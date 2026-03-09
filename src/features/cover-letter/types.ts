export interface CoverLetterData {
  growthProcess: string;
  growthProcessSummary?: string;
  strengthsAndWeaknesses: string;
  strengthsAndWeaknessesSummary?: string;
  keyExperience: string;
  keyExperienceSummary?: string;
  motivation: string;
  motivationSummary?: string;
}

export type CoverLetterTemplateId = 'classic' | 'modern';
export type CoverLetterCareerType = 'basic' | 'senior';
export type CoverLetterQuestionMode = 'default' | 'company';

export type CompanyQuestionAssistantId = 'balanced' | 'story' | 'impact' | 'concise';

export interface CompanyCoverLetterQuestion {
  id: string;
  question: string;
  answer: string;
  assistantId: CompanyQuestionAssistantId;
  hasCharacterLimit: boolean;
  characterLimit: number | null;
}
