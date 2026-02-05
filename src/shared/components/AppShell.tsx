'use client';

import React, { ReactNode, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AutoAwesome } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useCoverLetterStore } from '@/features/cover-letter/store';
import { useReportStore } from '@/features/report/store';
import { useResumeStore } from '@/features/resume/store';

const particleVariant = (i: number) => ({
  animate: {
    y: [0, -30, 0],
    x: [0, 20, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: 15 + i * 2,
      repeat: Infinity,
      ease: 'linear' as const,
    },
  },
});

interface Props {
  children: ReactNode;
  showParticles?: boolean;
}

const AppShell = ({ children, showParticles = false }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const pathname = usePathname();
  const isResumePage = pathname === '/resume';
  const isDocumentsPage = pathname === '/documents';
  const isReportOnlyPage = pathname === '/report-only';
  const { resetResultData } = useReportStore();
  const { resetResumeData } = useResumeStore();
  const { resetCoverLetterData } = useCoverLetterStore();

  useEffect(() => {
    const [navEntry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navEntry?.type !== 'reload') return;
    if (pathname === '/report') return;

    resetResultData();
    resetResumeData();
    resetCoverLetterData();

    void Promise.all([
      fetch('/api/recommend/chat/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      }).catch(() => undefined),
      fetch('/api/cover-letter/chat/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      }).catch(() => undefined),
    ]);
  }, [pathname, resetCoverLetterData, resetResultData, resetResumeData]);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      {showParticles &&
        [...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={particleVariant(i)}
            animate="animate"
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
              filter: 'blur(50px)',
              zIndex: 0,
            }}
          />
        ))}

      <AppBar position="fixed" elevation={0} sx={{ background: 'transparent', pt: 2, zIndex: 10 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(16px)',
              borderRadius: '50px',
              px: 3,
              py: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              onClick={() => router.push('/resume')}
              sx={{
                cursor: 'pointer',
                borderRadius: '999px',
                px: 1,
                py: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <AutoAwesome sx={{ mr: 1.5, color: '#2563EB', fontSize: '1.8rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                Naeil<span style={{ color: '#2563EB' }}>Ro</span>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={() => router.push('/resume')}
                sx={{
                  color: isResumePage ? '#2563EB' : '#64748b',
                  fontWeight: 700,
                  borderRadius: '20px',
                  px: 2.5,
                  bgcolor: isResumePage ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.12)',
                    color: '#2563EB',
                  },
                }}
              >
                {isMobile ? '작성' : '문서 작성'}
              </Button>
              <Button
                onClick={() => router.push('/documents')}
                sx={{
                  color: isDocumentsPage ? '#2563EB' : '#64748b',
                  fontWeight: 700,
                  borderRadius: '20px',
                  px: 2.5,
                  bgcolor: isDocumentsPage ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.12)',
                    color: '#2563EB',
                  },
                }}
              >
                {isMobile ? '조회' : '문서 조회'}
              </Button>
              <Button
                onClick={() => router.push('/report-only')}
                sx={{
                  color: isReportOnlyPage ? '#2563EB' : '#64748b',
                  fontWeight: 700,
                  borderRadius: '20px',
                  px: 2.5,
                  bgcolor: isReportOnlyPage ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.12)',
                    color: '#2563EB',
                  },
                }}
              >
                {isMobile ? '리포트' : 'AI 리포트'}
              </Button>
            </Box>
          </Box>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, pt: 15, pb: 8 }}>
        {children}
      </Container>
    </Box>
  );
};

export default AppShell;
