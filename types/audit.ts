// types/audit.ts

export type RobotsStatus = 'PASSED' | 'BLOCKED' | 'NOT_FOUND';

export interface AuditResponse {
  success: boolean;
  id?: string;
  url: string;
  pageTitle: string;
  hasProductSchema: boolean;
  robotsStatus: RobotsStatus;
  blockedBots: string[];
  aiScore: number;
  weaknesses: string[];
  rewrittenDescription: string;
  reasoning: string;
  createdAt?: string;
}

export interface AuditRequest {
  url: string;
}

export interface ApiError {
  error: string;
  details?: string;
}
