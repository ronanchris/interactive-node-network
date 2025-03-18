import React, { useState } from 'react';
import NetworkVisualizationController from './components/NetworkVisualizationController';
import NodeNetworkWrapper from './components/NodeNetworkWrapper';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

interface CustomTheme {
  background: string;
  nodeColor: string;
  connectionColor: string | { from: string; to: string };
  pulseColor: string;
  nodeBrightness: number;
}

interface NetworkConfig {
  theme: string;
  nodeCount: number;
  connectionCapacity: number;
  nodeSize: number;
  interactionRadius: number;
  connectionOpacity: number;
  nodeBrightness: number;
  backgroundColor: string;
  nodeColor: string;
  connectionColor: string;
  enableGradient: boolean;
  gradientStart: string;
  gradientEnd: string;
  enableMouseInteraction: boolean;
}

const App: React.FC = () => {
  const [networkConfig, setNetworkConfig] = useState<NetworkConfig>({
    theme: 'default',
    nodeCount: 30,
    connectionCapacity: 5,
    nodeSize: 4,
    interactionRadius: 200,
    connectionOpacity: 20,
    nodeBrightness: 100,
    backgroundColor: '#171f31',
    nodeColor: '#34c759',
    connectionColor: '#34c759',
    enableGradient: false,
    gradientStart: '#34c759',
    gradientEnd: '#4dabf5',
    enableMouseInteraction: true
  });

  const containerStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 36px',
  };

  const fullScreenButtonStyle = {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px',
    borderRadius: '4px',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <main className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8 px-4">Interactive Node Network Dashboard</h1>
        
        {/* Network Visualization */}
        <div style={{ marginBottom: '36px' }}>
          <div className="rounded-lg shadow-xl" style={containerStyle}>
            <div style={{ position: 'relative' }}>
              <button style={fullScreenButtonStyle}>
                <span>Full Screen</span>
                <FullscreenIcon />
              </button>
              <NodeNetworkWrapper
                variant="interactive-demo"
                themeVariant={networkConfig.theme}
                height="400px"
                mouseInteractionRadius={networkConfig.enableMouseInteraction ? networkConfig.interactionRadius : 0}
                nodeCount={networkConfig.nodeCount}
                nodeSize={networkConfig.nodeSize}
                connectionCapacity={networkConfig.connectionCapacity}
                enableGradient={networkConfig.enableGradient}
                gradientStart={networkConfig.gradientStart}
                gradientEnd={networkConfig.gradientEnd}
                customTheme={{
                  background: networkConfig.backgroundColor,
                  nodeColor: networkConfig.nodeColor,
                  connectionColor: networkConfig.enableGradient 
                    ? { from: networkConfig.gradientStart, to: networkConfig.gradientEnd }
                    : `rgba(${hexToRgb(networkConfig.connectionColor).join(', ')}, ${networkConfig.connectionOpacity/100})`,
                  pulseColor: `rgba(${hexToRgb(networkConfig.nodeColor).join(', ')}, 0.5)`,
                  nodeBrightness: networkConfig.nodeBrightness/100
                }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-lg shadow-xl" style={containerStyle}>
          <NetworkVisualizationController
            config={networkConfig}
            onConfigChange={setNetworkConfig}
          />
        </div>
      </main>
    </div>
  );
};

// Helper function to convert hex to rgb
function hexToRgb(hex: string): [number, number, number] {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return [r, g, b];
}

export default App; 