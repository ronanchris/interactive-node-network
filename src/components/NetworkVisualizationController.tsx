import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import NodeNetworkWrapper, { VARIANTS } from './NodeNetworkWrapper';

interface CustomTheme {
  background: string;
  nodeColor: string | { from: string; to: string };
  connectionColor: string;
  pulseColor: string;
  nodeBrightness: number;
}

// Add new interface for gradient mode
interface GradientColors {
  from: string;
  to: string;
}

// Add new interface for color picker popover
interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Add interfaces for saved state
interface SavedState {
  nodeCount: number;
  theme: string;
  interactionRadius: number;
  interactionEnabled: boolean;
  customMode: boolean;
  backgroundColor: string;
  nodeColor: string;
  connectionColor: string;
  connectionOpacity: number;
  nodeBrightness: number;
  isGradientMode: boolean;
  gradientColors: GradientColors;
}

interface SavedPreset extends SavedState {
  name: string;
  id: string;
}

// Add interfaces for user profile
interface UserProfile {
  id: string;
  name: string;
  lastModified: number;
  currentState: SavedState;
  presets: SavedPreset[];
}

interface NetworkConfig {
  theme: string;
  nodeCount: number;
  interactionRadius: number;
  interactionEnabled: boolean;
  customTheme: CustomTheme | null;
  nodeSize: number;
}

interface NetworkVisualizationControllerProps {
  config: NetworkConfig;
  onConfigChange: (config: NetworkConfig) => void;
}

const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({ color, onChange, isOpen, onClose }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={popoverRef}
      className="absolute z-10 bg-gray-800 rounded-lg shadow-xl p-3 mt-2 border border-gray-700"
      style={{ transform: 'translateY(calc(-100% - 40px))' }}
    >
      <HexColorPicker color={color} onChange={onChange} />
    </div>
  );
};

// Add FullScreenPreview component
const FullScreenPreview: React.FC<{
  onClose: () => void;
  theme: string;
  nodeCount: number;
  interactionRadius: number;
  interactionEnabled: boolean;
  customTheme: CustomTheme | null;
  nodeSize: number;
}> = ({ onClose, theme, nodeCount, interactionRadius, interactionEnabled, customTheme, nodeSize }) => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <span>Close Preview</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <NodeNetworkWrapper 
          variant="interactive-demo"
          themeVariant={theme}
          height="100vh"
          mouseInteractionRadius={interactionEnabled ? interactionRadius : 0}
          nodeCount={nodeCount}
          nodeSize={nodeSize}
          customTheme={customTheme}
        />
      </div>
    </div>
  );
};

const NetworkVisualizationController: React.FC<NetworkVisualizationControllerProps> = ({
  config,
  onConfigChange
}) => {
  const [nodeCount, setNodeCount] = useState(config.nodeCount);
  const [theme, setTheme] = useState(config.theme);
  const [interactionRadius, setInteractionRadius] = useState(config.interactionRadius);
  const [interactionEnabled, setInteractionEnabled] = useState(config.interactionEnabled);
  const [customMode, setCustomMode] = useState(false);
  const [nodeSize, setNodeSize] = useState(config.nodeSize);
  const [connectionCapacity, setConnectionCapacity] = useState(300);
  const [connectionOpacity, setConnectionOpacity] = useState(20);
  const [nodeBrightness, setNodeBrightness] = useState(100);
  const [lineThickness, setLineThickness] = useState(1);
  
  // Custom color controls
  const [backgroundColor, setBackgroundColor] = useState('#0a1929');
  const [nodeColor, setNodeColor] = useState('#4dabf5');
  const [connectionColor, setConnectionColor] = useState('#4dabf5');
  const [isGradientMode, setIsGradientMode] = useState(false);
  const [gradientStart, setGradientStart] = useState('#4dabf5');
  const [gradientEnd, setGradientEnd] = useState('#2196f3');
  
  // Computed custom theme that overrides the selected theme when custom mode is active
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    background: backgroundColor,
    nodeColor: nodeColor,
    connectionColor: `rgba(${hexToRgb(connectionColor).join(', ')}, ${connectionOpacity/100})`,
    pulseColor: `rgba(${hexToRgb(nodeColor).join(', ')}, 0.5)`,
    nodeBrightness: nodeBrightness/100
  });
  
  // Update customTheme when values change
  useEffect(() => {
    const rgbConnection = hexToRgb(connectionColor);
    const opacity = connectionOpacity / 100;
    const customTheme = {
      background: backgroundColor,
      nodeColor: isGradientMode ? { from: gradientStart, to: gradientEnd } : nodeColor,
      connectionColor: `rgba(${rgbConnection[0]}, ${rgbConnection[1]}, ${rgbConnection[2]}, ${opacity})`,
      pulseColor: `rgba(${hexToRgb(isGradientMode ? gradientStart : nodeColor).join(', ')}, 0.5)`,
      nodeBrightness: nodeBrightness/100
    };
    onConfigChange({
      ...config,
      theme,
      nodeCount,
      interactionRadius,
      interactionEnabled,
      nodeSize,
      customTheme: customMode ? customTheme : null
    });
  }, [
    backgroundColor,
    nodeColor,
    connectionColor,
    connectionOpacity,
    nodeBrightness,
    isGradientMode,
    gradientStart,
    gradientEnd,
    customMode,
    theme,
    nodeCount,
    interactionRadius,
    interactionEnabled,
    nodeSize,
    config,
    onConfigChange
  ]);
  
  const themes = ['default', 'warm', 'cool', 'night', 'highContrast', 'neon'];
  
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
  
  // Calculate contrast ratio between two colors (simplified version)
  const calculateContrastRatio = (color1: string, color2: string): number => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    // Calculate relative luminance
    const luminance1 = calculateLuminance(rgb1);
    const luminance2 = calculateLuminance(rgb2);
    
    // Calculate contrast ratio
    const ratio = (Math.max(luminance1, luminance2) + 0.05) / 
                 (Math.min(luminance1, luminance2) + 0.05);
    
    return Number(ratio.toFixed(2));
  };
  
  // Calculate luminance of RGB color
  const calculateLuminance = (rgb: [number, number, number]): number => {
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  // Get WCAG compliance status based on contrast ratio
  const getContrastStatus = (ratio: number): { status: string; color: string } => {
    if (ratio >= 7) return { status: 'Excellent', color: 'text-green-600' };
    if (ratio >= 4.5) return { status: 'Good (AA)', color: 'text-blue-600' };
    if (ratio >= 3) return { status: 'Fair (AA Large)', color: 'text-yellow-600' };
    return { status: 'Poor', color: 'text-red-600' };
  };
  
  const contrastRatio = calculateContrastRatio(
    customMode ? backgroundColor : '#0a1929', // Default background 
    customMode ? nodeColor : '#4dabf5' // Default node color
  );
  
  const contrastStatus = getContrastStatus(contrastRatio);
  
  // Handle theme change
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (!customMode) return;
    
    // If switching to a preset theme, update custom colors to match
    switch (newTheme) {
      case 'default':
        setBackgroundColor('#0a1929');
        setNodeColor('#4dabf5');
        break;
      case 'warm':
        setBackgroundColor('#271a10');
        setNodeColor('#ffb74d');
        break;
      case 'cool':
        setBackgroundColor('#092a2e');
        setNodeColor('#4dd0e1');
        break;
      case 'night':
        setBackgroundColor('#0d0a29');
        setNodeColor('#b39ddb');
        break;
      case 'highContrast':
        setBackgroundColor('#000000');
        setNodeColor('#ffffff');
        break;
      case 'neon':
        setBackgroundColor('#0f0f0f');
        setNodeColor('#39ff14');
        break;
      default:
        break;
    }
  };
  
  // Toggle custom mode
  const toggleCustomMode = () => {
    const newMode = !customMode;
    setCustomMode(newMode);
    
    if (newMode) {
      // When enabling custom mode, initialize with current theme colors
      switch (theme) {
        case 'default':
          setBackgroundColor('#0a1929');
          setNodeColor('#4dabf5');
          setConnectionColor('#4dabf5');
          break;
        case 'warm':
          setBackgroundColor('#271a10');
          setNodeColor('#ffb74d');
          setConnectionColor('#ffb74d');
          break;
        case 'cool':
          setBackgroundColor('#092a2e');
          setNodeColor('#4dd0e1');
          setConnectionColor('#4dd0e1');
          break;
        case 'night':
          setBackgroundColor('#0d0a29');
          setNodeColor('#b39ddb');
          setConnectionColor('#b39ddb');
          break;
        case 'highContrast':
          setBackgroundColor('#000000');
          setNodeColor('#ffffff');
          setConnectionColor('#ffffff');
          break;
        case 'neon':
          setBackgroundColor('#0f0f0f');
          setNodeColor('#39ff14');
          setConnectionColor('#39ff14');
          break;
        default:
          break;
      }
    }
  };

  // Add state for color picker popovers
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  // Handle color picker toggle
  const handleColorPickerToggle = useCallback((pickerName: string) => {
    setActiveColorPicker(activeColorPicker === pickerName ? null : pickerName);
  }, [activeColorPicker]);

  // Add state for full-screen preview
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Add state for presets
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  
  // Add profile management state
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  
  // Load profiles on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('networkProfiles');
    const lastActiveProfile = localStorage.getItem('lastActiveProfile');
    
    if (savedProfiles) {
      const loadedProfiles = JSON.parse(savedProfiles) as UserProfile[];
      setProfiles(loadedProfiles);
      
      // Load last active profile or first available
      const profileToLoad = lastActiveProfile 
        ? loadedProfiles.find(p => p.id === lastActiveProfile) 
        : loadedProfiles[0];
        
      if (profileToLoad) {
        loadProfile(profileToLoad);
      }
    } else {
      // Create default profile if none exist
      const defaultProfile: UserProfile = {
        id: 'default',
        name: 'Default Profile',
        lastModified: Date.now(),
        currentState: {
          nodeCount,
          theme,
          interactionRadius,
          interactionEnabled,
          customMode,
          backgroundColor,
          nodeColor,
          connectionColor,
          connectionOpacity,
          nodeBrightness,
          isGradientMode,
          gradientColors: { from: gradientStart, to: gradientEnd }
        },
        presets: []
      };
      setProfiles([defaultProfile]);
      setActiveProfileId(defaultProfile.id);
      localStorage.setItem('networkProfiles', JSON.stringify([defaultProfile]));
      localStorage.setItem('lastActiveProfile', defaultProfile.id);
    }
  }, []);

  // Save current state to active profile
  useEffect(() => {
    if (!activeProfileId) return;
    
    const currentState: SavedState = {
      nodeCount,
      theme,
      interactionRadius,
      interactionEnabled,
      customMode,
      backgroundColor,
      nodeColor,
      connectionColor,
      connectionOpacity,
      nodeBrightness,
      isGradientMode,
      gradientColors: { from: gradientStart, to: gradientEnd }
    };

    setProfiles(prevProfiles => {
      const updatedProfiles = prevProfiles.map(profile => {
        if (profile.id === activeProfileId) {
          return {
            ...profile,
            lastModified: Date.now(),
            currentState,
            presets: [...profile.presets]
          };
        }
        return profile;
      });
      localStorage.setItem('networkProfiles', JSON.stringify(updatedProfiles));
      return updatedProfiles;
    });
  }, [
    activeProfileId,
    nodeCount,
    theme,
    interactionRadius,
    interactionEnabled,
    customMode,
    backgroundColor,
    nodeColor,
    connectionColor,
    connectionOpacity,
    nodeBrightness,
    isGradientMode,
    gradientStart,
    gradientEnd
  ]);

  // Handle creating new profile
  const handleCreateProfile = () => {
    const profileName = prompt('Enter a name for the new profile:');
    if (!profileName) return;

    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name: profileName,
      lastModified: Date.now(),
      currentState: {
        nodeCount,
        theme,
        interactionRadius,
        interactionEnabled,
        customMode,
        backgroundColor,
        nodeColor,
        connectionColor,
        connectionOpacity,
        nodeBrightness,
        isGradientMode,
        gradientColors: { from: gradientStart, to: gradientEnd }
      },
      presets: []
    };

    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    localStorage.setItem('lastActiveProfile', newProfile.id);
  };

  // Handle loading profile
  const loadProfile = (profile: UserProfile) => {
    setNodeCount(profile.currentState.nodeCount);
    setTheme(profile.currentState.theme);
    setInteractionRadius(profile.currentState.interactionRadius);
    setInteractionEnabled(profile.currentState.interactionEnabled);
    setCustomMode(profile.currentState.customMode);
    setBackgroundColor(profile.currentState.backgroundColor);
    setNodeColor(profile.currentState.nodeColor);
    setConnectionColor(profile.currentState.connectionColor);
    setConnectionOpacity(profile.currentState.connectionOpacity);
    setNodeBrightness(profile.currentState.nodeBrightness);
    setIsGradientMode(profile.currentState.isGradientMode);
    setGradientStart(profile.currentState.gradientColors.from);
    setGradientEnd(profile.currentState.gradientColors.to);
    setPresets(profile.presets);
    setActiveProfileId(profile.id);
    localStorage.setItem('lastActiveProfile', profile.id);
  };

  // Handle deleting profile
  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length === 1) {
      alert('Cannot delete the last profile');
      return;
    }

    if (confirm('Are you sure you want to delete this profile?')) {
      setProfiles(prev => {
        const filtered = prev.filter(p => p.id !== profileId);
        localStorage.setItem('networkProfiles', JSON.stringify(filtered));
        
        // If deleting active profile, switch to another one
        if (profileId === activeProfileId) {
          const nextProfile = filtered[0];
          loadProfile(nextProfile);
        }
        
        return filtered;
      });
    }
  };

  // Handle exporting profile
  const handleExportProfile = (profile: UserProfile) => {
    const dataStr = JSON.stringify(profile);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${profile.name.toLowerCase().replace(/\s+/g, '-')}-network-profile.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Handle importing profile
  const handleImportProfile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const profile = JSON.parse(e.target?.result as string) as UserProfile;
          profile.id = Date.now().toString(); // Ensure unique ID
          setProfiles(prev => [...prev, profile]);
          loadProfile(profile);
        } catch (error) {
          alert('Invalid profile file');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  // Handle saving new preset
  const handleSavePreset = () => {
    const presetName = prompt('Enter a name for this preset:');
    if (!presetName) return;

    const newPreset: SavedPreset = {
      id: Date.now().toString(),
      name: presetName,
      nodeCount,
      theme,
      interactionRadius,
      interactionEnabled,
      customMode,
      backgroundColor,
      nodeColor,
      connectionColor,
      connectionOpacity,
      nodeBrightness,
      isGradientMode,
      gradientColors: { from: gradientStart, to: gradientEnd }
    };

    // Update presets in the active profile
    setProfiles(prevProfiles => {
      const updatedProfiles = prevProfiles.map(profile => {
        if (profile.id === activeProfileId) {
          return {
            ...profile,
            presets: [...profile.presets, newPreset]
          };
        }
        return profile;
      });
      localStorage.setItem('networkProfiles', JSON.stringify(updatedProfiles));
      return updatedProfiles;
    });
    setActivePresetId(newPreset.id);
  };

  // Handle loading preset
  const handleLoadPreset = (preset: SavedPreset) => {
    setNodeCount(preset.nodeCount);
    setTheme(preset.theme);
    setInteractionRadius(preset.interactionRadius);
    setInteractionEnabled(preset.interactionEnabled);
    setCustomMode(preset.customMode);
    setBackgroundColor(preset.backgroundColor);
    setNodeColor(preset.nodeColor);
    setConnectionColor(preset.connectionColor);
    setConnectionOpacity(preset.connectionOpacity);
    setNodeBrightness(preset.nodeBrightness);
    setIsGradientMode(preset.isGradientMode);
    setGradientStart(preset.gradientColors.from);
    setGradientEnd(preset.gradientColors.to);
    setActivePresetId(preset.id);
  };

  // Handle deleting preset
  const handleDeletePreset = (presetId: string) => {
    setProfiles(prevProfiles => {
      const updatedProfiles = prevProfiles.map(profile => {
        if (profile.id === activeProfileId) {
          return {
            ...profile,
            presets: profile.presets.filter(p => p.id !== presetId)
          };
        }
        return profile;
      });
      localStorage.setItem('networkProfiles', JSON.stringify(updatedProfiles));
      return updatedProfiles;
    });
    
    if (activePresetId === presetId) {
      setActivePresetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Theme</label>
        <select
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value)}
          className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
        >
          {themes.map(t => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Mouse/Touch Interaction Toggle */}
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={interactionEnabled}
            onChange={(e) => setInteractionEnabled(e.target.checked)}
            className="form-checkbox h-5 w-5 text-green-500 rounded bg-gray-800 border-gray-700"
          />
          <span className="text-sm text-gray-400">Enable mouse / touch interaction</span>
        </label>
      </div>

      {/* Node Count Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-gray-400">Node count: {nodeCount}</label>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-green-800/20 rounded-full"></div>
          <input 
            type="range" 
            min="5" 
            max="50" 
            value={nodeCount} 
            onChange={(e) => setNodeCount(parseInt(e.target.value))}
            className="w-full h-1 bg-transparent appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Node Size Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-gray-400">Node size: {nodeSize}px</label>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-green-800/20 rounded-full"></div>
          <input 
            type="range" 
            min="2" 
            max="8" 
            value={nodeSize} 
            onChange={(e) => setNodeSize(parseInt(e.target.value))}
            className="w-full h-1 bg-transparent appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Connection Opacity Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-gray-400">Connection opacity: {connectionOpacity}%</label>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-green-800/20 rounded-full"></div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={connectionOpacity} 
            onChange={(e) => setConnectionOpacity(parseInt(e.target.value))}
            className="w-full h-1 bg-transparent appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Connection Capacity Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-gray-400">Connection capacity: {connectionCapacity}</label>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-green-800/20 rounded-full"></div>
          <input 
            type="range" 
            min="100" 
            max="500" 
            value={connectionCapacity} 
            onChange={(e) => setConnectionCapacity(parseInt(e.target.value))}
            className="w-full h-1 bg-transparent appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Interaction Radius Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-gray-400">Interaction radius: {interactionRadius}px</label>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-green-800/20 rounded-full"></div>
          <input 
            type="range" 
            min="50" 
            max="500" 
            value={interactionRadius} 
            onChange={(e) => setInteractionRadius(parseInt(e.target.value))}
            className="w-full h-1 bg-transparent appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Custom Color Section */}
      <div className="pt-6 border-t border-gray-800">
        <h3 className="text-lg font-semibold mb-4">Custom Color</h3>
        
        {/* Color Pickers */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Background color</label>
            <button
              className="w-full h-10 rounded border border-gray-700"
              style={{ backgroundColor }}
              onClick={() => handleColorPickerToggle('background')}
            />
            {activeColorPicker === 'background' && (
              <ColorPickerPopover
                color={backgroundColor}
                onChange={setBackgroundColor}
                isOpen={true}
                onClose={() => setActiveColorPicker(null)}
              />
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Node color</label>
            <button
              className="w-full h-10 rounded border border-gray-700"
              style={{ backgroundColor: nodeColor }}
              onClick={() => handleColorPickerToggle('node')}
            />
            {activeColorPicker === 'node' && (
              <ColorPickerPopover
                color={nodeColor}
                onChange={setNodeColor}
                isOpen={true}
                onClose={() => setActiveColorPicker(null)}
              />
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Connection color</label>
            <button
              className="w-full h-10 rounded border border-gray-700"
              style={{ backgroundColor: connectionColor }}
              onClick={() => handleColorPickerToggle('connection')}
            />
            {activeColorPicker === 'connection' && (
              <ColorPickerPopover
                color={connectionColor}
                onChange={setConnectionColor}
                isOpen={true}
                onClose={() => setActiveColorPicker(null)}
              />
            )}
          </div>
        </div>

        {/* Node Brightness Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-400">Node brightness: {nodeBrightness}%</label>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-green-800/20 rounded-full"></div>
            <input 
              type="range" 
              min="0" 
              max="200" 
              value={nodeBrightness} 
              onChange={(e) => setNodeBrightness(parseInt(e.target.value))}
              className="w-full h-1 bg-transparent appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>

        {/* Gradient Mode Toggle */}
        <div className="mt-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isGradientMode}
              onChange={(e) => setIsGradientMode(e.target.checked)}
              className="form-checkbox h-5 w-5 text-green-500 rounded bg-gray-800 border-gray-700"
            />
            <span className="text-sm text-gray-400">Enable gradient for connections</span>
          </label>
        </div>

        {/* Gradient Color Pickers */}
        {isGradientMode && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Gradient start</label>
              <button
                className="w-full h-10 rounded border border-gray-700"
                style={{ backgroundColor: gradientStart }}
                onClick={() => handleColorPickerToggle('gradient-start')}
              />
              {activeColorPicker === 'gradient-start' && (
                <ColorPickerPopover
                  color={gradientStart}
                  onChange={setGradientStart}
                  isOpen={true}
                  onClose={() => setActiveColorPicker(null)}
                />
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Gradient end</label>
              <button
                className="w-full h-10 rounded border border-gray-700"
                style={{ backgroundColor: gradientEnd }}
                onClick={() => handleColorPickerToggle('gradient-end')}
              />
              {activeColorPicker === 'gradient-end' && (
                <ColorPickerPopover
                  color={gradientEnd}
                  onChange={setGradientEnd}
                  isOpen={true}
                  onClose={() => setActiveColorPicker(null)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkVisualizationController; 