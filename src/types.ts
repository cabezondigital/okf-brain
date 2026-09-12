export interface OKFNodeMetadata {
  id: string;
  title: string;
  category: string;
  tags?: string[];
  created?: string;
  updated?: string;
  isRoot?: boolean;
  priority?: string;
  status?: string;
  source?: string;
  [key: string]: any;
}

export interface GraphNode {
  id: string;
  label: string;
  group: string;
  color?: string;
  size?: number;
  isRoot?: boolean;
  filePath?: string;
  metadata?: OKFNodeMetadata;
  content?: string;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  solarOrbit?: {
    radius: number;
    rx: number;
    rz: number;
    currentAngle: number;
    orbitSpeed: number;
  };
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  isStructural?: boolean;
  label?: string;
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface OKFConfig {
  vaultPath: string;
  projectName: string;
  domain: string;
  categories: Array<{
    id: string;
    label: string;
    description: string;
    color: string;
  }>;
  connectedApps: string[];
  aiAssistants: string[];
  autoLearn: {
    enabled: boolean;
    logsPath: string;
    schedule: string;
  };
}

export interface OnboardingAnswers {
  projectName: string;
  vaultPath: string;
  domain: 'assistant' | 'software' | 'business' | 'research' | 'custom';
  categories: string[];
  connectedApps: string[];
  aiAssistants: string[];
  enableDailyLearning: boolean;
  logsPath: string;
}
