import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { DebugInterface } from '../../core/types';

export const OverlayContainer = styled(motion.div)<{
  position: DebugInterface['overlay']['position'];
  size: DebugInterface['overlay']['size'];
  opacity: number;
}>`
  position: fixed;
  ${({ position }) => {
    switch (position) {
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'top-left':
        return 'top: 20px; left: 20px;';
      case 'bottom-right':
        return 'bottom: 20px; right: 20px;';
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
    }
  }}
  width: ${({ size }) => size.width}px;
  height: ${({ size }) => size.height}px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  opacity: ${({ opacity }) => opacity};
  overflow: hidden;
  z-index: 9999;
  display: flex;
  flex-direction: column;
`;

export const TabBar = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.tabBackground};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px 8px 0;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  background: ${({ active, theme }) =>
    active ? theme.colors.background : 'transparent'};
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.text};
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.colors.background : theme.colors.hover};
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.tabBackground};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Button = styled.button`
  padding: 6px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

export const ResizeHandle = styled(motion.div)`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.5;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`; 