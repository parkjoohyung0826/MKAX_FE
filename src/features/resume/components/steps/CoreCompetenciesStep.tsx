'use client';

import React from 'react';
import { Box } from '@mui/material';
import { WorkspacePremium } from '@mui/icons-material';
import { useResumeStore } from '../../store';
import ResumeAssistantTextSection from './AssistantTextSection';
import StepHeader from './StepHeader';

const CoreCompetenciesStep = () => {
  const { resumeData, setResumeData, setResumeValidation, validationLock, setValidationLock } = useResumeStore();

  const submitCoreCompetencies = async (
    text: string
  ): Promise<{ missingInfo?: string; isComplete?: boolean }> => {
    const res = await fetch('/api/recommend/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userInput: text, currentSummary: resumeData.coreCompetencies }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? '교육사항/대외활동 생성에 실패했습니다.');
    }

    const data = await res.json();
    const missingInfo = String(data?.missingInfo ?? '');
    const isComplete =
      typeof data?.isComplete === 'boolean'
        ? data.isComplete
        : missingInfo.trim().length === 0;
    const fullDescription = String(data?.fullDescription ?? '').trim();
    if (fullDescription.length > 0) {
      setResumeData({ coreCompetencies: fullDescription });
    }
    setResumeValidation({ coreCompetencies: isComplete });
    return {
      missingInfo,
      isComplete,
    };
  };

  const handleValidateActivity = async (): Promise<{ missingInfo?: string; isComplete?: boolean }> => {
    const text = resumeData.coreCompetencies.trim();
    const res = await fetch('/api/recommend/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userInput: text, currentSummary: resumeData.coreCompetencies }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? '교육사항/대외활동 검증에 실패했습니다.');
    }

    const data = await res.json();
    const missingInfo = String(data?.missingInfo ?? '');
    const isComplete =
      typeof data?.isComplete === 'boolean'
        ? data.isComplete
        : missingInfo.trim().length === 0;
    const fullDescription = String(data?.fullDescription ?? '').trim();
    if (fullDescription.length > 0) {
      setResumeData({ coreCompetencies: fullDescription });
    }
    setResumeValidation({ coreCompetencies: isComplete });
    return { missingInfo, isComplete };
  };

  const handleChangeActivity = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setResumeData({ coreCompetencies: value });
    setResumeValidation({ coreCompetencies: false });
    setValidationLock({ coreCompetencies: false });
  };

  return (
    <Box sx={{ py: 2 }}>
      <StepHeader
        title="주요활동"
        subtitle="교육 및 대외활동 등 주요 활동 정보를 입력해주세요."
      />

      <ResumeAssistantTextSection
        sectionTitle="교육사항 / 대외활동"
        sectionHint="최신순 기재 권장 (활동명, 기간, 역할, 주요 성과 등)"
        icon={<WorkspacePremium fontSize="small" sx={{ color: '#64748b' }} />}
        assistantTitle="교육사항/대외활동 AI"
        assistantPrompt="참여했던 교육 프로그램, 대외 활동, 동아리 활동 등에 대해 자유롭게 이야기해주세요."
        onAssistantSubmit={submitCoreCompetencies}
        onValidate={handleValidateActivity}
        value={resumeData.coreCompetencies}
        onChange={handleChangeActivity}
        isValidated={validationLock.coreCompetencies}
        onValidatedChange={(validated) => {
          setValidationLock({ coreCompetencies: validated });
          if (!validated) {
            setResumeValidation({ coreCompetencies: false });
          }
        }}
        rows={7}
        name="coreCompetencies"
        placeholder={`예: 삼성 청년 SW 아카데미 (SSAFY) 10기 수료 (2023.07 ~ 2024.01)\nOOO 대외활동 (2022.01 ~ 2022.06) - 프로젝트 관리 및 기획 담당`}
      />
    </Box>
  );
};

export default CoreCompetenciesStep;
