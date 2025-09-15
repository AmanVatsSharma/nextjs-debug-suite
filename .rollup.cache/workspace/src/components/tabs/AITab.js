import { __assign, __awaiter, __generator, __makeTemplateObject, __spreadArray } from "tslib";
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDebugContext } from '../DebugSuiteProvider';
import { AIServiceManager } from '../../ai/factory';
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n"], ["\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n"])));
var QueryInput = styled.textarea(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 100%;\n  min-height: 80px;\n  padding: 12px;\n  border: 1px solid ", ";\n  border-radius: 6px;\n  background: ", ";\n  color: ", ";\n  font-family: inherit;\n  font-size: 14px;\n  resize: vertical;\n  margin-bottom: 12px;\n\n  &:focus {\n    outline: none;\n    border-color: ", ";\n  }\n"], ["\n  width: 100%;\n  min-height: 80px;\n  padding: 12px;\n  border: 1px solid ", ";\n  border-radius: 6px;\n  background: ", ";\n  color: ", ";\n  font-family: inherit;\n  font-size: 14px;\n  resize: vertical;\n  margin-bottom: 12px;\n\n  &:focus {\n    outline: none;\n    border-color: ", ";\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.background;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.text;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.primary;
});
var Button = styled.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 8px 16px;\n  border: none;\n  border-radius: 4px;\n  background: ", ";\n  color: white;\n  cursor: pointer;\n  font-size: 14px;\n  transition: all 0.2s;\n  align-self: flex-end;\n\n  &:hover {\n    opacity: 0.9;\n  }\n\n  &:disabled {\n    background: ", ";\n    cursor: not-allowed;\n  }\n"], ["\n  padding: 8px 16px;\n  border: none;\n  border-radius: 4px;\n  background: ", ";\n  color: white;\n  cursor: pointer;\n  font-size: 14px;\n  transition: all 0.2s;\n  align-self: flex-end;\n\n  &:hover {\n    opacity: 0.9;\n  }\n\n  &:disabled {\n    background: ", ";\n    cursor: not-allowed;\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.primary;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
});
var ResponseContainer = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-top: 20px;\n  flex: 1;\n  overflow-y: auto;\n"], ["\n  margin-top: 20px;\n  flex: 1;\n  overflow-y: auto;\n"])));
var ResponseCard = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  background: ", ";\n  border: 1px solid ", ";\n  border-radius: 6px;\n  margin-bottom: 16px;\n  overflow: hidden;\n"], ["\n  background: ", ";\n  border: 1px solid ", ";\n  border-radius: 6px;\n  margin-bottom: 16px;\n  overflow: hidden;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.tabBackground;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
});
var ResponseHeader = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  padding: 12px;\n  border-bottom: 1px solid ", ";\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n"], ["\n  padding: 12px;\n  border-bottom: 1px solid ", ";\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
});
var ResponseTitle = styled.h3(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin: 0;\n  font-size: 14px;\n  color: ", ";\n"], ["\n  margin: 0;\n  font-size: 14px;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.text;
});
var ResponseContent = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  padding: 12px;\n"], ["\n  padding: 12px;\n"])));
var CodeBlock = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  margin: 8px 0;\n  border-radius: 4px;\n  overflow: hidden;\n"], ["\n  margin: 8px 0;\n  border-radius: 4px;\n  overflow: hidden;\n"])));
export var AITab = function () {
    var _a;
    var config = useDebugContext().config;
    var _b = useState(''), query = _b[0], setQuery = _b[1];
    var _c = useState(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = useState([]), responses = _d[0], setResponses = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var aiService = AIServiceManager.getInstance().getService();
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var analysisResponse, response_1, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!query.trim() || !((_a = config.ai) === null || _a === void 0 ? void 0 : _a.enabled) || !aiService)
                        return [2 /*return*/];
                    setIsLoading(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, aiService.analyze({
                            type: 'general',
                            context: {
                                query: query,
                            },
                        })];
                case 2:
                    analysisResponse = _b.sent();
                    response_1 = __assign(__assign({}, analysisResponse), { type: 'analysis', title: 'AI Analysis', timestamp: Date.now() });
                    setResponses(function (prev) { return __spreadArray([response_1], prev, true); });
                    setQuery('');
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _b.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'An error occurred during analysis');
                    console.error('AI Analysis Error:', err_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (!((_a = config.ai) === null || _a === void 0 ? void 0 : _a.enabled)) {
        return (React.createElement("div", { style: { padding: 20, textAlign: 'center', color: '#666' } }, "AI features are disabled. Enable them in the configuration to use this feature."));
    }
    if (!aiService) {
        return (React.createElement("div", { style: { padding: 20, textAlign: 'center', color: '#666' } }, "AI service is not configured. Please provide an API key in the configuration."));
    }
    return (React.createElement(Container, null,
        React.createElement(QueryInput, { value: query, onChange: function (e) { return setQuery(e.target.value); }, placeholder: "Ask about performance, errors, or request suggestions for improvements..." }),
        React.createElement(Button, { onClick: handleSubmit, disabled: isLoading || !query.trim() }, isLoading ? 'Analyzing...' : 'Analyze'),
        error && (React.createElement("div", { style: { color: '#dc2626', margin: '12px 0', padding: '8px', background: '#fee2e2', borderRadius: '4px' } }, error)),
        React.createElement(ResponseContainer, null, responses.map(function (response, index) { return (React.createElement(ResponseCard, { key: index },
            React.createElement(ResponseHeader, null,
                React.createElement(ResponseTitle, null, response.title),
                React.createElement("span", { style: { fontSize: 12, color: '#666' } }, new Date(response.timestamp).toLocaleTimeString())),
            React.createElement(ResponseContent, null,
                React.createElement("div", null, response.explanation),
                response.suggestedFix && (React.createElement(CodeBlock, null,
                    React.createElement(SyntaxHighlighter, { language: "typescript", style: tomorrow, customStyle: { margin: 0 } }, response.suggestedFix))),
                response.additionalContext && Object.entries(response.additionalContext).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return (React.createElement("div", { key: key, style: { marginTop: 12 } },
                        React.createElement("h4", { style: { margin: '0 0 4px', fontSize: 13, color: '#666' } }, key.charAt(0).toUpperCase() + key.slice(1)),
                        React.createElement("div", null, value)));
                })))); }))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=AITab.js.map