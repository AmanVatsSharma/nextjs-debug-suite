import { __makeTemplateObject } from "tslib";
import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
var Container = styled(motion.div)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n  height: 300px;\n  background: ", ";\n  border-radius: 8px;\n  overflow: hidden;\n  position: relative;\n"], ["\n  width: 100%;\n  height: 300px;\n  background: ", ";\n  border-radius: 8px;\n  overflow: hidden;\n  position: relative;\n"])), function (props) { return props.theme.colors.background.primary; });
var Canvas = styled.canvas(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 100%;\n  height: 100%;\n"], ["\n  width: 100%;\n  height: 100%;\n"])));
export var DependencyVisualizer = function (_a) {
    var graph = _a.graph, errorNodeId = _a.errorNodeId;
    var canvasRef = useRef(null);
    useEffect(function () {
        var canvas = canvasRef.current;
        if (!canvas)
            return;
        var ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Set canvas size to match display size
        var _a = canvas.getBoundingClientRect(), width = _a.width, height = _a.height;
        canvas.width = width;
        canvas.height = height;
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        // Calculate node positions using force-directed layout
        var nodes = Object.values(graph.nodes);
        var nodePositions = calculateNodePositions(nodes, width, height);
        // Draw edges
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        graph.edges.forEach(function (edge) {
            var fromPos = nodePositions.get(edge.from);
            var toPos = nodePositions.get(edge.to);
            if (fromPos && toPos) {
                ctx.beginPath();
                ctx.moveTo(fromPos.x, fromPos.y);
                ctx.lineTo(toPos.x, toPos.y);
                ctx.stroke();
            }
        });
        // Draw nodes
        nodes.forEach(function (node) {
            var pos = nodePositions.get(node.id);
            if (!pos)
                return;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
            if (node.id === errorNodeId) {
                ctx.fillStyle = '#ff0000';
            }
            else {
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
    return (React.createElement(Container, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3 } },
        React.createElement(Canvas, { ref: canvasRef })));
};
function getNodeColor(type) {
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
function calculateNodePositions(nodes, width, height) {
    var positions = new Map();
    // Initialize random positions
    nodes.forEach(function (node) {
        positions.set(node.id, {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
        });
    });
    // Simple force-directed layout simulation
    var iterations = 50;
    for (var i = 0; i < iterations; i++) {
        // Apply repulsive forces between all nodes
        nodes.forEach(function (node1) {
            nodes.forEach(function (node2) {
                if (node1.id === node2.id)
                    return;
                var pos1 = positions.get(node1.id);
                var pos2 = positions.get(node2.id);
                var dx = pos2.x - pos1.x;
                var dy = pos2.y - pos1.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance === 0)
                    return;
                var force = 1000 / (distance * distance);
                var fx = (dx / distance) * force;
                var fy = (dy / distance) * force;
                pos1.vx -= fx;
                pos1.vy -= fy;
                pos2.vx += fx;
                pos2.vy += fy;
            });
        });
        // Update positions
        positions.forEach(function (pos) {
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
    var finalPositions = new Map();
    positions.forEach(function (pos, id) {
        finalPositions.set(id, { x: pos.x, y: pos.y });
    });
    return finalPositions;
}
var templateObject_1, templateObject_2;
//# sourceMappingURL=DependencyVisualizer.js.map