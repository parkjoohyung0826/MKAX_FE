'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import ProgressStepper from '@/shared/components/ProgressStepper';
import FinalReviewStep from './steps/FinalReviewStep';
import AIChatView, { ConversationStep } from './AIChatView';
import ConversationalForm from './ConversationalForm';
import { ResumeData } from '../types';

import BasicInfoPanel from '@/features/resume/components/chat-panels/BasicInfoPanel';
import EducationPanel from '@/features/resume/components/chat-panels/EducationPanel';
import WorkExperiencePanel from '@/features/resume/components/chat-panels/WorkExperiencePanel';
import SkillsPanel from '@/features/resume/components/chat-panels/SkillsPanel';

type InputMode = 'direct' | 'ai';

const resumeConversationSteps: ConversationStep<ResumeData>[] = [
  {
    title: '기본 정보',
    panel: (data: Partial<ResumeData>) => <BasicInfoPanel data={data} />,
    fields: [
      { field: 'name', question: '안녕하세요! 이력서 작성을 도와드릴게요.\n먼저 성함(한글)을 알려주세요.' },
      { field: 'englishName', question: '영문 이름도 알려주시겠어요?' },
      { field: 'desiredJob', question: '지원하고자 하는 희망 직무는 무엇인가요?' },
      { field: 'dateOfBirth', question: '생년월일(YYYY-MM-DD)을 입력해주세요.' },
      { field: 'email', question: '이메일 주소를 알려주세요.' },
      { field: 'phoneNumber', question: '연락 가능한 휴대폰 번호를 알려주세요.' },
      { field: 'address', question: '거주 중인 주소를 입력해주세요.' },
      { field: 'emergencyContact', question: '비상 연락처도 하나 남겨주세요.' },
    ]
  },
  {
    title: '학력 사항',
    panel: (data: Partial<ResumeData>) => <EducationPanel data={data} />,
    fields: [
      { field: 'education', question: '학력 사항에 대해 알려주세요.\n(예: OO대학교 컴퓨터공학과 졸업, 2018.03 ~ 2024.02)' },
    ]
  },
  {
    title: '경력 사항',
    panel: (data: Partial<ResumeData>) => <WorkExperiencePanel data={data} />,
    fields: [
      { field: 'workExperience', question: '경력 사항이 있다면 최신순으로 알려주세요.\n(회사명, 기간, 주요 업무 등)' },
    ]
  },
  {
    title: '자격증/주요활동',
    panel: (data: Partial<ResumeData>) => <SkillsPanel data={data} />,
    fields: [
      { field: 'coreCompetencies', question: '보유하신 핵심 역량이나 기술 스택을 자유롭게 말씀해주세요.' },
      { field: 'certifications', question: '자격증, 어학 성적, 또는 주요 대외활동 경험이 있다면 알려주세요.' },
    ]
  }
];

const resumeSteps = ['기본 정보', '학력 사항', '경력 사항', '자격증/주요활동', '최종 검토'];

interface Props {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onFinishResume: () => void;
}

const Resume = ({
  resumeData,
  setResumeData,
  onFinishResume,
}: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [stepInputModes, setStepInputModes] = useState<Record<number, InputMode>>({});
  const currentMode = stepInputModes[activeStep] || 'ai';

  const completedSteps = [
    !!(resumeData.name && resumeData.desiredJob && resumeData.email && resumeData.phoneNumber),
    !!resumeData.education,
    !!resumeData.workExperience,
    !!(resumeData.coreCompetencies || resumeData.certifications),
    false,
  ];

  const handleNextStep = () => {
    if (activeStep === resumeSteps.length - 1) {
      onFinishResume();
    } else {
      setDirection(1);
      setActiveStep((prev) => prev + 1);
      setIsStepComplete(false);
    }
  };

  const handleBackStep = () => {
    setDirection(-1);
    setActiveStep((prev) => prev - 1);
    setIsStepComplete(true);
  };

  const handleStepClick = (step: number) => {
    if (step > activeStep) {
      setDirection(1);
    } else if (step < activeStep) {
      setDirection(-1);
    }
    setActiveStep(step);
  };

  const handleModeChange = (step: number, mode: InputMode) => {
    setStepInputModes(prev => ({...prev, [step]: mode}));
  }

  const renderResumeContent = () => {
    const isFinalStep = activeStep === resumeSteps.length - 1;

    if (isFinalStep) {
      return <FinalReviewStep data={resumeData} />;
    }

    return (
      <Box>
        <ButtonGroup
          fullWidth
          sx={{
            mb: 5,
            p: 0.5,
            bgcolor: '#f1f5f9',
            borderRadius: '16px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          {(['ai', 'direct'] as InputMode[]).map((mode) => (
            <Button
              key={mode}
              variant={currentMode === mode ? 'contained' : 'text'}
              onClick={() => handleModeChange(activeStep, mode)}
              sx={{
                borderRadius: '12px !important',
                py: 1.5,
                boxShadow: currentMode === mode ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
                bgcolor: currentMode === mode ? '#2563EB' : 'transparent',
                color: currentMode === mode ? 'white' : '#64748b',
                border: 'none',
                '&:hover': {
                  bgcolor: currentMode === mode ? '#1d4ed8' : 'rgba(0,0,0,0.05)',
                  border: 'none',
                },
              }}
            >
              {mode === 'ai' ? 'AI 챗봇으로 작성' : '단계별로 직접 입력'}
            </Button>
          ))}
        </ButtonGroup>
        {currentMode === 'ai' ? (
          <AIChatView
            activeStep={activeStep}
            steps={resumeSteps}
            onStepComplete={() => setIsStepComplete(true)}
            data={resumeData}
            setData={setResumeData}
            conversationSteps={resumeConversationSteps}
          />
        ) : (
          <ConversationalForm
            activeStep={activeStep}
            direction={direction}
            steps={resumeSteps}
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ mt: -3 }}>
        <ProgressStepper
          steps={resumeSteps}
          activeStep={activeStep}
          onStepClick={handleStepClick}
          completedSteps={completedSteps}
        />
      </Box>
      
      {renderResumeContent()}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 6,
          pt: 3,
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Button
          disabled={activeStep === 0}
          onClick={handleBackStep}
          sx={{
            color: '#64748b',
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: '20px',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
          }}
        >
          이전 단계
        </Button>
        <Button
          variant="contained"
          onClick={handleNextStep}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: '30px',
            fontWeight: 700,
            boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)',
            background: 'linear-gradient(45deg, #2563EB, #1d4ed8)',
          }}
        >
          {activeStep === resumeSteps.length - 1 ? '자기소개서 작성' : '다음'}
        </Button>
      </Box>
    </Box>
  );
};

export default Resume;
