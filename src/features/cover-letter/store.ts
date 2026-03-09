import { create } from 'zustand';
import {
  CompanyCoverLetterQuestion,
  CompanyQuestionAssistantId,
  CoverLetterCareerType,
  CoverLetterData,
  CoverLetterQuestionMode,
  CoverLetterTemplateId,
} from './types';

interface CoverLetterState {
  coverLetterData: CoverLetterData;
  setCoverLetterData: (data: Partial<CoverLetterData>) => void;
  resetCoverLetterData: () => void;
  selectedTemplate: CoverLetterTemplateId | null;
  setSelectedTemplate: (template: CoverLetterTemplateId) => void;
  selectedCareerType: CoverLetterCareerType | null;
  setSelectedCareerType: (careerType: CoverLetterCareerType) => void;
  selectedQuestionMode: CoverLetterQuestionMode | null;
  setSelectedQuestionMode: (mode: CoverLetterQuestionMode | null) => void;
  companyQuestions: CompanyCoverLetterQuestion[];
  setCompanyQuestions: (questions: CompanyCoverLetterQuestion[]) => void;
  setCompanyQuestionAnswer: (id: string, answer: string) => void;
  setCompanyQuestionAssistant: (id: string, assistantId: CompanyQuestionAssistantId) => void;
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
  selectedQuestionMode: null,
  setSelectedQuestionMode: (mode) => set({ selectedQuestionMode: mode }),
  companyQuestions: [],
  setCompanyQuestions: (questions) => set({ companyQuestions: questions }),
  setCompanyQuestionAnswer: (id, answer) =>
    set((state) => ({
      companyQuestions: state.companyQuestions.map((item) => (
        item.id === id ? { ...item, answer } : item
      )),
    })),
  setCompanyQuestionAssistant: (id, assistantId) =>
    set((state) => ({
      companyQuestions: state.companyQuestions.map((item) => (
        item.id === id ? { ...item, assistantId } : item
      )),
    })),
  resetCoverLetterData: () => set({
    coverLetterData: initialState,
    selectedTemplate: defaultTemplate,
    selectedCareerType: null,
    selectedQuestionMode: null,
    companyQuestions: [],
  }),
}));
