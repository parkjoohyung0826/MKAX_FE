'use client';

import React from 'react';
import { Button } from '@mui/material';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { SxProps, Theme } from '@mui/material/styles'; 

interface Props {
  onClick: () => void;
  sx?: SxProps<Theme>; 
}

const AIHelperButton = ({ onClick, sx }: Props) => { 
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<SparklesIcon width={16} />}
      onClick={onClick}
      disableElevation
      sx={{ 
        mb: 2,
        fontWeight: 700,
        borderRadius: '12px',
        px: 1.5,
        py: 0.5,
        mx: 1.5,
        width: '125px',
        height: '40px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        },
        ...sx 
      }}
    >
      AI 도움받기
    </Button>
  );
};

export default AIHelperButton;
