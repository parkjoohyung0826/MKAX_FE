'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Paper } from '@mui/material';
import { ResumeData } from '../ConversationalForm';
import AIHelperButton from '../AIHelperButton';
import ConversationalAssistant from '../ConversationalAssistant';

interface Props {
  data: ResumeData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EducationStep = ({ data, handleChange }: Props) => {
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
        name: 'education',
        value: text,
      },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    handleChange(syntheticEvent);
    handleCloseAssistant();
  };

  return (
    <Box>
      <ConversationalAssistant
        open={isAssistantOpen}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title="학력 사항 AI 어시스턴트"
        prompt="최종 학력, 학교명, 전공, 재학 기간 등을 자유롭게 이야기해주세요. AI가 이력서에 맞게 내용을 정리해드립니다."
      />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        🎓 다음으로, 학력 사항을 알려주세요.
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
         <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <div>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              최종 학력
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              가장 높은 학력부터 순서대로 작성해주세요. (예: OOO대학교 컴퓨터공학부 졸업)
            </Typography>
          </div>
          <AIHelperButton onClick={handleOpenAssistant} />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          name="education"
          placeholder="예: OOO대학교 컴퓨터공학부 졸업 (2010.03 ~ 2014.02)"
          value={data.education}
          onChange={handleChange}
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
      </Paper>
    </Box>
  );
};

export default EducationStep;
