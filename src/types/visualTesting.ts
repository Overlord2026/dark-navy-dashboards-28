
export interface VisualSnapshot {
  id: string;
  name: string;
  timestamp: number; // Unix timestamp
  imageUrl: string;
  pageUrl: string;
  viewport: {
    width: number;
    height: number;
    deviceType: 'mobile' | 'tablet' | 'desktop';
  };
  metadata?: Record<string, any>;
}

export interface VisualComparisonResult {
  id: string;
  baselineId: string;
  currentId: string;
  timestamp: number;
  pageUrl: string;
  diffImageUrl?: string;
  misMatchPercentage: number;
  passed: boolean;
  viewport: {
    width: number;
    height: number;
    deviceType: 'mobile' | 'tablet' | 'desktop';
  };
  annotations?: VisualAnnotation[];
}

export interface VisualAnnotation {
  id: string;
  type: 'difference' | 'note' | 'expected';
  x: number;
  y: number;
  width: number;
  height: number;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface VisualTestConfig {
  threshold: number; // Percentage difference allowed (0-100)
  ignoreAreas?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  pages: {
    url: string;
    name: string;
    viewports: {
      width: number;
      height: number;
      deviceType: 'mobile' | 'tablet' | 'desktop';
    }[];
    elements?: string[]; // Optional specific elements to capture
  }[];
}
