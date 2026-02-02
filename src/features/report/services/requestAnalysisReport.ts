import { ResumeFormatResult } from '@/features/resume/types';
import { CoverLetterData } from '@/features/cover-letter/types';

type AnalysisReportPayload = {
  resume: ResumeFormatResult;
  coverLetter: Pick<
    CoverLetterData,
    'growthProcess' | 'strengthsAndWeaknesses' | 'keyExperience' | 'motivation'
  >;
  code: string;
};

export async function requestAnalysisReport(payload: AnalysisReportPayload) {
  const res = await fetch('/api/report/analysis-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? '분석 리포트 요청 실패');
  }

  return res.json();
}
