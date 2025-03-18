import React, { useRef, useEffect, useState } from 'react';
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
  // Gradient props
  gradientEnabled?: boolean;
  gradientColors?: Array<{ position: number; color: string; opacity: number }>;
  gradientRadius?: number;
  gradientOpacity?: number;
  followMouse?: boolean;
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
  repulsionForce = 0.12,
  // Gradient props
  gradientEnabled = true,
  gradientColors = [
    { position: 0, color: '#ffffff', opacity: 1 },
    { position: 0.3, color: '#4dabf5', opacity: 0.8 },
    { position: 0.6, color: '#2196f3', opacity: 0.6 },
    { position: 1, color: '#000000', opacity: 0.4 }
  ],
  gradientRadius = 800,
  gradientOpacity = 80,
  followMouse = false
}) => {
  const theme = customTheme || THEME_VARIANTS[themeVariant];
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  // Override theme colors with custom colors if provided
  const effectiveTheme = {
    ...theme,
    nodeColor: nodeColor || theme.nodeColor,
    connectionColor: lineColor || theme.connectionColor
  };

  // Use the animation hook
  const { canvasRef, handleMouseMove: animationMouseMove, handleMouseLeave: animationMouseLeave } = useNetworkAnimation({
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

  // Effect for gradient overlay
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas || !gradientEnabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update canvas size to match main canvas
    const mainCanvas = canvasRef.current;
    if (mainCanvas) {
      canvas.width = mainCanvas.width;
      canvas.height = mainCanvas.height;
    }

    // Clear the overlay canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create gradient
    const centerX = followMouse && mousePosition.x !== null ? mousePosition.x : canvas.width / 2;
    const centerY = followMouse && mousePosition.y !== null ? mousePosition.y : canvas.height / 2;

    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, gradientRadius
    );

    // Add color stops with opacity
    gradientColors.forEach(stop => {
      // Convert hex color to RGB
      const r = parseInt(stop.color.slice(1, 3), 16);
      const g = parseInt(stop.color.slice(3, 5), 16);
      const b = parseInt(stop.color.slice(5, 7), 16);
      // Create rgba string with stop opacity
      const rgba = `rgba(${r}, ${g}, ${b}, ${stop.opacity})`;
      gradient.addColorStop(stop.position, rgba);
    });

    // Apply gradient with global opacity
    ctx.globalAlpha = gradientOpacity / 100;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

  }, [gradientEnabled, gradientColors, gradientRadius, gradientOpacity, followMouse, mousePosition, canvasRef]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setMousePosition(newPosition);
    animationMouseMove(e);
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: null, y: null });
    animationMouseLeave();
  };

  return (
    <div className="relative w-full" style={{ height }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute top-0 left-0 w-full h-full"
      />
      <canvas
        ref={overlayCanvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  );
};

export default InteractiveNodeNetwork; 