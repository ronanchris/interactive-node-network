import React from 'react';
import InteractiveNodeNetwork from './InteractiveNodeNetwork';
import { ThemeVariant } from '../constants/themes';

export const VARIANTS = {
  INTERACTIVE_DEMO: 'interactive-demo',
  BACKGROUND: 'background',
  CARD: 'interactive-demo',
  HERO: 'background'
} as const;

type Variant = typeof VARIANTS[keyof typeof VARIANTS];

interface Props {
  variant?: Variant;
  themeVariant?: ThemeVariant;
  height?: string;
  nodeCount?: number;
  nodeSize?: number;
  connectionCapacity?: number;
  connectionOpacity?: number;
  lineThickness?: number;
  customTheme?: any;
  mouseRadius?: number;
  mouseForce?: number;
  nodeSpeed?: number;
  nodePulseSpeed?: number;
  nodePulseAmplitude?: number;
  connectionDuration?: number;
  connectionDistance?: number;
  connectionInterval?: number;
}

const NodeNetworkWrapper: React.FC<Props> = ({
  variant = VARIANTS.INTERACTIVE_DEMO,
  themeVariant = 'default',
  height = '100%',
  nodeCount = 30,
  nodeSize = 4,
  connectionCapacity = 300,
  connectionOpacity = 20,
  lineThickness = 1,
  customTheme = null,
  mouseRadius = 200,
  mouseForce = 0.05,
  nodeSpeed = 0.5,
  nodePulseSpeed = 0.002,
  nodePulseAmplitude = 0.2,
  connectionDuration = 800,
  connectionDistance = 200,
  connectionInterval = 100
}) => {
  return (
    <InteractiveNodeNetwork
      variant={variant}
      themeVariant={themeVariant}
      height={height}
      nodeCount={nodeCount}
      nodeSize={nodeSize}
      connectionCapacity={connectionCapacity}
      connectionOpacity={connectionOpacity}
      lineThickness={lineThickness}
      customTheme={customTheme}
      mouseRadius={mouseRadius}
      mouseForce={mouseForce}
      nodeSpeed={nodeSpeed}
      nodePulseSpeed={nodePulseSpeed}
      nodePulseAmplitude={nodePulseAmplitude}
      connectionDuration={connectionDuration}
      connectionDistance={connectionDistance}
      connectionInterval={connectionInterval}
    />
  );
};

export default NodeNetworkWrapper; 