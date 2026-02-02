'use client';

import React, { useState } from 'react';
import { Alert, Box, Button, Snackbar, TextField, Typography } from '@mui/material';
import AppShell from '@/shared/components/AppShell';
import { useRouter } from 'next/navigation';
import { useReportStore } from '@/features/report/store';
import { useResumeStore } from '@/features/resume/store';
import { mockJobPostings } from '@/features/report/services/mockJobPostings';
import { ResultData } from '@/features/report/types';

const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(37, 99, 235, 0.3)' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
      '& fieldset': { borderColor: '#2563EB' },
    },
  },
};

const DocumentsPage = () => {
  const [accessCode, setAccessCode] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
  const router = useRouter();
  const { setResultData } = useReportStore();
  const { setFormattedResume } = useResumeStore();

  const fetchByCode = async (code: string) => {
    const res = await fetch('/api/archive/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      let message = err?.message ?? '인증코드 조회 실패';
      if (message === 'Backend error' && err?.detail) {
        try {
          const parsed = JSON.parse(err.detail);
          message = parsed?.message ?? err.detail;
        } catch {
          message = err.detail;
        }
      }
      throw new Error(message);
    }

    return res.json();
  };

  const handleLoadData = async () => {
    const code = accessCode.trim();
    if (!code) return;

    try {
      const data = await fetchByCode(code);
      const mockResult: ResultData = {
        aiCoverLetter: data.coverLetter ?? '',
        aiResumeSummary: `${data?.resume?.name ?? ''}님의 경력 분석...`,
        jobPostings: mockJobPostings,
        resumeData: data.resume ?? {},
        accessCode: code,
        analysisReport: data.analysisReport ?? null,
      };
      if (data.resume) {
        setFormattedResume(data.resume);
      }
      setResultData(mockResult);
      setToastMessage('문서 조회가 완료되었습니다.');
      setToastSeverity('success');
      setToastOpen(true);
      router.push('/report');
    } catch (error) {
      console.error(error);
      setToastMessage(
        error instanceof Error ? error.message : '인증코드 조회 실패'
      );
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  return (
    <AppShell>
      <Box
        sx={{
          maxWidth: 520,
          mx: 'auto',
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: '28px',
          p: { xs: 3, md: 5 },
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight={900} gutterBottom sx={{ color: '#1e293b' }}>
          문서 조회
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          이전에 발급받은 인증 코드를 입력하면
          <br />
          작성 중이던 이력서와 자기소개서를 불러옵니다.
        </Typography>

        <TextField
          fullWidth
          placeholder="인증 코드 입력"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          sx={glassInputSx}
          InputProps={{ sx: { textAlign: 'center' } }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLoadData}
          disabled={!accessCode}
          sx={{
            mt: 3,
            py: 1.4,
            borderRadius: '16px',
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2563EB, #1d4ed8)',
          }}
        >
          불러오기
        </Button>
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </AppShell>
  );
};

export default DocumentsPage;
