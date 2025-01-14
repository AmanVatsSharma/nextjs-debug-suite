import React, { useState, useCallback } from 'react';
import { ThemeProvider } from '@emotion/react';
import { motion, PanInfo } from 'framer-motion';
import { MdDragIndicator } from 'react-icons/md';
import { useDebugContext } from './DebugSuiteProvider';
import { getTheme } from './styles/theme';
import {
  OverlayContainer,
  TabBar,
  Tab,
  ContentArea,
  ActionBar,
  Button,
  ResizeHandle,
} from './styles/DebugOverlay.styles';

// Import tab content components
import { ErrorsTab } from './tabs/ErrorsTab';
import { PerformanceTab } from './tabs/PerformanceTab';
import { NetworkTab } from './tabs/NetworkTab';
import { ConsoleTab } from './tabs/ConsoleTab';
import { AITab } from './tabs/AITab';

export const DebugOverlay: React.FC = () => {
  const { config, clearData, exportData } = useDebugContext();
  const [activeTab, setActiveTab] = useState(config.overlay.tabs[0]);
  const [size, setSize] = useState(config.overlay.size);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const theme = getTheme(config.overlay.theme);

  const handleResize = useCallback(
    (_: any, info: PanInfo) => {
      setSize(prev => ({
        width: Math.max(300, prev.width + info.delta.x),
        height: Math.max(200, prev.height + info.delta.y),
      }));
    },
    []
  );

  const handleClear = useCallback(() => {
    clearData(activeTab);
  }, [clearData, activeTab]);

  const handleExport = useCallback(() => {
    const data = exportData(activeTab);
    const fileName = `debug-data-${activeTab}-${new Date().toISOString()}.json`;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [exportData, activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'errors':
        return <ErrorsTab />;
      case 'performance':
        return <PerformanceTab />;
      case 'network':
        return <NetworkTab />;
      case 'console':
        return <ConsoleTab />;
      case 'ai':
        return <AITab />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <OverlayContainer
        data-testid="overlay-container"
        position={config.overlay.position}
        size={size}
        opacity={config.overlay.opacity}
        drag
        dragMomentum={false}
        dragListener={!isResizing}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: config.overlay.opacity }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <TabBar>
          {config.overlay.tabs.map(tab => (
            <Tab
              key={tab}
              data-testid={`${tab}-tab`}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Tab>
          ))}
        </TabBar>

        <ContentArea>
          {renderTabContent()}
        </ContentArea>

        <ActionBar>
          <Button onClick={handleClear}>Clear</Button>
          <Button onClick={handleExport}>Export</Button>
        </ActionBar>

        <ResizeHandle
          drag
          dragMomentum={false}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onDragStart={() => setIsResizing(true)}
          onDrag={handleResize}
          onDragEnd={() => setIsResizing(false)}
        >
          <MdDragIndicator size={16} />
        </ResizeHandle>
      </OverlayContainer>
    </ThemeProvider>
  );
}; 