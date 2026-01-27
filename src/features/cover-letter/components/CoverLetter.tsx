'use client';

import React, { useState } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import { motion } from 'framer-motion';

import AIChatView, { ConversationStep } from '@/features/resume/components/AIChatView';
import CoverLetterDirectInputStep from './steps/CoverLetterDirectInputStep';
import FinalReviewStep from './steps/FinalReviewStep';
import QuestionPanel from './chat-panels/QuestionPanel';
import ProgressStepper from '@/shared/components/ProgressStepper';

import { CoverLetterData } from '../types';
import { useCoverLetterStore } from '../store';

const coverLetterSteps = ['성장과정', '성격의 장단점', '주요 경력 및 업무 강점', '지원 동기 및 포부', '최종 검토'];

type InputMode = 'ai' | 'direct';

const coverLetterConversationSteps: ConversationStep<CoverLetterData>[] = [
  {
    title: '성장과정',
    panel: (data) => <QuestionPanel data={data} section="growthProcess" title="성장과정" />,
    fields: [
      { field: 'growthProcess', question: '훌륭해요! 자기소개서 작성을 시작해볼까요?\n첫 번째로, 당신의 성장과정에 대해 알려주세요. 어떤 경험이 지금의 당신을 만들었나요?' },
    ]
  },
  {
    title: '성격의 장단점',
    panel: (data) => <QuestionPanel data={data} section="strengthsAndWeaknesses" title="성격의 장단점" />,
    fields: [
      { field: 'strengthsAndWeaknesses', question: '좋습니다. 다음으로 당신의 성격적인 장점과 단점에 대해 솔직하게 이야기해주세요.' },
    ]
  },
  {
    title: '주요 경력 및 업무 강점',
    panel: (data) => <QuestionPanel data={data} section="keyExperience" title="주요 경력 및 업무 강점" />,
    fields: [
      { field: 'keyExperience', question: '이제 당신의 핵심 역량을 보여줄 차례입니다.\n가장 자신있는 주요 경력이나 업무 강점에 대해 구체적인 경험을 바탕으로 설명해주세요.' },
    ]
  },
  {
    title: '지원 동기 및 포부',
    panel: (data) => <QuestionPanel data={data} section="motivation" title="지원 동기 및 포부" />,
    fields: [
      { field: 'motivation', question: '거의 다 왔어요! 마지막으로 이 회사, 그리고 이 직무에 지원하는 동기는 무엇인가요?\n입사 후 어떤 목표를 이루고 싶으신가요?' },
    ]
  },
];

interface Props {
  handleGenerate: () => void;
  isGenerating: boolean;
}

const CoverLetter = ({ handleGenerate, isGenerating }: Props) => {
  const { coverLetterData, setCoverLetterData } = useCoverLetterStore();
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [stepInputModes, setStepInputModes] = useState<Record<number, InputMode>>({});

  const coverLetterCompletedSteps = [
    !!coverLetterData.growthProcess,
    !!coverLetterData.strengthsAndWeaknesses,
    !!coverLetterData.keyExperience,
    !!coverLetterData.motivation,
    false,
  ];

  const handleNextStep = () => {
    if (activeStep === coverLetterSteps.length - 1) {
      handleGenerate();
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
  
  const isFinalStep = activeStep === coverLetterSteps.length - 1;
  const currentMode = stepInputModes[activeStep] || 'ai';

  return (
    <Box>
      <Box sx={{mt: -3}}>
        <ProgressStepper
          steps={coverLetterSteps}
          activeStep={activeStep}
          onStepClick={handleStepClick}
          completedSteps={coverLetterCompletedSteps}
        />
      </Box>
      {!isFinalStep && (
        <ButtonGroup fullWidth sx={{ 
            mb: 5, 
            p: 0.5, 
            bgcolor: '#f1f5f9', 
            borderRadius: '16px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
          }}>
            {['ai', 'direct'].map((mode) => (
              <Button 
                key={mode}
                variant={currentMode === mode ? 'contained' : 'text'}
                onClick={() => handleModeChange(activeStep, mode as InputMode)}
                sx={{ 
                  borderRadius: '12px !important',
                  py: 1.5,
                  boxShadow: currentMode === mode ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
                  bgcolor: currentMode === mode ? '#2563EB' : 'transparent',
                  color: currentMode === mode ? 'white' : '#64748b',
                  border: 'none',
                  '&:hover': { bgcolor: currentMode === mode ? '#1d4ed8' : 'rgba(0,0,0,0.05)', border: 'none' }
                }}
              >
                {mode === 'ai' ? 'AI 챗봇으로 작성' : '단계별로 직접 입력'}
              </Button>
            ))}
        </ButtonGroup>
      )}
      <motion.div
        initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isFinalStep && <FinalReviewStep />}
        <Box sx={{ display: currentMode === 'ai' ? (isFinalStep ? 'none' : 'block') : 'none' }}>
          <AIChatView
              activeStep={activeStep}
              steps={coverLetterSteps}
              onStepComplete={() => setIsStepComplete(true)}
              data={coverLetterData}
              setData={(update) => {
                const newValues =
                  typeof update === 'function'
                    ? update(coverLetterData)
                    : update;
                setCoverLetterData({ ...coverLetterData, ...newValues });
              }}
              conversationSteps={coverLetterConversationSteps}
              fieldApiConfigs={{
                growthProcess: {
                  endpoint: '/api/cover-letter/growth-process',
                  summaryField: 'growthProcessSummary',
                },
                strengthsAndWeaknesses: {
                  endpoint: '/api/cover-letter/personality',
                  summaryField: 'strengthsAndWeaknessesSummary',
                },
                keyExperience: {
                  endpoint: '/api/cover-letter/career-strength',
                  summaryField: 'keyExperienceSummary',
                },
                motivation: {
                  endpoint: '/api/cover-letter/motivation-aspiration',
                  summaryField: 'motivationSummary',
                },
              }}
          />
        </Box>
        <Box sx={{ display: currentMode === 'direct' ? (isFinalStep ? 'none' : 'block') : 'none' }}>
          <CoverLetterDirectInputStep
              activeStep={activeStep}
              isGenerating={isGenerating}
          />
        </Box>
      </motion.div>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <Button disabled={activeStep === 0} onClick={handleBackStep} sx={{ color: '#64748b', fontWeight: 600, px: 3, py: 1, borderRadius: '20px', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }} >
          이전 단계
        </Button>
        <Button variant="contained" onClick={handleNextStep} disabled={currentMode === 'ai' && !isStepComplete && activeStep < coverLetterSteps.length -1 } sx={{ px: 4, py: 1.2, borderRadius: '30px', fontWeight: 700, boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)', background: 'linear-gradient(45deg, #2563EB, #1d4ed8)' }} >
          {activeStep === coverLetterSteps.length - 1 ? '자기소개서 완성하기' : '다음'}
        </Button>
      </Box>
    </Box>
  );
};

export default CoverLetter;
