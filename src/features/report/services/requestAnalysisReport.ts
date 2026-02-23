import { ResumeFormatResult } from '@/features/resume/types';
import { CoverLetterData } from '@/features/cover-letter/types';
import { requestJson } from './http';

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

  return requestJson(res, { fallbackMessage: '분석 리포트 요청 실패' });
}
