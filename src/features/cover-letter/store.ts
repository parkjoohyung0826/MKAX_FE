import { create } from 'zustand';
import { CoverLetterCareerType, CoverLetterData, CoverLetterTemplateId } from './types';

interface CoverLetterState {
  coverLetterData: CoverLetterData;
  setCoverLetterData: (data: Partial<CoverLetterData>) => void;
  resetCoverLetterData: () => void;
  selectedTemplate: CoverLetterTemplateId | null;
  setSelectedTemplate: (template: CoverLetterTemplateId) => void;
  selectedCareerType: CoverLetterCareerType | null;
  setSelectedCareerType: (careerType: CoverLetterCareerType) => void;
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

const defaultTemplate: CoverLetterTemplateId | null = null;

export const useCoverLetterStore = create<CoverLetterState>((set) => ({
  coverLetterData: initialState,
  setCoverLetterData: (data) =>
    set((state) => ({
      coverLetterData: { ...state.coverLetterData, ...data },
    })),
  selectedTemplate: defaultTemplate,
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  selectedCareerType: null,
  setSelectedCareerType: (careerType) => set({ selectedCareerType: careerType }),
  resetCoverLetterData: () => set({
    coverLetterData: initialState,
    selectedTemplate: defaultTemplate,
    selectedCareerType: null,
  }),
}));
