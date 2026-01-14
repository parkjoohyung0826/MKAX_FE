'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { PersonOutline, WorkOutline, AutoAwesome } from '@mui/icons-material';
import { ResumeData } from '../ConversationalForm';
import AIHelperButton from '../AIHelperButton';
import ConversationalAssistant from '../ConversationalAssistant';

interface Props {
  data: ResumeData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// 공통 Input 스타일 (Glassmorphism 적용)
const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': { borderColor: 'rgba(37, 99, 235, 0.3)' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 8px 20px rgba(37, 99, 235, 0.15)',
      '& fieldset': { borderColor: '#2563EB', borderWidth: '1px' }
    }
  },
  '& .MuiInputLabel-root': { color: '#64748b' }
};

const BasicInfoStep = ({ data, handleChange }: Props) => {
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  const handleOpenAssistant = () => setAssistantOpen(true);
  const handleCloseAssistant = () => setAssistantOpen(false);

  const handleAssistantSubmit = (text: string) => {
    const syntheticEvent = {
      target: { name: 'desiredJob', value: text },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(syntheticEvent);
    handleCloseAssistant();
  };

  return (
    <Box sx={{ py: 2 }}>
       <ConversationalAssistant
        open={isAssistantOpen}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title="직무 탐색 AI"
        prompt="본인의 경험이나 관심사를 자유롭게 말씀해주세요. AI가 적합한 직무명을 추천해드립니다."
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#1e293b' }}>
          기본 정보 입력
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          이력서의 기초가 되는 핵심 정보를 입력해주세요.
        </Typography>
      </Box>
      
      <Box display="grid" gap={4}>
        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, ml: 1, color: '#334155' }}>
            성함
          </Typography>
          <TextField
            fullWidth
            name="name"
            placeholder="홍길동"
            value={data.name}
            onChange={handleChange}
            variant="outlined"
            sx={glassInputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1, ml: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
              희망 직무
            </Typography>
            <Button 
              size="small" 
              onClick={handleOpenAssistant}
              startIcon={<AutoAwesome />}
              sx={{ 
                color: '#2563EB', 
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: 'rgba(37, 99, 235, 0.1)',
                borderRadius: '20px',
                px: 2,
                '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.2)' }
              }}
            >
              AI 추천받기
            </Button>
          </Box>
          <TextField
            fullWidth
            name="desiredJob"
            placeholder="예: 시니어 마케팅 전문가"
            value={data.desiredJob}
            onChange={handleChange}
            variant="outlined"
            sx={glassInputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WorkOutline sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BasicInfoStep;