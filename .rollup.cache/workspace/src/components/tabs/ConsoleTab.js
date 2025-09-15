import { __makeTemplateObject, __spreadArray } from "tslib";
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDebugContext } from '../DebugSuiteProvider';
var FilterBar = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  gap: 8px;\n  margin-bottom: 16px;\n"], ["\n  display: flex;\n  gap: 8px;\n  margin-bottom: 16px;\n"])));
var FilterButton = styled.button(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 4px 12px;\n  border: 1px solid ", ";\n  border-radius: 4px;\n  background: ", ";\n  color: ", ";\n  cursor: pointer;\n  font-size: 12px;\n  transition: all 0.2s;\n\n  &:hover {\n    background: ", ";\n  }\n"], ["\n  padding: 4px 12px;\n  border: 1px solid ", ";\n  border-radius: 4px;\n  background: ", ";\n  color: ", ";\n  cursor: pointer;\n  font-size: 12px;\n  transition: all 0.2s;\n\n  &:hover {\n    background: ", ";\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
}, function (_a) {
    var active = _a.active, theme = _a.theme;
    return active ? theme.colors.primary : theme.colors.background;
}, function (_a) {
    var active = _a.active, theme = _a.theme;
    return active ? 'white' : theme.colors.text;
}, function (_a) {
    var active = _a.active, theme = _a.theme;
    return active ? theme.colors.primary : theme.colors.hover;
});
var SearchInput = styled.input(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 4px 12px;\n  border: 1px solid ", ";\n  border-radius: 4px;\n  background: ", ";\n  color: ", ";\n  font-size: 12px;\n  flex: 1;\n\n  &:focus {\n    outline: none;\n    border-color: ", ";\n  }\n"], ["\n  padding: 4px 12px;\n  border: 1px solid ", ";\n  border-radius: 4px;\n  background: ", ";\n  color: ", ";\n  font-size: 12px;\n  flex: 1;\n\n  &:focus {\n    outline: none;\n    border-color: ", ";\n  }\n"])), function (_a) {
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
var LogEntry = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 8px 12px;\n  border-bottom: 1px solid ", ";\n  font-family: monospace;\n  font-size: 12px;\n  ", "\n\n  &:hover {\n    background: ", ";\n  }\n"], ["\n  padding: 8px 12px;\n  border-bottom: 1px solid ", ";\n  font-family: monospace;\n  font-size: 12px;\n  ", "\n\n  &:hover {\n    background: ", ";\n  }\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
}, function (_a) {
    var type = _a.type, theme = _a.theme;
    switch (type) {
        case 'ERROR':
            return "color: ".concat(theme.colors.error, ";");
        case 'WARN':
            return "color: ".concat(theme.colors.warning, ";");
        case 'INFO':
            return "color: ".concat(theme.colors.info, ";");
        default:
            return "color: ".concat(theme.colors.text, ";");
    }
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.hover;
});
var Timestamp = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: ", ";\n  margin-right: 8px;\n"], ["\n  color: ", ";\n  margin-right: 8px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.secondary;
});
var Source = styled.span(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n  margin-right: 8px;\n"], ["\n  color: ", ";\n  margin-right: 8px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.primary;
});
var DataPreview = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin-top: 4px;\n  padding: 8px;\n  background: ", ";\n  border-radius: 4px;\n"], ["\n  margin-top: 4px;\n  padding: 8px;\n  background: ", ";\n  border-radius: 4px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.tabBackground;
});
export var ConsoleTab = function () {
    var debug = useDebugContext().debug;
    var _a = useState([]), logs = _a[0], setLogs = _a[1];
    var _b = useState(new Set()), filters = _b[0], setFilters = _b[1];
    var _c = useState(''), search = _c[0], setSearch = _c[1];
    var _d = useState(new Set()), expandedLogs = _d[0], setExpandedLogs = _d[1];
    useEffect(function () {
        var unsubscribe = debug.subscribe(function (log) {
            setLogs(function (prev) { return __spreadArray([log], prev, true); });
        });
        return unsubscribe;
    }, [debug]);
    var toggleFilter = function (type) {
        var newFilters = new Set(filters);
        if (newFilters.has(type)) {
            newFilters.delete(type);
        }
        else {
            newFilters.add(type);
        }
        setFilters(newFilters);
    };
    var toggleExpanded = function (index) {
        var newExpanded = new Set(expandedLogs);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        }
        else {
            newExpanded.add(index);
        }
        setExpandedLogs(newExpanded);
    };
    var filteredLogs = logs.filter(function (log) {
        if (filters.size > 0 && !filters.has(log.type))
            return false;
        if (search && !log.message.toLowerCase().includes(search.toLowerCase()))
            return false;
        return true;
    });
    return (React.createElement("div", null,
        React.createElement(FilterBar, null,
            React.createElement(FilterButton, { active: filters.has('ERROR'), onClick: function () { return toggleFilter('ERROR'); } }, "Errors"),
            React.createElement(FilterButton, { active: filters.has('WARN'), onClick: function () { return toggleFilter('WARN'); } }, "Warnings"),
            React.createElement(FilterButton, { active: filters.has('INFO'), onClick: function () { return toggleFilter('INFO'); } }, "Info"),
            React.createElement(SearchInput, { placeholder: "Search logs...", value: search, onChange: function (e) { return setSearch(e.target.value); } })),
        React.createElement("div", null, filteredLogs.map(function (log, index) { return (React.createElement(LogEntry, { key: index, type: log.type, onClick: function () { return toggleExpanded(index); } },
            React.createElement(Timestamp, null, new Date(log.timestamp).toLocaleTimeString()),
            React.createElement(Source, null,
                "[",
                log.source,
                "]"),
            React.createElement("span", null, log.message),
            expandedLogs.has(index) && log.data && (React.createElement(DataPreview, null,
                React.createElement(SyntaxHighlighter, { language: "json", style: tomorrow, customStyle: { margin: 0 } }, JSON.stringify(log.data, null, 2)))))); }))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=ConsoleTab.js.map