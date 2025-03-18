"use client";
import React, { useState, ChangeEvent } from 'react';
import InteractiveNodeNetwork from './InteractiveNodeNetwork';
import { ThemeVariant } from '../constants/themes';

interface ControlSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
}

const ControlSection: React.FC<ControlSectionProps> = ({ title, isOpen, onToggle, children }) => (
  <div className="border-t border-gray-700 pt-4">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full text-left mb-4"
    >
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <span className="text-white">{isOpen ? '▼' : '▶'}</span>
    </button>
    {isOpen && <div className="space-y-4">{children}</div>}
  </div>
);

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step = 1, onChange, unit = '' }) => (
  <div className="flex items-center space-x-2">
    <label className="text-sm font-medium text-white w-1/3">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-1/2 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
    />
    <span className="text-white text-sm w-16">{value}{unit}</span>
  </div>
);

const NetworkVisualizationController: React.FC = () => {
  // Basic controls
  const [nodeCount, setNodeCount] = useState(50);
  const [connectionCapacity, setConnectionCapacity] = useState(500);
  const [lineThickness, setLineThickness] = useState(0.5);
  const [connectionOpacity, setConnectionOpacity] = useState(20);
  const [nodeSize, setNodeSize] = useState(2);
  const [theme, setTheme] = useState<ThemeVariant>('highContrast');
  const [nodeColor, setNodeColor] = useState<string>('');
  const [lineColor, setLineColor] = useState<string>('');

  // Advanced controls
  const [mouseRadius, setMouseRadius] = useState(200);
  const [mouseForce, setMouseForce] = useState(0.05);
  const [nodeSpeed, setNodeSpeed] = useState(0.08);
  const [nodePulseSpeed, setNodePulseSpeed] = useState(0.002);
  const [nodePulseAmplitude, setNodePulseAmplitude] = useState(0.2);
  const [connectionDuration, setConnectionDuration] = useState(6000);
  const [connectionDistance, setConnectionDistance] = useState(400);
  const [connectionInterval, setConnectionInterval] = useState(50);

  // Clustering controls
  const [clusterForce, setClusterForce] = useState(0.0002);
  const [connectionStrength, setConnectionStrength] = useState(0.001);
  const [repulsionForce, setRepulsionForce] = useState(0.01);

  // Section toggles
  const [openSections, setOpenSections] = useState({
    basic: false,
    mouse: false,
    nodes: false,
    connections: true,
    clustering: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Network Visualization */}
      <div className="w-full">
        <InteractiveNodeNetwork
          variant="interactive-demo"
          themeVariant={theme}
          height="500px"
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
          clusterForce={clusterForce}
          connectionStrength={connectionStrength}
          repulsionForce={repulsionForce}
          nodeColor={nodeColor || undefined}
          lineColor={lineColor || undefined}
        />
      </div>

      {/* Controls Panel */}
      <div className="w-full bg-gray-900 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Network Controls</h2>
          <div className="flex gap-2">
            {Object.entries(openSections).map(([key, isOpen]) => (
              <button
                key={key}
                onClick={() => toggleSection(key as keyof typeof openSections)}
                className={`px-3 py-1 rounded text-sm ${
                  isOpen 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {openSections.basic && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Basic Settings</h3>
              <Slider
                label="Node Count"
                value={nodeCount}
                min={10}
                max={100}
                onChange={(e) => setNodeCount(parseInt(e.target.value))}
              />
              <Slider
                label="Node Size"
                value={nodeSize}
                min={2}
                max={8}
                onChange={(e) => setNodeSize(parseInt(e.target.value))}
                unit="px"
              />
              <Slider
                label="Line Thickness"
                value={lineThickness}
                min={1}
                max={5}
                step={0.5}
                onChange={(e) => setLineThickness(parseFloat(e.target.value))}
                unit="px"
              />
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-white w-1/3">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemeVariant)}
                  className="w-2/3 bg-gray-700 text-white rounded-lg p-1 text-sm"
                >
                  <option value="default">Default</option>
                  <option value="warm">Warm</option>
                  <option value="cool">Cool</option>
                  <option value="night">Night</option>
                  <option value="highContrast">High Contrast</option>
                  <option value="neon">Neon</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-white w-1/3">Node Color</label>
                <input
                  type="color"
                  value={nodeColor}
                  onChange={(e) => setNodeColor(e.target.value)}
                  className="w-16 h-8 bg-gray-700 rounded cursor-pointer"
                />
                <button
                  onClick={() => setNodeColor('')}
                  className="px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-white w-1/3">Line Color</label>
                <input
                  type="color"
                  value={lineColor}
                  onChange={(e) => setLineColor(e.target.value)}
                  className="w-16 h-8 bg-gray-700 rounded cursor-pointer"
                />
                <button
                  onClick={() => setLineColor('')}
                  className="px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {openSections.mouse && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Mouse Interaction</h3>
              <Slider
                label="Radius"
                value={mouseRadius}
                min={100}
                max={300}
                onChange={(e) => setMouseRadius(parseInt(e.target.value))}
                unit="px"
              />
              <Slider
                label="Force"
                value={mouseForce}
                min={0.01}
                max={0.1}
                step={0.01}
                onChange={(e) => setMouseForce(parseFloat(e.target.value))}
              />
            </div>
          )}

          {openSections.nodes && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Node Animation</h3>
              <Slider
                label="Speed"
                value={nodeSpeed}
                min={0.1}
                max={1.0}
                step={0.1}
                onChange={(e) => setNodeSpeed(parseFloat(e.target.value))}
              />
              <Slider
                label="Pulse Speed"
                value={nodePulseSpeed}
                min={0.001}
                max={0.005}
                step={0.001}
                onChange={(e) => setNodePulseSpeed(parseFloat(e.target.value))}
              />
              <Slider
                label="Pulse Amplitude"
                value={nodePulseAmplitude}
                min={0.1}
                max={0.5}
                step={0.1}
                onChange={(e) => setNodePulseAmplitude(parseFloat(e.target.value))}
              />
            </div>
          )}

          {openSections.connections && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Connections</h3>
              <Slider
                label="Max Connections"
                value={connectionCapacity}
                min={50}
                max={1000}
                onChange={(e) => setConnectionCapacity(parseInt(e.target.value))}
              />
              <Slider
                label="Distance"
                value={connectionDistance}
                min={100}
                max={800}
                step={50}
                onChange={(e) => setConnectionDistance(parseInt(e.target.value))}
                unit="px"
              />
              <Slider
                label="Duration"
                value={connectionDuration}
                min={1000}
                max={15000}
                step={500}
                onChange={(e) => setConnectionDuration(parseInt(e.target.value))}
                unit="ms"
              />
              <Slider
                label="Interval"
                value={connectionInterval}
                min={10}
                max={500}
                step={10}
                onChange={(e) => setConnectionInterval(parseInt(e.target.value))}
                unit="ms"
              />
              <Slider
                label="Opacity"
                value={connectionOpacity}
                min={5}
                max={50}
                onChange={(e) => setConnectionOpacity(parseInt(e.target.value))}
                unit="%"
              />
            </div>
          )}

          {openSections.clustering && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Clustering</h3>
              <Slider
                label="Cluster Force"
                value={clusterForce}
                min={0}
                max={0.01}
                step={0.0005}
                onChange={(e) => setClusterForce(parseFloat(e.target.value))}
              />
              <Slider
                label="Connection Strength"
                value={connectionStrength}
                min={0}
                max={0.01}
                step={0.0005}
                onChange={(e) => setConnectionStrength(parseFloat(e.target.value))}
              />
              <Slider
                label="Repulsion Force"
                value={repulsionForce}
                min={0}
                max={0.2}
                step={0.005}
                onChange={(e) => setRepulsionForce(parseFloat(e.target.value))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkVisualizationController; 