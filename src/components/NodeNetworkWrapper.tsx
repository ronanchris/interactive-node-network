import React from 'react';
import InteractiveNodeNetwork from './InteractiveNodeNetwork';

export const VARIANTS = {
  INTERACTIVE_DEMO: 'interactive-demo',
  BACKGROUND: 'background'
} as const;

export const THEME_VARIANTS = {
  default: {
    background: '#0a1929',
    nodeColor: '#4dabf5',
    connectionColor: '#4dabf5',
    pulseColor: 'rgba(77, 171, 245, 0.5)',
    nodeBrightness: 1.0
  },
  warm: {
    background: '#271a10',
    nodeColor: '#ffb74d',
    connectionColor: '#ffb74d',
    pulseColor: 'rgba(255, 183, 77, 0.5)',
    nodeBrightness: 1.0
  },
  cool: {
    background: '#092a2e',
    nodeColor: '#4dd0e1',
    connectionColor: '#4dd0e1',
    pulseColor: 'rgba(77, 208, 225, 0.5)',
    nodeBrightness: 1.0
  },
  night: {
    background: '#0d0a29',
    nodeColor: '#b39ddb',
    connectionColor: '#b39ddb',
    pulseColor: 'rgba(179, 157, 219, 0.5)',
    nodeBrightness: 1.0
  },
  highContrast: {
    background: '#000000',
    nodeColor: '#ffffff',
    connectionColor: '#ffffff',
    pulseColor: 'rgba(255, 255, 255, 0.5)',
    nodeBrightness: 1.0
  },
  neon: {
    background: '#0a0a0a',
    nodeColor: '#39ff14',
    connectionColor: '#39ff14',
    pulseColor: 'rgba(57, 255, 20, 0.5)',
    nodeBrightness: 1.0
  }
};

interface Props {
  variant: 'interactive-demo' | 'background';
  themeVariant: string;
  height?: string;
  mouseInteractionRadius?: number;
  nodeCount?: number;
  customTheme?: {
    background: string;
    nodeColor: string;
    connectionColor: string | { from: string; to: string };
    pulseColor: string;
    nodeBrightness: number;
  } | null;
  nodeSize?: number;
  connectionCapacity?: number;
  connectionOpacity?: number;
  lineThickness?: number;
  enableGradient?: boolean;
  gradientStart?: string;
  gradientEnd?: string;
}

const NodeNetworkWrapper: React.FC<Props> = ({
  variant,
  themeVariant,
  height = '100%',
  mouseInteractionRadius = 200,
  nodeCount = 30,
  customTheme = null,
  nodeSize = 4,
  connectionCapacity = 300,
  connectionOpacity = 20,
  lineThickness = 1,
  enableGradient = false,
  gradientStart = '',
  gradientEnd = ''
}) => {
  return (
    <div className="w-full" style={{ height }}>
      <InteractiveNodeNetwork
        variant={variant}
        themeVariant={themeVariant}
        customTheme={customTheme}
        mouseInteractionRadius={mouseInteractionRadius}
        nodeCount={nodeCount}
        nodeSize={nodeSize}
        connectionCapacity={connectionCapacity}
        connectionOpacity={connectionOpacity}
        lineThickness={lineThickness}
        enableGradient={enableGradient}
        gradientStart={gradientStart}
        gradientEnd={gradientEnd}
      />
    </div>
  );
};

export default NodeNetworkWrapper; 