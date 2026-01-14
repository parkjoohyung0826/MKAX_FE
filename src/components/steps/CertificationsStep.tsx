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
        title="핵심 기술/역량 AI"
        prompt="보유한 기술 스택, 프로젝트 경험, 문제 해결 능력 등 자신의 강점에 대해 자유롭게 이야기해주세요."
      />
      <ConversationalAssistant
        open={assistantFor === 'certifications'}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title="자격증/어학 AI"
        prompt="취득한 자격증, 면허, 어학 성적, 수료한 교육 과정 등에 대해 알려주세요."
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#1e293b' }}>
          보유 기술 및 자격
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          나만의 경쟁력이 되는 스킬과 자격 사항을 입력해주세요.
        </Typography>
      </Box>
      
      <Box display="grid" gap={4}>
        {/* 핵심 기술 */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1.5, px: 1 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <WorkspacePremium fontSize="small" sx={{ color: '#64748b' }} />
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
                핵심 기술 및 역량
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
            placeholder="예: React, Next.js 기반의 프론트엔드 개발 경험&#13;&#10;AWS 인프라 구축 및 배포 경험&#13;&#10;애자일 환경에서의 협업 능력"
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