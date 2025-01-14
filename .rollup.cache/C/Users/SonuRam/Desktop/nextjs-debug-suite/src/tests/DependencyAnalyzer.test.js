import { __awaiter, __generator } from "tslib";
import * as ts from 'typescript';
import { DependencyAnalyzer } from '../core/errorDNA/dependencyAnalyzer';
// Mock TypeScript module
jest.mock('typescript', function () { return ({
    createSourceFile: jest.fn(),
    createProgram: jest.fn(function () { return ({
        getSourceFile: jest.fn(function () { return ({
            getText: jest.fn(function () { return ''; }),
        }); }),
    }); }),
    ScriptTarget: { Latest: 0 },
    ModuleKind: { ESNext: 0 },
    JsxEmit: { React: 0 },
    ModuleResolutionKind: { NodeJs: 0 },
    readConfigFile: jest.fn(function () { return ({ config: {} }); }),
    parseJsonConfigFileContent: jest.fn(function () { return ({ options: {} }); }),
    sys: { readFile: jest.fn() },
    isImportDeclaration: jest.fn(),
    isExportDeclaration: jest.fn(),
    isExportAssignment: jest.fn(),
    isNamedImports: jest.fn(),
    isNamedExports: jest.fn(),
    forEachChild: jest.fn(),
}); });
describe('DependencyAnalyzer', function () {
    var analyzer;
    var mockSourceFile;
    beforeEach(function () {
        jest.clearAllMocks();
        analyzer = new DependencyAnalyzer('.');
        mockSourceFile = {
            statements: [],
            getText: jest.fn(function () { return ''; }),
        };
        ts.createSourceFile.mockReturnValue(mockSourceFile);
        ts.isImportDeclaration.mockImplementation(function (node) { return node.kind === 'ImportDeclaration'; });
        ts.isExportDeclaration.mockImplementation(function (node) { return node.kind === 'ExportDeclaration'; });
        ts.isExportAssignment.mockImplementation(function (node) { return node.kind === 'ExportAssignment'; });
        ts.isNamedImports.mockImplementation(function (node) { var _a; return ((_a = node.namedBindings) === null || _a === void 0 ? void 0 : _a.elements) !== undefined; });
        ts.isNamedExports.mockImplementation(function (node) { var _a; return ((_a = node.exportClause) === null || _a === void 0 ? void 0 : _a.elements) !== undefined; });
        ts.forEachChild.mockImplementation(function (node, cb) {
            if (node.statements) {
                node.statements.forEach(cb);
            }
        });
    });
    it('should analyze imports and exports in a TypeScript file', function () { return __awaiter(void 0, void 0, void 0, function () {
        var fileContent, _a, imports, exports;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fileContent = "\n      import { useState } from 'react';\n      import type { FC } from 'react';\n      import DefaultExport from './module';\n      export { Something } from './other';\n      export default App;\n    ";
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
                            expression: { getText: function () { return 'App'; } },
                        },
                    ];
                    return [4 /*yield*/, analyzer.analyze(fileContent)];
                case 1:
                    _a = _b.sent(), imports = _a.imports, exports = _a.exports;
                    expect(imports).toEqual([
                        { name: 'useState', path: 'react', isDefault: false, isType: false },
                        { name: 'FC', path: 'react', isDefault: false, isType: true },
                        { name: 'DefaultExport', path: './module', isDefault: true, isType: false },
                    ]);
                    expect(exports).toEqual([
                        { name: 'Something', isDefault: false, isType: false },
                        { name: 'App', isDefault: true, isType: false },
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should generate a dependency graph', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockSourceFile, graph;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockSourceFile = {
                        getText: jest.fn(function () { return "\n        import { useState } from 'react';\n        import { Something } from './other';\n      "; }),
                    };
                    ts.createProgram.mockReturnValue({
                        getSourceFile: jest.fn(function () { return mockSourceFile; }),
                    });
                    return [4 /*yield*/, analyzer.getDependencyGraph('src/components/App.tsx')];
                case 1:
                    graph = _a.sent();
                    expect(graph.nodes).toEqual([
                        {
                            id: 'src/components/App.tsx',
                            type: 'file',
                            name: 'App.tsx',
                            path: 'src/components/App.tsx',
                        },
                    ]);
                    expect(graph.edges).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should handle circular dependencies', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockFileA, mockFileB, fileCounter, graph;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockFileA = {
                        getText: jest.fn(function () { return "import { B } from './B';"; }),
                    };
                    mockFileB = {
                        getText: jest.fn(function () { return "import { A } from './A';"; }),
                    };
                    fileCounter = 0;
                    ts.createProgram.mockReturnValue({
                        getSourceFile: jest.fn(function () {
                            fileCounter++;
                            return fileCounter === 1 ? mockFileA : mockFileB;
                        }),
                    });
                    return [4 /*yield*/, analyzer.getDependencyGraph('src/A.ts')];
                case 1:
                    graph = _a.sent();
                    expect(graph.nodes).toEqual([
                        {
                            id: 'src/A.ts',
                            type: 'file',
                            name: 'A.ts',
                            path: 'src/A.ts',
                        },
                    ]);
                    expect(graph.edges).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should handle type-only imports and exports', function () { return __awaiter(void 0, void 0, void 0, function () {
        var fileContent, _a, imports, exports;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fileContent = "\n      import type { Type1 } from './types';\n      export type { Type2 } from './other-types';\n    ";
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
                    return [4 /*yield*/, analyzer.analyze(fileContent)];
                case 1:
                    _a = _b.sent(), imports = _a.imports, exports = _a.exports;
                    expect(imports).toEqual([
                        { name: 'Type1', path: './types', isDefault: false, isType: true },
                    ]);
                    expect(exports).toEqual([
                        { name: 'Type2', isDefault: false, isType: true },
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=DependencyAnalyzer.test.js.map