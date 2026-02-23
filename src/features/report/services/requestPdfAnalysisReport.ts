import { requestJson } from './http';

export async function requestPdfAnalysisReport(
  resumeFile?: File,
  coverLetterFile?: File
) {
  const form = new FormData();
  if (resumeFile) form.append('resume', resumeFile);
  if (coverLetterFile) form.append('coverLetter', coverLetterFile);

  const res = await fetch('/api/report/analysis-report/pdf', {
    method: 'POST',
    credentials: 'include',
    body: form,
  });

  return requestJson<{
    code: string;
    report: any;
    resumeUrl?: string;
    coverLetterUrl?: string;
  }>(res, {
    fallbackMessage: 'PDF 분석 요청 실패',
    statusMessages: {
      413: '파일 용량이 커서 리포트를 생성할 수 없습니다.',
    },
  });
}
