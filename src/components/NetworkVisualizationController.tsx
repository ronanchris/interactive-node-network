"use client";
import React, { useState } from 'react';
import InteractiveNodeNetwork from './InteractiveNodeNetwork';

const NetworkVisualizationController: React.FC = () => {
  // Basic controls
  const [nodeCount, setNodeCount] = useState(30);
  const [connectionCapacity, setConnectionCapacity] = useState(300);
  const [lineThickness, setLineThickness] = useState(2);
  const [connectionOpacity, setConnectionOpacity] = useState(50);
  const [nodeSize, setNodeSize] = useState(4);
  const [theme, setTheme] = useState('default');

  // Advanced controls
  const [mouseRadius, setMouseRadius] = useState(200);
  const [mouseForce, setMouseForce] = useState(0.05);
  const [nodeSpeed, setNodeSpeed] = useState(0.5);
  const [nodePulseSpeed, setNodePulseSpeed] = useState(0.002);
  const [nodePulseAmplitude, setNodePulseAmplitude] = useState(0.2);
  const [connectionDuration, setConnectionDuration] = useState(800);
  const [connectionDistance, setConnectionDistance] = useState(200);
  const [connectionInterval, setConnectionInterval] = useState(100);

  // Show advanced controls toggle
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div>
      {/* Network Visualization */}
      <div className="mb-6">
        <InteractiveNodeNetwork
          variant="interactive-demo"
          themeVariant={theme}
          height="400px"
          nodeCount={nodeCount}
          nodeSize={nodeSize}
          connectionCapacity={connectionCapacity}
          connectionOpacity={connectionOpacity}
          lineThickness={lineThickness}
          mouseRadius={mouseRadius}
          mouseForce={mouseForce}
          nodeSpeed={nodeSpeed}
          nodePulseSpeed={nodePulseSpeed}
          nodePulseAmplitude={nodePulseAmplitude}
          connectionDuration={connectionDuration}
          connectionDistance={connectionDistance}
          connectionInterval={connectionInterval}
        />
      </div>

      {/* Controls Panel */}
      <div className="p-6 bg-gray-900 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Network Controls</h2>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>
        
        {/* Basic Controls */}
        <div className="space-y-6">
          {/* Line Thickness Control */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Line Thickness: {lineThickness}px
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={lineThickness}
              onChange={(e) => setLineThickness(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Connection Opacity Control */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Connection Opacity: {connectionOpacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={connectionOpacity}
              onChange={(e) => setConnectionOpacity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Node Count Control */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Node Count: {nodeCount}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={nodeCount}
              onChange={(e) => setNodeCount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Connection Capacity Control */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Connection Capacity: {connectionCapacity}
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="50"
              value={connectionCapacity}
              onChange={(e) => setConnectionCapacity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Node Size Control */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Node Size: {nodeSize}px
            </label>
            <input
              type="range"
              min="2"
              max="8"
              value={nodeSize}
              onChange={(e) => setNodeSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg p-2"
            >
              <option value="default">Default</option>
              <option value="warm">Warm</option>
              <option value="cool">Cool</option>
              <option value="night">Night</option>
              <option value="highContrast">High Contrast</option>
              <option value="neon">Neon</option>
            </select>
          </div>

          {/* Advanced Controls */}
          {showAdvanced && (
            <div className="mt-8 space-y-6 border-t border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Advanced Controls</h3>
              
              {/* Mouse Interaction Controls */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Mouse Interaction Radius: {mouseRadius}px
                </label>
                <input
                  type="range"
                  min="100"
                  max="300"
                  value={mouseRadius}
                  onChange={(e) => setMouseRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Mouse Force: {mouseForce}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.1"
                  step="0.01"
                  value={mouseForce}
                  onChange={(e) => setMouseForce(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Node Animation Controls */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Node Speed: {nodeSpeed}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={nodeSpeed}
                  onChange={(e) => setNodeSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Node Pulse Speed: {nodePulseSpeed}
                </label>
                <input
                  type="range"
                  min="0.001"
                  max="0.005"
                  step="0.001"
                  value={nodePulseSpeed}
                  onChange={(e) => setNodePulseSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Node Pulse Amplitude: {nodePulseAmplitude}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.1"
                  value={nodePulseAmplitude}
                  onChange={(e) => setNodePulseAmplitude(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Connection Animation Controls */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Connection Duration: {connectionDuration}ms
                </label>
                <input
                  type="range"
                  min="400"
                  max="2000"
                  step="100"
                  value={connectionDuration}
                  onChange={(e) => setConnectionDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Connection Distance: {connectionDistance}px
                </label>
                <input
                  type="range"
                  min="100"
                  max="300"
                  step="10"
                  value={connectionDistance}
                  onChange={(e) => setConnectionDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Connection Interval: {connectionInterval}ms
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={connectionInterval}
                  onChange={(e) => setConnectionInterval(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkVisualizationController; 