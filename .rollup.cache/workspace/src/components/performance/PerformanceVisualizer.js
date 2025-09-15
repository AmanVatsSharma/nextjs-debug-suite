import { __makeTemplateObject } from "tslib";
import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  padding: 1rem;\n  background: ", ";\n  border-radius: 8px;\n"], ["\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  padding: 1rem;\n  background: ", ";\n  border-radius: 8px;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.background.secondary;
});
var MetricGroup = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n"], ["\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n"])));
var MetricHeader = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n"], ["\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n"])));
var MetricTitle = styled.h4(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin: 0;\n  color: ", ";\n"], ["\n  margin: 0;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.text.primary;
});
var MetricValue = styled.span(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-family: monospace;\n  color: ", ";\n"], ["\n  font-family: monospace;\n  color: ", ";\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.text.secondary;
});
var BarChart = styled(motion.div)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  width: 100%;\n  height: 200px;\n  position: relative;\n  margin-top: 1rem;\n"], ["\n  width: 100%;\n  height: 200px;\n  position: relative;\n  margin-top: 1rem;\n"])));
var Bar = styled(motion.div)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  position: absolute;\n  bottom: 0;\n  width: 20px;\n  height: ", ";\n  background-color: ", ";\n  border-radius: 4px 4px 0 0;\n"], ["\n  position: absolute;\n  bottom: 0;\n  width: 20px;\n  height: ", ";\n  background-color: ", ";\n  border-radius: 4px 4px 0 0;\n"])), function (props) { return props.height; }, function (props) { return props.color; });
var BarLabel = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  position: absolute;\n  bottom: -20px;\n  left: 50%;\n  transform: translateX(-50%);\n  font-size: 0.75rem;\n  color: ", ";\n  white-space: nowrap;\n"], ["\n  position: absolute;\n  bottom: -20px;\n  left: 50%;\n  transform: translateX(-50%);\n  font-size: 0.75rem;\n  color: ", ";\n  white-space: nowrap;\n"])), function (_a) {
    var theme = _a.theme;
    return theme.colors.text.secondary;
});
export var PerformanceVisualizer = function (_a) {
    var _b;
    var metrics = _a.metrics;
    var renderMetrics = useMemo(function () {
        return metrics.filter(function (metric) { return metric.type === 'render'; });
    }, [metrics]);
    var memoryMetrics = useMemo(function () {
        return metrics.filter(function (metric) { return metric.type === 'memory'; });
    }, [metrics]);
    var resourceMetrics = useMemo(function () {
        return metrics.filter(function (metric) { return metric.type === 'resource'; });
    }, [metrics]);
    var maxRenderTime = useMemo(function () {
        return Math.max.apply(Math, renderMetrics.map(function (metric) { return metric.duration || 0; }));
    }, [renderMetrics]);
    return (React.createElement(Container, null,
        React.createElement(MetricGroup, null,
            React.createElement(MetricHeader, null,
                React.createElement(MetricTitle, null, "Component Render Times"),
                React.createElement(MetricValue, null,
                    renderMetrics.length,
                    " renders")),
            React.createElement(BarChart, null, renderMetrics.map(function (metric, index) {
                var height = metric.duration ? (metric.duration / maxRenderTime) * 180 : 0;
                return (React.createElement(Bar, { key: "".concat(metric.name, "-").concat(metric.timestamp), height: "".concat(height, "px"), color: metric.duration && metric.duration > 16 ? '#ff5252' : '#4caf50', style: { left: "".concat(index * 30, "px") }, initial: { height: 0 }, animate: { height: "".concat(height, "px") }, transition: { duration: 0.3 } },
                    React.createElement(BarLabel, null, metric.name)));
            }))),
        memoryMetrics.length > 0 && (React.createElement(MetricGroup, null,
            React.createElement(MetricHeader, null,
                React.createElement(MetricTitle, null, "Memory Usage"),
                React.createElement(MetricValue, null,
                    ((((_b = memoryMetrics[memoryMetrics.length - 1].details) === null || _b === void 0 ? void 0 : _b.usedJSHeapSize) || 0) / 1024 / 1024).toFixed(1),
                    " MB")))),
        resourceMetrics.length > 0 && (React.createElement(MetricGroup, null,
            React.createElement(MetricHeader, null,
                React.createElement(MetricTitle, null, "Resource Timings"),
                React.createElement(MetricValue, null,
                    resourceMetrics.length,
                    " resources")),
            resourceMetrics.map(function (metric) {
                var _a, _b;
                return (React.createElement("div", { key: "".concat(metric.name, "-").concat(metric.timestamp) },
                    React.createElement(MetricValue, null,
                        metric.name,
                        " - ", (_a = metric.duration) === null || _a === void 0 ? void 0 :
                        _a.toFixed(2),
                        "ms",
                        ((_b = metric.details) === null || _b === void 0 ? void 0 : _b.size) && " (".concat((metric.details.size / 1024).toFixed(1), " KB)"))));
            })))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=PerformanceVisualizer.js.map