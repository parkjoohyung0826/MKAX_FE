// src/components/steps/WorkExperienceStep.tsx
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

const WorkExperienceStep = ({ data, handleChange }: Props) => {
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  const handleOpenAssistant = () => {
    setAssistantOpen(true);
  };

  const handleCloseAssistant = () => {
    setAssistantOpen(false);
  };

  const handleAssistantSubmit = (text: string) => {
    // `handleChange`는 ChangeEvent를 기대하므로, 가짜 이벤트를 생성하여 전달합니다.
    const syntheticEvent = {
      target: {
        name: 'workExperience',
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
        title="경력 사항 AI 어시스턴트"
        prompt="주요 경력, 담당했던 프로젝트, 역할, 그리고 성과에 대해 자유롭게 이야기해주세요. AI가 이력서에 맞게 내용을 정리해드립니다."
      />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        💼 주요 경력 사항에 대해 알려주세요.
      </Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <div>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              경력
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              가장 최근 경력부터 순서대로 작성해주세요. 주요 업무와 성과 위주로 작성하는 것이 좋습니다.
            </Typography>
          </div>
          <AIHelperButton onClick={handleOpenAssistant} />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={6}
          name="workExperience"
          placeholder="예: (주)가나다 (2015.01 ~ 2020.12)&#10;- ABC 프로젝트 리드&#10;- XYZ 서비스 개발 및 유지보수"
          value={data.workExperience}
          onChange={handleChange}
          variant="outlined"
          sx={{ bgcolor: 'white' }}
        />
      </Paper>
    </Box>
  );
};

export default WorkExperienceStep;