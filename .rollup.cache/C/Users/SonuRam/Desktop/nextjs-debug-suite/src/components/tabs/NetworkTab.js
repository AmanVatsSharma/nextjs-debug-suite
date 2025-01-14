import { __makeTemplateObject, __spreadArray } from "tslib";
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDebugContext } from '../DebugSuiteProvider';
var RequestCard = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 12px;\n  border: 1px solid ", ";\n  border-radius: 6px;\n  overflow: hidden;\n"], ["\n  margin-bottom: 12px;\n  border: 1px solid ", ";\n  border-radius: 6px;\n  overflow: hidden;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
});
var RequestHeader = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 12px;\n  background: ", ";\n  border-bottom: 1px solid ", ";\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  cursor: pointer;\n\n  ", "\n"], ["\n  padding: 12px;\n  background: ", ";\n  border-bottom: 1px solid ", ";\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  cursor: pointer;\n\n  ", "\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.tabBackground;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
}, function (_a) {
    var status = _a.status, theme = _a.theme;
    if (!status)
        return '';
    if (status >= 500)
        return "color: ".concat(theme.colors.error, ";");
    if (status >= 400)
        return "color: ".concat(theme.colors.warning, ";");
    if (status >= 200 && status < 300)
        return "color: ".concat(theme.colors.success, ";");
    return '';
});
var Method = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-weight: 600;\n  margin-right: 8px;\n  ", "\n"], ["\n  font-weight: 600;\n  margin-right: 8px;\n  ", "\n"])), function (_a) {
    var method = _a.method, theme = _a.theme;
    switch (method.toUpperCase()) {
        case 'GET':
            return "color: ".concat(theme.colors.info, ";");
        case 'POST':
            return "color: ".concat(theme.colors.success, ";");
        case 'PUT':
            return "color: ".concat(theme.colors.warning, ";");
        case 'DELETE':
            return "color: ".concat(theme.colors.error, ";");
        default:
            return '';
    }
});
var Status = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-weight: 500;\n  font-size: 12px;\n  padding: 2px 6px;\n  border-radius: 4px;\n  ", "\n"], ["\n  font-weight: 500;\n  font-size: 12px;\n  padding: 2px 6px;\n  border-radius: 4px;\n  ", "\n"])), function (_a) {
    var status = _a.status, theme = _a.theme;
    if (!status)
        return '';
    if (status >= 500)
        return "background: ".concat(theme.colors.error, "; color: white;");
    if (status >= 400)
        return "background: ".concat(theme.colors.warning, "; color: white;");
    if (status >= 200 && status < 300)
        return "background: ".concat(theme.colors.success, "; color: white;");
    return '';
});
var RequestDetails = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  padding: 12px;\n"], ["\n  padding: 12px;\n"])));
var DetailSection = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  margin-bottom: 16px;\n\n  &:last-child {\n    margin-bottom: 0;\n  }\n"], ["\n  margin-bottom: 16px;\n\n  &:last-child {\n    margin-bottom: 0;\n  }\n"])));
var DetailTitle = styled.h4(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin: 0 0 8px;\n  font-size: 13px;\n  color: ", ";\n"], ["\n  margin: 0 0 8px;\n  font-size: 13px;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.secondary;
});
var NetworkRequest = function (_a) {
    var request = _a.request;
    var _b = useState(false), isExpanded = _b[0], setIsExpanded = _b[1];
    return (React.createElement(RequestCard, null,
        React.createElement(RequestHeader, { status: request.status, onClick: function () { return setIsExpanded(!isExpanded); } },
            React.createElement("div", null,
                React.createElement(Method, { method: request.method }, request.method),
                React.createElement("span", null, request.url)),
            React.createElement("div", null,
                request.status && React.createElement(Status, { status: request.status }, request.status),
                request.duration && (React.createElement("span", { style: { marginLeft: 8, fontSize: 12 } },
                    request.duration.toFixed(2),
                    "ms")))),
        isExpanded && (React.createElement(RequestDetails, null,
            request.requestData && (React.createElement(DetailSection, null,
                React.createElement(DetailTitle, null, "Request Data"),
                React.createElement(SyntaxHighlighter, { language: "json", style: tomorrow, customStyle: { margin: 0 } }, JSON.stringify(request.requestData, null, 2)))),
            request.responseData && (React.createElement(DetailSection, null,
                React.createElement(DetailTitle, null, "Response Data"),
                React.createElement(SyntaxHighlighter, { language: "json", style: tomorrow, customStyle: { margin: 0 } }, JSON.stringify(request.responseData, null, 2)))),
            request.error && (React.createElement(DetailSection, null,
                React.createElement(DetailTitle, null, "Error"),
                React.createElement("div", { style: { color: '#dc2626' } }, request.error.message)))))));
};
export var NetworkTab = function () {
    var network = useDebugContext().network;
    var _a = useState([]), requests = _a[0], setRequests = _a[1];
    useEffect(function () {
        // Subscribe to network events
        var unsubscribe = network.debug.subscribe(function (log) {
            if (log.type === 'NETWORK' || log.type === 'NETWORK_ERROR') {
                setRequests(function (prev) { return __spreadArray([log.data], prev, true); });
            }
        });
        return unsubscribe;
    }, [network]);
    if (requests.length === 0) {
        return (React.createElement("div", { style: { padding: 20, textAlign: 'center', color: '#666' } }, "No network requests captured"));
    }
    return (React.createElement("div", null, requests.map(function (request, index) { return (React.createElement(NetworkRequest, { key: index, request: request })); })));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=NetworkTab.js.map