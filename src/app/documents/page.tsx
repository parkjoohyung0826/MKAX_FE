'use client';

import React, { useState } from 'react';
import { Alert, Box, Button, Snackbar, TextField, Typography, Paper, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import AppShell from '@/shared/components/AppShell';
import { useRouter } from 'next/navigation';
import { useReportStore } from '@/features/report/store';
import { useResumeStore } from '@/features/resume/store';
import { useCoverLetterStore } from '@/features/cover-letter/store';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { setResultData } = useReportStore();
  const { setFormattedResume } = useResumeStore();
  const { setCoverLetterData } = useCoverLetterStore();

  const toCoverLetterData = () => ({
    growthProcess: '',
    strengthsAndWeaknesses: '',
    keyExperience: '',
    motivation: '',
  });

  const toCoverLetterText = (data: ReturnType<typeof toCoverLetterData>) =>
    `[성장과정]\n${data.growthProcess}\n\n[성격의 장, 단점]\n${data.strengthsAndWeaknesses}\n\n[주요 경력 및 업무 강점]\n${data.keyExperience}\n\n[지원 동기 및 입사 포부]\n${data.motivation}`.trim();

  const normalizeCoverLetter = (coverLetter: any) => {
    if (!Array.isArray(coverLetter)) return null;
    const sectionMap: Record<string, keyof ReturnType<typeof toCoverLetterData>> = {
      GROWTH_PROCESS: 'growthProcess',
      STRENGTHS_AND_WEAKNESSES: 'strengthsAndWeaknesses',
      KEY_EXPERIENCE: 'keyExperience',
      MOTIVATION: 'motivation',
    };
    const base = toCoverLetterData();
    coverLetter.forEach((item: any) => {
      const key = sectionMap[item?.section];
      if (!key) return;
      base[key] = item?.finalDraft ?? item?.summary ?? '';
    });
    return base;
  };

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
      const normalizedCoverLetter = normalizeCoverLetter(data.coverLetter);
      if (normalizedCoverLetter) {
        setCoverLetterData(normalizedCoverLetter);
      }

      const mockResult: ResultData = {
        aiCoverLetter: normalizedCoverLetter ? toCoverLetterText(normalizedCoverLetter) : (data.coverLetter ?? ''),
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
      <AnimatePresence mode="wait">
        <motion.div
          key="documents-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              fontWeight={900}
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #1e293b 30%, #2563EB 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-1px',
                wordBreak: 'keep-all',
              }}
            >
              문서 조회
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              이전에 발급받은 인증 코드를 입력하면
              <br />
              작성 중이던 이력서와 자기소개서를 불러옵니다.
            </Typography>
          </Box>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 520,
            mx: 'auto',
            p: { xs: 3, md: 5 },
            borderRadius: '28px',
            bgcolor: 'rgba(255, 255, 255, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
            textAlign: 'center',
          }}
        >
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
        </Paper>
      </motion.div>

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
