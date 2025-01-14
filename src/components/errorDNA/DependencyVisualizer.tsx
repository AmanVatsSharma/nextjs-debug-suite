import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { DependencyGraph } from '../../core/errorDNA/dependencyAnalyzer';

const Container = styled(motion.div)`
  width: 100%;
  height: 300px;
  background: ${props => props.theme.colors.background.primary};
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

interface DependencyVisualizerProps {
  graph: DependencyGraph;
  errorNodeId?: string;
}

export const DependencyVisualizer: React.FC<DependencyVisualizerProps> = ({
  graph,
  errorNodeId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match display size
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate node positions using force-directed layout
    const nodes = Object.values(graph.nodes);
    const nodePositions = calculateNodePositions(nodes, width, height);

    // Draw edges
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    graph.edges.forEach(edge => {
      const fromPos = nodePositions.get(edge.from);
      const toPos = nodePositions.get(edge.to);
      if (fromPos && toPos) {
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const pos = nodePositions.get(node.id);
      if (!pos) return;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
      
      if (node.id === errorNodeId) {
        ctx.fillStyle = '#ff0000';
      } else {
        ctx.fillStyle = getNodeColor(node.type);
      }
      
      ctx.fill();

      // Draw node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, pos.x, pos.y + 20);
    });
  }, [graph, errorNodeId]);

  return (
    <Container
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Canvas ref={canvasRef} />
    </Container>
  );
};

function getNodeColor(type: string): string {
  switch (type) {
    case 'component':
      return '#4caf50';
    case 'module':
      return '#2196f3';
    case 'function':
      return '#ff9800';
    case 'hook':
      return '#9c27b0';
    default:
      return '#757575';
  }
}

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function calculateNodePositions(nodes: any[], width: number, height: number): Map<string, { x: number; y: number }> {
  const positions = new Map<string, NodePosition>();
  
  // Initialize random positions
  nodes.forEach(node => {
    positions.set(node.id, {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
    });
  });

  // Simple force-directed layout simulation
  const iterations = 50;
  for (let i = 0; i < iterations; i++) {
    // Apply repulsive forces between all nodes
    nodes.forEach(node1 => {
      nodes.forEach(node2 => {
        if (node1.id === node2.id) return;

        const pos1 = positions.get(node1.id)!;
        const pos2 = positions.get(node2.id)!;

        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        const force = 1000 / (distance * distance);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        pos1.vx -= fx;
        pos1.vy -= fy;
        pos2.vx += fx;
        pos2.vy += fy;
      });
    });

    // Update positions
    positions.forEach(pos => {
      pos.x += pos.vx * 0.1;
      pos.y += pos.vy * 0.1;
      pos.vx *= 0.9;
      pos.vy *= 0.9;

      // Keep nodes within bounds
      pos.x = Math.max(10, Math.min(width - 10, pos.x));
      pos.y = Math.max(10, Math.min(height - 10, pos.y));
    });
  }

  // Convert NodePosition to simple {x, y} coordinates
  const finalPositions = new Map<string, { x: number; y: number }>();
  positions.forEach((pos, id) => {
    finalPositions.set(id, { x: pos.x, y: pos.y });
  });

  return finalPositions;
} 