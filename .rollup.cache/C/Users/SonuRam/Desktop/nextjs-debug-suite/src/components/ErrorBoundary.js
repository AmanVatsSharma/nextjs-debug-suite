import { __awaiter, __extends, __generator, __makeTemplateObject } from "tslib";
import React from 'react';
import styled from '@emotion/styled';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ErrorDNAGenerator } from '../core/errorDNA/errorDNA';
import { useDebugContext } from './DebugSuiteProvider';
var ErrorContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 20px;\n  margin: 20px;\n  border: 1px solid ", ";\n  border-radius: 8px;\n  background: ", ";\n"], ["\n  padding: 20px;\n  margin: 20px;\n  border: 1px solid ", ";\n  border-radius: 8px;\n  background: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.error;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.background;
});
var ErrorHeader = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 16px;\n"], ["\n  margin-bottom: 16px;\n"])));
var ErrorTitle = styled.h2(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0 0 8px;\n  color: ", ";\n  font-size: 18px;\n"], ["\n  margin: 0 0 8px;\n  color: ", ";\n  font-size: 18px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.error;
});
var ErrorMeta = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: 14px;\n  color: ", ";\n"], ["\n  font-size: 14px;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.secondary;
});
var CodeSection = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin: 16px 0;\n"], ["\n  margin: 16px 0;\n"])));
var SectionTitle = styled.h3(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  margin: 0 0 8px;\n  font-size: 16px;\n  color: ", ";\n"], ["\n  margin: 0 0 8px;\n  font-size: 16px;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.text;
});
var DependencySection = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin: 16px 0;\n"], ["\n  margin: 16px 0;\n"])));
var DependencyGraph = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  padding: 12px;\n  background: ", ";\n  border-radius: 4px;\n  font-family: monospace;\n  font-size: 12px;\n"], ["\n  padding: 12px;\n  background: ", ";\n  border-radius: 4px;\n  font-family: monospace;\n  font-size: 12px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.tabBackground;
});
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        _this.errorDNAGenerator = new ErrorDNAGenerator();
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var errorDNA, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.errorDNAGenerator.generateDNA(error)];
                    case 1:
                        errorDNA = _a.sent();
                        this.setState({ errorDNA: errorDNA, errorInfo: errorInfo });
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error('Failed to generate error DNA:', e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ErrorBoundary.prototype.render = function () {
        if (!this.state.hasError) {
            return this.props.children;
        }
        if (this.props.fallback) {
            return this.props.fallback;
        }
        return React.createElement(ErrorBoundaryFallback, { errorState: this.state });
    };
    return ErrorBoundary;
}(React.Component));
export { ErrorBoundary };
var ErrorBoundaryFallback = function (_a) {
    var _b;
    var errorState = _a.errorState;
    var error = errorState.error, errorDNA = errorState.errorDNA;
    var config = useDebugContext().config;
    if (!error)
        return null;
    return (React.createElement(ErrorContainer, null,
        React.createElement(ErrorHeader, null,
            React.createElement(ErrorTitle, null,
                error.name,
                ": ",
                error.message),
            errorDNA && (React.createElement(ErrorMeta, null,
                errorDNA.location.file,
                ":",
                errorDNA.location.line,
                errorDNA.location.component && " in ".concat(errorDNA.location.component)))),
        errorDNA && (React.createElement(React.Fragment, null,
            React.createElement(CodeSection, null,
                React.createElement(SectionTitle, null, "Code Preview"),
                React.createElement(SyntaxHighlighter, { language: "typescript", style: tomorrow, showLineNumbers: true, wrapLines: true, lineProps: function (lineNumber) { return ({
                        style: {
                            backgroundColor: errorDNA.visual.highlightedLines.includes(lineNumber)
                                ? 'rgba(255, 0, 0, 0.1)'
                                : undefined,
                        },
                    }); } }, errorDNA.visual.codePreview)),
            React.createElement(DependencySection, null,
                React.createElement(SectionTitle, null, "Dependencies"),
                React.createElement(DependencyGraph, null, Object.entries(errorDNA.visual.dependencies.nodes).map(function (_a) {
                    var id = _a[0], node = _a[1];
                    return (React.createElement("div", { key: id },
                        node.name,
                        " (",
                        node.type,
                        "):",
                        node.dependencies.length > 0 && (React.createElement("ul", null, node.dependencies.map(function (dep) { return (React.createElement("li", { key: dep }, dep)); })))));
                }))),
            ((_b = config.ai) === null || _b === void 0 ? void 0 : _b.enabled) && errorDNA.aiAnalysis && (React.createElement(React.Fragment, null,
                React.createElement(SectionTitle, null, "AI Analysis"),
                React.createElement("div", null, errorDNA.aiAnalysis.explanation),
                errorDNA.aiAnalysis.suggestedFix && (React.createElement(CodeSection, null,
                    React.createElement(SectionTitle, null, "Suggested Fix"),
                    React.createElement(SyntaxHighlighter, { language: "typescript", style: tomorrow }, errorDNA.aiAnalysis.suggestedFix)))))))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=ErrorBoundary.js.map