'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import AIChatView, { ConversationStep, AIChatViewHandle } from '@/features/resume/components/AIChatView';
import CareerTypeSelectStep from './steps/CareerTypeSelectStep';
import CoverLetterDirectInputStep from './steps/CoverLetterDirectInputStep';
import CoverLetterTemplateSelectStep from './steps/CoverLetterTemplateSelectStep';
import FinalReviewStep from './steps/FinalReviewStep';
import QuestionPanel from './chat-panels/QuestionPanel';
import ProgressStepper from '@/shared/components/ProgressStepper';
import ModeToggleBar from '@/shared/components/ModeToggleBar';

import { CoverLetterData } from '../types';
import { useCoverLetterStore } from '../store';
import { coverLetterSectionOrder, getCoverLetterCareerTypeCopy } from '../careerTypeCopy';
import { coverLetterApiByMode, toCareerMode } from '@/shared/constants/careerModeApi';

type InputMode = 'ai' | 'direct';

const stepSlideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? 32 : -32,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -32 : 32,
  }),
};

interface Props {
  handleGenerate: () => void | Promise<void>;
  isGenerating: boolean;
}

const CoverLetter = ({ handleGenerate, isGenerating }: Props) => {
  const { coverLetterData, setCoverLetterData, selectedTemplate, selectedCareerType } = useCoverLetterStore();
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [stepInputModes, setStepInputModes] = useState<Record<number, InputMode>>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const aiChatRef = useRef<AIChatViewHandle | null>(null);
  const mode = toCareerMode(selectedCareerType);
  const copy = useMemo(() => getCoverLetterCareerTypeCopy(selectedCareerType), [selectedCareerType]);
  const contentSteps = useMemo(
    () => coverLetterSectionOrder.map((sectionId) => copy.sections[sectionId].stepLabel),
    [copy],
  );
  const progressSteps = contentSteps;
  const coverLetterSteps = useMemo(
    () => ['작성 유형 선택', '템플릿 선택', ...contentSteps, '최종 검토'],
    [contentSteps],
  );
  const coverLetterConversationSteps = useMemo<ConversationStep<CoverLetterData>[]>(() => [
    {
      title: copy.sections.growthProcess.stepLabel,
      panel: (data) => <QuestionPanel data={data} section="growthProcess" title={copy.sections.growthProcess.panelTitle} />,
      fields: [
        { field: 'growthProcess', question: copy.sections.growthProcess.chatQuestion },
      ]
    },
    {
      title: copy.sections.strengthsAndWeaknesses.stepLabel,
      panel: (data) => (
        <QuestionPanel
          data={data}
          section="strengthsAndWeaknesses"
          title={copy.sections.strengthsAndWeaknesses.panelTitle}
        />
      ),
      fields: [
        { field: 'strengthsAndWeaknesses', question: copy.sections.strengthsAndWeaknesses.chatQuestion },
      ]
    },
    {
      title: copy.sections.keyExperience.stepLabel,
      panel: (data) => <QuestionPanel data={data} section="keyExperience" title={copy.sections.keyExperience.panelTitle} />,
      fields: [
        { field: 'keyExperience', question: copy.sections.keyExperience.chatQuestion },
      ]
    },
    {
      title: copy.sections.motivation.stepLabel,
      panel: (data) => <QuestionPanel data={data} section="motivation" title={copy.sections.motivation.panelTitle} />,
      fields: [
        { field: 'motivation', question: copy.sections.motivation.chatQuestion },
      ]
    },
  ], [copy]);

  const coverLetterCompletedSteps = [
    Boolean(selectedCareerType),
    Boolean(selectedTemplate),
    !!coverLetterData.growthProcess,
    !!coverLetterData.strengthsAndWeaknesses,
    !!coverLetterData.keyExperience,
    !!coverLetterData.motivation,
    false,
  ];

  const handleNextStep = () => {
    if (isTypeStep && !selectedCareerType) {
      setToastMessage('작성 유형(기본형/시니어용)을 먼저 선택해주세요.');
      setToastOpen(true);
      return;
    }

    if (isTemplateStep && !selectedTemplate) {
      setToastMessage('템플릿을 먼저 선택해주세요.');
      setToastOpen(true);
      return;
    }

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

  const handleProgressStepClick = (step: number) => {
    handleStepClick(step + 2);
  };

  const handleModeChange = (step: number, mode: InputMode) => {
    setStepInputModes(prev => ({...prev, [step]: mode}));
  }
  
  const isTypeStep = activeStep === 0;
  const isTemplateStep = activeStep === 1;
  const isFinalStep = activeStep === coverLetterSteps.length - 1;
  const currentMode = stepInputModes[activeStep] || 'ai';
  const contentStepIndex = Math.max(activeStep - 2, 0);
  const progressActiveStep = Math.min(Math.max(activeStep - 2, 0), progressSteps.length - 1);
  const isContentStep = !isTypeStep && !isTemplateStep && !isFinalStep;
  const [persistentContentStepIndex, setPersistentContentStepIndex] = useState(0);
  const [shouldPersistAiChat, setShouldPersistAiChat] = useState(false);

  useEffect(() => {
    if (isContentStep) {
      setPersistentContentStepIndex(contentStepIndex);
    }
  }, [contentStepIndex, isContentStep]);

  useEffect(() => {
    if (isContentStep) {
      setShouldPersistAiChat(true);
    }
  }, [isContentStep]);

  const showAiChatView = currentMode === 'ai' && isContentStep;
  const showNonAiPanel = !showAiChatView;

  return (
    <Box>
      {!isTypeStep && !isTemplateStep && !isFinalStep && (
        <Box sx={{ mt: -3 }}>
          <ProgressStepper
            steps={progressSteps}
            activeStep={progressActiveStep}
            onStepClick={handleProgressStepClick}
            completedSteps={coverLetterCompletedSteps.slice(2, -1)}
          />
        </Box>
      )}
      {!isFinalStep && !isTemplateStep && !isTypeStep && (
        <ModeToggleBar
          currentMode={currentMode}
          onModeChange={(mode) => handleModeChange(activeStep, mode)}
          onReset={() => aiChatRef.current?.resetCurrentStep()}
          resetDisabled={currentMode !== 'ai'}
        />
      )}
      {shouldPersistAiChat && (
        <Box sx={{ display: showAiChatView ? 'block' : 'none' }}>
          <AIChatView
            ref={aiChatRef}
            activeStep={persistentContentStepIndex}
            steps={contentSteps}
            onStepComplete={() => setIsStepComplete(true)}
            onResetChat={async (args) => {
              const sections = args?.sections?.length
                ? args.sections
                : args?.section
                  ? [args.section]
                  : [];
              if (sections.length === 0) return;
              await Promise.all(
                sections.map((section) =>
                  fetch('/api/cover-letter/chat/reset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ section }),
                  })
                )
              );
            }}
            data={coverLetterData}
            setData={(update) => {
              const newValues =
                typeof update === 'function'
                  ? update(coverLetterData)
                  : update;
              setCoverLetterData({ ...coverLetterData, ...newValues });
            }}
            conversationSteps={coverLetterConversationSteps}
            hideResetButton
            fieldApiConfigs={{
              growthProcess: {
                endpoint: coverLetterApiByMode[mode].growthProcess,
                summaryField: 'growthProcessSummary',
                resetSection: 'GROWTH_PROCESS',
              },
              strengthsAndWeaknesses: {
                endpoint: coverLetterApiByMode[mode].strengthsAndWeaknesses,
                summaryField: 'strengthsAndWeaknessesSummary',
                resetSection: 'PERSONALITY',
              },
              keyExperience: {
                endpoint: coverLetterApiByMode[mode].keyExperience,
                summaryField: 'keyExperienceSummary',
                resetSection: 'CAREER_STRENGTH',
              },
              motivation: {
                endpoint: coverLetterApiByMode[mode].motivation,
                summaryField: 'motivationSummary',
                resetSection: 'MOTIVATION_ASPIRATION',
              },
            }}
          />
        </Box>
      )}
      <AnimatePresence mode="wait" initial={false}>
        {showNonAiPanel && (
          <motion.div
            custom={direction}
            variants={stepSlideVariants}
            key={`${activeStep}-${currentMode}`}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {isTypeStep && <CareerTypeSelectStep />}
            {isTemplateStep && <CoverLetterTemplateSelectStep />}
            {isFinalStep && <FinalReviewStep />}
            <Box sx={{ display: currentMode === 'direct' ? (isFinalStep || isTemplateStep || isTypeStep ? 'none' : 'block') : 'none' }}>
              <CoverLetterDirectInputStep
                  activeStep={contentStepIndex}
                  isGenerating={isGenerating}
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <Button disabled={activeStep === 0} onClick={handleBackStep} sx={{ color: '#64748b', fontWeight: 600, px: 3, py: 1, borderRadius: '20px', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }} >
          이전 단계
        </Button>
        <Button variant="contained" onClick={handleNextStep} sx={{ px: 4, py: 1.2, borderRadius: '30px', fontWeight: 700, boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)', background: 'linear-gradient(45deg, #2563EB, #1d4ed8)' }} >
          {activeStep === coverLetterSteps.length - 1 ? '자기소개서 완성하기' : '다음'}
        </Button>
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="warning"
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CoverLetter;
