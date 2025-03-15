import React, { useMemo } from 'react';
import InteractiveNodeNetwork from './InteractiveNodeNetwork';

// Define variants as an enum
export const VARIANTS = {
  FULLSCREEN: 'FULLSCREEN',
  BACKGROUND: 'BACKGROUND',
  HERO: 'HERO',
  CARD: 'CARD',
  INTERACTIVE_DEMO: 'INTERACTIVE_DEMO'
} as const;

interface NodeNetworkWrapperProps {
  variant: keyof typeof VARIANTS;
  themeVariant?: string;
  height?: string;
  className?: string;
  contentOverlay?: React.ReactNode;
  mouseInteractionRadius?: number;
  nodeCount?: number;
  nodeSize?: number;
  customTheme?: {
    background: string;
    nodeColor: string | { from: string; to: string };
    connectionColor: string;
    pulseColor: string;
    nodeBrightness: number;
  } | null;
}

const NodeNetworkWrapper: React.FC<NodeNetworkWrapperProps> = ({
  variant,
  themeVariant = 'default',
  height = '100%',
  className = '',
  contentOverlay = null,
  mouseInteractionRadius = 200,
  nodeCount = 30,
  nodeSize = 4,
  customTheme = null
}) => {
  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case VARIANTS.BACKGROUND:
        return 'fixed top-0 left-0 w-full h-full -z-10';
      case VARIANTS.HERO:
        return 'absolute top-0 left-0 w-full h-full -z-10';
      case VARIANTS.CARD:
        return 'absolute top-0 left-0 w-full h-full';
      case VARIANTS.INTERACTIVE_DEMO:
        return 'relative w-full h-full';
      default:
        return 'w-full h-full';
    }
  };

  // Get variant-specific node count
  const getNodeCount = () => {
    switch (variant) {
      case VARIANTS.CARD:
        return 15;
      case VARIANTS.BACKGROUND:
        return 50;
      default:
        return nodeCount;
    }
  };

  const classNameMemo = useMemo(() => getVariantStyles(), [variant]);
  const showOverlay = variant === VARIANTS.HERO || variant === VARIANTS.CARD;

  return (
    <div className={`${classNameMemo} ${className}`} style={{ height }}>
      {variant === VARIANTS.INTERACTIVE_DEMO ? (
        <InteractiveNodeNetwork 
          themeVariant={themeVariant}
          height={height}
          mouseInteractionRadius={mouseInteractionRadius}
          nodeCount={nodeCount}
          nodeSize={nodeSize}
          customTheme={customTheme}
        />
      ) : (
        <InteractiveNodeNetwork 
          nodeCount={getNodeCount()}
          themeVariant={themeVariant}
          height={height}
          mouseInteractionRadius={mouseInteractionRadius}
          customTheme={customTheme}
        />
      )}
      {showOverlay && (
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Interactive Node Network</h1>
            <p className="text-lg">A beautiful and interactive visualization</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeNetworkWrapper; 