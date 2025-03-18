// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';

// Helper function to adjust color opacity
const adjustColorOpacity = (color: string, opacity: number) => {
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/g, `${opacity})`);
  }
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

interface Props {
  variant: 'interactive-demo' | 'background';
  nodeCount?: number;
  themeVariant?: string;
  mouseInteractionRadius?: number;
  height?: string;
  nodeSize?: number;
  customTheme?: {
    background: string;
    nodeColor: string;
    connectionColor: string | { from: string; to: string };
    pulseColor: string;
    nodeBrightness: number;
  } | null;
  connectionCapacity?: number;
  connectionOpacity?: number;
  lineThickness?: number;
  enableGradient?: boolean;
  gradientStart?: string;
  gradientEnd?: string;
}

interface Connection {
  fromNode: number;
  toNode: number;
  progress: number;
  active: boolean;
  startTime: number;
  duration: number;
  opacity: number;
  completed: boolean;
}

// Main component implementation
const InteractiveNodeNetwork: React.FC<Props> = ({
  variant,
  nodeCount = 30,
  themeVariant = 'default',
  mouseInteractionRadius = 200,
  height = '100%',
  nodeSize = 4,
  customTheme = null,
  connectionCapacity = 300,
  connectionOpacity = 20,
  lineThickness = 1,
  enableGradient = false,
  gradientStart = '',
  gradientEnd = ''
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
    opacity: number;
    startDelay: number;
  }>>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [dpr, setDpr] = useState(1);
  
  // Add connectionsRef to track active connections
  const connectionsRef = useRef<Connection[]>([]);
  const lastConnectionTime = useRef<number>(0);

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
    
    // Get device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;
    setDpr(devicePixelRatio);
    
    // Setup canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;

    // Initialize with a small delay to ensure container is properly sized
    const initializeNetwork = () => {
      // Get the actual dimensions of the container
      const rect = container.getBoundingClientRect();
      const width = rect.width || container.clientWidth;
      const height = rect.height || container.clientHeight;
      
      // Only proceed if we have valid dimensions
      if (width === 0 || height === 0) {
        // Try again in a few ms if dimensions aren't ready
        setTimeout(initializeNetwork, 50);
        return;
      }
      
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

      // Create nodes with truly random positions across the entire screen
      const newNodes = [];
      for (let i = 0; i < actualNodeCount; i++) {
        // Divide the screen into regions and place nodes in different regions
        const region = i % 9; // Create 9 regions (3x3 grid)
        const regionX = region % 3;
        const regionY = Math.floor(region / 3);
        
        // Calculate position within the region
        const x = (regionX * (width / 3)) + (Math.random() * (width / 3));
        const y = (regionY * (height / 3)) + (Math.random() * (height / 3));
        
        // Random velocity in any direction
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 0.8;
        
        newNodes.push({
          x,
          y,
          radius: nodeSize + Math.random() * (nodeSize * 0.5),
          velocity: {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
          },
          phase: Math.random() * Math.PI * 2,
          brightness: 0.8 + Math.random() * 0.2
        });
      }
      
      // Shuffle the nodes array to prevent pattern recognition
      for (let i = newNodes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newNodes[i], newNodes[j]] = [newNodes[j], newNodes[i]];
      }
      
      nodesRef.current = newNodes;
    };

    // Start initialization
    initializeNetwork();
    
    // Add event listeners
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      canvas.addEventListener('touchmove', handleTouchMove);
    }
    
    // Handle resize
    const handleResize = () => {
      if (!canvas || !container) return;
      initializeNetwork(); // Reinitialize on resize
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      } else if (canvas) {
        canvas.removeEventListener('touchmove', handleTouchMove);
      }
      window.removeEventListener('resize', handleResize);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [nodeCount, nodeSize, dimensions.width, dimensions.height]);
  
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
  
  // Easing function for smooth animations
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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

      // Create new connections
      if (currentTime - lastConnectionTime.current > 100) {
        const nodes = nodesRef.current;
        if (nodes.length > 1) {
          // Remove excess connections if we're over capacity
          if (connectionsRef.current.length > connectionCapacity) {
            const excess = connectionsRef.current.length - connectionCapacity;
            const completedConnections = connectionsRef.current.filter(conn => conn.completed);
            if (completedConnections.length > 0) {
              completedConnections
                .sort((a, b) => a.startTime - b.startTime)
                .slice(0, excess)
                .forEach(conn => {
                  connectionsRef.current = connectionsRef.current.filter(c => c !== conn);
                });
            }
          }

          // Create new connections if under capacity
          if (connectionsRef.current.length < connectionCapacity) {
            // Find nodes that are close enough to connect
            for (let i = 0; i < nodes.length; i++) {
              for (let j = i + 1; j < nodes.length; j++) {
                if (connectionsRef.current.length >= connectionCapacity) break;
                
                const node1 = nodes[i];
                const node2 = nodes[j];
                
                // Check distance between nodes
                const dx = node2.x - node1.x;
                const dy = node2.y - node1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only connect nodes within reasonable distance
                if (distance < 150) {
                  // Check if connection already exists
                  const connectionExists = connectionsRef.current.some(
                    conn => (conn.fromNode === i && conn.toNode === j) ||
                           (conn.fromNode === j && conn.toNode === i)
                  );

                  if (!connectionExists) {
                    connectionsRef.current.push({
                      fromNode: i,
                      toNode: j,
                      progress: 0,
                      active: true,
                      startTime: currentTime,
                      duration: 800,
                      opacity: 0,
                      completed: false
                    });
                  }
                }
              }
            }
          }
          lastConnectionTime.current = currentTime;
        }
      }

      // Draw all connections with consistent style
      ctx.lineWidth = lineThickness * 2; // Double the line thickness for better visibility
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // First draw completed connections
      connectionsRef.current.filter(conn => !conn.active).forEach(conn => {
        const fromNode = nodesRef.current[conn.fromNode];
        const toNode = nodesRef.current[conn.toNode];

        const baseOpacity = connectionOpacity / 100;
        const finalOpacity = Math.max(0.1, Math.min(1, baseOpacity * 2)); // Ensure minimum visibility

        if (enableGradient && gradientStart && gradientEnd) {
          const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
          gradient.addColorStop(0, adjustColorOpacity(gradientStart, finalOpacity));
          gradient.addColorStop(1, adjustColorOpacity(gradientEnd, finalOpacity));
          ctx.strokeStyle = gradient;
        } else {
          const baseColor = typeof theme.connectionColor === 'string' ? theme.connectionColor : theme.connectionColor.from;
          ctx.strokeStyle = adjustColorOpacity(baseColor, finalOpacity);
        }

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      });

      // Then draw active connections
      connectionsRef.current.filter(conn => conn.active).forEach(conn => {
        const fromNode = nodesRef.current[conn.fromNode];
        const toNode = nodesRef.current[conn.toNode];

        const elapsed = currentTime - conn.startTime;
        const progress = Math.min(1, elapsed / conn.duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = fromNode.x + (toNode.x - fromNode.x) * easedProgress;
        const currentY = fromNode.y + (toNode.y - fromNode.y) * easedProgress;

        const baseOpacity = connectionOpacity / 100;
        const animationOpacity = easedProgress;
        const finalOpacity = Math.max(0.1, Math.min(1, baseOpacity * 2 * animationOpacity));

        if (enableGradient && gradientStart && gradientEnd) {
          const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, currentX, currentY);
          gradient.addColorStop(0, adjustColorOpacity(gradientStart, finalOpacity));
          gradient.addColorStop(1, adjustColorOpacity(gradientEnd, finalOpacity));
          ctx.strokeStyle = gradient;
        } else {
          const baseColor = typeof theme.connectionColor === 'string' ? theme.connectionColor : theme.connectionColor.from;
          ctx.strokeStyle = adjustColorOpacity(baseColor, finalOpacity);
        }

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        if (progress >= 1) {
          conn.active = false;
          conn.completed = true;
        }
      });

      // Update and draw nodes
      nodesRef.current = nodesRef.current.map(node => {
        const newNode = { ...node };
        
        // Apply velocity with increased movement
        newNode.x += newNode.velocity.x * deltaTime;
        newNode.y += newNode.velocity.y * deltaTime;
        
        // Mouse interaction
        if (mousePosition.x !== null && mousePosition.y !== null) {
          const dx = mousePosition.x / dpr - newNode.x;
          const dy = mousePosition.y / dpr - newNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseInteractionRadius) {
            const force = (1 - distance / mouseInteractionRadius) * 0.02 * deltaTime;
            const angle = Math.atan2(dy, dx);
            newNode.velocity.x += Math.cos(angle) * force;
            newNode.velocity.y += Math.sin(angle) * force;
          }
        }
        
        // Add slight random movement for more natural flow
        newNode.velocity.x += (Math.random() - 0.5) * 0.1;
        newNode.velocity.y += (Math.random() - 0.5) * 0.1;
        
        // Apply friction
        newNode.velocity.x *= 0.99;
        newNode.velocity.y *= 0.99;
        
        // Bounce off edges
        if (newNode.x < 0 || newNode.x > dimensions.width) {
          newNode.velocity.x *= -1;
          newNode.x = Math.max(0, Math.min(dimensions.width, newNode.x));
        }
        if (newNode.y < 0 || newNode.y > dimensions.height) {
          newNode.velocity.y *= -1;
          newNode.y = Math.max(0, Math.min(dimensions.height, newNode.y));
        }
        
        // Draw node with solid color
        const pulse = Math.sin(currentTime * 0.002 + newNode.phase) * 0.1 + 0.9;
        const finalRadius = newNode.radius * pulse;
        
        ctx.beginPath();
        ctx.arc(newNode.x, newNode.y, finalRadius, 0, Math.PI * 2);
        
        // Use solid color for nodes
        ctx.fillStyle = typeof theme.nodeColor === 'string' ? theme.nodeColor : theme.nodeColor.from;
        ctx.fill();
        
        // Update phase
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
  }, [dimensions, mousePosition, dpr, themeVariant, customTheme, mouseInteractionRadius, enableGradient, gradientStart, gradientEnd, connectionOpacity, connectionCapacity, lineThickness]);
  
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