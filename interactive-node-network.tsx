import React, { useEffect, useRef, useState } from 'react';

// Constants for the network
const THEME_VARIANTS = {
  default: {
    background: '#0a1929',
    nodeColor: '#4dabf5',
    connectionColor: 'rgba(77, 171, 245, 0.2)',
    pulseColor: 'rgba(77, 171, 245, 0.5)',
    nodeBrightness: 1.0
  },
  warm: {
    background: '#271a10',
    nodeColor: '#ffb74d',
    connectionColor: 'rgba(255, 183, 77, 0.2)',
    pulseColor: 'rgba(255, 183, 77, 0.5)',
    nodeBrightness: 1.0
  },
  cool: {
    background: '#092a2e',
    nodeColor: '#4dd0e1',
    connectionColor: 'rgba(77, 208, 225, 0.2)',
    pulseColor: 'rgba(77, 208, 225, 0.5)',
    nodeBrightness: 1.0
  },
  night: {
    background: '#0d0a29',
    nodeColor: '#b39ddb',
    connectionColor: 'rgba(179, 157, 219, 0.2)',
    pulseColor: 'rgba(179, 157, 219, 0.5)',
    nodeBrightness: 1.0
  },
  highContrast: {
    background: '#000000',
    nodeColor: '#ffffff',
    connectionColor: 'rgba(255, 255, 255, 0.3)',
    pulseColor: 'rgba(255, 255, 255, 0.6)',
    nodeBrightness: 1.0
  },
  neon: {
    background: '#0f0f0f',
    nodeColor: '#39ff14',
    connectionColor: 'rgba(57, 255, 20, 0.2)',
    pulseColor: 'rgba(57, 255, 20, 0.5)',
    nodeBrightness: 1.0
  }
};

// Node network class
const InteractiveNodeNetwork = ({ 
  nodeCount = 30, 
  themeVariant = 'default',
  mouseInteractionRadius = 200,
  height = '100%',
  customTheme = null
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const [isTouch, setIsTouch] = useState(false);
  const [dpr, setDpr] = useState(1);
  
  // Initialize network
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsTouch(isMobile);
    
    // Get device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;
    setDpr(devicePixelRatio);
    
    // Determine actual node count based on screen size and device
    let actualNodeCount = nodeCount;
    if (isMobile) {
      actualNodeCount = Math.floor(nodeCount * 0.6); // Reduce nodes on mobile
    }
    
    // Setup canvas
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const { width, height } = container.getBoundingClientRect();
    
    // Set canvas dimensions
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    setDimensions({ width, height });
    
    // Create nodes
    const newNodes = [];
    for (let i = 0; i < actualNodeCount; i++) {
      newNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.5 + Math.random() * 1.5,
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5
        },
        phase: Math.random() * Math.PI * 2, // Random starting phase for pulse effect
        brightness: 0.8 + Math.random() * 0.2 // Random brightness variation
      });
    }
    
    setNodes(newNodes);
    
    // Add event listeners
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      canvas.addEventListener('touchmove', handleTouchMove);
    }
    
    // Handle resize
    const handleResize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      setDimensions({ width, height });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      } else {
        canvas.removeEventListener('touchmove', handleTouchMove);
      }
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [nodeCount]);
  
  // Handle mouse movement
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  // Handle touch movement
  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      });
    }
  };
  
  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;
    
    // Use custom theme if provided, otherwise use the selected theme variant
    const theme = customTheme || THEME_VARIANTS[themeVariant] || THEME_VARIANTS.default;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // Use non-alpha for better performance
    
    const animate = () => {
      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Scale context for high DPI displays
      ctx.scale(dpr, dpr);
      
      // Update and draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
          
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            // Draw connection
            const opacity = 1 - distance / 100;
            
            // Extract connection color and apply the opacity
            let connectionColorValue = theme.connectionColor;
            
            // If it's already an rgba format, parse it and apply our opacity
            if (connectionColorValue.startsWith('rgba')) {
              const rgbaMatch = connectionColorValue.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
              if (rgbaMatch) {
                const [_, r, g, b, baseOpacity] = rgbaMatch;
                // Use the base opacity value from the theme but scale it by our calculated opacity
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${parseFloat(baseOpacity) * opacity})`;
              } else {
                // Fallback if parsing fails
                ctx.strokeStyle = connectionColorValue;
              }
            } else {
              // Handle hex colors
              const hexMatch = /#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/.exec(connectionColorValue);
              if (hexMatch) {
                const [_, r, g, b] = hexMatch;
                const rDec = parseInt(r, 16);
                const gDec = parseInt(g, 16);
                const bDec = parseInt(b, 16);
                ctx.strokeStyle = `rgba(${rDec}, ${gDec}, ${bDec}, ${opacity * 0.5})`;
              } else {
                // Fallback
                ctx.strokeStyle = connectionColorValue;
              }
            }
            
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
              // Update nodes
      const updatedNodes = nodes.map(node => {
        // Apply pulse effect for visual interest
        const pulse = Math.sin(Date.now() * 0.003 + node.phase) * 0.2 + 0.8;
        const finalRadius = node.radius * pulse;
        
        // Calculate distance to mouse if interaction is active
        let mouseEffect = { x: 0, y: 0 };
        if (mousePosition.x !== null && mousePosition.y !== null) {
          const dx = mousePosition.x - node.x;
          const dy = mousePosition.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseInteractionRadius) {
            const force = (mouseInteractionRadius - distance) / mouseInteractionRadius;
            mouseEffect = {
              x: dx * force * 0.02,
              y: dy * force * 0.02
            };
          }
        }
        
        // Update position
        let newX = node.x + node.velocity.x + mouseEffect.x;
        let newY = node.y + node.velocity.y + mouseEffect.y;
        
        // Bounce at boundaries
        if (newX < 0 || newX > dimensions.width) {
          node.velocity.x *= -1;
          newX = Math.max(0, Math.min(dimensions.width, newX));
        }
        
        if (newY < 0 || newY > dimensions.height) {
          node.velocity.y *= -1;
          newY = Math.max(0, Math.min(dimensions.height, newY));
        }
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, finalRadius, 0, Math.PI * 2);
        
        // Apply brightness variation, taking into account the theme's nodeBrightness setting
        const hexColor = theme.nodeColor;
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        // Apply both the individual node's brightness and the global theme brightness
        const effectiveBrightness = node.brightness * (theme.nodeBrightness || 1.0);
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${effectiveBrightness})`;
        ctx.fill();
        
        return {
          ...node,
          x: newX,
          y: newY
        };
      });
      
      // Reset scale
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      setNodes(updatedNodes);
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [nodes, dimensions, mousePosition, themeVariant, mouseInteractionRadius, dpr, customTheme]);
  
  return (
    <div className="w-full h-full" style={{ height }}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
      />
    </div>
  );
};

// NodeNetworkWrapper with different variants
const VARIANTS = {
  FULLSCREEN: 'fullscreen',
  BACKGROUND: 'background',
  HERO: 'hero',
  CARD: 'card',
  INTERACTIVE_DEMO: 'interactive_demo'
};

const NodeNetworkWrapper = ({ 
  variant = VARIANTS.FULLSCREEN,
  themeVariant = 'default',
  height = '100%',
  className = '',
  contentOverlay = null,
  mouseInteractionRadius = 200,
  nodeCount = 30,
  customTheme = null
}) => {
  const getVariantStyles = () => {
    switch(variant) {
      case VARIANTS.BACKGROUND:
        return 'fixed top-0 left-0 w-full h-full z-0 opacity-60';
      case VARIANTS.HERO:
        return 'relative w-full';
      case VARIANTS.CARD:
        return 'overflow-hidden';
      case VARIANTS.INTERACTIVE_DEMO:
        return 'relative w-full border rounded-lg shadow-lg overflow-hidden';
      default:
        return 'w-full h-full';
    }
  };
  
  // Adjust node count based on variant
  const getNodeCount = () => {
    switch(variant) {
      case VARIANTS.CARD:
        return Math.floor(nodeCount * 0.5); // Fewer nodes for cards
      case VARIANTS.BACKGROUND:
        return Math.floor(nodeCount * 0.8); // Slightly fewer for background
      default:
        return nodeCount;
    }
  };
  
  return (
    <div className={`${getVariantStyles()} ${className}`} style={{ height }}>
      <InteractiveNodeNetwork 
        nodeCount={getNodeCount()}
        themeVariant={themeVariant}
        mouseInteractionRadius={mouseInteractionRadius}
        height={height}
        customTheme={customTheme}
      />
      {contentOverlay && (
        <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center">
          {contentOverlay}
        </div>
      )}
    </div>
  );
};

// Controller component for advanced options
const NetworkVisualizationController = () => {
  const [nodeCount, setNodeCount] = useState(30);
  const [theme, setTheme] = useState('default');
  const [interactionRadius, setInteractionRadius] = useState(200);
  const [interactionEnabled, setInteractionEnabled] = useState(true);
  const [customMode, setCustomMode] = useState(false);
  
  // Custom color controls
  const [backgroundColor, setBackgroundColor] = useState('#0a1929');
  const [nodeColor, setNodeColor] = useState('#4dabf5');
  const [connectionColor, setConnectionColor] = useState('#4dabf5');
  const [connectionOpacity, setConnectionOpacity] = useState(20);
  const [nodeBrightness, setNodeBrightness] = useState(100);
  
  // Computed custom theme that overrides the selected theme when custom mode is active
  const [customTheme, setCustomTheme] = useState({
    background: backgroundColor,
    nodeColor: nodeColor,
    connectionColor: `rgba(${hexToRgb(connectionColor).join(', ')}, ${connectionOpacity/100})`,
    pulseColor: `rgba(${hexToRgb(nodeColor).join(', ')}, 0.5)`,
    nodeBrightness: nodeBrightness/100
  });
  
  // Update custom theme when color values change
  useEffect(() => {
    if (customMode) {
      setCustomTheme({
        background: backgroundColor,
        nodeColor: nodeColor,
        connectionColor: `rgba(${hexToRgb(connectionColor).join(', ')}, ${connectionOpacity/100})`,
        pulseColor: `rgba(${hexToRgb(nodeColor).join(', ')}, 0.5)`,
        nodeBrightness: nodeBrightness/100
      });
    }
  }, [backgroundColor, nodeColor, connectionColor, connectionOpacity, nodeBrightness, customMode]);
  
  const themes = Object.keys(THEME_VARIANTS);
  
  // Helper function to convert hex to rgb
  function hexToRgb(hex) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return [r, g, b];
  }
  
  // Calculate contrast ratio between two colors (simplified version)
  const calculateContrastRatio = (color1, color2) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    // Calculate relative luminance
    const luminance1 = calculateLuminance(rgb1);
    const luminance2 = calculateLuminance(rgb2);
    
    // Calculate contrast ratio
    const ratio = (Math.max(luminance1, luminance2) + 0.05) / 
                 (Math.min(luminance1, luminance2) + 0.05);
    
    return ratio.toFixed(2);
  };
  
  // Calculate luminance of RGB color
  const calculateLuminance = (rgb) => {
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  // Get WCAG compliance status based on contrast ratio
  const getContrastStatus = (ratio) => {
    if (ratio >= 7) return { status: 'Excellent', color: 'text-green-600' };
    if (ratio >= 4.5) return { status: 'Good (AA)', color: 'text-blue-600' };
    if (ratio >= 3) return { status: 'Fair (AA Large)', color: 'text-yellow-600' };
    return { status: 'Poor', color: 'text-red-600' };
  };
  
  const contrastRatio = calculateContrastRatio(
    customMode ? backgroundColor : THEME_VARIANTS[theme].background, 
    customMode ? nodeColor : THEME_VARIANTS[theme].nodeColor
  );
  
  const contrastStatus = getContrastStatus(contrastRatio);
  
  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (!customMode) return;
    
    // If switching to a preset theme, update custom colors to match
    const themeSettings = THEME_VARIANTS[newTheme];
    setBackgroundColor(themeSettings.background);
    setNodeColor(themeSettings.nodeColor);
  };
  
  // Toggle custom mode
  const toggleCustomMode = () => {
    const newMode = !customMode;
    setCustomMode(newMode);
    
    if (newMode) {
      // When enabling custom mode, initialize with current theme colors
      const themeSettings = THEME_VARIANTS[theme];
      setBackgroundColor(themeSettings.background);
      setNodeColor(themeSettings.nodeColor);
      setConnectionColor(themeSettings.nodeColor); // Initially set connection color same as node color
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <NodeNetworkWrapper 
          variant={VARIANTS.INTERACTIVE_DEMO}
          themeVariant={theme}
          height="400px"
          mouseInteractionRadius={interactionEnabled ? interactionRadius : 0}
          nodeCount={nodeCount}
          // Override theme when in custom mode
          customTheme={customMode ? customTheme : null}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Visualization Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Node Count: {nodeCount}
            </label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={nodeCount} 
              onChange={(e) => setNodeCount(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Theme
            </label>
            <select 
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="w-full p-2 border rounded"
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
            <label className="block text-sm font-medium mb-2">
              Interaction Radius: {interactionRadius}px
            </label>
            <input 
              type="range" 
              min="50" 
              max="300" 
              value={interactionRadius} 
              onChange={(e) => setInteractionRadius(parseInt(e.target.value))}
              className="w-full"
              disabled={!interactionEnabled}
            />
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="interaction-toggle"
              checked={interactionEnabled}
              onChange={() => setInteractionEnabled(!interactionEnabled)}
              className="mr-2"
            />
            <label htmlFor="interaction-toggle" className="text-sm font-medium">
              Enable Mouse/Touch Interaction
            </label>
          </div>
        </div>
        
        {/* Custom color controls section */}
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Custom Colors</h3>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="custom-toggle"
                checked={customMode}
                onChange={toggleCustomMode}
                className="mr-2"
              />
              <label htmlFor="custom-toggle" className="text-sm font-medium">
                Enable Custom Colors
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Background Color
              </label>
              <div className="flex items-center">
                <input 
                  type="color" 
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-10 mr-2"
                  disabled={!customMode}
                />
                <input 
                  type="text" 
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="p-2 border rounded flex-1"
                  disabled={!customMode}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Node Color
              </label>
              <div className="flex items-center">
                <input 
                  type="color" 
                  value={nodeColor}
                  onChange={(e) => setNodeColor(e.target.value)}
                  className="h-10 w-10 mr-2"
                  disabled={!customMode}
                />
                <input 
                  type="text" 
                  value={nodeColor}
                  onChange={(e) => setNodeColor(e.target.value)}
                  className="p-2 border rounded flex-1"
                  disabled={!customMode}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Connection Line Color
              </label>
              <div className="flex items-center">
                <input 
                  type="color" 
                  value={connectionColor}
                  onChange={(e) => setConnectionColor(e.target.value)}
                  className="h-10 w-10 mr-2"
                  disabled={!customMode}
                />
                <input 
                  type="text" 
                  value={connectionColor}
                  onChange={(e) => setConnectionColor(e.target.value)}
                  className="p-2 border rounded flex-1"
                  disabled={!customMode}
                />
                <button 
                  className="ml-2 p-2 text-xs bg-blue-100 text-blue-800 rounded"
                  onClick={() => setConnectionColor(nodeColor)}
                  disabled={!customMode}
                >
                  Match Node
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Connection Opacity: {connectionOpacity}%
              </label>
              <input 
                type="range" 
                min="5" 
                max="80" 
                value={connectionOpacity} 
                onChange={(e) => setConnectionOpacity(parseInt(e.target.value))}
                className="w-full"
                disabled={!customMode}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Node Brightness: {nodeBrightness}%
              </label>
              <input 
                type="range" 
                min="50" 
                max="100" 
                value={nodeBrightness} 
                onChange={(e) => setNodeBrightness(parseInt(e.target.value))}
                className="w-full"
                disabled={!customMode}
              />
            </div>
          </div>
          
          {/* Contrast indicator */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Contrast Ratio</h4>
                <div className="flex items-center mt-1">
                  <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: customMode ? backgroundColor : THEME_VARIANTS[theme].background }}></div>
                  <span className="mx-2">to</span>
                  <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: customMode ? nodeColor : THEME_VARIANTS[theme].nodeColor }}></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{contrastRatio}:1</div>
                <div className={`text-sm ${contrastStatus.color}`}>
                  {contrastStatus.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main demo component
const NodeNetworkDemo = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Interactive Node Network</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-64">
            <NodeNetworkWrapper 
              variant={VARIANTS.CARD} 
              themeVariant="default"
              height="100%"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-64">
            <NodeNetworkWrapper 
              variant={VARIANTS.CARD} 
              themeVariant="warm"
              height="100%"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-64">
            <NodeNetworkWrapper 
              variant={VARIANTS.CARD} 
              themeVariant="cool"
              height="100%"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-64">
            <NodeNetworkWrapper 
              variant={VARIANTS.CARD} 
              themeVariant="night"
              height="100%"
            />
          </div>
        </div>
        
        <div className="mb-12">
          <NodeNetworkWrapper 
            variant={VARIANTS.HERO}
            themeVariant="cool"
            height="60vh"
            contentOverlay={
              <div className="text-center p-8 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl text-white max-w-2xl">
                <h2 className="text-4xl font-bold mb-4">Interactive Network Visualization</h2>
                <p className="text-xl">A customizable, performant network visualization component with multiple implementation options and themes.</p>
              </div>
            }
          />
        </div>
        
        <NetworkVisualizationController />
      </div>
    </div>
  );
};

// Export the components with variants
NodeNetworkWrapper.VARIANTS = VARIANTS;

export default NodeNetworkDemo;
