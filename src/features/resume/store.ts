import { create } from 'zustand';
import { ResumeData, ResumeFormatResult } from './types';

interface ResumeStore {
  resumeData: ResumeData;
  setResumeData: (data: Partial<ResumeData>) => void;
  resetResumeData: () => void;
  resumeValidation: {
    education: boolean;
    workExperience: boolean;
    coreCompetencies: boolean;
    certifications: boolean;
  };
  setResumeValidation: (data: Partial<ResumeStore['resumeValidation']>) => void;
  formattedResume: ResumeFormatResult | null;
  setFormattedResume: (data: ResumeFormatResult | null) => void;
}

const initialResumeData: ResumeData = {
  name: '',
  englishName: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  emergencyContact: '',
  address: '',
  photo: '',
  desiredJob: '',
  education: '',
  workExperience: '',
  coreCompetencies: '',
  certifications: '',
};

const initialResumeValidation = {
  education: false,
  workExperience: false,
  coreCompetencies: false,
  certifications: false,
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resumeData: initialResumeData,
  setResumeData: (data) =>
    set((state) => ({
      resumeData: { ...state.resumeData, ...data },
    })),
  resumeValidation: initialResumeValidation,
  setResumeValidation: (data) =>
    set((state) => ({
      resumeValidation: { ...state.resumeValidation, ...data },
    })),
  formattedResume: null,
  setFormattedResume: (data) => set({ formattedResume: data }),
  resetResumeData: () =>
    set({ resumeData: initialResumeData, resumeValidation: initialResumeValidation, formattedResume: null }),
}));
