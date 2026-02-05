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
  sentenceFeedback?: {
    resume?: Array<{
      title: string;
      deductionItems?: string[];
      before: string;
      deductionReason?: string;
      improvement?: string[];
      after?: string;
    }>;
    coverLetter?: Array<{
      title: string;
      deductionItems?: string[];
      before: string;
      deductionReason?: string;
      improvement?: string[];
      after?: string;
    }>;
    commonPatterns?: Array<{
      pattern: string;
      description: string;
    }>;
  };
  improvementGuide?: {
    gapSummary?: Array<{
      category: string;
      gap: string;
      description: string;
    }>;
    categoryGuides?: Array<{
      title: string;
      currentState?: string[];
      direction?: string[];
      examples?: string[];
    }>;
    roadmap?: Array<{
      week: string;
      title: string;
      tasks?: string[];
    }>;
    priorityStrategy?: Array<{
      priority: number;
      item: string;
      reason: string;
    }>;
  };
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
  resumeUrl?: string;
  coverLetterUrl?: string;
  analysisReportSourceType?: 'json' | 'pdf';
}

export type { JobPosting };
