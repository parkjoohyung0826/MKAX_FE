import { create } from 'zustand';
import { ResultData } from './types';

interface ReportStore {
  resultData: ResultData | null;
  setResultData: (data: ResultData | null) => void;
  resetResultData: () => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  resultData: null,
  setResultData: (data) => set({ resultData: data }),
  resetResultData: () => set({ resultData: null }),
}));
