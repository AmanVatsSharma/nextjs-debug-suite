import * as ts from 'typescript';
import { DependencyAnalyzer } from '../core/errorDNA/dependencyAnalyzer';

// Mock TypeScript module
jest.mock('typescript', () => ({
  createSourceFile: jest.fn(),
  createProgram: jest.fn(() => ({
    getSourceFile: jest.fn(() => ({
      getText: jest.fn(() => ''),
    })),
  })),
  ScriptTarget: { Latest: 0 },
  ModuleKind: { ESNext: 0 },
  JsxEmit: { React: 0 },
  ModuleResolutionKind: { NodeJs: 0 },
  readConfigFile: jest.fn(() => ({ config: {} })),
  parseJsonConfigFileContent: jest.fn(() => ({ options: {} })),
  sys: { readFile: jest.fn() },
  isImportDeclaration: jest.fn(),
  isExportDeclaration: jest.fn(),
  isExportAssignment: jest.fn(),
  isNamedImports: jest.fn(),
  isNamedExports: jest.fn(),
  forEachChild: jest.fn(),
}));

describe('DependencyAnalyzer', () => {
  let analyzer: DependencyAnalyzer;
  let mockSourceFile: any;

  beforeEach(() => {
    jest.clearAllMocks();
    analyzer = new DependencyAnalyzer('.');

    mockSourceFile = {
      statements: [],
      getText: jest.fn(() => ''),
    };

    (ts.createSourceFile as jest.Mock).mockReturnValue(mockSourceFile);
    (ts.isImportDeclaration as unknown as jest.Mock).mockImplementation((node: any) => node.kind === 'ImportDeclaration');
    (ts.isExportDeclaration as unknown as jest.Mock).mockImplementation((node: any) => node.kind === 'ExportDeclaration');
    (ts.isExportAssignment as unknown as jest.Mock).mockImplementation((node: any) => node.kind === 'ExportAssignment');
    (ts.isNamedImports as unknown as jest.Mock).mockImplementation((node: any) => node.namedBindings?.elements !== undefined);
    (ts.isNamedExports as unknown as jest.Mock).mockImplementation((node: any) => node.exportClause?.elements !== undefined);
    (ts.forEachChild as jest.Mock).mockImplementation((node: any, cb: any) => {
      if (node.statements) {
        node.statements.forEach(cb);
      }
    });
  });

  it('should analyze imports and exports in a TypeScript file', async () => {
    const fileContent = `
      import { useState } from 'react';
      import type { FC } from 'react';
      import DefaultExport from './module';
      export { Something } from './other';
      export default App;
    `;

    mockSourceFile.statements = [
      {
        kind: 'ImportDeclaration',
        moduleSpecifier: { text: 'react' },
        importClause: {
          name: null,
          isTypeOnly: false,
          namedBindings: {
            elements: [{ name: { text: 'useState' } }],
          },
        },
      },
      {
        kind: 'ImportDeclaration',
        moduleSpecifier: { text: 'react' },
        importClause: {
          name: null,
          isTypeOnly: true,
          namedBindings: {
            elements: [{ name: { text: 'FC' } }],
          },
        },
      },
      {
        kind: 'ImportDeclaration',
        moduleSpecifier: { text: './module' },
        importClause: {
          name: { text: 'DefaultExport' },
          isTypeOnly: false,
        },
      },
      {
        kind: 'ExportDeclaration',
        moduleSpecifier: { text: './other' },
        exportClause: {
          elements: [{ name: { text: 'Something' } }],
        },
        isTypeOnly: false,
      },
      {
        kind: 'ExportAssignment',
        expression: { getText: () => 'App' },
      },
    ];

    const { imports, exports } = await analyzer.analyze(fileContent);

    expect(imports).toEqual([
      { name: 'useState', path: 'react', isDefault: false, isType: false },
      { name: 'FC', path: 'react', isDefault: false, isType: true },
      { name: 'DefaultExport', path: './module', isDefault: true, isType: false },
    ]);

    expect(exports).toEqual([
      { name: 'Something', isDefault: false, isType: false },
      { name: 'App', isDefault: true, isType: false },
    ]);
  });

  it('should generate a dependency graph', async () => {
    const mockSourceFile = {
      getText: jest.fn(() => `
        import { useState } from 'react';
        import { Something } from './other';
      `),
    };

    (ts.createProgram as jest.Mock).mockReturnValue({
      getSourceFile: jest.fn(() => mockSourceFile),
    });

    const graph = await analyzer.getDependencyGraph('src/components/App.tsx');

    expect(graph.nodes).toEqual([
      {
        id: 'src/components/App.tsx',
        type: 'file',
        name: 'App.tsx',
        path: 'src/components/App.tsx',
      },
    ]);

    expect(graph.edges).toEqual([]);
  });

  it('should handle circular dependencies', async () => {
    const mockFileA = {
      getText: jest.fn(() => `import { B } from './B';`),
    };

    const mockFileB = {
      getText: jest.fn(() => `import { A } from './A';`),
    };

    let fileCounter = 0;
    (ts.createProgram as jest.Mock).mockReturnValue({
      getSourceFile: jest.fn(() => {
        fileCounter++;
        return fileCounter === 1 ? mockFileA : mockFileB;
      }),
    });

    const graph = await analyzer.getDependencyGraph('src/A.ts');

    expect(graph.nodes).toEqual([
      {
        id: 'src/A.ts',
        type: 'file',
        name: 'A.ts',
        path: 'src/A.ts',
      },
    ]);

    expect(graph.edges).toEqual([]);
  });

  it('should handle type-only imports and exports', async () => {
    const fileContent = `
      import type { Type1 } from './types';
      export type { Type2 } from './other-types';
    `;

    mockSourceFile.statements = [
      {
        kind: 'ImportDeclaration',
        moduleSpecifier: { text: './types' },
        importClause: {
          isTypeOnly: true,
          namedBindings: {
            elements: [{ name: { text: 'Type1' } }],
          },
        },
      },
      {
        kind: 'ExportDeclaration',
        moduleSpecifier: { text: './other-types' },
        exportClause: {
          elements: [{ name: { text: 'Type2' } }],
        },
        isTypeOnly: true,
      },
    ];

    const { imports, exports } = await analyzer.analyze(fileContent);

    expect(imports).toEqual([
      { name: 'Type1', path: './types', isDefault: false, isType: true },
    ]);

    expect(exports).toEqual([
      { name: 'Type2', isDefault: false, isType: true },
    ]);
  });
}); 