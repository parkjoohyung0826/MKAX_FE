'use client';

import React, { ReactNode } from 'react';
import { Box, Tab, Tabs, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';

import AppShell from '@/shared/components/AppShell';

type TabValue = 'resume' | 'coverLetter';

interface Props {
  activeTab: TabValue;
  onTabChange: (event: React.SyntheticEvent, newValue: TabValue) => void;
  children: ReactNode;
  isLoading?: boolean;
  loadingFallback?: ReactNode;
}

const FormPageLayout = ({ activeTab, onTabChange, children, isLoading = false, loadingFallback }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key="form-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
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
              당신의 경험이 <br className={isMobile ? 'block' : 'hidden'} />새로운 내일이 됩니다
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                opacity: 0.8,
                wordBreak: 'keep-all',
              }}
            >
              AI와 함께 이력서와 자기소개서를 완성하고 맞춤형 분석 리포트를 받아보세요.
            </Typography>
          </Box>
        </motion.div>
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {isLoading ? (
          loadingFallback ?? null
        ) : (
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(24px)',
              borderRadius: '32px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)', px: 4 }}>
              <Tabs
                value={activeTab}
                onChange={onTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': { height: 4, borderRadius: 2, background: '#2563EB' },
                  '& .MuiTab-root': { py: 4, fontSize: '1rem', fontWeight: 700, color: '#64748b' },
                  '& .Mui-selected': { color: '#2563EB !important' },
                }}
              >
                <Tab label="01. 이력서 작성" value="resume" />
                <Tab label="02. 자기소개서 작성" value="coverLetter" />
              </Tabs>
            </Box>

            <Box sx={{ p: { xs: 3, md: 6 } }}>{children}</Box>
          </Box>
        )}
      </motion.div>
    </AppShell>
  );
};

export default FormPageLayout;
