import { __makeTemplateObject } from "tslib";
import React from 'react';
import styled from '@emotion/styled';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDebugContext } from '../DebugSuiteProvider';
var ErrorContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 16px;\n  border: 1px solid ", ";\n  border-radius: 6px;\n  overflow: hidden;\n"], ["\n  margin-bottom: 16px;\n  border: 1px solid ", ";\n  border-radius: 6px;\n  overflow: hidden;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
});
var ErrorHeader = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 12px;\n  background: ", ";\n  border-bottom: 1px solid ", ";\n"], ["\n  padding: 12px;\n  background: ", ";\n  border-bottom: 1px solid ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.tabBackground;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
});
var ErrorTitle = styled.h3(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0;\n  font-size: 14px;\n  color: ", ";\n"], ["\n  margin: 0;\n  font-size: 14px;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.error;
});
var ErrorMeta = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: 12px;\n  color: ", ";\n  margin-top: 4px;\n"], ["\n  font-size: 12px;\n  color: ", ";\n  margin-top: 4px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.secondary;
});
var ErrorContent = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding: 12px;\n"], ["\n  padding: 12px;\n"])));
var CodePreview = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  margin: 8px 0;\n  border-radius: 4px;\n  overflow: hidden;\n"], ["\n  margin: 8px 0;\n  border-radius: 4px;\n  overflow: hidden;\n"])));
var AIAnalysis = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin-top: 12px;\n  padding: 12px;\n  background: ", ";\n  border-radius: 4px;\n"], ["\n  margin-top: 12px;\n  padding: 12px;\n  background: ", ";\n  border-radius: 4px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.tabBackground;
});
var AITitle = styled.h4(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  margin: 0 0 8px;\n  font-size: 13px;\n  color: ", ";\n"], ["\n  margin: 0 0 8px;\n  font-size: 13px;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.primary;
});
var ErrorItem = function (_a) {
    var error = _a.error;
    return (React.createElement(ErrorContainer, null,
        React.createElement(ErrorHeader, null,
            React.createElement(ErrorTitle, null,
                error.type,
                " Error"),
            React.createElement(ErrorMeta, null,
                error.location.file,
                ":",
                error.location.line,
                error.location.component && " in ".concat(error.location.component))),
        React.createElement(ErrorContent, null,
            React.createElement(CodePreview, null,
                React.createElement(SyntaxHighlighter, { language: "typescript", style: tomorrow, showLineNumbers: true, wrapLines: true, lineProps: function (lineNumber) { return ({
                        style: {
                            backgroundColor: error.visual.highlightedLines.includes(lineNumber)
                                ? 'rgba(255, 0, 0, 0.1)'
                                : undefined,
                        },
                    }); } }, error.visual.codePreview)),
            error.aiAnalysis && (React.createElement(AIAnalysis, null,
                React.createElement(AITitle, null, "AI Analysis"),
                React.createElement("div", null, error.aiAnalysis.explanation),
                error.aiAnalysis.suggestedFix && (React.createElement(React.Fragment, null,
                    React.createElement(AITitle, null, "Suggested Fix"),
                    React.createElement(SyntaxHighlighter, { language: "typescript", style: tomorrow, customStyle: { margin: 0 } }, error.aiAnalysis.suggestedFix))))))));
};
export var ErrorsTab = function () {
    var config = useDebugContext().config;
    var errors = React.useState([])[0]; // This will be connected to the error tracking system
    if (errors.length === 0) {
        return (React.createElement("div", { style: { padding: 20, textAlign: 'center', color: '#666' } }, "No errors to display"));
    }
    return (React.createElement("div", null, errors.map(function (error) { return (React.createElement(ErrorItem, { key: error.id, error: error })); })));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=ErrorsTab.js.map