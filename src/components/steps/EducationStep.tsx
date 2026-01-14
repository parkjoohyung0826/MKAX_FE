'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { School, AutoAwesome } from '@mui/icons-material';
import { ResumeData } from '../ConversationalForm';
import ConversationalAssistant from '../ConversationalAssistant';

interface Props {
  data: ResumeData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// 공통 Input 스타일 (Glassmorphism)
const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    padding: '16px',
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

const EducationStep = ({ data, handleChange }: Props) => {
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  const handleOpenAssistant = () => setAssistantOpen(true);
  const handleCloseAssistant = () => setAssistantOpen(false);

  const handleAssistantSubmit = (text: string) => {
    const syntheticEvent = {
      target: { name: 'education', value: text },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    handleChange(syntheticEvent);
    handleCloseAssistant();
  };

  return (
    <Box sx={{ py: 2 }}>
      <ConversationalAssistant
        open={isAssistantOpen}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title="학력 정보 AI"
        prompt="최종 학력, 학교명, 전공, 재학 기간, 주요 수강 과목이나 학점 등을 자유롭게 이야기해주세요. AI가 깔끔하게 정리해드립니다."
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#1e293b' }}>
          학력 사항 입력
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          전공 분야와 학습하신 내용을 중심으로 작성해주세요.
        </Typography>
      </Box>
      
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1.5, px: 1 }}>
          <Box>
             <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <School fontSize="small" sx={{ color: '#64748b' }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
                  최종 학력 상세
                </Typography>
             </Box>
             <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', ml: 3.5 }}>
                가장 높은 학력부터 순서대로 작성해주세요.
             </Typography>
          </Box>
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
                py: 0.5,
                fontSize: '0.85rem',
                '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.2)' }
             }}
          >
            AI 작성 도우미
          </Button>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={5}
          name="education"
          placeholder="예: OO대학교 컴퓨터공학과 졸업 (2018.03 ~ 2024.02)&#13;&#10;- 주요 수강 과목: 데이터베이스, 알고리즘, 웹프로그래밍&#13;&#10;- 졸업 프로젝트: AI 기반 추천 시스템 개발"
          value={data.education}
          onChange={handleChange}
          variant="outlined"
          sx={glassInputSx}
        />
      </Box>
    </Box>
  );
};

export default EducationStep;