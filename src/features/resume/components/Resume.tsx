'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import ProgressStepper from '@/shared/components/ProgressStepper';
import FinalReviewStep from './steps/FinalReviewStep';
import AIChatView, { ConversationStep, AIChatViewHandle } from './AIChatView';
import ConversationalForm from './ConversationalForm';
import { ResumeData } from '../types';
import { useResumeStore } from '../store';
import TemplateSelectStep from './steps/TemplateSelectStep';
import { AnimatePresence, motion } from 'framer-motion';
import ModeToggleBar from '@/shared/components/ModeToggleBar';

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
      { field: 'coreCompetencies', question: '참여했던 교육 프로그램, 대외 활동, 동아리 활동 등에 대해 자유롭게 이야기해주세요.' },
      { field: 'certifications', question: '자격증 또는 어학 성적이 있다면 알려주세요.' },
    ]
  }
];

const resumeSteps = ['템플릿 선택', '기본 정보', '학력 사항', '경력 사항', '자격증/주요활동', '최종 검토'];
const contentSteps = resumeSteps.slice(1);
const progressSteps = resumeSteps.slice(1);

interface Props {
  onFinishResume: () => void;
}

const Resume = ({ onFinishResume }: Props) => {
  const {
    resumeData,
    setResumeData,
    resumeValidation,
    setResumeValidation,
    setValidationLock,
    selectedTemplate,
  } = useResumeStore();
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [stepInputModes, setStepInputModes] = useState<Record<number, InputMode>>({});
  const [aiCompletedSteps, setAiCompletedSteps] = useState<Record<number, boolean>>({});
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const currentMode = stepInputModes[activeStep] || 'ai';
  const isTemplateStep = activeStep === 0;
  const isFinalStep = activeStep === resumeSteps.length - 1;
  const contentStepIndex = Math.max(activeStep - 1, 0);
  const progressActiveStep = Math.max(activeStep - 1, 0);
  const aiChatRef = useRef<AIChatViewHandle | null>(null);

  const directCompletedSteps = [
    Boolean(selectedTemplate),
    !!(resumeData.name && resumeData.desiredJob && resumeData.email && resumeData.phoneNumber),
    resumeValidation.education,
    resumeValidation.workExperience,
    resumeValidation.coreCompetencies && resumeValidation.certifications,
    false,
  ];

  const completedSteps = directCompletedSteps.map((completed, index) => {
    if (index === 0 || index === resumeSteps.length - 1) {
      return completed;
    }
    const mode = stepInputModes[index] ?? 'ai';
    return mode === 'ai' ? !!aiCompletedSteps[index] : completed;
  });

  const handleNextStep = async () => {
    if (activeStep === resumeSteps.length - 1) {
      const incomplete = completedSteps
        .slice(0, resumeSteps.length - 1)
        .map((done, index) => ({ done, label: resumeSteps[index] }))
        .filter((item) => !item.done)
        .map((item) => item.label);

      if (incomplete.length > 0) {
        setToastMessage(`${incomplete.join(', ')} 내용을 먼저 작성해주세요.`);
        setToastOpen(true);
        return;
      }

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

  const handleProgressStepClick = (step: number) => {
    handleStepClick(step + 1);
  };

  const handleModeChange = (step: number, mode: InputMode) => {
    setStepInputModes(prev => ({...prev, [step]: mode}));
  }

  const renderModeToggle = () => {
    if (isFinalStep || isTemplateStep) return null;
    return (
      <ModeToggleBar
        currentMode={currentMode}
        onModeChange={(mode) => handleModeChange(activeStep, mode)}
        onReset={() => aiChatRef.current?.resetCurrentStep()}
        resetDisabled={currentMode !== 'ai'}
      />
    );
  };

  const renderStepBody = () => {
    if (isTemplateStep) {
      return <TemplateSelectStep />;
    }

    if (isFinalStep) {
      return <FinalReviewStep data={resumeData} />;
    }

    return (
      <>
        <Box sx={{ display: currentMode === 'ai' ? 'block' : 'none' }}>
          <AIChatView
            ref={aiChatRef}
            activeStep={contentStepIndex}
            steps={contentSteps}
            onStepComplete={() => {
              setIsStepComplete(true);
              setAiCompletedSteps((prev) => ({ ...prev, [activeStep]: true }));
            }}
            onResetChat={async (args) => {
              const sections = args?.sections?.length
                ? args.sections
                : args?.section
                  ? [args.section]
                  : [];
              if (sections.length === 0) return;
              await Promise.all(
                sections.map((section) =>
                  fetch('/api/recommend/chat/reset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ section }),
                  })
                )
              );
            }}
            onFieldsReset={(fields) => {
              fields.forEach((field) => {
                if (field === 'education') {
                  setResumeValidation({ education: false });
                  setValidationLock({ education: false });
                }
                if (field === 'workExperience') {
                  setResumeValidation({ workExperience: false });
                  setValidationLock({ workExperience: false });
                }
                if (field === 'coreCompetencies') {
                  setResumeValidation({ coreCompetencies: false });
                  setValidationLock({ coreCompetencies: false });
                }
                if (field === 'certifications') {
                  setResumeValidation({ certifications: false });
                  setValidationLock({ certifications: false });
                }
              });
            }}
            onFieldComplete={(field) => {
              if (field === 'education') {
                setResumeValidation({ education: true });
                setValidationLock({ education: true });
              }
              if (field === 'workExperience') {
                setResumeValidation({ workExperience: true });
                setValidationLock({ workExperience: true });
              }
              if (field === 'coreCompetencies') {
                setResumeValidation({ coreCompetencies: true });
                setValidationLock({ coreCompetencies: true });
              }
              if (field === 'certifications') {
                setResumeValidation({ certifications: true });
                setValidationLock({ certifications: true });
              }
            }}
            hideResetButton
            data={resumeData}
            setData={(update) => {
              setResumeData((prev) => (
                typeof update === 'function'
                  ? update(prev)
                  : update
              ));
            }}
            resetSectionMap={{
              name: 'PROFILE',
              englishName: 'PROFILE',
              desiredJob: 'PROFILE',
              dateOfBirth: 'PROFILE',
              email: 'PROFILE',
              phoneNumber: 'PROFILE',
              address: 'PROFILE',
              emergencyContact: 'PROFILE',
              education: 'EDUCATION',
              workExperience: 'CAREER',
              coreCompetencies: 'ACTIVITY',
              certifications: 'CERTIFICATION',
            }}
            conversationSteps={resumeConversationSteps}
          />
        </Box>
        <Box sx={{ display: currentMode === 'direct' ? 'block' : 'none' }}>
          <ConversationalForm
            activeStep={contentStepIndex}
            direction={direction}
            steps={contentSteps}
          />
        </Box>
      </>
    );
  };

  return (
    <Box>
      {!isTemplateStep && (
        <Box sx={{ mt: -3 }}>
          <ProgressStepper
            steps={progressSteps}
            activeStep={progressActiveStep}
            onStepClick={handleProgressStepClick}
            completedSteps={completedSteps.slice(1)}
          />
        </Box>
      )}
      {renderModeToggle()}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {renderStepBody()}
        </motion.div>
      </AnimatePresence>

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
          {activeStep === resumeSteps.length - 1 ? '이력서 작성 완료' : '다음'}
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

export default Resume;
