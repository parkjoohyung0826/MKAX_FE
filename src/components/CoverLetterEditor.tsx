'use client';

import React from 'react';
import { Box, Button, TextField, Typography, Stack, IconButton, Tooltip } from '@mui/material';
import { AutoAwesome, HelpOutline } from '@mui/icons-material';
import CustomModal from './common/CustomModal';
import AIWriter from './cover-letter/AIWriter';
import { ResumeData } from './ConversationalForm';
import WritingGuide from './cover-letter/WritingGuide';

interface Props {
  coverLetterData: {
    growthProcess: string;
    strengthsAndWeaknesses: string;
    keyExperience: string;
    motivation: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setCoverLetterData: React.Dispatch<React.SetStateAction<Props['coverLetterData']>>;
  handleGenerate: () => void;
  isGenerating: boolean;
  resumeData: ResumeData;
}

// Glassmorphism 스타일 정의
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

const CoverLetterEditor = ({ coverLetterData, handleChange, setCoverLetterData, handleGenerate, isGenerating, resumeData }: Props) => {
  const [isGuideModalOpen, setGuideModalOpen] = React.useState(false);
  const [isAIGenerateSectionModalOpen, setIsAIGenerateSectionModalOpen] = React.useState(false); 
  const [isAIGenerateAllModalOpen, setIsAIGenerateAllModalOpen] = React.useState(false); 
  const [selectedSection, setSelectedSection] = React.useState('');
  const [isGeneratingAll, setIsGeneratingAll] = React.useState(false); 

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

  const handleAIGenerateAll = async (prompt: string) => {
    setIsAIGenerateAllModalOpen(false); 
    setIsGeneratingAll(true); 

    // 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 3000)); 
    
    const newCoverLetterData = { ...coverLetterData };
    const sections = ['growthProcess', 'strengthsAndWeaknesses', 'keyExperience', 'motivation'];
    sections.forEach(key => {
      // @ts-ignore
      newCoverLetterData[key] = `[AI 전체 작성] ${key}에 대한 내용: ${prompt}. ${resumeData.name}님의 데이터를 바탕으로 생성되었습니다.`;
    });

    setCoverLetterData(newCoverLetterData); 
    setIsGeneratingAll(false);
  };

  const coverLetterSections = [
    { id: 'growthProcess', label: '성장과정', rows: 8, desc: '직무에 관심을 갖게 된 계기나 가치관 형성 과정' },
    { id: 'strengthsAndWeaknesses', label: '성격의 장단점', rows: 8, desc: '직무 수행에 도움이 되는 장점과 개선 노력' },
    { id: 'keyExperience', label: '주요 경력 및 업무 강점', rows: 8, desc: '관련 경험에서의 구체적인 역할과 성과' },
    { id: 'motivation', label: '지원 동기 및 포부', rows: 8, desc: '회사 지원 이유와 입사 후 구체적 목표' },
  ];

  return (
    <Box sx={{ py: 2 }}>
      {/* 헤더 영역 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5, px: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
            자기소개서 작성
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            AI의 도움을 받아 완성도 높은 자기소개서를 작성해보세요.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AutoAwesome />}
          onClick={() => setIsAIGenerateAllModalOpen(true)} 
          disabled={isGenerating || isGeneratingAll}
          sx={{
            ...actionButtonSx,
            background: 'linear-gradient(45deg, #2563EB, #4F46E5)',
            py: 1.2,
            px: 3,
            fontSize: '0.95rem'
          }}
        >
          {isGeneratingAll ? 'AI 작성 중...' : 'AI 전체 자동 작성'}
        </Button>
      </Box>

      <Stack spacing={4}>
        {coverLetterSections.map((section) => (
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
                  disabled={isGenerating || isGeneratingAll}
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
              disabled={isGeneratingAll}
              variant="outlined"
              sx={glassInputSx}
            />
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGenerate}
            disabled={isGenerating || isGeneratingAll}
            sx={{
              py: 2,
              px: 6,
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: 600,
              boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.4)',
              background: 'linear-gradient(45deg, #2563EB, #1d4ed8)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.5)',
              }
            }}
          >
            {isGenerating ? '최종 생성 중...' : '자기소개서 완성하기'}
          </Button>
        </Box>
      </Stack>

      <CustomModal
        open={isGuideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        title="작성 가이드"
      >
        <WritingGuide section={selectedSection} resumeData={resumeData} />
      </CustomModal>

      <CustomModal
        open={isAIGenerateSectionModalOpen} 
        onClose={() => setIsAIGenerateSectionModalOpen(false)}
        title="AI 초안 작성"
      >
        <AIWriter
          section={selectedSection}
          onGenerate={handleAIGenerate}
          isGenerating={isGenerating || isGeneratingAll} 
        />
      </CustomModal>

      <CustomModal
        open={isAIGenerateAllModalOpen}
        onClose={() => setIsAIGenerateAllModalOpen(false)}
        title="AI 전체 자동 작성"
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="body1" sx={{ color: '#475569', mb: 3, lineHeight: 1.6 }}>
            전체 자기소개서를 AI가 한 번에 작성합니다.<br/>
            강조하고 싶은 핵심 키워드나 방향성을 입력해주시면 더 좋은 결과가 나옵니다.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder="예: 저는 꼼꼼함과 분석력이 강점입니다. 백엔드 성능 최적화 경험을 특히 강조하고 싶습니다."
            sx={glassInputSx}
            id="ai-all-prompt"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
             <Button
              variant="contained"
              startIcon={<AutoAwesome />}
              onClick={() => handleAIGenerateAll((document.getElementById('ai-all-prompt') as HTMLInputElement)?.value || '')}
              disabled={isGenerating || isGeneratingAll}
              sx={{ ...actionButtonSx, py: 1.5, px: 3, bgcolor: '#2563EB' }}
            >
              전체 작성 시작
            </Button>
          </Box>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default CoverLetterEditor;