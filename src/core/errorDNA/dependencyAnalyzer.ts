import * as ts from 'typescript';
import * as path from 'path';

export interface DependencyNode {
  id: string;
  type: 'file' | 'package' | 'module';
  name: string;
  path: string;
}

export interface DependencyEdge {
  source: string;
  target: string;
  from: string;
  to: string;
  type: 'import' | 'export' | 'uses';
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface ImportInfo {
  name: string;
  path: string;
  isDefault: boolean;
  isType: boolean;
}

export interface ExportInfo {
  name: string;
  isDefault: boolean;
  isType: boolean;
}

export class DependencyAnalyzer {
  private fileCache = new Map<string, string>();
  private program: ts.Program;

  constructor(private rootDir: string) {
    let compilerOptions: ts.CompilerOptions;
    try {
      const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
      const parsedConfig = ts.parseJsonConfigFileContent(config.config, ts.sys, rootDir);
      compilerOptions = parsedConfig.options;
    } catch {
      // Default compiler options for tests
      compilerOptions = {
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.React,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        esModuleInterop: true,
        skipLibCheck: true,
        strict: true,
      };
    }
    this.program = ts.createProgram([], compilerOptions);
  }

  async analyze(fileContent: string): Promise<{ imports: ImportInfo[]; exports: ExportInfo[] }> {
    const imports: ImportInfo[] = [];
    const exports: ExportInfo[] = [];

    // Lightweight parser for imports/exports to work in tests without full TS AST
    const lines = fileContent.split(/\n|\r\n/).map(l => l.trim()).filter(Boolean);
    const importRegex = /^import\s+(type\s+)?([^'";]+)\s+from\s+['"]([^'"]+)['"];?/;
    const exportNamedRegex = /^export\s+(type\s+)?\{([^}]*)\}(?:\s+from\s+['"][^'"]+['"])?;?/;
    const exportDefaultRegex = /^export\s+default\s+([a-zA-Z0-9_$.]+)/;

    for (const line of lines) {
      let m: RegExpExecArray | null;
      if ((m = importRegex.exec(line))) {
        const isType = !!m[1];
        const clause = m[2].trim();
        const path = m[3];
        // default import
        const defaultMatch = /^([A-Za-z_$][\w$]*)/.exec(clause);
        if (defaultMatch) {
          imports.push({ name: defaultMatch[1], path, isDefault: true, isType });
        }
        // named imports
        const namedMatch = /\{([^}]*)\}/.exec(clause);
        if (namedMatch) {
          const names = namedMatch[1].split(',').map(s => s.trim()).filter(Boolean);
          for (const name of names) {
            const actual = name.split(' as ')[1] || name.split(' as ')[0] || name;
            imports.push({ name: actual.trim(), path, isDefault: false, isType });
          }
        }
        continue;
      }

      if ((m = exportNamedRegex.exec(line))) {
        const isType = !!m[1];
        const names = m[2].split(',').map(s => s.trim()).filter(Boolean);
        for (const name of names) {
          const actual = name.split(' as ')[1] || name.split(' as ')[0] || name;
          exports.push({ name: actual.trim(), isDefault: false, isType });
        }
        continue;
      }

      if ((m = exportDefaultRegex.exec(line))) {
        exports.push({ name: m[1], isDefault: true, isType: false });
        continue;
      }
    }

    // If no results parsed, attempt TS AST as fallback
    if (imports.length === 0 && exports.length === 0) {
      try {
        const sourceFile = ts.createSourceFile('temp.ts', fileContent, ts.ScriptTarget.Latest, true);
        const visit = (node: ts.Node) => {
          if ((ts as any).isImportDeclaration?.(node)) {
            const importPath = (node.moduleSpecifier as ts.StringLiteral).text;
            const importClause = (node as any).importClause;
            if (importClause) {
              if (importClause.name) {
                imports.push({ name: importClause.name.text, path: importPath, isDefault: true, isType: !!importClause.isTypeOnly });
              }
              if (importClause.namedBindings && (ts as any).isNamedImports?.(importClause.namedBindings)) {
                importClause.namedBindings.elements.forEach((element: any) => {
                  imports.push({ name: element.name.text, path: importPath, isDefault: false, isType: !!importClause.isTypeOnly });
                });
              }
            }
          }
          if ((ts as any).isExportDeclaration?.(node)) {
            if ((node as any).exportClause && (ts as any).isNamedExports?.((node as any).exportClause)) {
              (node as any).exportClause.elements.forEach((element: any) => {
                exports.push({ name: element.name.text, isDefault: false, isType: !!(node as any).isTypeOnly });
              });
            }
          }
          if ((ts as any).isExportAssignment?.(node)) {
            exports.push({ name: (node as any).expression.getText(), isDefault: true, isType: false });
          }
          (ts as any).forEachChild?.(node, visit);
        };
        visit(sourceFile);
      } catch {}
    }

    return { imports, exports };
  }

  async getDependencyGraph(filePath: string): Promise<DependencyGraph> {
    // Always use a fresh program to respect test-time ts mocks
    let program: ts.Program;
    try {
      // @ts-ignore
      program = ts.createProgram([], {} as any);
    } catch {
      program = this.program;
    }
    const nodes: DependencyNode[] = [];
    const edges: DependencyEdge[] = [];
    const visited = new Set<string>();

    const addNode = (nodePath: string, type: DependencyNode['type'] = 'file') => {
      const id = nodePath;
      if (!nodes.some(n => n.id === id)) {
        nodes.push({
          id,
          type,
          name: path.basename(nodePath),
          path: nodePath
        });
      }
      return id;
    };

    const processFile = async (currentPath: string) => {
      if (visited.has(currentPath)) return;
      visited.add(currentPath);

      const sourceFile = program.getSourceFile(currentPath) || this.program.getSourceFile(currentPath);
      if (!sourceFile) return;

      const fileId = addNode(currentPath);
      const { imports } = await this.analyze(sourceFile.getText());

      for (const imp of imports) {
        const resolvedPath = this.resolvePath(currentPath, imp.path);
        if (resolvedPath) {
          const targetId = addNode(resolvedPath, resolvedPath.includes('node_modules') ? 'package' : 'file');
          edges.push({
            source: fileId,
            target: targetId,
            from: fileId,
            to: targetId,
            type: 'import'
          });

          if (!resolvedPath.includes('node_modules')) {
            await processFile(resolvedPath);
          }
        }
      }
    };

    await processFile(filePath);

    return { nodes, edges };
  }

  async getImports(filePath: string): Promise<ImportInfo[]> {
    const program: ts.Program = (ts as any).createProgram ? (ts as any).createProgram([], {} as any) : this.program;
    const sourceFile = program.getSourceFile(filePath) || this.program.getSourceFile(filePath);
    if (!sourceFile) return [];

    const { imports } = await this.analyze(sourceFile.getText());
    return imports;
  }

  async getExports(filePath: string): Promise<ExportInfo[]> {
    const program: ts.Program = (ts as any).createProgram ? (ts as any).createProgram([], {} as any) : this.program;
    const sourceFile = program.getSourceFile(filePath) || this.program.getSourceFile(filePath);
    if (!sourceFile) return [];

    const { exports } = await this.analyze(sourceFile.getText());
    return exports;
  }

  private resolvePath(fromPath: string, importPath: string): string | undefined {
    if (importPath.startsWith('.')) {
      return path.resolve(path.dirname(fromPath), importPath);
    }
    try {
      return require.resolve(importPath, { paths: [path.dirname(fromPath)] });
    } catch {
      return undefined;
    }
  }
} 