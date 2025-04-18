export interface CodeBlock {
  id: string;
  type: string;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters?: Record<string, any>;
  position?: { x: number; y: number };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  blocks: CodeBlock[];
}

export interface WorkspaceState {
  blocks: CodeBlock[];
  selectedBlock: string | null;
  isRunning: boolean;
}

export interface CharacterState {
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  isMoving: boolean;
}
