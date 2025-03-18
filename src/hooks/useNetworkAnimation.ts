import { useRef, useState, useEffect } from 'react';
import { Theme } from '../constants/themes';

interface Node {
  x: number;
  y: number;
  radius: number;
  velocity: { x: number; y: number };
  phase: number;
  brightness: number;
  opacity: number;
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

interface AnimationConfig {
  nodeCount: number;
  nodeSize: number;
  connectionCapacity: number;
  connectionOpacity: number;
  lineThickness: number;
  theme: Theme;
  mouseRadius: number;
  mouseForce: number;
  nodeSpeed: number;
  nodePulseSpeed: number;
  nodePulseAmplitude: number;
  connectionDuration: number;
  connectionDistance: number;
  connectionInterval: number;
}

export const useNetworkAnimation = (config: AnimationConfig) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const lastConnectionTime = useRef<number>(0);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [dpr, setDpr] = useState(1);

  // Initialize canvas and handle resize
  useEffect(() => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    setDpr(devicePixelRatio);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      setDimensions({ width, height });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize nodes
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    nodesRef.current = Array.from({ length: config.nodeCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      radius: config.nodeSize,
      velocity: {
        x: (Math.random() - 0.5) * config.nodeSpeed,
        y: (Math.random() - 0.5) * config.nodeSpeed
      },
      phase: Math.random() * Math.PI * 2,
      brightness: 0.8 + Math.random() * 0.2,
      opacity: 1
    }));
    
    connectionsRef.current = [];
    lastConnectionTime.current = 0;
  }, [dimensions, config.nodeCount, config.nodeSize, config.nodeSpeed]);

  // Animation loop
  useEffect(() => {
    const animate = (currentTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.fillStyle = config.theme.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Scale for DPR
      ctx.scale(dpr, dpr);
      
      // Update and draw nodes
      nodesRef.current.forEach((node, index) => {
        // Update position
        node.x += node.velocity.x;
        node.y += node.velocity.y;
        
        // Mouse interaction
        if (mousePosition.x !== null && mousePosition.y !== null) {
          const dx = mousePosition.x - node.x;
          const dy = mousePosition.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < config.mouseRadius) {
            const force = (1 - distance / config.mouseRadius) * config.mouseForce;
            node.velocity.x += (dx / distance) * force;
            node.velocity.y += (dy / distance) * force;
          }
        }
        
        // Bounce off walls
        if (node.x <= 0 || node.x >= dimensions.width) {
          node.velocity.x *= -1;
          node.x = Math.max(0, Math.min(dimensions.width, node.x));
        }
        
        if (node.y <= 0 || node.y >= dimensions.height) {
          node.velocity.y *= -1;
          node.y = Math.max(0, Math.min(dimensions.height, node.y));
        }
        
        // Draw node with pulsing effect
        const pulse = Math.sin(currentTime * config.nodePulseSpeed + node.phase) * config.nodePulseAmplitude + 0.8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = config.theme.nodeColor;
        ctx.fill();
        
        // Update phase
        node.phase += 0.02;
      });
      
      // Create new connections
      if (currentTime - lastConnectionTime.current >= config.connectionInterval) {
        const maxNewConnections = Math.min(10, config.connectionCapacity - connectionsRef.current.length);
        
        // Find close node pairs
        const nodePairs = [];
        for (let i = 0; i < nodesRef.current.length; i++) {
          for (let j = i + 1; j < nodesRef.current.length; j++) {
            const fromNode = nodesRef.current[i];
            const toNode = nodesRef.current[j];
            const distance = Math.sqrt(
              Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2)
            );
            
            if (distance < config.connectionDistance) {
              nodePairs.push({ i, j, distance });
            }
          }
        }
        
        // Create connections for closest pairs
        nodePairs
          .sort((a, b) => a.distance - b.distance)
          .slice(0, maxNewConnections)
          .forEach(({ i, j }) => {
            if (connectionsRef.current.length < config.connectionCapacity) {
              const exists = connectionsRef.current.some(
                conn => (conn.fromNode === i && conn.toNode === j) ||
                       (conn.fromNode === j && conn.toNode === i)
              );
              
              if (!exists) {
                connectionsRef.current.push({
                  fromNode: i,
                  toNode: j,
                  progress: 0,
                  active: true,
                  startTime: currentTime,
                  duration: config.connectionDuration,
                  opacity: 1,
                  completed: false
                });
              }
            }
          });
        
        lastConnectionTime.current = currentTime;
      }
      
      // Update and draw connections
      connectionsRef.current = connectionsRef.current.filter(connection => {
        const fromNode = nodesRef.current[connection.fromNode];
        const toNode = nodesRef.current[connection.toNode];
        
        const elapsed = currentTime - connection.startTime;
        const progress = Math.min(1, elapsed / connection.duration);
        
        if (!connection.completed) {
          connection.progress = progress;
          if (progress >= 1) {
            connection.completed = true;
            connection.opacity = 0.3;
          }
        }
        
        // Draw connection
        ctx.beginPath();
        ctx.lineWidth = config.lineThickness;
        
        const baseOpacity = Math.max(0.1, Math.min(1, config.connectionOpacity / 50));
        const finalOpacity = baseOpacity * (connection.completed ? 0.5 : 1);
        ctx.strokeStyle = `rgba(77, 171, 245, ${finalOpacity})`;
        
        if (!connection.completed) {
          const currentX = fromNode.x + (toNode.x - fromNode.x) * connection.progress;
          const currentY = fromNode.y + (toNode.y - fromNode.y) * connection.progress;
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(currentX, currentY);
        } else {
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
        }
        
        ctx.stroke();
        
        return connection.active || connection.completed;
      });
      
      // Maintain connection capacity
      while (connectionsRef.current.length > config.connectionCapacity) {
        const oldestCompletedIndex = connectionsRef.current.findIndex(c => c.completed);
        if (oldestCompletedIndex !== -1) {
          connectionsRef.current.splice(oldestCompletedIndex, 1);
        } else {
          break;
        }
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [dimensions, dpr, config]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: null, y: null });
  };

  return {
    canvasRef,
    handleMouseMove,
    handleMouseLeave
  };
}; 