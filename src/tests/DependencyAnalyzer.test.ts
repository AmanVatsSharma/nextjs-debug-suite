import { DependencyAnalyzer } from '../core/errorDNA/dependencyAnalyzer';

describe('DependencyAnalyzer', () => {
  let analyzer: DependencyAnalyzer;

  beforeEach(() => {
    analyzer = new DependencyAnalyzer(process.cwd());
  });

  it('should analyze imports in a TypeScript file', async () => {
    const code = `
      import { useState, useEffect } from 'react';
      import type { FC } from 'react';
      import defaultExport from 'module';
      import * as namespace from 'namespace-module';
      import './styles.css';
    `;

    const { imports } = await analyzer.analyze(code);
    expect(imports).toEqual([
      { name: 'useState', path: 'react', isDefault: false, isType: false },
      { name: 'useEffect', path: 'react', isDefault: false, isType: false },
      { name: 'FC', path: 'react', isDefault: false, isType: true },
      { name: 'defaultExport', path: 'module', isDefault: true, isType: false }
    ]);
  });

  it('should analyze exports in a TypeScript file', async () => {
    const code = `
      export const namedExport = 'value';
      export type TypeExport = string;
      export default class DefaultExport {}
      export { something as somethingElse } from 'module';
    `;

    const { exports } = await analyzer.analyze(code);
    expect(exports).toEqual([
      { name: 'namedExport', isDefault: false, isType: false },
      { name: 'TypeExport', isDefault: false, isType: true },
      { name: 'DefaultExport', isDefault: true, isType: false },
      { name: 'somethingElse', isDefault: false, isType: false }
    ]);
  });

  it('should generate a dependency graph', async () => {
    const code = `
      import { Component } from 'react';
      import { connect } from 'react-redux';
      import { MyComponent } from './MyComponent';
      import { utils } from '../utils';
    `;

    const { nodes, edges } = await analyzer.getDependencyGraph('src/components/TestComponent.tsx');
    
    expect(nodes).toContainEqual(expect.objectContaining({
      type: 'package',
      name: 'react'
    }));

    expect(nodes).toContainEqual(expect.objectContaining({
      type: 'package',
      name: 'react-redux'
    }));

    expect(edges).toContainEqual(expect.objectContaining({
      type: 'import',
      source: expect.stringContaining('TestComponent.tsx'),
      target: expect.stringContaining('react')
    }));
  });

  it('should handle circular dependencies', async () => {
    const fileA = `
      import { functionB } from './B';
      export const functionA = () => functionB();
    `;

    const fileB = `
      import { functionA } from './A';
      export const functionB = () => functionA();
    `;

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

  it('should resolve relative and absolute imports', async () => {
    const code = `
      import { relative } from './relative';
      import { absolute } from 'absolute';
      import { alias } from '@/alias';
    `;

    const { imports } = await analyzer.analyze(code);
    expect(imports.map(i => i.path)).toEqual([
      './relative',
      'absolute',
      '@/alias'
    ]);
  });

  it('should handle type-only imports and exports', async () => {
    const code = `
      import type { Type1 } from 'module1';
      import { type Type2 } from 'module2';
      export type { Type3 } from 'module3';
      export interface Interface1 {}
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
      isType: true
    });

    expect(exports).toContainEqual({
      name: 'Type3',
      isDefault: false,
      isType: true
    });
  });
}); 