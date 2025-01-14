import { DependencyAnalyzer } from '../core/errorDNA/dependencyAnalyzer';
import * as path from 'path';

jest.mock('typescript', () => ({
  createSourceFile: jest.fn((fileName, content) => ({
    fileName,
    getText: () => content,
    statements: []
  })),
  ScriptTarget: { Latest: 0 },
  createProgram: jest.fn(() => ({
    getSourceFile: jest.fn((filePath) => ({
      fileName: filePath,
      getText: () => '',
      statements: []
    }))
  })),
  readConfigFile: jest.fn(() => ({ config: {} })),
  parseJsonConfigFileContent: jest.fn(() => ({
    fileNames: [],
    options: {}
  })),
  sys: {
    readFile: jest.fn()
  }
}));

describe('DependencyAnalyzer', () => {
  let analyzer: DependencyAnalyzer;

  beforeEach(() => {
    analyzer = new DependencyAnalyzer(process.cwd());
  });

  it('should analyze imports and exports in a TypeScript file', async () => {
    const code = `
      import { something } from './module';
      import type { Type } from './types';
      import DefaultImport from './default';
      
      export const namedExport = 'value';
      export type TypeExport = string;
      export default DefaultExport;
      export { somethingElse } from './other';
    `;

    const { imports, exports } = await analyzer.analyze(code);

    expect(imports).toEqual([
      { name: 'something', path: './module', isDefault: false, isType: false },
      { name: 'Type', path: './types', isDefault: false, isType: true },
      { name: 'DefaultImport', path: './default', isDefault: true, isType: false }
    ]);

    expect(exports).toEqual([
      { name: 'namedExport', isDefault: false, isType: false },
      { name: 'TypeExport', isDefault: false, isType: true },
      { name: 'DefaultExport', isDefault: true, isType: false },
      { name: 'somethingElse', isDefault: false, isType: false }
    ]);
  });

  it('should generate a dependency graph', async () => {
    const mockSourceFile = {
      fileName: 'src/components/TestComponent.tsx',
      getText: () => `
        import React from 'react';
        import { useEffect } from 'react';
        import { MyComponent } from './MyComponent';
      `,
      statements: []
    };

    require.resolve = jest.fn((modulePath) => {
      if (modulePath === 'react') {
        return path.resolve('node_modules/react/index.js');
      }
      return path.resolve(path.dirname('src/components/TestComponent.tsx'), modulePath);
    });

    const { nodes, edges } = await analyzer.getDependencyGraph('src/components/TestComponent.tsx');

    expect(nodes).toContainEqual(expect.objectContaining({
      type: 'package',
      name: 'react'
    }));

    expect(nodes).toContainEqual(expect.objectContaining({
      type: 'file',
      name: 'MyComponent.tsx'
    }));

    expect(edges).toContainEqual(expect.objectContaining({
      type: 'import',
      source: 'src/components/TestComponent.tsx'
    }));
  });

  it('should handle circular dependencies', async () => {
    const mockFiles = {
      'src/A.ts': `
        import { b } from './B';
        export const a = b + 1;
      `,
      'src/B.ts': `
        import { a } from './A';
        export const b = a + 1;
      `
    };

    const { nodes, edges } = await analyzer.getDependencyGraph('src/A.ts');

    const nodeA = nodes.find(n => n.name === 'A.ts');
    const nodeB = nodes.find(n => n.name === 'B.ts');

    expect(nodeA).toBeDefined();
    expect(nodeB).toBeDefined();
    expect(edges).toContainEqual(expect.objectContaining({
      source: nodeA?.id,
      target: nodeB?.id,
      type: 'import'
    }));
  });

  it('should handle type-only imports and exports', async () => {
    const code = `
      import type { Type1 } from 'module1';
      import { Type2 } from 'module2';
      
      export type ExportedType = Type1;
      export interface ExportedInterface {}
      export { Type2 };
    `;

    const { imports, exports } = await analyzer.analyze(code);

    expect(imports).toContainEqual({
      name: 'Type1',
      path: 'module1',
      isDefault: false,
      isType: true
    });

    expect(imports).toContainEqual({
      name: 'Type2',
      path: 'module2',
      isDefault: false,
      isType: false
    });

    expect(exports).toContainEqual({
      name: 'ExportedType',
      isDefault: false,
      isType: true
    });
  });
}); 