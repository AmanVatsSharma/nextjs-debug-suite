import { __makeTemplateObject } from "tslib";
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useDebugContext } from '../DebugSuiteProvider';
var MetricCard = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: ", ";\n  border: 1px solid ", ";\n  border-radius: 6px;\n  padding: 12px;\n  margin-bottom: 12px;\n"], ["\n  background: ", ";\n  border: 1px solid ", ";\n  border-radius: 6px;\n  padding: 12px;\n  margin-bottom: 12px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.tabBackground;
}, function (_a) {
    var theme = _a.theme;
    return theme.colors.border;
});
var MetricTitle = styled.h3(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 0 0 8px;\n  font-size: 14px;\n  color: ", ";\n"], ["\n  margin: 0 0 8px;\n  font-size: 14px;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.text;
});
var MetricValue = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  font-size: 24px;\n  font-weight: 600;\n  color: ", ";\n"], ["\n  font-size: 24px;\n  font-weight: 600;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme, status = _a.status;
    switch (status) {
        case 'warning':
            return theme.colors.warning;
        case 'error':
            return theme.colors.error;
        case 'success':
            return theme.colors.success;
        default:
            return theme.colors.primary;
    }
});
var MetricMeta = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: 12px;\n  color: ", ";\n  margin-top: 4px;\n"], ["\n  font-size: 12px;\n  color: ", ";\n  margin-top: 4px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.secondary;
});
var Section = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin-bottom: 24px;\n"], ["\n  margin-bottom: 24px;\n"])));
var SectionTitle = styled.h2(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  margin: 0 0 16px;\n  font-size: 16px;\n  color: ", ";\n"], ["\n  margin: 0 0 16px;\n  font-size: 16px;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.text;
});
export var PerformanceTab = function () {
    var performance = useDebugContext().performance;
    var _a = useState([]), metrics = _a[0], setMetrics = _a[1];
    var _b = useState([]), resources = _b[0], setResources = _b[1];
    useEffect(function () {
        // Memory metrics
        var memoryInterval = setInterval(function () {
            performance.trackMemory();
        }, 5000);
        // Resource timing
        var resourceInterval = setInterval(function () {
            performance.trackResourceTiming();
        }, 10000);
        return function () {
            clearInterval(memoryInterval);
            clearInterval(resourceInterval);
        };
    }, [performance]);
    var getStatusForMetric = function (name, value) {
        switch (name) {
            case 'Memory Usage':
                return value > 80 ? 'error' : value > 60 ? 'warning' : 'success';
            case 'First Paint':
                return value > 3000 ? 'error' : value > 1000 ? 'warning' : 'success';
            default:
                return undefined;
        }
    };
    return (React.createElement("div", null,
        React.createElement(Section, null,
            React.createElement(SectionTitle, null, "Real-time Metrics"),
            metrics.map(function (metric) { return (React.createElement(MetricCard, { key: metric.name },
                React.createElement(MetricTitle, null, metric.name),
                React.createElement(MetricValue, { status: metric.status },
                    metric.value.toFixed(2),
                    " ",
                    metric.unit),
                React.createElement(MetricMeta, null,
                    "Last updated: ",
                    new Date(metric.timestamp).toLocaleTimeString()))); })),
        React.createElement(Section, null,
            React.createElement(SectionTitle, null, "Resource Performance"),
            resources.map(function (resource) { return (React.createElement(MetricCard, { key: resource.name },
                React.createElement(MetricTitle, null, resource.name),
                React.createElement(MetricValue, null,
                    resource.duration.toFixed(2),
                    " ms"),
                React.createElement(MetricMeta, null,
                    "Size: ",
                    (resource.size / 1024).toFixed(2),
                    " KB"))); }))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=PerformanceTab.js.map