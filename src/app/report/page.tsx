'use client';

import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import AppShell from '@/shared/components/AppShell';
import GenerationResult from '@/features/report/components/GenerationResult';
import { useCoverLetterStore } from '@/features/cover-letter/store';
import { useResumeStore } from '@/features/resume/store';
import { useReportStore } from '@/features/report/store';

const ReportPage = () => {
  const router = useRouter();
  const { resultData, resetResultData } = useReportStore();
  const { resetResumeData } = useResumeStore();
  const { resetCoverLetterData } = useCoverLetterStore();

  useEffect(() => {
    if (!resultData) {
      router.replace('/resume');
    }
  }, [resultData, router]);

  const handleReset = () => {
    resetResultData();
    resetResumeData();
    resetCoverLetterData();
    router.push('/resume');
  };

  if (!resultData) {
    return null;
  }

  return (
    <AppShell showParticles>
      <AnimatePresence mode="wait">
        <motion.div
          key="result-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography
              variant="h3"
              fontWeight={900}
              gutterBottom
              sx={{
                color: '#1e293b',
                textShadow: '0 2px 10px rgba(0,0,0,0.05)',
                letterSpacing: '-1px',
              }}
            >
              분석 및 생성이 완료되었습니다!
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              fontWeight={500}
              sx={{ opacity: 0.8, mt: 2, wordBreak: 'keep-all' }}
            >
              AI가 분석한 커리어 리포트와 완성된 서류를 탭을 눌러 확인해보세요.
            </Typography>
          </Box>
        </motion.div>
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <GenerationResult data={resultData} onReset={handleReset} />
      </motion.div>
    </AppShell>
  );
};

export default ReportPage;
