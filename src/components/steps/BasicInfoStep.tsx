// src/components/steps/BasicInfoStep.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Paper, Button } from '@mui/material'; // Button import 추가
import { ResumeData } from '../ConversationalForm';
import AIHelperButton from '../AIHelperButton';
import ConversationalAssistant from '../ConversationalAssistant';

interface Props {
  data: ResumeData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoStep = ({ data, handleChange }: Props) => {
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  const handleOpenAssistant = () => {
    setAssistantOpen(true);
  };

  const handleCloseAssistant = () => {
    setAssistantOpen(false);
  };

  const handleAssistantSubmit = (text: string) => {
    const syntheticEvent = {
      target: {
        name: 'desiredJob',
        value: text,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(syntheticEvent);
    handleCloseAssistant();
  };

  return (
    <Box>
       <ConversationalAssistant
        open={isAssistantOpen}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title="희망 직무 AI 어시스턴트"
        prompt="어떤 직무를 찾고 계신가요? 희망하는 역할, 기술, 산업 분야에 대해 자유롭게 이야기해주세요. AI가 가장 적합한 직무명을 추천해드립니다."
      />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        🤖 안녕하세요! 먼저 이력서의 기본이 되는 정보를 알려주세요.
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
        <Box mb={3}>
          <Typography variant="body1" fontWeight={600} gutterBottom>
            성함
          </Typography>
          <TextField
            fullWidth
            name="name"
            placeholder="예: 홍길동"
            value={data.name}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: 'white' }}
          />
        </Box>

        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
              희망 직무
            </Typography>
            <AIHelperButton onClick={handleOpenAssistant} />
          </Box>
          <TextField
            fullWidth
            name="desiredJob"
            placeholder="예: 시니어 백엔드 개발자"
            value={data.desiredJob}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: 'white' }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default BasicInfoStep;