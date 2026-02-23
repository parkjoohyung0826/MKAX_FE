export type CareerMode = 'basic' | 'senior';

export const toCareerMode = (value: string | null | undefined): CareerMode =>
  value === 'senior' ? 'senior' : 'basic';

export const resumeApiByMode = {
  basic: {
    activity: '/api/recommend/activity',
    certification: '/api/recommend/certification',
  },
  senior: {
    activity: '/api/recommend/senior-training',
    certification: '/api/recommend/senior-license-skill',
  },
} as const;

export const coverLetterApiByMode = {
  basic: {
    growthProcess: '/api/cover-letter/growth-process',
    strengthsAndWeaknesses: '/api/cover-letter/personality',
    keyExperience: '/api/cover-letter/career-strength',
    motivation: '/api/cover-letter/motivation-aspiration',
  },
  senior: {
    growthProcess: '/api/cover-letter/senior/career-summary',
    strengthsAndWeaknesses: '/api/cover-letter/senior/communication',
    keyExperience: '/api/cover-letter/senior/skills',
    motivation: '/api/cover-letter/senior/motivation',
  },
} as const;

