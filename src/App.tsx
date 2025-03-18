import React from 'react';
import NetworkVisualizationController from './components/NetworkVisualizationController';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-white mb-8">Interactive Node Network</h1>
        <NetworkVisualizationController />
      </main>
    </div>
  );
};

export default App; 