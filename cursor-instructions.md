# Setting Up Interactive Node Network in Cursor.ai

This guide provides detailed instructions for implementing the Interactive Node Network visualization component in Cursor.ai, designed specifically for design professionals with limited coding experience.

## Dealing with Terminal Permission Issues

Cursor.ai can help with common terminal permission issues, but here are some specific solutions you might need:

### For Mac/Linux Users:
- If npm gives permission errors, you can ask Cursor: "I'm getting permission errors with npm, can you help me fix them?"
- Cursor will likely suggest:
  ```
  sudo npm install
  ```
  Or a more permanent fix:
  ```
  sudo chown -R $(whoami) ~/.npm
  sudo chown -R $(whoami) /usr/local/lib/node_modules
  ```

### For Windows Users:
- For Windows permission issues, ask: "How do I fix npm permission issues on Windows?"
- Cursor will likely suggest:
  - Running the terminal as Administrator
  - Checking User Account Control settings
  - Using a different installation directory with the `--prefix` flag

### For Any Platform:
If you encounter permission issues that Cursor can't resolve directly, you can:
1. Ask Cursor to generate a detailed error analysis
2. Ask for alternative approaches (like using a local installation instead of global)
3. Request a step-by-step troubleshooting guide specific to your error message

## Project Setup Instructions

### 1. Initial Project Creation

**First Prompt to Cursor:**
```
I'd like to create a new project for an interactive node network visualization. Please set up a React project with Vite.
```

*Expected Actions:* Cursor will create the necessary commands to initialize a new Vite project with React template.

**If You Encounter Permission Issues:**
```
I'm seeing permission errors with npm. Can you help me fix them?
```

*Expected Actions:* Cursor will suggest solutions like:
- Using `sudo` (on Mac/Linux) with the commands
- Recommending proper npm permissions settings
- Suggesting running terminal as administrator (on Windows)

### 2. Project Structure Setup

**Prompt to Cursor:**
```
Create a proper file structure for my React project with a components folder for the node network visualization.
```

*Expected Actions:* Cursor will create/modify:
- `src/components` directory
- Other necessary project directories

### 3. Component Implementation

**Prompt to Cursor:**
```
Create a new file called InteractiveNodeNetwork.jsx in the components folder. I'll share the code for implementation in a moment.
```

*Paste the InteractiveNodeNetwork code here when asked*

**Follow-up Prompt:**
```
Now create a NodeNetworkWrapper.jsx file that will serve as a flexible wrapper for different UI contexts.
```

*Paste the NodeNetworkWrapper code when asked*

**Final Component Prompt:**
```
Finally, create a NetworkVisualizationController.jsx file for the control panel component.
```

*Paste the NetworkVisualizationController code when asked*

### 4. Installing Dependencies

**Prompt to Cursor:**
```
What dependencies do I need for this project? Please install all necessary packages.
```

*Expected Actions:* Cursor should identify and install:
- React and React DOM (already included in Vite template)
- Any other dependencies it identifies in the code

### 5. Main App Implementation

**Prompt to Cursor:**
```
Now modify App.jsx to implement our node network visualization with the controller.
```

*Expected Actions:* Cursor will update the main App component to include the visualization.

### 6. Running the Project

**Prompt to Cursor:**
```
How do I start the development server to see my visualization?
```

*Expected Actions:* Cursor will provide the command (`npm run dev`) and might execute it for you.

## Basic Customization Examples

Here are some examples of how you can ask Cursor.ai to make specific adjustments to the visualization:

### Changing the Card Layout

**Prompt to Cursor:**
```
I'd like to change the 2x2 grid of cards to a single row of 4 cards that are smaller. Can you help me modify that?
```

### Adding a New Theme

**Prompt to Cursor:**
```
I want to add a new theme called "Ocean" with a deep blue background (#051e3e) and light teal nodes (#25b0bc). How would I do that?
```

### Changing Animation Speed

**Prompt to Cursor:**
```
The node animation seems too fast. Can you help me slow down their movement and pulsing effect?
```

### Using as a Background

**Prompt to Cursor:**
```
I'd like to use the visualization as a subtle background for my entire website. How can I implement that?
```

## Troubleshooting Common Issues

### CSS/Styling Issues

**Prompt to Cursor:**
```
The styling doesn't look right. How can I make sure the visualization fills the entire container?
```

*Expected Actions:* Cursor will suggest CSS fixes for proper sizing.

### Performance Problems

**Prompt to Cursor:**
```
The animation seems slow on my device. How can I optimize it for better performance?
```

*Expected Actions:* Cursor will suggest performance optimizations like reducing node count or optimizing the render loop.

### Responsive Design

**Prompt to Cursor:**
```
How do I make this visualization work well on mobile devices?
```

*Expected Actions:* Cursor will suggest responsive design approaches.

## Component Customization

### Changing Colors

**Prompt to Cursor:**
```
I want to create a custom theme with specific colors. How do I do that?
```

*Expected Actions:* Cursor will show how to modify the existing themes or create a new custom theme.

### Layout Adjustments

**Prompt to Cursor:**
```
I want to use this in a hero section with text overlay. How should I implement that?
```

*Expected Actions:* Cursor will show how to use the HERO variant of the NodeNetworkWrapper.

## Complete Component Code

Below is the reference code structure for your Interactive Node Network. You can share these with Cursor.ai when it asks for the implementation:

### InteractiveNodeNetwork.jsx

```jsx
import React, { useEffect, useRef, useState } from 'react';

// Main component implementation
const InteractiveNodeNetwork = ({ 
  nodeCount = 30, 
  themeVariant = 'default',
  mouseInteractionRadius = 200,
  height = '100%',
  customTheme = null
}) => {
  // State and refs setup
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  const [isTouch, setIsTouch] = useState(false);
  const [dpr, setDpr] = useState(1);
  
  // Theme definitions
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

export default InteractiveNodeNetwork;
```

### NodeNetworkWrapper.jsx

```jsx
import React from 'react';
import InteractiveNodeNetwork from './InteractiveNodeNetwork';

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

// Export the component with variants
NodeNetworkWrapper.VARIANTS = VARIANTS;

export default NodeNetworkWrapper;
```

### NetworkVisualizationController.jsx

```jsx
import React, { useState, useEffect } from 'react';
import NodeNetworkWrapper from './NodeNetworkWrapper';

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
  
  const themes = ['default', 'warm', 'cool', 'night', 'highContrast', 'neon'];
  
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
    customMode ? backgroundColor : '#0a1929', // Default background 
    customMode ? nodeColor : '#4dabf5' // Default node color
  );
  
  const contrastStatus = getContrastStatus(contrastRatio);
  
  // Handle theme change
  const handleThemeChange = (newTheme) => {
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
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <NodeNetworkWrapper 
          variant={NodeNetworkWrapper.VARIANTS.INTERACTIVE_DEMO}
          themeVariant={theme}
          height="400px"
          mouseInteractionRadius={interactionEnabled ? interactionRadius : 0}
          nodeCount={nodeCount}
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
                  <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: customMode ? backgroundColor : '#0a1929' }}></div>
                  <span className="mx-2">to</span>
                  <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: customMode ? nodeColor : '#4dabf5' }}></div>
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