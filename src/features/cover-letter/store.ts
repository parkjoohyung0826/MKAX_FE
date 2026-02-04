import { create } from 'zustand';
import { CoverLetterData, CoverLetterTemplateId } from './types';

interface CoverLetterState {
  coverLetterData: CoverLetterData;
  setCoverLetterData: (data: Partial<CoverLetterData>) => void;
  resetCoverLetterData: () => void;
  selectedTemplate: CoverLetterTemplateId;
  setSelectedTemplate: (template: CoverLetterTemplateId) => void;
}

const initialState: CoverLetterData = {
  growthProcess: '',
  growthProcessSummary: '',
  strengthsAndWeaknesses: '',
  strengthsAndWeaknessesSummary: '',
  keyExperience: '',
  keyExperienceSummary: '',
  motivation: '',
  motivationSummary: '',
};

const defaultTemplate: CoverLetterTemplateId = 'classic';

export const useCoverLetterStore = create<CoverLetterState>((set) => ({
  coverLetterData: initialState,
  setCoverLetterData: (data) =>
    set((state) => ({
      coverLetterData: { ...state.coverLetterData, ...data },
    })),
  selectedTemplate: defaultTemplate,
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  resetCoverLetterData: () => set({ coverLetterData: initialState, selectedTemplate: defaultTemplate }),
}));
