import { __assign } from "tslib";
import React, { createContext, useContext, useState, useCallback } from 'react';
var DebugContext = createContext(undefined);
export var useDebugContext = function () {
    var context = useContext(DebugContext);
    if (!context) {
        throw new Error('useDebugContext must be used within a DebugSuiteProvider');
    }
    return context;
};
export var DebugSuiteProvider = function (_a) {
    var children = _a.children, initialConfig = _a.config;
    var config = useState(initialConfig)[0];
    var _b = useState({
        errors: [],
        performance: {
            metrics: [],
            memory: [],
            renders: []
        },
        network: {
            requests: [],
            responses: []
        },
        console: {
            logs: [],
            warnings: [],
            errors: []
        },
        ai: {
            suggestions: [],
            analysis: []
        }
    }), data = _b[0], setData = _b[1];
    var clearData = useCallback(function (tab) {
        setData(function (prev) {
            var newData = __assign({}, prev);
            switch (tab) {
                case 'errors':
                    newData.errors = [];
                    break;
                case 'performance':
                    newData.performance = {
                        metrics: [],
                        memory: [],
                        renders: []
                    };
                    break;
                case 'network':
                    newData.network = {
                        requests: [],
                        responses: []
                    };
                    break;
                case 'console':
                    newData.console = {
                        logs: [],
                        warnings: [],
                        errors: []
                    };
                    break;
                case 'ai':
                    newData.ai = {
                        suggestions: [],
                        analysis: []
                    };
                    break;
            }
            return newData;
        });
    }, []);
    var exportData = useCallback(function (tab) {
        switch (tab) {
            case 'errors':
                return { errors: data.errors };
            case 'performance':
                return { performance: data.performance };
            case 'network':
                return { network: data.network };
            case 'console':
                return { console: data.console };
            case 'ai':
                return { ai: data.ai };
            default:
                return data;
        }
    }, [data]);
    var value = {
        config: config,
        data: data,
        clearData: clearData,
        exportData: exportData
    };
    return (React.createElement(DebugContext.Provider, { value: value }, children));
};
//# sourceMappingURL=DebugSuiteProvider.js.map