'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { BusinessCenter, AutoAwesome } from '@mui/icons-material';
import { useResumeStore } from '../../store';
import ConversationalAssistant from '@/shared/components/ConversationalAssistant';

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

const WorkExperienceStep = () => {
  const { resumeData, setResumeData } = useResumeStore();
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  const handleOpenAssistant = () => setAssistantOpen(true);
  const handleCloseAssistant = () => setAssistantOpen(false);

  const handleAssistantSubmit = async (text: string): Promise<void> => {
    const res = await fetch('/api/recommend/career', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput: text }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? '경력 정보 생성에 실패했습니다.');
    }

    const data = await res.json();
    // expected: { fullDescription, companyName, period, mainTask, leavingReason }
    setResumeData({ workExperience: [data] });
    handleCloseAssistant();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
        // 사용자가 직접 입력 시, 첫 번째 학력 정보의 fullDescription을 업데이트
        // 또는 학력 정보가 없다면 새로운 항목으로 생성
    const newWorkExperience = [...resumeData.workExperience];
    if (newWorkExperience.length > 0) {
      newWorkExperience[0] = { ...newWorkExperience[0], fullDescription: value };
    } else {
      newWorkExperience.push({
        companyName: '',
        period: '',
        mainTask: '',
        leavingReason: '',
        fullDescription: value,
      });
    }
    setResumeData({ workExperience: newWorkExperience });
  };

  return (
    <Box sx={{ py: 2 }}>
      <ConversationalAssistant
        open={isAssistantOpen}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title="경력 상세 AI"
        prompt="주요 경력, 담당했던 프로젝트, 역할, 그리고 성과(수치 등)에 대해 자유롭게 이야기해주세요. AI가 내용을 구조화해드립니다."
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#1e293b' }}>
          경력 사항 입력
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          직무와 관련된 주요 프로젝트와 성과를 중심으로 작성해주세요.
        </Typography>
      </Box>

      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1.5, px: 1 }}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <BusinessCenter fontSize="small" sx={{ color: '#64748b' }} />
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
                주요 경력 상세
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', ml: 3.5 }}>
              최신순 기재 권장 (회사명, 기간, 직급, 주요 성과 등)
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
          rows={7}
          name="workExperience"
          placeholder="예: (주)테크스타트업 (2021.01 ~ 재직중)&#13;&#10;- 주요 역할: 백엔드 리드 개발자&#13;&#10;- 주요 성과: 레거시 시스템 마이그레이션을 통해 서버 비용 40% 절감&#13;&#10;- 사용 기술: Node.js, AWS, Docker"
          value={resumeData.workExperience.map(wor => wor.fullDescription).join('\n\n')}
          onChange={handleChange}
          variant="outlined"
          sx={glassInputSx}
        />
      </Box>
    </Box>
  );
};

export default WorkExperienceStep;
