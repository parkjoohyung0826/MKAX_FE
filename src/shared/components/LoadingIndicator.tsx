'use client';

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingIndicator = () => {
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
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
        AI가 이력서와 추천 채용 공고를 생성하고 있습니다...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        시니어님의 경력을 가장 돋보이게 만들고 있어요. 잠시만 기다려주세요.
      </Typography>
    </Box>
  );
};

export default LoadingIndicator;
