'use client';

import React from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import ProgressStepper from '@/shared/components/ProgressStepper';
import FinalReviewStep from './steps/FinalReviewStep';
import AIChatView, { ConversationStep } from './AIChatView';
import ConversationalForm from './ConversationalForm';
import { ResumeData } from '../types';

type InputMode = 'direct' | 'ai';

interface Props {
  activeStep: number;
  direction: number;
  steps: string[];
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  resumeInputMode: InputMode;
  setResumeInputMode: (mode: InputMode) => void;
  handleNextStep: () => void;
  handleBackStep: () => void;
  setIsStepComplete: (isComplete: boolean) => void;
  conversationSteps: ConversationStep<ResumeData>[];
}

const Resume = ({
  activeStep,
  direction,
  steps,
  resumeData,
  setResumeData,
  resumeInputMode,
  setResumeInputMode,
  handleNextStep,
  handleBackStep,
  setIsStepComplete,
  conversationSteps
}: Props) => {
  const renderResumeContent = () => {
    const isFinalStep = activeStep === steps.length - 1;

    if (isFinalStep) {
      return <FinalReviewStep data={resumeData} />;
    }

    if (resumeInputMode === 'ai') {
      return (
        <AIChatView
          activeStep={activeStep}
          steps={steps}
          onStepComplete={() => setIsStepComplete(true)}
          data={resumeData}
          setData={setResumeData}
          conversationSteps={conversationSteps}
        />
      );
    }

    if (resumeInputMode === 'direct') {
      return (
        <ConversationalForm
          activeStep={activeStep}
          direction={direction}
          steps={steps}
          resumeData={resumeData}
          setResumeData={setResumeData}
        />
      );
    }
  };

  return (
    <Box>
      <Box sx={{ mt: -3 }}>
        <ProgressStepper steps={steps} activeStep={activeStep} />
      </Box>
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
            variant={resumeInputMode === mode ? 'contained' : 'text'}
            onClick={() => setResumeInputMode(mode)}
            sx={{
              borderRadius: '12px !important',
              py: 1.5,
              boxShadow: resumeInputMode === mode ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
              bgcolor: resumeInputMode === mode ? '#2563EB' : 'transparent',
              color: resumeInputMode === mode ? 'white' : '#64748b',
              border: 'none',
              '&:hover': {
                bgcolor: resumeInputMode === mode ? '#1d4ed8' : 'rgba(0,0,0,0.05)',
                border: 'none',
              },
            }}
          >
            {mode === 'ai' ? 'AI 챗봇으로 작성' : '단계별로 직접 입력'}
          </Button>
        ))}
      </ButtonGroup>

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
          {activeStep === steps.length - 1 ? '자기소개서 작성' : '다음'}
        </Button>
      </Box>
    </Box>
  );
};

export default Resume;
