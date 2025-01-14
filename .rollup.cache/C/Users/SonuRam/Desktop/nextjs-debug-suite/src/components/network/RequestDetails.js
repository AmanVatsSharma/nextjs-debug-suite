import { __makeTemplateObject } from "tslib";
import React from 'react';
import styled from '@emotion/styled';
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  padding: 16px;\n  background: ", ";\n  border-radius: 8px;\n  font-family: monospace;\n"], ["\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  padding: 16px;\n  background: ", ";\n  border-radius: 8px;\n  font-family: monospace;\n"])), function (props) { return props.theme.colors.surface; });
var Section = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n"], ["\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n"])));
var SectionTitle = styled.h3(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin: 0;\n  font-size: 14px;\n  color: ", ";\n"], ["\n  margin: 0;\n  font-size: 14px;\n  color: ", ";\n"])), function (props) { return props.theme.colors.textSecondary; });
var InfoGrid = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: grid;\n  grid-template-columns: auto 1fr;\n  gap: 8px 16px;\n  align-items: baseline;\n"], ["\n  display: grid;\n  grid-template-columns: auto 1fr;\n  gap: 8px 16px;\n  align-items: baseline;\n"])));
var Label = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 12px;\n"], ["\n  color: ", ";\n  font-size: 12px;\n"])), function (props) { return props.theme.colors.textSecondary; });
var Value = styled.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n  font-size: 12px;\n  word-break: break-all;\n"], ["\n  color: ", ";\n  font-size: 12px;\n  word-break: break-all;\n"])), function (props) { return props.theme.colors.text; });
var CodeBlock = styled.pre(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin: 0;\n  padding: 8px;\n  background: ", ";\n  border-radius: 4px;\n  font-size: 12px;\n  overflow-x: auto;\n  color: ", ";\n"], ["\n  margin: 0;\n  padding: 8px;\n  background: ", ";\n  border-radius: 4px;\n  font-size: 12px;\n  overflow-x: auto;\n  color: ", ";\n"])), function (props) { return props.theme.colors.background; }, function (props) { return props.theme.colors.text; });
export var RequestDetails = function (_a) {
    var request = _a.request;
    var formatHeaders = function (headers) {
        if (!headers)
            return null;
        return Object.entries(headers).map(function (_a) {
            var key = _a[0], value = _a[1];
            return (React.createElement(React.Fragment, { key: key },
                React.createElement(Label, null,
                    key,
                    ":"),
                React.createElement(Value, null, value)));
        });
    };
    var formatBody = function (body) {
        if (!body)
            return null;
        try {
            if (typeof body === 'string') {
                try {
                    // Try to parse as JSON first
                    var parsed = JSON.parse(body);
                    return JSON.stringify(parsed, null, 2);
                }
                catch (_a) {
                    // If not JSON, return as is
                    return body;
                }
            }
            return JSON.stringify(body, null, 2);
        }
        catch (error) {
            return String(body);
        }
    };
    var formatDuration = function (duration) {
        if (!duration)
            return 'N/A';
        if (duration < 1000)
            return "".concat(duration.toFixed(0), "ms");
        return "".concat((duration / 1000).toFixed(2), "s");
    };
    var formatSize = function (size) {
        if (!size)
            return 'N/A';
        if (size < 1024)
            return "".concat(size, "B");
        if (size < 1024 * 1024)
            return "".concat((size / 1024).toFixed(1), "KB");
        return "".concat((size / (1024 * 1024)).toFixed(1), "MB");
    };
    return (React.createElement(Container, null,
        React.createElement(Section, null,
            React.createElement(SectionTitle, null, "General"),
            React.createElement(InfoGrid, { role: "grid", "aria-label": "General Information" },
                React.createElement(Label, null, "URL:"),
                React.createElement(Value, null, request.url),
                React.createElement(Label, null, "Method:"),
                React.createElement(Value, null, request.method),
                React.createElement(Label, null, "Status:"),
                React.createElement(Value, null, request.status || 'Pending'),
                React.createElement(Label, null, "Duration:"),
                React.createElement(Value, null, formatDuration(request.duration)),
                React.createElement(Label, null, "Size:"),
                React.createElement(Value, null, formatSize(request.size)),
                React.createElement(Label, null, "Initiator:"),
                React.createElement(Value, null, request.initiator))),
        request.requestHeaders && (React.createElement(Section, null,
            React.createElement(SectionTitle, null, "Request Headers"),
            React.createElement(InfoGrid, { role: "grid", "aria-label": "Request Headers" }, formatHeaders(request.requestHeaders)))),
        request.responseHeaders && (React.createElement(Section, null,
            React.createElement(SectionTitle, null, "Response Headers"),
            React.createElement(InfoGrid, { role: "grid", "aria-label": "Response Headers" }, formatHeaders(request.responseHeaders)))),
        request.requestBody && (React.createElement(Section, null,
            React.createElement(SectionTitle, null, "Request Body"),
            React.createElement(CodeBlock, null, formatBody(request.requestBody)))),
        request.responseBody && (React.createElement(Section, null,
            React.createElement(SectionTitle, null, "Response Body"),
            React.createElement(CodeBlock, null, formatBody(request.responseBody)))),
        request.error && (React.createElement(Section, null,
            React.createElement(SectionTitle, null, "Error"),
            React.createElement(CodeBlock, { style: { color: function (props) { return props.theme.colors.error; } } },
                request.error.message,
                request.error.stack && "\n\n".concat(request.error.stack))))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=RequestDetails.js.map