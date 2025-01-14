import React, { useState, useCallback } from 'react';
import { ThemeProvider } from '@emotion/react';
import { MdDragIndicator } from 'react-icons/md';
import { useDebugContext } from './DebugSuiteProvider';
import { getTheme } from './styles/theme';
import { OverlayContainer, TabBar, Tab, ContentArea, ActionBar, Button, ResizeHandle, } from './styles/DebugOverlay.styles';
// Import tab content components
import { ErrorsTab } from './tabs/ErrorsTab';
import { PerformanceTab } from './tabs/PerformanceTab';
import { NetworkTab } from './tabs/NetworkTab';
import { ConsoleTab } from './tabs/ConsoleTab';
import { AITab } from './tabs/AITab';
export var DebugOverlay = function () {
    var _a = useDebugContext(), config = _a.config, clearData = _a.clearData, exportData = _a.exportData;
    var _b = useState(config.overlay.tabs[0]), activeTab = _b[0], setActiveTab = _b[1];
    var _c = useState(config.overlay.size), size = _c[0], setSize = _c[1];
    var _d = useState(false), isDragging = _d[0], setIsDragging = _d[1];
    var _e = useState(false), isResizing = _e[0], setIsResizing = _e[1];
    var theme = getTheme(config.overlay.theme);
    var handleResize = useCallback(function (_, info) {
        setSize(function (prev) { return ({
            width: Math.max(300, prev.width + info.delta.x),
            height: Math.max(200, prev.height + info.delta.y),
        }); });
    }, []);
    var handleClear = useCallback(function () {
        clearData(activeTab);
    }, [clearData, activeTab]);
    var handleExport = useCallback(function () {
        var data = exportData(activeTab);
        var fileName = "debug-data-".concat(activeTab, "-").concat(new Date().toISOString(), ".json");
        var jsonString = JSON.stringify(data, null, 2);
        var blob = new Blob([jsonString], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [exportData, activeTab]);
    var renderTabContent = function () {
        switch (activeTab) {
            case 'errors':
                return React.createElement(ErrorsTab, null);
            case 'performance':
                return React.createElement(PerformanceTab, null);
            case 'network':
                return React.createElement(NetworkTab, null);
            case 'console':
                return React.createElement(ConsoleTab, null);
            case 'ai':
                return React.createElement(AITab, null);
            default:
                return null;
        }
    };
    return (React.createElement(ThemeProvider, { theme: theme },
        React.createElement(OverlayContainer, { "data-testid": "overlay-container", position: config.overlay.position, size: size, opacity: config.overlay.opacity, drag: true, dragMomentum: false, dragListener: !isResizing, onDragStart: function () { return setIsDragging(true); }, onDragEnd: function () { return setIsDragging(false); }, initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: config.overlay.opacity }, exit: { scale: 0.9, opacity: 0 } },
            React.createElement(TabBar, null, config.overlay.tabs.map(function (tab) { return (React.createElement(Tab, { key: tab, "data-testid": "".concat(tab, "-tab"), active: activeTab === tab, onClick: function () { return setActiveTab(tab); } }, tab.charAt(0).toUpperCase() + tab.slice(1))); })),
            React.createElement(ContentArea, null, renderTabContent()),
            React.createElement(ActionBar, null,
                React.createElement(Button, { onClick: handleClear }, "Clear"),
                React.createElement(Button, { onClick: handleExport }, "Export")),
            React.createElement(ResizeHandle, { drag: true, dragMomentum: false, dragConstraints: { top: 0, left: 0, right: 0, bottom: 0 }, onDragStart: function () { return setIsResizing(true); }, onDrag: handleResize, onDragEnd: function () { return setIsResizing(false); } },
                React.createElement(MdDragIndicator, { size: 16 })))));
};
//# sourceMappingURL=DebugOverlay.js.map