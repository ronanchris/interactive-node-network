import React from 'react';
import { THEME_VARIANTS, ThemeVariant, Theme } from '../constants/themes';
import { useNetworkAnimation } from '../hooks/useNetworkAnimation';

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
  // Color options
  nodeColor?: string;
  lineColor?: string;
  // Advanced props
  mouseRadius?: number;
  mouseForce?: number;
  nodeSpeed?: number;
  nodePulseSpeed?: number;
  nodePulseAmplitude?: number;
  connectionDuration?: number;
  connectionDistance?: number;
  connectionInterval?: number;
  // Clustering props
  clusterForce?: number;
  connectionStrength?: number;
  repulsionForce?: number;
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
  nodeCount = 12,
  nodeSize = 8,
  connectionCapacity = 8,
  connectionOpacity = 100,
  lineThickness = 3,
  customTheme = null,
  // Color options
  nodeColor,
  lineColor,
  // Advanced props with defaults
  mouseRadius = 200,
  mouseForce = 0.05,
  nodeSpeed = 0.15,
  nodePulseSpeed = 0.002,
  nodePulseAmplitude = 0.2,
  connectionDuration = 600,
  connectionDistance = 150,
  connectionInterval = 3000,
  // Clustering props
  clusterForce = 0.002,
  connectionStrength = 0.003,
  repulsionForce = 0.12
}) => {
  const theme = customTheme || THEME_VARIANTS[themeVariant];
  
  // Override theme colors with custom colors if provided
  const effectiveTheme = {
    ...theme,
    nodeColor: nodeColor || theme.nodeColor,
    connectionColor: lineColor || theme.connectionColor
  };
  
  const { canvasRef, handleMouseMove, handleMouseLeave } = useNetworkAnimation({
    nodeCount,
    nodeSize,
    connectionCapacity,
    connectionOpacity,
    lineThickness,
    theme: effectiveTheme,
    mouseRadius,
    mouseForce,
    nodeSpeed,
    nodePulseSpeed,
    nodePulseAmplitude,
    connectionDuration,
    connectionDistance,
    connectionInterval,
    clusterForce,
    connectionStrength,
    repulsionForce
  });

  return (
    <div className="relative w-full" style={{ height }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default InteractiveNodeNetwork; 