"use client";
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Select, MenuItem, Checkbox, FormControlLabel, Slider } from '@mui/material';
import { HexColorPicker } from 'react-colorful';
import NodeNetworkWrapper from './NodeNetworkWrapper';

// Styled components
const ControlPanel = styled('div')({
  backgroundColor: '#1f294d',
  padding: '36px',
  borderRadius: '8px',
  color: 'white',
});

const ControlGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '32px',
  padding: '0',
});

const SliderRow = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '64px',  // Increased from 32px
  marginTop: '32px',
});

const SliderContainer = styled('div')({
  marginTop: '24px',
  '& label': {
    display: 'block',
    marginBottom: '8px',
    textAlign: 'left',
  }
});

const TopRow = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '64px',  // Increased from 32px
  marginBottom: '40px',
  alignItems: 'center',
});

const TopRowItem = styled('div')({
  '& label': {
    display: 'block',
    marginBottom: '8px',
    textAlign: 'left',
  },
  '& .MuiFormControlLabel-root': {
    marginTop: '32px',
  }
});

const LeftColumn = styled('div')({
  '& ${TopRow}': {
    marginBottom: '40px',  // Specific margin for Theme dropdown
  }
});

const RightColumn = styled('div')({
  '& ${TopRow}': {
    marginBottom: '24px',  // Smaller margin for checkbox to align sliders
  }
});

const StyledSelect = styled(Select)({
  backgroundColor: 'white',
  width: '100%',
  '& .MuiSelect-icon': {
    color: '#000',
  }
});

const GreenSlider = styled(Slider)({
  color: '#34c759',
  height: 2,
  '& .MuiSlider-thumb': {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(52, 199, 89, 0.16)',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.32,
  },
});

const ColorSwatch = styled('button')({
  width: '32px',
  height: '32px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  padding: 0,
  cursor: 'pointer',
  backgroundColor: '#e0e0e0',
});

const ColorSection = styled('div')({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
});

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
  mouseInteractionRadius: number;
  lineThickness: number;
  customTheme?: {
    background: string;
    nodeColor: string;
    connectionColor: string;
    pulseColor: string;
    nodeBrightness: number;
  };
}

interface NetworkVisualizationControllerProps {
  config: NetworkConfig;
  onConfigChange: (config: NetworkConfig) => void;
}

const NetworkVisualizationController: React.FC<NetworkVisualizationControllerProps> = ({
  config,
  onConfigChange,
}) => {
  const [activeColorPicker, setActiveColorPicker] = React.useState<string | null>(null);

  const handleChange = (key: keyof NetworkConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  const ColorPickerPopover = styled('div')({
    position: 'absolute',
    zIndex: 2,
    marginTop: '8px',
  });

  return (
    <div>
      {/* Control Panel */}
      <ControlPanel>
        <h1 style={{ 
          margin: '0 0 32px 0', 
          fontSize: '24px', 
          color: 'white',
          textAlign: 'left'
        }}>
          Visualization Controls
        </h1>

        {/* Top Row - Theme and Checkbox */}
        <TopRow>
          <TopRowItem>
            <label>Theme</label>
            <StyledSelect
              value={config.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="light">Light</MenuItem>
            </StyledSelect>
          </TopRowItem>
          <TopRowItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.enableMouseInteraction}
                  onChange={(e) => handleChange('enableMouseInteraction', e.target.checked)}
                  sx={{
                    color: '#34c759',
                    '&.Mui-checked': {
                      color: '#34c759',
                    },
                  }}
                />
              }
              label="Enable mouse / touch interaction"
            />
          </TopRowItem>
        </TopRow>

        {/* Slider Rows */}
        <div>
          {/* Row 1 - Node Count and Connection Capacity */}
          <SliderRow>
            <div>
              <label>Node count: {config.nodeCount}</label>
              <GreenSlider
                value={config.nodeCount}
                onChange={(_, value) => handleChange('nodeCount', value)}
                min={10}
                max={100}
              />
            </div>
            <div>
              <label>Connection capacity: {config.connectionCapacity}</label>
              <GreenSlider
                value={config.connectionCapacity}
                onChange={(_, value) => handleChange('connectionCapacity', value)}
                min={50}
                max={500}
                step={50}
              />
            </div>
          </SliderRow>

          {/* Row 2 - Node Size and Interaction Radius */}
          <SliderRow>
            <div>
              <label>Node size: {config.nodeSize} px</label>
              <GreenSlider
                value={config.nodeSize}
                onChange={(_, value) => handleChange('nodeSize', value)}
                min={1}
                max={10}
              />
            </div>
            <div>
              <label>Interaction radius: {config.interactionRadius} px</label>
              <GreenSlider
                value={config.interactionRadius}
                onChange={(_, value) => handleChange('interactionRadius', value)}
                min={0}
                max={500}
                disabled={!config.enableMouseInteraction}
              />
            </div>
          </SliderRow>

          {/* Row 3 - Line Thickness and Connection Opacity */}
          <SliderRow>
            <div>
              <label>Line thickness: {config.lineThickness} px</label>
              <GreenSlider
                value={config.lineThickness}
                onChange={(_, value) => handleChange('lineThickness', value)}
                min={1}
                max={5}
                step={0.5}
              />
            </div>
            <div>
              <label>Connection opacity: {config.connectionOpacity}%</label>
              <GreenSlider
                value={config.connectionOpacity}
                onChange={(_, value) => handleChange('connectionOpacity', value)}
                min={0}
                max={100}
              />
            </div>
          </SliderRow>
        </div>

        {/* Custom Colors Section */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', textAlign: 'left' }}>Custom Color</h3>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ position: 'relative' }}>
              <ColorSection>
                <ColorSwatch
                  style={{ backgroundColor: config.backgroundColor }}
                  onClick={() => setActiveColorPicker(activeColorPicker === 'background' ? null : 'background')}
                />
                <span>Background color</span>
              </ColorSection>
              {activeColorPicker === 'background' && (
                <ColorPickerPopover>
                  <HexColorPicker
                    color={config.backgroundColor}
                    onChange={(color) => handleChange('backgroundColor', color)}
                  />
                </ColorPickerPopover>
              )}
            </div>
            
            <div style={{ position: 'relative' }}>
              <ColorSection>
                <ColorSwatch
                  style={{ backgroundColor: config.nodeColor }}
                  onClick={() => setActiveColorPicker(activeColorPicker === 'node' ? null : 'node')}
                />
                <span>Node color</span>
              </ColorSection>
              {activeColorPicker === 'node' && (
                <ColorPickerPopover>
                  <HexColorPicker
                    color={config.nodeColor}
                    onChange={(color) => handleChange('nodeColor', color)}
                  />
                </ColorPickerPopover>
              )}
            </div>
            
            <div style={{ position: 'relative' }}>
              <ColorSection>
                <ColorSwatch
                  style={{ backgroundColor: config.connectionColor }}
                  onClick={() => setActiveColorPicker(activeColorPicker === 'connection' ? null : 'connection')}
                />
                <span>Connection color</span>
              </ColorSection>
              {activeColorPicker === 'connection' && (
                <ColorPickerPopover>
                  <HexColorPicker
                    color={config.connectionColor}
                    onChange={(color) => handleChange('connectionColor', color)}
                  />
                </ColorPickerPopover>
              )}
            </div>
          </div>
        </div>

        {/* Gradient Section */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              style={{ margin: '0', padding: '0' }}
              control={
                <Checkbox
                  checked={config.enableGradient}
                  onChange={(e) => handleChange('enableGradient', e.target.checked)}
                  sx={{
                    color: '#34c759',
                    padding: '0',
                    marginRight: '8px',
                    '&.Mui-checked': {
                      color: '#34c759',
                    },
                  }}
                />
              }
              label="Enable gradient for connections"
            />
          </div>
          
          {config.enableGradient && (
            <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
              <div style={{ position: 'relative' }}>
                <ColorSection>
                  <ColorSwatch
                    style={{ backgroundColor: config.gradientStart }}
                    onClick={() => setActiveColorPicker(activeColorPicker === 'gradientStart' ? null : 'gradientStart')}
                  />
                  <span>Gradient start</span>
                </ColorSection>
                {activeColorPicker === 'gradientStart' && (
                  <ColorPickerPopover>
                    <HexColorPicker
                      color={config.gradientStart}
                      onChange={(color) => handleChange('gradientStart', color)}
                    />
                  </ColorPickerPopover>
                )}
              </div>
              
              <div style={{ position: 'relative' }}>
                <ColorSection>
                  <ColorSwatch
                    style={{ backgroundColor: config.gradientEnd }}
                    onClick={() => setActiveColorPicker(activeColorPicker === 'gradientEnd' ? null : 'gradientEnd')}
                  />
                  <span>Gradient end</span>
                </ColorSection>
                {activeColorPicker === 'gradientEnd' && (
                  <ColorPickerPopover>
                    <HexColorPicker
                      color={config.gradientEnd}
                      onChange={(color) => handleChange('gradientEnd', color)}
                    />
                  </ColorPickerPopover>
                )}
              </div>
            </div>
          )}
        </div>
      </ControlPanel>
    </div>
  );
};

export default NetworkVisualizationController; 