import { create } from 'zustand';
import { ResultData } from './types';
import { JobPosting } from './types/job';

const dedupeByWantedAuthNo = (prev: JobPosting[], next: JobPosting[]) => {
  const map = new Map<string, JobPosting>();
  prev.forEach((item) => map.set(item.wantedAuthNo, item));
  next.forEach((item) => {
    if (!map.has(item.wantedAuthNo)) {
      map.set(item.wantedAuthNo, item);
    }
  });
  return Array.from(map.values());
};

interface ReportStore {
  resultData: ResultData | null;
  recruitments: JobPosting[];
  recruitmentsNextOffset: number;
  recruitmentsHasMore: boolean;
  recruitmentsLoaded: boolean;
  setResultData: (data: ResultData | null) => void;
  appendRecruitments: (items: JobPosting[], nextOffset: number, hasMore: boolean) => void;
  resetRecruitments: () => void;
  resetResultData: () => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  resultData: null,
  recruitments: [],
  recruitmentsNextOffset: 0,
  recruitmentsHasMore: true,
  recruitmentsLoaded: false,
  setResultData: (data) => set({ resultData: data }),
  appendRecruitments: (items, nextOffset, hasMore) =>
    set((state) => ({
      recruitments: dedupeByWantedAuthNo(state.recruitments, items),
      recruitmentsNextOffset: nextOffset,
      recruitmentsHasMore: hasMore,
      recruitmentsLoaded: true,
    })),
  resetRecruitments: () =>
    set({
      recruitments: [],
      recruitmentsNextOffset: 0,
      recruitmentsHasMore: true,
      recruitmentsLoaded: false,
    }),
  resetResultData: () => set({ resultData: null }),
}));
