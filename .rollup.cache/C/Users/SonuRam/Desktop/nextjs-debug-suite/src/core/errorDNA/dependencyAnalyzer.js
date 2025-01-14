import { __awaiter, __generator } from "tslib";
import * as ts from 'typescript';
import * as path from 'path';
var DependencyAnalyzer = /** @class */ (function () {
    function DependencyAnalyzer(rootDir) {
        this.rootDir = rootDir;
        this.fileCache = new Map();
        var compilerOptions;
        try {
            var config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
            var parsedConfig = ts.parseJsonConfigFileContent(config.config, ts.sys, rootDir);
            compilerOptions = parsedConfig.options;
        }
        catch (_a) {
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
    DependencyAnalyzer.prototype.analyze = function (fileContent) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceFile, imports, exports, visit;
            return __generator(this, function (_a) {
                sourceFile = ts.createSourceFile('temp.ts', fileContent, ts.ScriptTarget.Latest, true);
                imports = [];
                exports = [];
                visit = function (node) {
                    if (ts.isImportDeclaration(node)) {
                        var importPath_1 = node.moduleSpecifier.text;
                        var importClause_1 = node.importClause;
                        if (importClause_1) {
                            if (importClause_1.name) {
                                imports.push({
                                    name: importClause_1.name.text,
                                    path: importPath_1,
                                    isDefault: true,
                                    isType: importClause_1.isTypeOnly
                                });
                            }
                            if (importClause_1.namedBindings) {
                                if (ts.isNamedImports(importClause_1.namedBindings)) {
                                    importClause_1.namedBindings.elements.forEach(function (element) {
                                        imports.push({
                                            name: element.name.text,
                                            path: importPath_1,
                                            isDefault: false,
                                            isType: importClause_1.isTypeOnly
                                        });
                                    });
                                }
                            }
                        }
                    }
                    if (ts.isExportDeclaration(node)) {
                        if (node.exportClause && ts.isNamedExports(node.exportClause)) {
                            node.exportClause.elements.forEach(function (element) {
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
                return [2 /*return*/, { imports: imports, exports: exports }];
            });
        });
    };
    DependencyAnalyzer.prototype.getDependencyGraph = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var nodes, edges, visited, addNode, processFile;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nodes = [];
                        edges = [];
                        visited = new Set();
                        addNode = function (nodePath, type) {
                            if (type === void 0) { type = 'file'; }
                            var id = nodePath;
                            if (!nodes.some(function (n) { return n.id === id; })) {
                                nodes.push({
                                    id: id,
                                    type: type,
                                    name: path.basename(nodePath),
                                    path: nodePath
                                });
                            }
                            return id;
                        };
                        processFile = function (currentPath) { return __awaiter(_this, void 0, void 0, function () {
                            var sourceFile, fileId, imports, _i, imports_1, imp, resolvedPath, targetId;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (visited.has(currentPath))
                                            return [2 /*return*/];
                                        visited.add(currentPath);
                                        sourceFile = this.program.getSourceFile(currentPath);
                                        if (!sourceFile)
                                            return [2 /*return*/];
                                        fileId = addNode(currentPath);
                                        return [4 /*yield*/, this.analyze(sourceFile.getText())];
                                    case 1:
                                        imports = (_a.sent()).imports;
                                        _i = 0, imports_1 = imports;
                                        _a.label = 2;
                                    case 2:
                                        if (!(_i < imports_1.length)) return [3 /*break*/, 5];
                                        imp = imports_1[_i];
                                        resolvedPath = this.resolvePath(currentPath, imp.path);
                                        if (!resolvedPath) return [3 /*break*/, 4];
                                        targetId = addNode(resolvedPath, resolvedPath.includes('node_modules') ? 'package' : 'file');
                                        edges.push({
                                            source: fileId,
                                            target: targetId,
                                            type: 'import'
                                        });
                                        if (!!resolvedPath.includes('node_modules')) return [3 /*break*/, 4];
                                        return [4 /*yield*/, processFile(resolvedPath)];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, processFile(filePath)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { nodes: nodes, edges: edges }];
                }
            });
        });
    };
    DependencyAnalyzer.prototype.getImports = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceFile, imports;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sourceFile = this.program.getSourceFile(filePath);
                        if (!sourceFile)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.analyze(sourceFile.getText())];
                    case 1:
                        imports = (_a.sent()).imports;
                        return [2 /*return*/, imports];
                }
            });
        });
    };
    DependencyAnalyzer.prototype.getExports = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceFile, exports;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sourceFile = this.program.getSourceFile(filePath);
                        if (!sourceFile)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.analyze(sourceFile.getText())];
                    case 1:
                        exports = (_a.sent()).exports;
                        return [2 /*return*/, exports];
                }
            });
        });
    };
    DependencyAnalyzer.prototype.resolvePath = function (fromPath, importPath) {
        if (importPath.startsWith('.')) {
            return path.resolve(path.dirname(fromPath), importPath);
        }
        try {
            return require.resolve(importPath, { paths: [path.dirname(fromPath)] });
        }
        catch (_a) {
            return undefined;
        }
    };
    return DependencyAnalyzer;
}());
export { DependencyAnalyzer };
//# sourceMappingURL=dependencyAnalyzer.js.map