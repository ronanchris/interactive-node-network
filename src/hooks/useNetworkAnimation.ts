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
  cluster: number;  // Cluster identifier
  connections: number;  // Number of connections
  mass: number;  // Node mass affects force calculations
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
  strength: number;  // Connection strength affects attraction
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
  clusterForce?: number;  // Force of cluster attraction
  connectionStrength?: number;  // Base strength of connections
  repulsionForce?: number;  // Force of node repulsion
}

// Helper function to calculate force between nodes
const calculateForce = (distance: number, strength: number, minDist: number, maxDist: number): number => {
  if (distance < minDist) return -strength * 2;
  if (distance > maxDist) return 0;
  return strength * (1 - (distance - minDist) / (maxDist - minDist));
};

// Helper function to parse color into RGBA components
const parseColor = (color: string): { r: number; g: number; b: number } => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
  }
  
  // Handle rgb/rgba colors
  const rgbMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10)
    };
  }
  
  // Default fallback color (blue)
  return { r: 77, g: 171, b: 245 };
};

// Simple smooth easing function
const easeOutQuart = (x: number): number => {
  return 1 - Math.pow(1 - x, 4);
};

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

  // Initialize nodes with cluster properties
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    // Create initial clusters
    const clusterCount = Math.ceil(config.nodeCount / 5); // Average 5 nodes per cluster
    
    // Spread nodes out more initially
    nodesRef.current = Array.from({ length: config.nodeCount }, (_, i) => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      radius: config.nodeSize,
      velocity: {
        x: (Math.random() - 0.5) * config.nodeSpeed * 0.5, // Reduced initial velocity
        y: (Math.random() - 0.5) * config.nodeSpeed * 0.5
      },
      phase: Math.random() * Math.PI * 2,
      brightness: 0.8 + Math.random() * 0.2,
      opacity: 1,
      cluster: Math.floor(i / (config.nodeCount / clusterCount)),
      connections: 0,
      mass: 1 + Math.random() * 0.5
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
      ctx.setTransform(1, 0, 0, 1, 0, 0);  // Reset transform before clearing
      ctx.fillStyle = config.theme.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Scale for DPR and apply it only once
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // First, draw all connections
      connectionsRef.current = connectionsRef.current.filter(connection => {
        const fromNode = nodesRef.current[connection.fromNode];
        const toNode = nodesRef.current[connection.toNode];
        
        const elapsed = currentTime - connection.startTime;
        const rawProgress = Math.min(1, elapsed / connection.duration);
        
        // Apply simple smooth easing only during initial creation
        const progress = !connection.completed ? easeOutQuart(rawProgress) : 1;
        
        if (!connection.completed) {
          connection.progress = progress;
          if (rawProgress >= 1) {
            connection.completed = true;
            connection.opacity = 1;
          }
        }
        
        // Draw connection with straight line
        ctx.beginPath();
        ctx.lineWidth = config.lineThickness;
        
        // Base opacity calculation
        const baseOpacity = config.connectionOpacity / 100;
        
        // Parse theme color and create rgba
        const colorMatch = config.theme.connectionColor.match(/^#([A-Fa-f0-9]{6})$/);
        let r = 77, g = 171, b = 245; // Default fallback color
        
        if (colorMatch) {
          r = parseInt(colorMatch[1].substring(0, 2), 16);
          g = parseInt(colorMatch[1].substring(2, 4), 16);
          b = parseInt(colorMatch[1].substring(4, 6), 16);
        }
        
        // Set line style
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${baseOpacity})`;
        
        if (!connection.completed) {
          // Draw growing line with smooth easing
          const currentX = fromNode.x + (toNode.x - fromNode.x) * progress;
          const currentY = fromNode.y + (toNode.y - fromNode.y) * progress;
          
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(currentX, currentY);
        } else {
          // Draw complete line
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
        }
        
        ctx.stroke();
        
        return true;
      });

      // Then, update and draw all nodes on top
      nodesRef.current.forEach((node, i) => {
        // Calculate forces and update positions
        const forces = { x: 0, y: 0 };
        
        // Apply forces from connections
        connectionsRef.current.forEach(conn => {
          if (conn.fromNode === i || conn.toNode === i) {
            const otherNode = nodesRef.current[conn.fromNode === i ? conn.toNode : conn.fromNode];
            const dx = otherNode.x - node.x;
            const dy = otherNode.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Connection-based forces - maintain minimum distance
            const minDistance = config.nodeSize * 4; // Minimum distance between connected nodes
            const connectionForce = calculateForce(
              distance,
              (config.connectionStrength || 0.02) * conn.strength,
              minDistance,
              config.connectionDistance
            );
            
            forces.x += (dx / distance) * connectionForce;
            forces.y += (dy / distance) * connectionForce;
          }
        });
        
        // Cluster-based attraction
        nodesRef.current.forEach((otherNode, j) => {
          if (i !== j && node.cluster === otherNode.cluster) {
            const dx = otherNode.x - node.x;
            const dy = otherNode.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Cluster attraction
            const clusterForce = calculateForce(
              distance,
              config.clusterForce || 0.01,
              100,
              300
            );
            
            forces.x += (dx / distance) * clusterForce;
            forces.y += (dy / distance) * clusterForce;
            
            // Node repulsion (stronger within clusters)
            const repulsion = calculateForce(
              distance,
              config.repulsionForce || 0.03,
              0,
              100
            );
            
            forces.x -= (dx / distance) * repulsion;
            forces.y -= (dy / distance) * repulsion;
          }
        });
        
        // Mouse interaction
        if (mousePosition.x !== null && mousePosition.y !== null) {
          const dx = mousePosition.x - node.x;
          const dy = mousePosition.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < config.mouseRadius) {
            const force = (1 - distance / config.mouseRadius) * config.mouseForce;
            forces.x += (dx / distance) * force;
            forces.y += (dy / distance) * force;
          }
        }
        
        // Update velocity with forces
        node.velocity.x = node.velocity.x * 0.95 + forces.x / node.mass;
        node.velocity.y = node.velocity.y * 0.95 + forces.y / node.mass;
        
        // Update position
        node.x += node.velocity.x;
        node.y += node.velocity.y;
        
        // Bounce off walls with damping
        if (node.x <= 0 || node.x >= dimensions.width) {
          node.velocity.x *= -0.8;
          node.x = Math.max(0, Math.min(dimensions.width, node.x));
        }
        
        if (node.y <= 0 || node.y >= dimensions.height) {
          node.velocity.y *= -0.8;
          node.y = Math.max(0, Math.min(dimensions.height, node.y));
        }
        
        // Draw node with size based on connections
        const size = node.radius * (1 + node.connections * 0.1);
        const pulse = Math.sin(currentTime * config.nodePulseSpeed + node.phase) * config.nodePulseAmplitude + 0.8;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * pulse, 0, Math.PI * 2);
        const nodeColor = parseColor(config.theme.nodeColor);
        ctx.fillStyle = `rgba(${nodeColor.r}, ${nodeColor.g}, ${nodeColor.b}, 1)`;
        ctx.fill();
        
        // Update phase
        node.phase += 0.02;
      });

      // Create new connections preferring nodes in the same cluster
      if (currentTime - lastConnectionTime.current >= config.connectionInterval) {
        // Remove oldest connections if we're at capacity, but keep more active connections
        while (connectionsRef.current.length >= config.connectionCapacity) {
          // Remove a random connection to create more dynamic patterns
          const randomIndex = Math.floor(Math.random() * connectionsRef.current.length);
          connectionsRef.current.splice(randomIndex, 1);
        }

        // Create many more connections per interval
        const maxNewConnections = Math.min(20, config.connectionCapacity - connectionsRef.current.length);
        
        // Find ALL possible node pairs within distance
        const nodePairs = [];
        for (let i = 0; i < nodesRef.current.length; i++) {
          for (let j = i + 1; j < nodesRef.current.length; j++) {
            const fromNode = nodesRef.current[i];
            const toNode = nodesRef.current[j];
            const distance = Math.sqrt(
              Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2)
            );
            
            // Allow connections up to 3x the connection distance
            const maxDistance = config.connectionDistance * 3;
            
            if (distance < maxDistance) {
              // Simplified scoring to create more connections
              const distanceScore = 1 - (distance / maxDistance);
              nodePairs.push({ 
                i, 
                j, 
                score: distanceScore,
                distance,
                strength: 1
              });
            }
          }
        }
        
        // Randomly select from valid pairs to create more varied connections
        const selectedPairs = nodePairs
          .sort(() => Math.random() - 0.5) // Randomize order
          .slice(0, maxNewConnections);

        selectedPairs.forEach(({ i, j, strength }) => {
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
              duration: config.connectionDuration * (0.5 + Math.random() * 0.5), // Randomize duration
              opacity: 0.5 + Math.random() * 0.5, // Randomize opacity
              completed: false,
              strength
            });
          }
        });
        
        lastConnectionTime.current = currentTime;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [config, dimensions, mousePosition, dpr]);

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