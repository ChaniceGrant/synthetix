export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    headingFontFamily: string;
    baseFontSize: string;
    borderRadius: string;
  };
  visuals: {
    shadow: string;
    vibe: 'minimal' | 'playful' | 'brutalism' | 'corporate' | 'futuristic';
    animationSpeed: number;
  };
  threeJs: {
    geometry: 'box' | 'sphere' | 'torus' | 'icosahedron';
    material: 'standard' | 'physical' | 'normal';
    complexity: number;
  };
}

export const defaultTokens: DesignTokens = {
  colors: {
    primary: '#3b82f6',
    secondary: '#1e293b',
    accent: '#f59e0b',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    border: '#e2e8f0',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    headingFontFamily: 'Inter, sans-serif',
    baseFontSize: '16px',
    borderRadius: '0.5rem',
  },
  visuals: {
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    vibe: 'minimal',
    animationSpeed: 1,
  },
  threeJs: {
    geometry: 'box',
    material: 'standard',
    complexity: 5,
  },
};
