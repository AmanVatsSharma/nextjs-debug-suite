import { __makeTemplateObject } from "tslib";
import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { useDebugContext } from '../DebugSuiteProvider';
import { RequestDetails } from './RequestDetails';
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n"], ["\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  overflow: hidden;\n"])));
var Toolbar = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  gap: 8px;\n  padding: 8px;\n  border-bottom: 1px solid ", ";\n"], ["\n  display: flex;\n  gap: 8px;\n  padding: 8px;\n  border-bottom: 1px solid ", ";\n"])), function (props) { return props.theme.colors.border; });
var Button = styled.button(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 6px 12px;\n  border-radius: 4px;\n  border: 1px solid ", ";\n  background: ", ";\n  color: ", ";\n  cursor: pointer;\n  &:hover {\n    background: ", ";\n  }\n"], ["\n  padding: 6px 12px;\n  border-radius: 4px;\n  border: 1px solid ", ";\n  background: ", ";\n  color: ", ";\n  cursor: pointer;\n  &:hover {\n    background: ", ";\n  }\n"])), function (props) { return props.theme.colors.border; }, function (props) { return props.active ? props.theme.colors.primary : 'transparent'; }, function (props) { return props.active ? props.theme.colors.white : props.theme.colors.text; }, function (props) { return props.active ? props.theme.colors.primary : props.theme.colors.hover; });
var SearchInput = styled.input(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 6px 12px;\n  border-radius: 4px;\n  border: 1px solid ", ";\n  background: ", ";\n  color: ", ";\n  flex: 1;\n"], ["\n  padding: 6px 12px;\n  border-radius: 4px;\n  border: 1px solid ", ";\n  background: ", ";\n  color: ", ";\n  flex: 1;\n"])), function (props) { return props.theme.colors.border; }, function (props) { return props.theme.colors.background; }, function (props) { return props.theme.colors.text; });
var Content = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  flex: 1;\n  overflow: hidden;\n"], ["\n  display: flex;\n  flex: 1;\n  overflow: hidden;\n"])));
var RequestList = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  flex: 1;\n  overflow-y: auto;\n  padding: 8px;\n  border-right: 1px solid ", ";\n"], ["\n  flex: 1;\n  overflow-y: auto;\n  padding: 8px;\n  border-right: 1px solid ", ";\n"])), function (props) { return props.theme.colors.border; });
var DetailsPanel = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  flex: 1;\n  overflow-y: auto;\n  padding: 8px;\n"], ["\n  flex: 1;\n  overflow-y: auto;\n  padding: 8px;\n"])));
var RequestItem = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  padding: 8px;\n  border-radius: 4px;\n  margin-bottom: 4px;\n  background: ", ";\n  cursor: pointer;\n  &:hover {\n    background: ", ";\n  }\n"], ["\n  display: flex;\n  align-items: center;\n  padding: 8px;\n  border-radius: 4px;\n  margin-bottom: 4px;\n  background: ", ";\n  cursor: pointer;\n  &:hover {\n    background: ", ";\n  }\n"])), function (props) {
    if (props.selected)
        return props.theme.colors.primary + '20';
    if (props.failed)
        return props.theme.colors.error + '20';
    return props.theme.colors.surface;
}, function (props) { return props.selected ? props.theme.colors.primary + '30' : props.theme.colors.hover; });
var Method = styled.span(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  padding: 2px 6px;\n  border-radius: 3px;\n  font-size: 12px;\n  font-weight: bold;\n  margin-right: 8px;\n  background: ", ";\n  color: ", ";\n"], ["\n  padding: 2px 6px;\n  border-radius: 3px;\n  font-size: 12px;\n  font-weight: bold;\n  margin-right: 8px;\n  background: ", ";\n  color: ", ";\n"])), function (props) {
    switch (props.method) {
        case 'GET': return props.theme.colors.success + '20';
        case 'POST': return props.theme.colors.primary + '20';
        case 'PUT': return props.theme.colors.warning + '20';
        case 'DELETE': return props.theme.colors.error + '20';
        default: return props.theme.colors.surface;
    }
}, function (props) {
    switch (props.method) {
        case 'GET': return props.theme.colors.success;
        case 'POST': return props.theme.colors.primary;
        case 'PUT': return props.theme.colors.warning;
        case 'DELETE': return props.theme.colors.error;
        default: return props.theme.colors.text;
    }
});
var StatusContainer = styled.span(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  padding: 2px 6px;\n  border-radius: 3px;\n  font-size: 12px;\n  margin-right: 8px;\n  background: ", ";\n  color: ", ";\n"], ["\n  padding: 2px 6px;\n  border-radius: 3px;\n  font-size: 12px;\n  margin-right: 8px;\n  background: ", ";\n  color: ", ";\n"])), function (props) {
    if (!props.$status)
        return props.theme.colors.surface;
    if (props.$status < 300)
        return props.theme.colors.success + '20';
    if (props.$status < 400)
        return props.theme.colors.warning + '20';
    return props.theme.colors.error + '20';
}, function (props) {
    if (!props.$status)
        return props.theme.colors.text;
    if (props.$status < 300)
        return props.theme.colors.success;
    if (props.$status < 400)
        return props.theme.colors.warning;
    return props.theme.colors.error;
});
var DurationContainer = styled.span(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  padding: 2px 6px;\n  border-radius: 3px;\n  font-size: 12px;\n  margin-right: 8px;\n  background: ", ";\n  color: ", ";\n"], ["\n  padding: 2px 6px;\n  border-radius: 3px;\n  font-size: 12px;\n  margin-right: 8px;\n  background: ", ";\n  color: ", ";\n"])), function (props) {
    if (!props.$duration)
        return props.theme.colors.surface;
    if (props.$duration < 300)
        return props.theme.colors.success + '20';
    if (props.$duration < 1000)
        return props.theme.colors.warning + '20';
    return props.theme.colors.error + '20';
}, function (props) {
    if (!props.$duration)
        return props.theme.colors.text;
    if (props.$duration < 300)
        return props.theme.colors.success;
    if (props.$duration < 1000)
        return props.theme.colors.warning;
    return props.theme.colors.error;
});
var Url = styled.span(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  flex: 1;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: ", ";\n"], ["\n  flex: 1;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: ", ";\n"])), function (props) { return props.theme.colors.text; });
var Size = styled.span(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  font-size: 12px;\n  color: ", ";\n  margin-left: 8px;\n"], ["\n  font-size: 12px;\n  color: ", ";\n  margin-left: 8px;\n"])), function (props) { return props.theme.colors.textSecondary; });
export var NetworkVisualizer = function () {
    var network = useDebugContext().network;
    var _a = useState('all'), filter = _a[0], setFilter = _a[1];
    var _b = useState(''), search = _b[0], setSearch = _b[1];
    var _c = useState('time'), sortBy = _c[0], setSortBy = _c[1];
    var _d = useState(null), selectedRequest = _d[0], setSelectedRequest = _d[1];
    var requests = useMemo(function () {
        var filtered;
        // Apply filter
        switch (filter) {
            case 'failed':
                filtered = network.getFailedRequests();
                break;
            case 'slow':
                filtered = network.getSlowRequests();
                break;
            default:
                filtered = network.getRequests();
        }
        // Apply search
        if (search) {
            var searchLower_1 = search.toLowerCase();
            filtered = filtered.filter(function (req) {
                var _a;
                return req.url.toLowerCase().includes(searchLower_1) ||
                    req.method.toLowerCase().includes(searchLower_1) ||
                    (((_a = req.status) === null || _a === void 0 ? void 0 : _a.toString()) || '').includes(searchLower_1);
            });
        }
        // Apply sorting
        return filtered.sort(function (a, b) {
            switch (sortBy) {
                case 'duration':
                    return (b.duration || 0) - (a.duration || 0);
                case 'size':
                    return (b.size || 0) - (a.size || 0);
                default:
                    return b.startTime - a.startTime;
            }
        });
    }, [network, filter, search, sortBy]);
    var formatSize = function (size) {
        if (!size)
            return 'N/A';
        if (size < 1024)
            return "".concat(size, "B");
        if (size < 1024 * 1024)
            return "".concat((size / 1024).toFixed(1), "KB");
        return "".concat((size / (1024 * 1024)).toFixed(1), "MB");
    };
    var formatDuration = function (duration) {
        if (!duration)
            return 'N/A';
        if (duration < 1000)
            return "".concat(duration.toFixed(0), "ms");
        return "".concat((duration / 1000).toFixed(2), "s");
    };
    return (React.createElement(Container, null,
        React.createElement(Toolbar, null,
            React.createElement(Button, { active: filter === 'all', onClick: function () { return setFilter('all'); } }, "All"),
            React.createElement(Button, { active: filter === 'failed', onClick: function () { return setFilter('failed'); } }, "Failed"),
            React.createElement(Button, { active: filter === 'slow', onClick: function () { return setFilter('slow'); } }, "Slow"),
            React.createElement(SearchInput, { placeholder: "Search requests...", value: search, onChange: function (e) { return setSearch(e.target.value); } }),
            React.createElement(Button, { active: sortBy === 'time', onClick: function () { return setSortBy('time'); } }, "Time"),
            React.createElement(Button, { active: sortBy === 'duration', onClick: function () { return setSortBy('duration'); } }, "Duration"),
            React.createElement(Button, { active: sortBy === 'size', onClick: function () { return setSortBy('size'); } }, "Size")),
        React.createElement(Content, null,
            React.createElement(RequestList, null, requests.map(function (request) {
                var _a, _b;
                return (React.createElement(RequestItem, { key: request.id, failed: request.error !== undefined || (request.status !== undefined && request.status >= 400), selected: (selectedRequest === null || selectedRequest === void 0 ? void 0 : selectedRequest.id) === request.id, onClick: function () { return setSelectedRequest(request); } },
                    React.createElement(Method, { method: request.method }, request.method),
                    React.createElement(StatusContainer, { "$status": (_a = request.status) !== null && _a !== void 0 ? _a : null }, request.status || 'Pending'),
                    React.createElement(DurationContainer, { "$duration": (_b = request.duration) !== null && _b !== void 0 ? _b : null }, formatDuration(request.duration)),
                    React.createElement(Url, null, request.url),
                    React.createElement(Size, null, formatSize(request.size))));
            })),
            React.createElement(DetailsPanel, null, selectedRequest && React.createElement(RequestDetails, { request: selectedRequest })))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
//# sourceMappingURL=NetworkVisualizer.js.map