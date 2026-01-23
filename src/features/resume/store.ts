import { create } from 'zustand';
import { ResumeData } from './types';

interface ResumeStore {
  resumeData: ResumeData;
  setResumeData: (data: Partial<ResumeData>) => void;
  resetResumeData: () => void;
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

export const useResumeStore = create<ResumeStore>((set) => ({
  resumeData: initialResumeData,
  setResumeData: (data) =>
    set((state) => ({
      resumeData: { ...state.resumeData, ...data },
    })),
  resetResumeData: () => set({ resumeData: initialResumeData }),
}));
