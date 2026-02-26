'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CloseRounded, MenuRounded } from '@mui/icons-material';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isResumePage = pathname === '/resume';
  const isDocumentsPage = pathname === '/documents';
  const isReportOnlyPage = pathname === '/report-only';
  const isRecruitmentsPage = pathname === '/recruitments';
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { path: '/resume', label: '문서 작성', shortLabel: '작성', active: isResumePage },
    { path: '/report-only', label: 'AI 리포트', shortLabel: '리포트', active: isReportOnlyPage },
    { path: '/recruitments', label: '채용 공고', shortLabel: '채용', active: isRecruitmentsPage },
    { path: '/documents', label: '문서 조회', shortLabel: '조회', active: isDocumentsPage },
  ] as const;

  const handleMove = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100vh',
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
              onClick={() => {
                window.location.href = '/resume';
              }}
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
              {/* <AutoAwesome sx={{ mr: 1.5, color: '#2563EB', fontSize: '1.8rem' }} /> */}
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                Naeil<span style={{ color: '#2563EB' }}>Ro</span>
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton
                aria-label="메뉴 열기"
                onClick={() => setIsMobileMenuOpen(true)}
                sx={{
                  color: '#334155',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  bgcolor: 'rgba(255,255,255,0.7)',
                  '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.08)' },
                }}
              >
                <MenuRounded />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => handleMove(item.path)}
                    sx={{
                      color: item.active ? '#2563EB' : '#64748b',
                      fontWeight: 700,
                      borderRadius: '20px',
                      px: 2.5,
                      bgcolor: item.active ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.12)',
                        color: '#2563EB',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
          </Box>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: '82vw',
            maxWidth: 320,
            p: 2,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
          },
        }}
      >
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5 }}>
            <Typography sx={{ fontWeight: 800, color: '#1e293b' }}>메뉴</Typography>
            <IconButton
              aria-label="메뉴 닫기"
              onClick={() => setIsMobileMenuOpen(false)}
              sx={{ color: '#64748b' }}
            >
              <CloseRounded />
            </IconButton>
          </Box>

          <Stack spacing={1}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                fullWidth
                onClick={() => handleMove(item.path)}
                sx={{
                  justifyContent: 'flex-start',
                  color: item.active ? '#2563EB' : '#334155',
                  fontWeight: 700,
                  borderRadius: '14px',
                  px: 2,
                  py: 1.2,
                  bgcolor: item.active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                  border: item.active ? '1px solid rgba(37, 99, 235, 0.18)' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: 'rgba(37, 99, 235, 0.08)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Drawer>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, pt: 15, pb: 8 }}>
        {children}
      </Container>
    </Box>
  );
};

export default AppShell;
