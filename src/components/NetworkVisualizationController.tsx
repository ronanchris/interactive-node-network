"use client";
import React, { useState, ChangeEvent } from 'react';
import InteractiveNodeNetwork from './InteractiveNodeNetwork';
import { ThemeVariant } from '../constants/themes';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
}

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
  const [nodeCount, setNodeCount] = useState(500);
  const [connectionCapacity, setConnectionCapacity] = useState(1607);
  const [lineThickness, setLineThickness] = useState(0.5);
  const [connectionOpacity, setConnectionOpacity] = useState(20);
  const [nodeSize, setNodeSize] = useState(2);
  const [theme, setTheme] = useState<ThemeVariant>('highContrast');
  const [nodeColor, setNodeColor] = useState<string>('');
  const [lineColor, setLineColor] = useState<string>('');

  // Gradient controls
  const [gradientEnabled, setGradientEnabled] = useState(true);
  const [gradientColors, setGradientColors] = useState([
    { position: 0, color: '#00ff9d', opacity: 1 },
    { position: 0.3, color: '#00a2ff', opacity: 0.8 },
    { position: 0.6, color: '#8000ff', opacity: 0.6 }
  ]);
  const [gradientRadius, setGradientRadius] = useState(800);
  const [gradientOpacity, setGradientOpacity] = useState(80);
  const [followMouse, setFollowMouse] = useState(true);

  // Advanced controls
  const [mouseRadius, setMouseRadius] = useState(200);
  const [mouseForce, setMouseForce] = useState(0.05);
  const [nodeSpeed, setNodeSpeed] = useState(0.01);
  const [nodePulseSpeed, setNodePulseSpeed] = useState(0.002);
  const [nodePulseAmplitude, setNodePulseAmplitude] = useState(0.42);
  const [connectionDuration, setConnectionDuration] = useState(6000);
  const [connectionDistance, setConnectionDistance] = useState(400);
  const [connectionInterval, setConnectionInterval] = useState(50);

  // Physics controls
  const [clusterForce, setClusterForce] = useState(0.001);
  const [connectionStrength, setConnectionStrength] = useState(0.0035);
  const [repulsionForce, setRepulsionForce] = useState(0.01);

  const accordionStyles = {
    width: '100%', 
    bgcolor: 'transparent',
    '& .MuiAccordion-root': {
      background: 'transparent',
      boxShadow: 'none',
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiAccordionSummary-root': {
      minHeight: '40px',
      padding: '0 8px',
      color: '#fff',
      '& .MuiAccordionSummary-expandIconWrapper': {
        color: '#fff',
      },
    },
    '& .MuiAccordionSummary-content': {
      margin: '8px 0',
    },
    '& .MuiAccordionDetails-root': {
      padding: '0 8px 8px',
    },
    '& .MuiTypography-root': {
      fontSize: '0.9rem',
      fontWeight: 500,
      color: '#fff',
    },
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
          gradientEnabled={gradientEnabled}
          gradientColors={gradientColors}
          gradientRadius={gradientRadius}
          gradientOpacity={gradientOpacity}
          followMouse={followMouse}
        />
      </div>

      {/* Controls Panel */}
      <div className="w-full bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold text-white mb-4">Network Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Box sx={accordionStyles}>
            <Accordion defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Basic Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="space-y-2">
                  <Slider
                    label="Node Count"
                    value={nodeCount}
                    min={10}
                    max={500}
                    onChange={(e) => setNodeCount(parseInt(e.target.value))}
                  />
                  <Slider
                    label="Node Size"
                    value={nodeSize}
                    min={1}
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
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={accordionStyles}>
            <Accordion defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Mouse Interaction</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="space-y-2">
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
                    value={mouseForce * 100}
                    min={1}
                    max={10}
                    onChange={(e) => setMouseForce(parseInt(e.target.value) / 100)}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={accordionStyles}>
            <Accordion defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Node Animation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="space-y-2">
                  <Slider
                    label="Speed"
                    value={nodeSpeed * 100}
                    min={1}
                    max={20}
                    onChange={(e) => setNodeSpeed(parseInt(e.target.value) / 100)}
                  />
                  <Slider
                    label="Pulse Speed"
                    value={nodePulseSpeed * 1000}
                    min={1}
                    max={10}
                    onChange={(e) => setNodePulseSpeed(parseInt(e.target.value) / 1000)}
                  />
                  <Slider
                    label="Pulse Amplitude"
                    value={nodePulseAmplitude * 100}
                    min={10}
                    max={50}
                    onChange={(e) => setNodePulseAmplitude(parseInt(e.target.value) / 100)}
                    unit="%"
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={accordionStyles}>
            <Accordion defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Connection Controls</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="space-y-2">
                  <Slider
                    label="Max Connections"
                    value={connectionCapacity}
                    min={50}
                    max={2000}
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
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={accordionStyles}>
            <Accordion defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Physics Controls</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="space-y-2">
                  <Slider
                    label="Cluster Force"
                    value={clusterForce * 10000}
                    min={0}
                    max={100}
                    step={5}
                    onChange={(e) => setClusterForce(parseInt(e.target.value) / 10000)}
                  />
                  <Slider
                    label="Connection Strength"
                    value={connectionStrength * 10000}
                    min={0}
                    max={100}
                    step={5}
                    onChange={(e) => setConnectionStrength(parseInt(e.target.value) / 10000)}
                  />
                  <Slider
                    label="Repulsion Force"
                    value={repulsionForce * 100}
                    min={0}
                    max={20}
                    step={1}
                    onChange={(e) => setRepulsionForce(parseInt(e.target.value) / 100)}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box sx={accordionStyles}>
            <Accordion defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Gradient Overlay</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-white w-1/3">Enable Gradient</label>
                    <input
                      type="checkbox"
                      checked={gradientEnabled}
                      onChange={(e) => setGradientEnabled(e.target.checked)}
                      className="w-4 h-4 bg-gray-700 rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-white w-1/3">Follow Mouse</label>
                    <input
                      type="checkbox"
                      checked={followMouse}
                      onChange={(e) => setFollowMouse(e.target.checked)}
                      className="w-4 h-4 bg-gray-700 rounded cursor-pointer"
                    />
                  </div>
                  <Slider
                    label="Radius"
                    value={gradientRadius}
                    min={200}
                    max={2000}
                    step={100}
                    onChange={(e) => setGradientRadius(parseInt(e.target.value))}
                    unit="px"
                  />
                  <Slider
                    label="Global Opacity"
                    value={gradientOpacity}
                    min={0}
                    max={100}
                    onChange={(e) => setGradientOpacity(parseInt(e.target.value))}
                    unit="%"
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Color Stops</label>
                    {gradientColors.map((stop, index) => (
                      <div key={index} className="space-y-2 border-b border-gray-700 pb-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={stop.position}
                            min={0}
                            max={1}
                            step={0.1}
                            onChange={(e) => {
                              const newColors = [...gradientColors];
                              newColors[index] = {
                                ...stop,
                                position: parseFloat(e.target.value)
                              };
                              setGradientColors(newColors);
                            }}
                            className="w-16 bg-gray-700 text-white rounded p-1 text-sm"
                          />
                          <input
                            type="color"
                            value={stop.color}
                            onChange={(e) => {
                              const newColors = [...gradientColors];
                              newColors[index] = {
                                ...stop,
                                color: e.target.value
                              };
                              setGradientColors(newColors);
                            }}
                            className="w-16 h-8 bg-gray-700 rounded cursor-pointer"
                          />
                          <div className="flex-1">
                            <Slider
                              label="Opacity"
                              value={Math.round(stop.opacity * 100)}
                              min={0}
                              max={100}
                              onChange={(e) => {
                                const newColors = [...gradientColors];
                                newColors[index] = {
                                  ...stop,
                                  opacity: parseInt(e.target.value) / 100
                                };
                                setGradientColors(newColors);
                              }}
                              unit="%"
                            />
                          </div>
                          <button
                            onClick={() => {
                              if (gradientColors.length > 2) {
                                setGradientColors(gradientColors.filter((_, i) => i !== index));
                              }
                            }}
                            className="px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600"
                            disabled={gradientColors.length <= 2}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const lastStop = gradientColors[gradientColors.length - 1];
                        setGradientColors([
                          ...gradientColors,
                          {
                            position: Math.min(1, lastStop.position + 0.1),
                            color: lastStop.color,
                            opacity: lastStop.opacity
                          }
                        ]);
                      }}
                      className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500"
                    >
                      Add Color Stop
                    </button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default NetworkVisualizationController; 