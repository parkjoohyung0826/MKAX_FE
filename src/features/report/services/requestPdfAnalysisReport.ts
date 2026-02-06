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

  if (!res.ok) {
    if (res.status === 413) {
      throw new Error('파일 용량이 커서 리포트를 생성할 수 없습니다.');
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? 'PDF 분석 요청 실패');
  }

  return res.json() as Promise<{
    code: string;
    report: any;
    resumeUrl?: string;
    coverLetterUrl?: string;
  }>;
}
