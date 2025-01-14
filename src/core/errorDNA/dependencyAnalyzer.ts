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
    const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
    const parsedConfig = ts.parseJsonConfigFileContent(config.config, ts.sys, rootDir);
    this.program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
  }

  async analyze(fileContent: string): Promise<{ imports: ImportInfo[]; exports: ExportInfo[] }> {
    const sourceFile = ts.createSourceFile(
      'temp.ts',
      fileContent,
      ts.ScriptTarget.Latest,
      true
    );

    const imports: ImportInfo[] = [];
    const exports: ExportInfo[] = [];

    const visit = (node: ts.Node) => {
      if (ts.isImportDeclaration(node)) {
        const importPath = (node.moduleSpecifier as ts.StringLiteral).text;
        const importClause = node.importClause;

        if (importClause) {
          if (importClause.name) {
            imports.push({
              name: importClause.name.text,
              path: importPath,
              isDefault: true,
              isType: importClause.isTypeOnly
            });
          }

          if (importClause.namedBindings) {
            if (ts.isNamedImports(importClause.namedBindings)) {
              importClause.namedBindings.elements.forEach(element => {
                imports.push({
                  name: element.name.text,
                  path: importPath,
                  isDefault: false,
                  isType: importClause.isTypeOnly
                });
              });
            }
          }
        }
      }

      if (ts.isExportDeclaration(node)) {
        if (node.exportClause && ts.isNamedExports(node.exportClause)) {
          node.exportClause.elements.forEach(element => {
            exports.push({
              name: element.name.text,
              isDefault: false,
              isType: node.isTypeOnly
            });
          });
        }
      }

      if (ts.isExportAssignment(node)) {
        exports.push({
          name: node.expression.getText(),
          isDefault: true,
          isType: false
        });
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return { imports, exports };
  }

  async getDependencyGraph(filePath: string): Promise<DependencyGraph> {
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

      const sourceFile = this.program.getSourceFile(currentPath);
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
    const sourceFile = this.program.getSourceFile(filePath);
    if (!sourceFile) return [];

    const { imports } = await this.analyze(sourceFile.getText());
    return imports;
  }

  async getExports(filePath: string): Promise<ExportInfo[]> {
    const sourceFile = this.program.getSourceFile(filePath);
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