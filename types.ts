export enum ItemType {
  TASK = 'TASK',
  DECISION = 'DECISION',
  KNOWLEDGE = 'KNOWLEDGE',
}

export enum Urgency {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface DecisionOption {
  name: string;
  pros: string[];
  cons: string[];
}

export interface MindItem {
  id: string;
  originalInput: string;
  type: ItemType;
  title: string;
  summary: string;
  createdAt: number;
  urgency: Urgency;
  // Specific fields based on type
  decisionOptions?: DecisionOption[];
  tags?: string[];
  completed?: boolean;
}

export interface TriageResult {
  type: ItemType;
  title: string;
  summary: string;
  urgency: Urgency;
  decisionOptions?: DecisionOption[];
  tags?: string[];
}

export type ViewState = 'FOCUS' | 'CAPTURE' | 'DECISIONS' | 'KNOWLEDGE' | 'TASKS';