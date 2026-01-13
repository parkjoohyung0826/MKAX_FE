'use client';

import React from 'react';
import { Box, Button, TextField, Typography, Card, CardContent, Paper, Stack } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
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
    console.log(`Generating for section: ${selectedSection} with prompt: ${prompt}`);
    setIsAIGenerateSectionModalOpen(false); 
    const updatedSectionContent = `AI가 '${selectedSection}' 섹션을 위한 내용을 작성했습니다: ${prompt}. (실제 AI 결과)`
    setCoverLetterData(prev => ({
        ...prev,
        [selectedSection]: updatedSectionContent
    }));
  };

  const handleAIGenerateAll = async (prompt: string) => {
    setIsAIGenerateAllModalOpen(false); 
    setIsGeneratingAll(true); 

    const newCoverLetterData = { ...coverLetterData };

    await new Promise(resolve => setTimeout(resolve, 3000)); 

    newCoverLetterData.growthProcess = `[AI 전체 작성] 성장 과정: ${prompt}. ${resumeData.name}님의 정보를 바탕으로 AI가 생성한 초안입니다.`;
    newCoverLetterData.strengthsAndWeaknesses = `[AI 전체 작성] 성격의 장단점: ${prompt}. ${resumeData.name}님의 정보를 바탕으로 AI가 생성한 초안입니다.`;
    newCoverLetterData.keyExperience = `[AI 전체 작성] 주요 경력: ${prompt}. ${resumeData.name}님의 정보를 바탕으로 AI가 생성한 초안입니다.`;
    newCoverLetterData.motivation = `[AI 전체 작성] 지원 동기: ${prompt}. ${resumeData.name}님의 정보를 바탕으로 AI가 생성한 초안입니다.`;

    setCoverLetterData(newCoverLetterData); 
    setIsGeneratingAll(false);
  };

  const coverLetterSections = [
    { id: 'growthProcess', label: '성장과정', rows: 6 },
    { id: 'strengthsAndWeaknesses', label: '성격의 장단점', rows: 6 },
    { id: 'keyExperience', label: '주요 경력 및 업무 강점', rows: 6 },
    { id: 'motivation', label: '지원 동기 및 입사 후 포부', rows: 6 },
  ];

  return (
    <Card sx={{ p: 3, boxShadow: 'none' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            자기소개서 작성
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AutoAwesome />}
            onClick={() => setIsAIGenerateAllModalOpen(true)} 
            disabled={isGenerating || isGeneratingAll} 
          >
            {isGeneratingAll ? 'AI가 전체 작성 중...' : 'AI로 전체 작성'}
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          아래 항목에 맞춰 자기소개서를 작성해 보세요. AI의 도움이 필요하면 각 항목 옆의 ✨ 버튼을 눌러보세요.
        </Typography>

        <Stack spacing={4}>
          {coverLetterSections.map((section) => (
            <Paper key={section.id} variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium' }}>
                  {section.label}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleGuideClick(section.id)}
                    sx={{
                      color: 'primary.main',
                      borderColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        borderColor: 'primary.dark',
                      },
                    }}
                  >
                    작성 가이드
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AutoAwesome />}
                    onClick={() => handleAIWriteClick(section.id)}
                    disabled={isGenerating || isGeneratingAll} // Also disable per-section AI if overall is generating
                  >
                    AI 작성
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
                placeholder={`${section.label}을 입력하세요.`}
                disabled={isGeneratingAll} // Disable individual fields while 'generate all' is active
              />
            </Paper>
          ))}

          <Button
            fullWidth
            variant="contained"
            sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
            onClick={handleGenerate}
            disabled={isGenerating || isGeneratingAll} // Disable if any generation is active
          >
            {isGenerating ? '생성 중...' : 'AI로 자기소개서 완성하기'}
          </Button>
        </Stack>

        <CustomModal
          open={isGuideModalOpen}
          onClose={() => setGuideModalOpen(false)}
          title={`${selectedSection ? coverLetterSections.find(s => s.id === selectedSection)?.label : ''} 작성 가이드`}
        >
          <WritingGuide section={selectedSection} resumeData={resumeData} />
        </CustomModal>

        <CustomModal
          open={isAIGenerateSectionModalOpen} 
          onClose={() => setIsAIGenerateSectionModalOpen(false)}
          title="AI 작성"
        >
          <AIWriter
            section={selectedSection}
            onGenerate={handleAIGenerate}
            isGenerating={isGenerating || isGeneratingAll} 
          />
        </CustomModal>

        {/* New Modal for Generate All Sections */}
        <CustomModal
          open={isAIGenerateAllModalOpen}
          onClose={() => setIsAIGenerateAllModalOpen(false)}
          title="AI로 전체 자기소개서 작성"
        >
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              자기소개서 전체 내용을 AI에게 맡겨보세요. 어떤 내용을 강조하고 싶은지 입력해주세요.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="예: 저의 강점은 빠른 학습 능력과 긍정적인 태도입니다. 지원하는 직무는 백엔드 개발입니다."
              sx={{ mb: 2 }}
              id="ai-all-prompt"
              name="ai-all-prompt"
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<AutoAwesome />}
              onClick={() => handleAIGenerateAll((document.getElementById('ai-all-prompt') as HTMLInputElement)?.value || '')}
              disabled={isGenerating || isGeneratingAll}
            >
              AI로 전체 작성 요청
            </Button>
          </Box>
        </CustomModal>
      </CardContent>
    </Card>
  );
};

export default CoverLetterEditor;
