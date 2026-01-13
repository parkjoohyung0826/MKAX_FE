// src/components/steps/CertificationsStep.tsx
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

type AssistantField = 'coreCompetencies' | 'certifications';

const CertificationsStep = ({ data, handleChange }: Props) => {
  const [assistantFor, setAssistantFor] = useState<AssistantField | null>(null);

  const handleOpenAssistant = (field: AssistantField) => {
    setAssistantFor(field);
  };

  const handleCloseAssistant = () => {
    setAssistantFor(null);
  };

  const handleAssistantSubmit = (text: string) => {
    if (!assistantFor) return;

    const syntheticEvent = {
      target: {
        name: assistantFor,
        value: text,
      },
    } as React.ChangeEvent<HTMLTextAreaElement>;

    handleChange(syntheticEvent);
    handleCloseAssistant();
  };

  return (
    <Box>
      {/* Modals */}
      <ConversationalAssistant
        open={assistantFor === 'coreCompetencies'}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title="핵심 기술/역량 AI 어시스턴트"
        prompt="보유한 기술 스택, 프로젝트 경험, 문제 해결 능력 등 자신의 강점에 대해 자유롭게 이야기해주세요."
      />
      <ConversationalAssistant
        open={assistantFor === 'certifications'}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title="자격증 AI 어시스턴트"
        prompt="취득한 자격증, 면허, 수료한 교육 과정 등에 대해 알려주세요."
      />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        🛠️ 보유하신 핵심 기술이나 자격증에 대해 알려주세요.
      </Typography>
      
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <div>
              <Typography variant="body1" fontWeight={600} gutterBottom>
                핵심 기술 및 역량
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                자신있는 기술이나 직무 관련 강점을 자유롭게 표현해주세요.
              </Typography>
            </div>
            <AIHelperButton onClick={() => handleOpenAssistant('coreCompetencies')} />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="coreCompetencies"
            placeholder="예: React, Next.js 기반의 프론트엔드 개발, 프로젝트 리딩 및 팀 관리"
            value={data.coreCompetencies}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: 'white' }}
          />
        </Box>

        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <div>
              <Typography variant="body1" fontWeight={600} gutterBottom>
                자격증 및 기타 사항
              </Typography>
            </div>
            <AIHelperButton onClick={() => handleOpenAssistant('certifications')} />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="certifications"
            placeholder="예: 정보처리기사 (2010.05)"
            value={data.certifications}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: 'white' }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CertificationsStep;