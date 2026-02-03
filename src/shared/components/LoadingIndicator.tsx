'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, LinearProgress, Typography } from '@mui/material';

const LoadingIndicator = () => {
  const messages = useMemo(
    () => [
      'AI가 이력서와 추천 채용 공고를 생성 중입니다',
      '문서 구조를 정리하고 핵심을 요약하고 있어요',
      '맞춤형 분석 리포트를 작성 중입니다',
    ],
    []
  );
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1600);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        textAlign: 'center',
      }}
    >
      <Box sx={{ position: 'relative', mb: 3 }}>
        <CircularProgress size={64} thickness={4} sx={{ color: '#2563EB' }} />
      </Box>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
        {messages[messageIndex]}
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            ml: 0.5,
            gap: '4px',
            '& span': {
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              bgcolor: '#2563EB',
              display: 'inline-block',
              animation: 'loadingDot 1.2s infinite ease-in-out',
            },
            '& span:nth-of-type(2)': { animationDelay: '0.15s', bgcolor: '#3b82f6' },
            '& span:nth-of-type(3)': { animationDelay: '0.3s', bgcolor: '#60a5fa' },
            '@keyframes loadingDot': {
              '0%, 80%, 100%': { transform: 'scale(0)', opacity: 0.4 },
              '40%': { transform: 'scale(1)', opacity: 1 },
            },
          }}
        >
          <span />
          <span />
          <span />
        </Box>
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        조금만 기다려주세요. 생성 상태를 실시간으로 반영하고 있습니다.
      </Typography>
      <Box sx={{ width: '100%', maxWidth: 360 }}>
        <LinearProgress
          variant="indeterminate"
          sx={{
            height: 8,
            borderRadius: 6,
            bgcolor: 'rgba(37, 99, 235, 0.12)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 6,
              background: 'linear-gradient(90deg, #2563EB 0%, #60a5fa 100%)',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default LoadingIndicator;
