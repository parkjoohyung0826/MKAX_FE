'use client';

import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

interface AIWriterProps {
  section: string;
  onGenerate: (prompt: string) => void | Promise<void>;
  isGenerating: boolean;
}

const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    transition: 'all 0.2s',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(37, 99, 235, 0.3)' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
      '& fieldset': { borderColor: '#2563EB' }
    }
  }
};

const AIWriter = ({ section, onGenerate, isGenerating }: AIWriterProps) => {
  const [prompt, setPrompt] = useState('');

  const handleGenerateClick = async () => {
    await onGenerate(prompt);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body1" sx={{ color: '#475569', mb: 2 }}>
        AI에게 지시할 내용을 간단히 입력해주세요.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={`예: ${section} 항목에 대해 작성해줘. 나의 경험 중 팀 프로젝트 리딩 경험을 강조하고 싶어.`}
        sx={glassInputSx}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleGenerateClick}
          disabled={isGenerating || !prompt.trim()}
          startIcon={!isGenerating && <AutoAwesome />}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 700,
            py: 1.2,
            px: 3,
            bgcolor: '#2563EB',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
            '&:hover': { bgcolor: '#1d4ed8' }
          }}
        >
          {isGenerating ? <CircularProgress size={24} color="inherit" /> : 'AI 생성 요청'}
        </Button>
      </Box>
    </Box>
  );
};

export default AIWriter;