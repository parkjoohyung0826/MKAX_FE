import { create } from 'zustand';
import { ResumeCareerType, ResumeData, ResumeFormatResult, ResumeTemplateId } from './types';

interface ResumeStore {
  resumeData: ResumeData;
  setResumeData: (data: Partial<ResumeData> | ((prev: ResumeData) => Partial<ResumeData>)) => void;
  resetResumeData: () => void;
  selectedTemplate: ResumeTemplateId | null;
  setSelectedTemplate: (template: ResumeTemplateId) => void;
  selectedCareerType: ResumeCareerType | null;
  setSelectedCareerType: (careerType: ResumeCareerType) => void;
  resumeValidation: {
    education: boolean;
    workExperience: boolean;
    coreCompetencies: boolean;
    certifications: boolean;
  };
  setResumeValidation: (data: Partial<ResumeStore['resumeValidation']>) => void;
  validationLock: {
    education: boolean;
    workExperience: boolean;
    coreCompetencies: boolean;
    certifications: boolean;
  };
  setValidationLock: (data: Partial<ResumeStore['validationLock']>) => void;
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

const initialValidationLock = {
  education: false,
  workExperience: false,
  coreCompetencies: false,
  certifications: false,
};

const defaultTemplate: ResumeTemplateId | null = null;

export const useResumeStore = create<ResumeStore>((set) => ({
  resumeData: initialResumeData,
  setResumeData: (data) =>
    set((state) => {
      const patch = typeof data === 'function' ? data(state.resumeData) : data;
      return {
        resumeData: { ...state.resumeData, ...patch },
      };
    }),
  selectedTemplate: defaultTemplate,
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  selectedCareerType: null,
  setSelectedCareerType: (careerType) => set({ selectedCareerType: careerType }),
  resumeValidation: initialResumeValidation,
  setResumeValidation: (data) =>
    set((state) => ({
      resumeValidation: { ...state.resumeValidation, ...data },
    })),
  validationLock: initialValidationLock,
  setValidationLock: (data) =>
    set((state) => ({
      validationLock: { ...state.validationLock, ...data },
    })),
  formattedResume: null,
  setFormattedResume: (data) => set({ formattedResume: data }),
  resetResumeData: () =>
    set({
      resumeData: initialResumeData,
      resumeValidation: initialResumeValidation,
      validationLock: initialValidationLock,
      formattedResume: null,
      selectedTemplate: defaultTemplate,
      selectedCareerType: null,
    }),
}));
