export const THEME_VARIANTS = {
  default: {
    background: '#0a1929',
    nodeColor: '#4dabf5',
    connectionColor: '#4dabf5',
    pulseColor: 'rgba(77, 171, 245, 0.5)',
    nodeBrightness: 1.0
  },
  warm: {
    background: '#271a10',
    nodeColor: '#ffb74d',
    connectionColor: '#ffb74d',
    pulseColor: 'rgba(255, 183, 77, 0.5)',
    nodeBrightness: 1.0
  },
  cool: {
    background: '#092a2e',
    nodeColor: '#4dd0e1',
    connectionColor: '#4dd0e1',
    pulseColor: 'rgba(77, 208, 225, 0.5)',
    nodeBrightness: 1.0
  },
  night: {
    background: '#0d0a29',
    nodeColor: '#b39ddb',
    connectionColor: '#b39ddb',
    pulseColor: 'rgba(179, 157, 219, 0.5)',
    nodeBrightness: 1.0
  },
  highContrast: {
    background: '#000000',
    nodeColor: '#ffffff',
    connectionColor: '#ffffff',
    pulseColor: 'rgba(255, 255, 255, 0.5)',
    nodeBrightness: 1.0
  },
  neon: {
    background: '#0a0a0a',
    nodeColor: '#39ff14',
    connectionColor: '#39ff14',
    pulseColor: 'rgba(57, 255, 20, 0.5)',
    nodeBrightness: 1.0
  }
} as const;

export type ThemeVariant = keyof typeof THEME_VARIANTS;

export interface Theme {
  background: string;
  nodeColor: string;
  connectionColor: string;
  pulseColor: string;
  nodeBrightness: number;
} 