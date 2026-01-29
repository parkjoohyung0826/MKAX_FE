import { ResumeData } from '@/features/resume/types';
import { JobPosting } from './job';

export interface ResultData {
  aiCoverLetter: string;
  aiResumeSummary: string;
  jobPostings: JobPosting[];
  resumeData: ResumeData;
  accessCode?: string;
}

export type { JobPosting };
