'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { WorkspacePremium, Verified, AutoAwesome } from '@mui/icons-material';
import { ResumeData } from '../ConversationalForm';
import ConversationalAssistant from '../ConversationalAssistant';

interface Props {
  data: ResumeData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

type AssistantField = 'coreCompetencies' | 'certifications';

// 공통 Input 스타일 (Glassmorphism)
const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    padding: '16px', // 멀티라인 패딩 조정
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

const aiButtonSx = {
  color: '#2563EB', 
  fontWeight: 700,
  textTransform: 'none',
  bgcolor: 'rgba(37, 99, 235, 0.1)',
  borderRadius: '20px',
  px: 2,
  py: 0.5,
  fontSize: '0.85rem',
  '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.2)' }
};

const CertificationsStep = ({ data, handleChange }: Props) => {
  const [assistantFor, setAssistantFor] = useState<AssistantField | null>(null);

  const handleOpenAssistant = (field: AssistantField) => setAssistantFor(field);
  const handleCloseAssistant = () => setAssistantFor(null);

  const handleAssistantSubmit = (text: string) => {
    if (!assistantFor) return;
    const syntheticEvent = {
      target: { name: assistantFor, value: text },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    handleChange(syntheticEvent);
    handleCloseAssistant();
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Modals */}
      <ConversationalAssistant
        open={assistantFor === 'coreCompetencies'}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title="교육사항/대외활동 AI"
        prompt="참여했던 교육 프로그램, 대외 활동, 동아리 활동 등에 대해 자유롭게 이야기해주세요."
      />
      <ConversationalAssistant
        open={assistantFor === 'certifications'}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title="자격증/어학 AI"
        prompt="취득한 자격증, 면허, 어학 성적 등에 대해 자유롭게 이야기해주세요."
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#1e293b' }}>
          주요 활동 및 자격
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          교육 및 대외활동, 자격증, 어학 능력 등 주요 활동과 자격 사항을 입력해주세요.
        </Typography>
      </Box>
      
      <Box display="grid" gap={4}>
        {/* 핵심 기술 */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1.5, px: 1 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <WorkspacePremium fontSize="small" sx={{ color: '#64748b' }} />
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
                교육사항 / 대외활동
              </Typography>
            </Box>
            <Button 
              size="small" 
              onClick={() => handleOpenAssistant('coreCompetencies')}
              startIcon={<AutoAwesome />}
              sx={aiButtonSx}
            >
              AI 작성 도우미
            </Button>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="coreCompetencies"
            placeholder="예: 삼성 청년 SW 아카데미 (SSAFY) 10기 수료 (2023.07 ~ 2024.01)&#13;&#10;OOO 대외활동 (2022.01 ~ 2022.06) - 프로젝트 관리 및 기획 담당"
            value={data.coreCompetencies}
            onChange={handleChange}
            variant="outlined"
            sx={glassInputSx}
          />
        </Box>

        {/* 자격증 */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1.5, px: 1 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Verified fontSize="small" sx={{ color: '#64748b' }} />
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
                자격증 및 어학
              </Typography>
            </Box>
            <Button 
              size="small" 
              onClick={() => handleOpenAssistant('certifications')}
              startIcon={<AutoAwesome />}
              sx={aiButtonSx}
            >
              AI 작성 도우미
            </Button>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="certifications"
            placeholder="예: 정보처리기사 (2023.05)&#13;&#10;TOEIC 900 (2023.08)"
            value={data.certifications}
            onChange={handleChange}
            variant="outlined"
            sx={glassInputSx}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CertificationsStep;