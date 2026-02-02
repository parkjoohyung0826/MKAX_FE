import { ResumeData } from '@/features/resume/types';
import { JobPosting } from './job';

export interface AnalysisReportScoreDetail {
  category: string;
  score: string;
  reason?: string;
}

export interface AnalysisReport {
  totalScore?: number | string;
  totalScoreText?: string;
  summary?: string;
  overallEvaluation?: string | string[];
  strengths?: string[];
  improvements?: string[];
  scoreDetails?: AnalysisReportScoreDetail[];
  scoreItems?: AnalysisReportScoreDetail[];
  scores?: AnalysisReportScoreDetail[];
  scoreBreakdown?: Array<{
    item: string;
    score: number;
    maxScore?: number;
    scoreText?: string;
    deductionReason?: string;
  }>;
  scoreBreakdownTotal?: { score?: number; maxScore?: number; scoreText?: string };
  oneLineSummary?: string;
  evaluation?: string | string[];
  overallDescription?: string;
}

export interface ResultData {
  aiCoverLetter: string;
  aiResumeSummary: string;
  jobPostings: JobPosting[];
  resumeData: ResumeData;
  accessCode?: string;
  analysisReport?: AnalysisReport | null;
}

export type { JobPosting };
