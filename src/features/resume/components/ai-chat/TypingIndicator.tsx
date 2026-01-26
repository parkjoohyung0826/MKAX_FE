'use client';

import React from 'react';
import { Box } from '@mui/material';

const TypingIndicator = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.8,
      p: 2,
      px: 2.5,
      bgcolor: '#fff',
      borderRadius: '20px',
      borderTopLeftRadius: '4px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      width: 'fit-content',
    }}
  >
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          width: 8,
          height: 8,
          bgcolor: '#3B82F6',
          borderRadius: '50%',
          animation: 'wave 1.2s infinite ease-in-out both',
          animationDelay: `${i * 0.15}s`,
          '@keyframes wave': {
            '0%, 60%, 100%': { transform: 'translateY(0)' },
            '30%': { transform: 'translateY(-6px)' },
          },
        }}
      />
    ))}
  </Box>
);

export default TypingIndicator;
