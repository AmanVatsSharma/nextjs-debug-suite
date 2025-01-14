import React, { createContext, useContext, useState, useCallback } from 'react';
import type { DebugConfig, DebugData } from '../types/debug';

interface DebugContextValue {
  config: DebugConfig;
  data: DebugData;
  clearData: (tab: string) => void;
  exportData: (tab: string) => any;
}

const DebugContext = createContext<DebugContextValue | undefined>(undefined);

export const useDebugContext = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebugContext must be used within a DebugSuiteProvider');
  }
  return context;
};

interface DebugSuiteProviderProps {
  children: React.ReactNode;
  config: DebugConfig;
}

export const DebugSuiteProvider: React.FC<DebugSuiteProviderProps> = ({
  children,
  config: initialConfig,
}) => {
  const [config] = useState(initialConfig);
  const [data, setData] = useState<DebugData>({
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
  });

  const clearData = useCallback((tab: string) => {
    setData(prev => {
      const newData = { ...prev };
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

  const exportData = useCallback((tab: string) => {
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

  const value = {
    config,
    data,
    clearData,
    exportData
  };

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
}; 