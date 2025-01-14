import { __makeTemplateObject } from "tslib";
import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { motion } from 'framer-motion';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { DependencyVisualizer } from './DependencyVisualizer';
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  padding: 1rem;\n  background: ", ";\n  border-radius: 8px;\n"], ["\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  padding: 1rem;\n  background: ", ";\n  border-radius: 8px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.background.secondary;
});
var Header = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n"], ["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n"])));
var Title = styled.h3(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0;\n  color: ", ";\n"], ["\n  margin: 0;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.text.primary;
});
var ErrorLocation = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-family: monospace;\n  color: ", ";\n"], ["\n  font-family: monospace;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.text.secondary;
});
var CodePreview = styled(motion.div)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: relative;\n  border-radius: 4px;\n  overflow: hidden;\n"], ["\n  position: relative;\n  border-radius: 4px;\n  overflow: hidden;\n"])));
var HighlightedLine = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  background: ", ";\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 1.5rem;\n  opacity: 0.3;\n"], ["\n  background: ", ";\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 1.5rem;\n  opacity: 0.3;\n"])), function (_a) {
    var theme = _a.theme, isError = _a.isError;
    return isError
        ? theme.colors.error.background
        : theme.colors.highlight.background;
});
export var ErrorDNAVisualizer = function (_a) {
    var errorDNA = _a.errorDNA, dependencyGraph = _a.dependencyGraph;
    var theme = useTheme();
    return (React.createElement(Container, null,
        React.createElement(Header, null,
            React.createElement(Title, null, "Error DNA Analysis"),
            React.createElement(ErrorLocation, null,
                errorDNA.location.file,
                ":",
                errorDNA.location.line)),
        React.createElement(CodePreview, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } },
            errorDNA.visual.highlightedLines.map(function (line) { return (React.createElement(HighlightedLine, { key: line, style: { top: "".concat((line - 1) * 1.5, "rem") }, isError: line === errorDNA.location.line })); }),
            React.createElement(SyntaxHighlighter, { language: "typescript", style: vs2015, showLineNumbers: true, wrapLines: true, customStyle: {
                    margin: 0,
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    background: theme.colors.background.primary,
                    color: theme.colors.text.primary,
                } }, errorDNA.visual.codePreview)),
        errorDNA.aiAnalysis && (React.createElement(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 } },
            React.createElement("h4", null, "AI Analysis"),
            React.createElement("p", null, errorDNA.aiAnalysis.explanation),
            errorDNA.aiAnalysis.suggestedFix && (React.createElement(React.Fragment, null,
                React.createElement("h4", null, "Suggested Fix"),
                React.createElement(SyntaxHighlighter, { language: "typescript", style: vs2015, customStyle: {
                        margin: 0,
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        background: theme.colors.background.primary,
                        color: theme.colors.text.primary,
                    } }, errorDNA.aiAnalysis.suggestedFix))))),
        dependencyGraph && (React.createElement(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.6 } },
            React.createElement("h4", null, "Dependency Chain"),
            React.createElement(DependencyVisualizer, { graph: dependencyGraph, errorNodeId: errorDNA.location.file })))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=ErrorDNAVisualizer.js.map