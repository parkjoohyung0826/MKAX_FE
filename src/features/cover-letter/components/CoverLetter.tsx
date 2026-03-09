'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import AIChatView, { ConversationStep, AIChatViewHandle } from '@/features/resume/components/AIChatView';
import CareerTypeSelectStep from './steps/CareerTypeSelectStep';
import CoverLetterDirectInputStep from './steps/CoverLetterDirectInputStep';
import CoverLetterTemplateSelectStep from './steps/CoverLetterTemplateSelectStep';
import CoverLetterQuestionModeStep from './steps/CoverLetterQuestionModeStep';
import CoverLetterCompanyQuestionSetupStep from './steps/CoverLetterCompanyQuestionSetupStep';
import CoverLetterCompanyDirectInputStep from './steps/CoverLetterCompanyDirectInputStep';
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
  const {
    coverLetterData,
    setCoverLetterData,
    selectedTemplate,
    selectedCareerType,
    selectedQuestionMode,
    companyQuestions,
  } = useCoverLetterStore();
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [stepInputModes, setStepInputModes] = useState<Record<number, InputMode>>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const aiChatRef = useRef<AIChatViewHandle | null>(null);

  const mode = toCareerMode(selectedCareerType);
  const copy = useMemo(() => getCoverLetterCareerTypeCopy(selectedCareerType), [selectedCareerType]);
  const defaultContentSteps = useMemo(
    () => coverLetterSectionOrder.map((sectionId) => copy.sections[sectionId].stepLabel),
    [copy],
  );
  const isCompanyMode = selectedQuestionMode === 'company';
  const contentSteps = useMemo(
    () => (isCompanyMode ? companyQuestions.map((_, index) => `문항 ${index + 1}`) : defaultContentSteps),
    [companyQuestions, defaultContentSteps, isCompanyMode],
  );

  const hasCompanySetupStep = isCompanyMode;
  const typeStepIndex = 0;
  const templateStepIndex = 1;
  const questionModeStepIndex = 2;
  const companySetupStepIndex = hasCompanySetupStep ? 3 : -1;
  const contentStartIndex = hasCompanySetupStep ? 4 : 3;

  const coverLetterSteps = useMemo(
    () => [
      '작성 유형 선택',
      '템플릿 선택',
      '문항 유형 선택',
      ...(hasCompanySetupStep ? ['기업 문항 설정'] : []),
      ...contentSteps,
      '최종 검토',
    ],
    [contentSteps, hasCompanySetupStep],
  );

  const isTypeStep = activeStep === typeStepIndex;
  const isTemplateStep = activeStep === templateStepIndex;
  const isQuestionModeStep = activeStep === questionModeStepIndex;
  const isCompanySetupStep = hasCompanySetupStep && activeStep === companySetupStepIndex;
  const isFinalStep = activeStep === coverLetterSteps.length - 1;
  const isContentStep = activeStep >= contentStartIndex && activeStep < coverLetterSteps.length - 1;
  const contentStepIndex = Math.max(activeStep - contentStartIndex, 0);
  const currentMode: InputMode = isCompanyMode ? 'direct' : (stepInputModes[activeStep] || 'ai');

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

  const contentCompletedSteps = isCompanyMode
    ? companyQuestions.map((item) => Boolean(item.answer.trim()))
    : [
        Boolean(coverLetterData.growthProcess),
        Boolean(coverLetterData.strengthsAndWeaknesses),
        Boolean(coverLetterData.keyExperience),
        Boolean(coverLetterData.motivation),
      ];

  const progressActiveStep = contentSteps.length > 0
    ? Math.min(Math.max(activeStep - contentStartIndex, 0), contentSteps.length - 1)
    : 0;
  const companySetupCompleted = !isCompanyMode || (
    companyQuestions.length > 0 && companyQuestions.every((item) => item.question.trim().length > 0)
  );

  const [persistentContentStepIndex, setPersistentContentStepIndex] = useState(0);
  const [shouldPersistAiChat, setShouldPersistAiChat] = useState(false);

  useEffect(() => {
    if (activeStep > coverLetterSteps.length - 1) {
      setActiveStep(coverLetterSteps.length - 1);
    }
  }, [activeStep, coverLetterSteps.length]);

  useEffect(() => {
    if (!isCompanyMode && isContentStep) {
      setPersistentContentStepIndex(contentStepIndex);
    }
  }, [contentStepIndex, isCompanyMode, isContentStep]);

  useEffect(() => {
    if (!isCompanyMode && isContentStep) {
      setShouldPersistAiChat(true);
    }
  }, [isCompanyMode, isContentStep]);

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

    if (isQuestionModeStep && !selectedQuestionMode) {
      setToastMessage('문항 유형(기본 문항/기업별 문항)을 먼저 선택해주세요.');
      setToastOpen(true);
      return;
    }

    if (isCompanySetupStep && !companySetupCompleted) {
      setToastMessage('기업별 문항을 1개 이상 작성하고, 각 문항 내용을 입력해주세요.');
      setToastOpen(true);
      return;
    }

    if (activeStep === coverLetterSteps.length - 1) {
      handleGenerate();
      return;
    }

    setDirection(1);
    setActiveStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setDirection(-1);
    setActiveStep((prev) => prev - 1);
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
    handleStepClick(step + contentStartIndex);
  };

  const handleModeChange = (step: number, modeValue: InputMode) => {
    setStepInputModes((prev) => ({ ...prev, [step]: modeValue }));
  };

  const showAiChatView = !isCompanyMode && currentMode === 'ai' && isContentStep;
  const showNonAiPanel = !showAiChatView;

  return (
    <Box>
      {isContentStep && contentSteps.length > 0 && (
        <Box sx={{ mt: -3 }}>
          <ProgressStepper
            steps={contentSteps}
            activeStep={progressActiveStep}
            onStepClick={handleProgressStepClick}
            completedSteps={contentCompletedSteps}
          />
        </Box>
      )}
      {!isFinalStep && !isTypeStep && !isTemplateStep && !isQuestionModeStep && !isCompanyMode && isContentStep && (
        <ModeToggleBar
          currentMode={currentMode}
          onModeChange={(modeValue) => handleModeChange(activeStep, modeValue)}
          onReset={() => aiChatRef.current?.resetCurrentStep()}
          resetDisabled={currentMode !== 'ai'}
        />
      )}
      {shouldPersistAiChat && (
        <Box sx={{ display: showAiChatView ? 'block' : 'none' }}>
          <AIChatView
            ref={aiChatRef}
            activeStep={persistentContentStepIndex}
            steps={defaultContentSteps}
            onStepComplete={() => undefined}
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
            key={isContentStep ? `${activeStep}-${currentMode}` : `${activeStep}`}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {isTypeStep && <CareerTypeSelectStep />}
            {isTemplateStep && <CoverLetterTemplateSelectStep />}
            {isQuestionModeStep && <CoverLetterQuestionModeStep />}
            {isCompanySetupStep && <CoverLetterCompanyQuestionSetupStep />}
            {isFinalStep && <FinalReviewStep />}

            {!isFinalStep && isContentStep && isCompanyMode && (
              <CoverLetterCompanyDirectInputStep activeStep={contentStepIndex} />
            )}

            {!isFinalStep && isContentStep && !isCompanyMode && currentMode === 'direct' && (
              <CoverLetterDirectInputStep
                activeStep={contentStepIndex}
                isGenerating={isGenerating}
              />
            )}
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
