import { create } from 'zustand';
import { CoverLetterData } from './types';

interface CoverLetterState {
  coverLetterData: CoverLetterData;
  setCoverLetterData: (data: Partial<CoverLetterData>) => void;
  resetCoverLetterData: () => void;
}

const initialState: CoverLetterData = {
  growthProcess: '',
  strengthsAndWeaknesses: '',
  keyExperience: '',
  motivation: '',
};

export const useCoverLetterStore = create<CoverLetterState>((set) => ({
  coverLetterData: initialState,
  setCoverLetterData: (data) =>
    set((state) => ({
      coverLetterData: { ...state.coverLetterData, ...data },
    })),
  resetCoverLetterData: () => set({ coverLetterData: initialState }),
}));
