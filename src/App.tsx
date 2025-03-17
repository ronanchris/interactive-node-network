import React, { useState } from 'react';
import NetworkVisualizationController from './components/NetworkVisualizationController';
import NodeNetworkWrapper from './components/NodeNetworkWrapper';

interface CustomTheme {
  background: string;
  nodeColor: string | { from: string; to: string };
  connectionColor: string;
  pulseColor: string;
  nodeBrightness: number;
}

interface NetworkConfig {
  theme: string;
  nodeCount: number;
  interactionRadius: number;
  interactionEnabled: boolean;
  customTheme: CustomTheme | null;
  nodeSize: number;
}

const App: React.FC = () => {
  const [networkConfig, setNetworkConfig] = useState<NetworkConfig>({
    theme: 'default',
    nodeCount: 30,
    interactionRadius: 200,
    interactionEnabled: true,
    customTheme: null,
    nodeSize: 4
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center text-white">
                Interactive Node Network
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Network Dashboard
                </a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Status Dashboard
                </a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Interactive Node Network Dashboard</h1>
        
        {/* Network Visualization */}
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden mb-8">
          <NodeNetworkWrapper
            variant="interactive-demo"
            themeVariant={networkConfig.theme}
            height="400px"
            mouseInteractionRadius={networkConfig.interactionEnabled ? networkConfig.interactionRadius : 0}
            nodeCount={networkConfig.nodeCount}
            nodeSize={networkConfig.nodeSize}
            customTheme={networkConfig.customTheme}
          />
        </div>

        {/* Controls */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Visualization Controls</h2>
          <NetworkVisualizationController
            config={networkConfig}
            onConfigChange={setNetworkConfig}
          />
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-900 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Network Statistics</h2>
            <p className="text-gray-400">Statistics coming soon...</p>
          </div>
          <div className="bg-gray-900 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Controls</h2>
            <p className="text-gray-400">Controls coming soon...</p>
          </div>
          <div className="bg-gray-900 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
            <p className="text-gray-400">Settings coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App; 