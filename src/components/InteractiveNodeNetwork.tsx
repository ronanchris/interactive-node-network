// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { THEME_VARIANTS, ThemeVariant, Theme } from '../constants/themes';
import { useNetworkAnimation } from '../hooks/useNetworkAnimation';

// Helper function to adjust color opacity
const adjustColorOpacity = (color: string, opacity: number) => {
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/g, `${opacity})`);
  }
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

interface Props {
  variant: 'interactive-demo' | 'background';
  themeVariant: ThemeVariant;
  height?: string;
  nodeCount?: number;
  nodeSize?: number;
  connectionCapacity?: number;
  connectionOpacity?: number;
  lineThickness?: number;
  customTheme?: Theme | null;
  // Advanced props
  mouseRadius?: number;
  mouseForce?: number;
  nodeSpeed?: number;
  nodePulseSpeed?: number;
  nodePulseAmplitude?: number;
  connectionDuration?: number;
  connectionDistance?: number;
  connectionInterval?: number;
}

interface Connection {
  fromNode: number;
  toNode: number;
  progress: number;
  active: boolean;
  startTime: number;
  duration: number;
  opacity: number;
  completed: boolean;
}

// Main component implementation
const InteractiveNodeNetwork: React.FC<Props> = ({
  variant,
  themeVariant = 'default',
  height = '100%',
  nodeCount = 30,
  nodeSize = 4,
  connectionCapacity = 300,
  connectionOpacity = 20,
  lineThickness = 1,
  customTheme = null,
  // Advanced props with defaults
  mouseRadius = 200,
  mouseForce = 0.05,
  nodeSpeed = 0.5,
  nodePulseSpeed = 0.002,
  nodePulseAmplitude = 0.2,
  connectionDuration = 800,
  connectionDistance = 200,
  connectionInterval = 100
}) => {
  const theme = customTheme || THEME_VARIANTS[themeVariant];
  
  const { canvasRef, handleMouseMove, handleMouseLeave } = useNetworkAnimation({
    nodeCount,
    nodeSize,
    connectionCapacity,
    connectionOpacity,
    lineThickness,
    theme,
    mouseRadius,
    mouseForce,
    nodeSpeed,
    nodePulseSpeed,
    nodePulseAmplitude,
    connectionDuration,
    connectionDistance,
    connectionInterval
  });

  return (
    <div className="w-full h-full relative" style={{ height }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full"
        style={{ background: theme.background }}
      />
    </div>
  );
};

export default InteractiveNodeNetwork; 