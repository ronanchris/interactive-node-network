import React, { useEffect, useRef, useState } from 'react';

// Main component implementation
const InteractiveNodeNetwork: React.FC<{
  nodeCount?: number;
  themeVariant?: string;
  mouseInteractionRadius?: number;
  height?: string;
  nodeSize?: number;
  customTheme?: {
    background: string;
    nodeColor: string | { from: string; to: string };
    connectionColor: string;
    pulseColor: string;
    nodeBrightness: number;
  } | null;
}> = ({ 
  nodeCount = 30, 
  themeVariant = 'default',
  mouseInteractionRadius = 200,
  height = '100%',
  nodeSize = 4,
  customTheme = null
}) => {
  // State and refs setup
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const nodesRef = useRef<Array<{
    x: number;
    y: number;
    radius: number;
    velocity: { x: number; y: number };
    phase: number;
    brightness: number;
  }>>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
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
    
    // Setup canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    // Get the actual dimensions of the container
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Set physical canvas size
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    
    // Set display size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // Store logical dimensions (pre-scaled)
    setDimensions({ width, height });
    
    // Determine actual node count based on screen size and device
    let actualNodeCount = nodeCount;
    if (isMobile) {
      actualNodeCount = Math.floor(nodeCount * 0.6);
    }
    
    // Create nodes with logical coordinates
    nodesRef.current = Array.from({ length: actualNodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: nodeSize + Math.random() * (nodeSize * 0.5),
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      },
      phase: Math.random() * Math.PI * 2,
      brightness: 0.8 + Math.random() * 0.2
    }));
    
    // Add event listeners
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      canvas.addEventListener('touchmove', handleTouchMove);
    }
    
    // Handle resize
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Update canvas dimensions
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Update stored dimensions
      setDimensions({ width, height });
      
      // Reposition nodes within new dimensions
      nodesRef.current = nodesRef.current.map(node => ({
        ...node,
        x: Math.min(node.x, width),
        y: Math.min(node.y, height)
      }));
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      } else {
        canvas.removeEventListener('touchmove', handleTouchMove);
      }
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [nodeCount, nodeSize]);
  
  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale mouse position by device pixel ratio
    setMousePosition({
      x: x * dpr,
      y: y * dpr
    });
  };
  
  // Handle touch movement
  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      
      // Scale touch position by device pixel ratio
      setMousePosition({
        x: x * dpr,
        y: y * dpr
      });
    }
  };
  
  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || nodesRef.current.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    const theme = customTheme || THEME_VARIANTS[themeVariant as keyof typeof THEME_VARIANTS] || THEME_VARIANTS.default;
    
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2);
      lastTime = currentTime;
      
      // Clear canvas with background
      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set up scaling for high DPI
      ctx.save();
      ctx.scale(dpr, dpr);
      
      // Draw connections
      ctx.lineWidth = 1;
      nodesRef.current.forEach((node1, i) => {
        nodesRef.current.slice(i + 1).forEach(node2 => {
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const opacity = 1 - distance / 150;
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = `rgba(77, 171, 245, ${opacity * 0.3})`;
            ctx.stroke();
          }
        });
      });
      
      // Update and draw nodes
      nodesRef.current = nodesRef.current.map(node => {
        const newNode = { ...node };
        
        // Apply velocity with increased movement
        newNode.x += newNode.velocity.x * deltaTime * 1.5;
        newNode.y += newNode.velocity.y * deltaTime * 1.5;
        
        // Mouse interaction - now attracting instead of repelling
        if (mousePosition.x !== null && mousePosition.y !== null) {
          const dx = mousePosition.x / dpr - newNode.x;
          const dy = mousePosition.y / dpr - newNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseInteractionRadius) {
            const force = (1 - distance / mouseInteractionRadius) * 0.015 * deltaTime;
            const angle = Math.atan2(dy, dx);
            newNode.velocity.x += Math.cos(angle) * force;
            newNode.velocity.y += Math.sin(angle) * force;
          }
        }
        
        // Reduced friction for more persistent movement
        newNode.velocity.x *= 0.995;
        newNode.velocity.y *= 0.995;
        
        // Add slight random movement
        newNode.velocity.x += (Math.random() - 0.5) * 0.02;
        newNode.velocity.y += (Math.random() - 0.5) * 0.02;
        
        // Bounce off edges with more energy preservation
        if (newNode.x <= 0 || newNode.x >= dimensions.width) {
          newNode.velocity.x *= -0.95;
          newNode.x = Math.max(0, Math.min(dimensions.width, newNode.x));
        }
        if (newNode.y <= 0 || newNode.y >= dimensions.height) {
          newNode.velocity.y *= -0.95;
          newNode.y = Math.max(0, Math.min(dimensions.height, newNode.y));
        }
        
        // Limit maximum velocity to prevent excessive speed
        const maxVelocity = 3;
        const currentVelocity = Math.sqrt(newNode.velocity.x * newNode.velocity.x + newNode.velocity.y * newNode.velocity.y);
        if (currentVelocity > maxVelocity) {
          const scale = maxVelocity / currentVelocity;
          newNode.velocity.x *= scale;
          newNode.velocity.y *= scale;
        }
        
        // Draw node with reduced pulse
        const pulse = Math.sin(currentTime * 0.002 + newNode.phase) * 0.1 + 0.9;
        const finalRadius = newNode.radius * pulse;
        
        ctx.beginPath();
        ctx.arc(newNode.x, newNode.y, finalRadius, 0, Math.PI * 2);
        
        if (typeof theme.nodeColor === 'object' && theme.nodeColor.from && theme.nodeColor.to) {
          const gradient = ctx.createRadialGradient(
            newNode.x, newNode.y, 0,
            newNode.x, newNode.y, finalRadius * 2
          );
          gradient.addColorStop(0, theme.nodeColor.from);
          gradient.addColorStop(1, theme.nodeColor.to);
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = typeof theme.nodeColor === 'string' ? theme.nodeColor : theme.nodeColor.from;
        }
        
        ctx.fill();
        
        // Reduced phase update speed from 0.08 to 0.04
        newNode.phase += 0.04 * deltaTime;
        
        return newNode;
      });
      
      // Reset transform
      ctx.restore();
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [dimensions, mousePosition, dpr, themeVariant, customTheme, mouseInteractionRadius]);
  
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