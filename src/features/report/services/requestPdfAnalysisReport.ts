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
