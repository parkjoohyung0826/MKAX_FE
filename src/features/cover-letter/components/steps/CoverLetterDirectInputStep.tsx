'use client';

import React from 'react';
import { Box, Button, TextField, Typography, Stack, IconButton, Tooltip } from '@mui/material';
import { AutoAwesome, HelpOutline } from '@mui/icons-material';
import CustomModal from '@/shared/components/CustomModal';
import AIWriter from '../cover-letter/AIWriter';
import WritingGuide from '../cover-letter/WritingGuide';
import { CoverLetterData } from '../../types';

interface Props {
  activeStep: number;
  coverLetterData: CoverLetterData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setCoverLetterData: React.Dispatch<React.SetStateAction<CoverLetterData>>;
  isGenerating: boolean;
}

const glassSectionSx = {
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: '24px',
  p: 4,
  mb: 3,
  border: '1px solid rgba(255, 255, 255, 0.6)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
  }
};

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
      boxShadow: '0 8px 20px rgba(37, 99, 235, 0.1)',
      '& fieldset': { borderColor: '#2563EB', borderWidth: '1px' }
    }
  },
  '& .MuiInputBase-input': {
    lineHeight: 1.6,
    color: '#334155'
  }
};

const actionButtonSx = {
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 700,
  px: 2,
  boxShadow: 'none',
  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
};

const coverLetterSections = [
  { id: 'growthProcess', label: '성장과정', rows: 8, desc: '직무에 관심을 갖게 된 계기나 가치관 형성 과정' },
  { id: 'strengthsAndWeaknesses', label: '성격의 장단점', rows: 8, desc: '직무 수행에 도움이 되는 장점과 개선 노력' },
  { id: 'keyExperience', label: '주요 경력 및 업무 강점', rows: 8, desc: '관련 경험에서의 구체적인 역할과 성과' },
  { id: 'motivation', label: '지원 동기 및 포부', rows: 8, desc: '회사 지원 이유와 입사 후 구체적 목표' },
];

const CoverLetterDirectInputStep = ({ activeStep, coverLetterData, handleChange, setCoverLetterData, isGenerating }: Props) => {
  const [isGuideModalOpen, setGuideModalOpen] = React.useState(false);
  const [isAIGenerateSectionModalOpen, setIsAIGenerateSectionModalOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState('');

  const handleGuideClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    setGuideModalOpen(true);
  };

  const handleAIWriteClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    setIsAIGenerateSectionModalOpen(true);
  };

  const handleAIGenerate = (prompt: string) => {
    setIsAIGenerateSectionModalOpen(false);
    const updatedSectionContent = `[AI 작성 예시] ${prompt}에 대한 내용입니다... (실제 연동 시 생성된 텍스트)`;
    setCoverLetterData(prev => ({ ...prev, [selectedSection]: updatedSectionContent }));
  };

  const section = coverLetterSections[activeStep];

  if (!section) return null;

  return (
    <Box sx={{ py: 2 }}>
      <Box key={section.id} sx={glassSectionSx}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155', mb: 0.5 }}>
              {section.label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              {section.desc}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="작성 가이드 보기">
              <IconButton
                onClick={() => handleGuideClick(section.id)}
                sx={{ color: '#94a3b8', '&:hover': { color: '#2563EB', bgcolor: 'rgba(37,99,235,0.05)' } }}
              >
                <HelpOutline />
              </IconButton>
            </Tooltip>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AutoAwesome />}
              onClick={() => handleAIWriteClick(section.id)}
              disabled={isGenerating}
              sx={{
                ...actionButtonSx,
                borderColor: 'rgba(37, 99, 235, 0.3)',
                color: '#2563EB',
                bgcolor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: '#2563EB',
                  bgcolor: 'rgba(37, 99, 235, 0.05)',
                },
              }}
            >
              AI 초안 작성
            </Button>
          </Stack>
        </Box>
        <TextField
          fullWidth
          id={section.id}
          name={section.id}
          multiline
          minRows={section.rows}
          value={coverLetterData[section.id as keyof typeof coverLetterData]}
          onChange={handleChange}
          placeholder={`${section.label} 내용을 입력하세요.`}
          disabled={isGenerating}
          variant="outlined"
          sx={glassInputSx}
        />
      </Box>

      <CustomModal
        open={isGuideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        title="작성 가이드"
      >
        <WritingGuide section={selectedSection} />
      </CustomModal>

      <CustomModal
        open={isAIGenerateSectionModalOpen}
        onClose={() => setIsAIGenerateSectionModalOpen(false)}
        title="AI 초안 작성"
      >
        <AIWriter
          section={selectedSection}
          onGenerate={handleAIGenerate}
          isGenerating={isGenerating}
        />
      </CustomModal>
    </Box>
  );
};

export default CoverLetterDirectInputStep;
