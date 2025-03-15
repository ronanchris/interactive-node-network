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
}> = ({ onClose, theme, nodeCount, interactionRadius, interactionEnabled, customTheme }) => {
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
          variant={VARIANTS.INTERACTIVE_DEMO}
          themeVariant={theme}
          height="100vh"
          mouseInteractionRadius={interactionEnabled ? interactionRadius : 0}
          nodeCount={nodeCount}
          customTheme={customTheme}
        />
      </div>
    </div>
  );
};

const NetworkVisualizationController: React.FC = () => {
  const [nodeCount, setNodeCount] = useState(30);
  const [theme, setTheme] = useState('default');
  const [interactionRadius, setInteractionRadius] = useState(200);
  const [interactionEnabled, setInteractionEnabled] = useState(true);
  const [customMode, setCustomMode] = useState(false);
  const [nodeSize, setNodeSize] = useState(4);
  
  // Custom color controls
  const [backgroundColor, setBackgroundColor] = useState('#0a1929');
  const [nodeColor, setNodeColor] = useState('#4dabf5');
  const [connectionColor, setConnectionColor] = useState('#4dabf5');
  const [connectionOpacity, setConnectionOpacity] = useState(20);
  const [nodeBrightness, setNodeBrightness] = useState(100);
  
  // Add state for gradient mode
  const [isGradientMode, setIsGradientMode] = useState(false);
  const [gradientColors, setGradientColors] = useState<GradientColors>({
    from: '#4dabf5',
    to: '#2196f3'
  });
  
  // Computed custom theme that overrides the selected theme when custom mode is active
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    background: backgroundColor,
    nodeColor: nodeColor,
    connectionColor: `rgba(${hexToRgb(connectionColor).join(', ')}, ${connectionOpacity/100})`,
    pulseColor: `rgba(${hexToRgb(nodeColor).join(', ')}, 0.5)`,
    nodeBrightness: nodeBrightness/100
  });
  
  // Update custom theme when color values change
  useEffect(() => {
    if (customMode) {
      const rgbConnection = hexToRgb(connectionColor);
      const opacity = connectionOpacity / 100;
      setCustomTheme({
        background: backgroundColor,
        nodeColor: isGradientMode ? gradientColors : nodeColor,
        connectionColor: `rgba(${rgbConnection[0]}, ${rgbConnection[1]}, ${rgbConnection[2]}, ${opacity})`,
        pulseColor: `rgba(${hexToRgb(isGradientMode ? gradientColors.from : nodeColor).join(', ')}, 0.5)`,
        nodeBrightness: nodeBrightness/100
      });
    }
  }, [backgroundColor, nodeColor, connectionColor, connectionOpacity, nodeBrightness, customMode, isGradientMode, gradientColors]);
  
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
          gradientColors
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
      gradientColors
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
    gradientColors
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
        gradientColors
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
    setGradientColors(profile.currentState.gradientColors);
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
      gradientColors
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
    setGradientColors(preset.gradientColors);
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
    <div className="min-h-screen bg-black w-full">
      {isPreviewMode && (
        <FullScreenPreview
          onClose={() => setIsPreviewMode(false)}
          theme={theme}
          nodeCount={nodeCount}
          interactionRadius={interactionRadius}
          interactionEnabled={interactionEnabled}
          customTheme={customMode ? customTheme : null}
        />
      )}
      <div className="w-full max-w-4xl mx-auto p-4">
        {/* Add profile management section */}
        <div className="mb-4 bg-gray-900 rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-100">Profiles</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleCreateProfile}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                New Profile
              </button>
              <button
                onClick={handleImportProfile}
                className="px-3 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                Import Profile
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {profiles.map(profile => (
              <div
                key={profile.id}
                className={`p-3 rounded border ${
                  activeProfileId === profile.id
                    ? 'bg-blue-900 border-blue-500'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-200">{profile.name}</h4>
                    <p className="text-xs text-gray-400">
                      Last modified: {new Date(profile.lastModified).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {profile.presets.length} saved presets
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => loadProfile(profile)}
                      className="px-2 py-1 text-sm text-blue-400 hover:text-blue-300"
                      disabled={activeProfileId === profile.id}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleExportProfile(profile)}
                      className="px-2 py-1 text-sm text-green-400 hover:text-green-300"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => handleDeleteProfile(profile.id)}
                      className="px-2 py-1 text-sm text-red-400 hover:text-red-300"
                      disabled={profiles.length === 1}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Add preset controls */}
        <div className="mb-4 bg-gray-900 rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-100">Saved Presets</h3>
            <button
              onClick={handleSavePreset}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save Current State
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {presets.map(preset => (
              <div
                key={preset.id}
                className={`p-3 rounded border ${
                  activePresetId === preset.id
                    ? 'bg-blue-900 border-blue-500'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-200 font-medium">{preset.name}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLoadPreset(preset)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeletePreset(preset.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.backgroundColor }}
                  />
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.nodeColor }}
                  />
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.connectionColor }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8 bg-gray-900 rounded-lg shadow-lg overflow-hidden relative">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsPreviewMode(true)}
              className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <span>Full Screen</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-2V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
          <NodeNetworkWrapper 
            variant={VARIANTS.INTERACTIVE_DEMO}
            themeVariant={theme}
            height="400px"
            mouseInteractionRadius={interactionEnabled ? interactionRadius : 0}
            nodeCount={nodeCount}
            nodeSize={nodeSize}
            customTheme={customMode ? customTheme : null}
          />
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-100">Visualization Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
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
            
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Node Size: {nodeSize}px
              </label>
              <input 
                type="range" 
                min="2" 
                max="10" 
                value={nodeSize} 
                onChange={(e) => setNodeSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Theme
              </label>
              <select 
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full p-2 border rounded bg-gray-800 text-gray-200 border-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={customMode}
              >
                {themes.map(t => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Interaction Radius: {interactionRadius}px
              </label>
              <input 
                type="range" 
                min="50" 
                max="300" 
                value={interactionRadius} 
                onChange={(e) => setInteractionRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                disabled={!interactionEnabled}
              />
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="interaction-toggle"
                checked={interactionEnabled}
                onChange={() => setInteractionEnabled(!interactionEnabled)}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-900"
              />
              <label htmlFor="interaction-toggle" className="ml-2 text-sm font-semibold text-gray-200">
                Enable Mouse/Touch Interaction
              </label>
            </div>
          </div>
          
          {/* Custom color controls section */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-100">Custom Colors</h3>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="custom-toggle"
                  checked={customMode}
                  onChange={toggleCustomMode}
                  className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <label htmlFor="custom-toggle" className="ml-2 text-sm font-semibold text-gray-200">
                  Enable Custom Colors
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Background Color
                </label>
                <div className="flex items-center relative">
                  <button
                    type="button"
                    onClick={() => handleColorPickerToggle('background')}
                    className="h-10 w-10 rounded border border-gray-600 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: backgroundColor }}
                    disabled={!customMode}
                  />
                  <input 
                    type="text" 
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="ml-2 p-2 border rounded flex-1 bg-gray-800 text-gray-200 border-gray-700"
                    disabled={!customMode}
                  />
                  <ColorPickerPopover
                    color={backgroundColor}
                    onChange={setBackgroundColor}
                    isOpen={activeColorPicker === 'background' && customMode}
                    onClose={() => setActiveColorPicker(null)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Node Color
                </label>
                <div className="flex items-center mb-2">
                  <input 
                    type="checkbox" 
                    id="gradient-toggle"
                    checked={isGradientMode}
                    onChange={() => setIsGradientMode(!isGradientMode)}
                    className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-900"
                    disabled={!customMode}
                  />
                  <label htmlFor="gradient-toggle" className="ml-2 text-sm font-semibold text-gray-200">
                    Use Gradient
                  </label>
                </div>
                {!isGradientMode ? (
                  <div className="flex items-center relative">
                    <button
                      type="button"
                      onClick={() => handleColorPickerToggle('node')}
                      className="h-10 w-10 rounded border border-gray-600 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ backgroundColor: nodeColor }}
                      disabled={!customMode}
                    />
                    <input 
                      type="text" 
                      value={nodeColor}
                      onChange={(e) => setNodeColor(e.target.value)}
                      className="ml-2 p-2 border rounded flex-1 bg-gray-800 text-gray-200 border-gray-700"
                      disabled={!customMode}
                    />
                    <ColorPickerPopover
                      color={nodeColor}
                      onChange={setNodeColor}
                      isOpen={activeColorPicker === 'node' && customMode}
                      onClose={() => setActiveColorPicker(null)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center relative">
                      <button
                        type="button"
                        onClick={() => handleColorPickerToggle('gradient-from')}
                        className="h-10 w-10 rounded border border-gray-600 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: gradientColors.from }}
                        disabled={!customMode}
                      />
                      <input 
                        type="text" 
                        value={gradientColors.from}
                        onChange={(e) => setGradientColors({ ...gradientColors, from: e.target.value })}
                        className="ml-2 p-2 border rounded flex-1 bg-gray-800 text-gray-200 border-gray-700"
                        placeholder="From Color"
                        disabled={!customMode}
                      />
                      <ColorPickerPopover
                        color={gradientColors.from}
                        onChange={(color) => setGradientColors({ ...gradientColors, from: color })}
                        isOpen={activeColorPicker === 'gradient-from' && customMode}
                        onClose={() => setActiveColorPicker(null)}
                      />
                    </div>
                    <div className="flex items-center relative">
                      <button
                        type="button"
                        onClick={() => handleColorPickerToggle('gradient-to')}
                        className="h-10 w-10 rounded border border-gray-600 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: gradientColors.to }}
                        disabled={!customMode}
                      />
                      <input 
                        type="text" 
                        value={gradientColors.to}
                        onChange={(e) => setGradientColors({ ...gradientColors, to: e.target.value })}
                        className="ml-2 p-2 border rounded flex-1 bg-gray-800 text-gray-200 border-gray-700"
                        placeholder="To Color"
                        disabled={!customMode}
                      />
                      <ColorPickerPopover
                        color={gradientColors.to}
                        onChange={(color) => setGradientColors({ ...gradientColors, to: color })}
                        isOpen={activeColorPicker === 'gradient-to' && customMode}
                        onClose={() => setActiveColorPicker(null)}
                      />
                    </div>
                    <div className="h-6 rounded-lg border border-gray-600" 
                      style={{ 
                        background: `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})` 
                      }} 
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Connection Line Color
                </label>
                <div className="flex items-center relative">
                  <button
                    type="button"
                    onClick={() => handleColorPickerToggle('connection')}
                    className="h-10 w-10 rounded border border-gray-600 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: connectionColor }}
                    disabled={!customMode}
                  />
                  <input 
                    type="text" 
                    value={connectionColor}
                    onChange={(e) => setConnectionColor(e.target.value)}
                    className="ml-2 p-2 border rounded flex-1 bg-gray-800 text-gray-200 border-gray-700"
                    disabled={!customMode}
                  />
                  <button 
                    className="ml-2 px-3 py-2 text-xs bg-blue-900 text-blue-200 rounded hover:bg-blue-800 transition-colors"
                    onClick={() => setConnectionColor(nodeColor)}
                    disabled={!customMode}
                  >
                    Match Node
                  </button>
                  <ColorPickerPopover
                    color={connectionColor}
                    onChange={setConnectionColor}
                    isOpen={activeColorPicker === 'connection' && customMode}
                    onClose={() => setActiveColorPicker(null)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Connection Opacity: {connectionOpacity}%
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="80" 
                  value={connectionOpacity} 
                  onChange={(e) => setConnectionOpacity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  disabled={!customMode}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Node Brightness: {nodeBrightness}%
                </label>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={nodeBrightness} 
                  onChange={(e) => setNodeBrightness(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  disabled={!customMode}
                />
              </div>
            </div>
            
            {/* Contrast indicator */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-200">Contrast Ratio</h4>
                  <div className="flex items-center mt-1">
                    <div className="w-6 h-6 rounded mr-2 border border-gray-600 shadow-sm" style={{ backgroundColor: customMode ? backgroundColor : '#0a1929' }}></div>
                    <span className="mx-2 text-gray-300">to</span>
                    <div className="w-6 h-6 rounded mr-2 border border-gray-600 shadow-sm" style={{ backgroundColor: customMode ? nodeColor : '#4dabf5' }}></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-100">{contrastRatio}:1</div>
                  <div className={`text-sm ${contrastStatus.color}`}>
                    {contrastStatus.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkVisualizationController; 