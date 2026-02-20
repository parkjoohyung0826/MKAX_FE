'use client';

import React from 'react';
import { Box } from '@mui/material';
import { WorkspacePremium } from '@mui/icons-material';
import { useResumeStore } from '../../store';
import { getResumeCareerTypeCopy } from '../../careerTypeCopy';
import ResumeAssistantTextSection from './AssistantTextSection';
import StepHeader from './StepHeader';

const CoreCompetenciesStep = () => {
  const { resumeData, setResumeData, setResumeValidation, validationLock, setValidationLock, selectedCareerType } = useResumeStore();
  const copy = getResumeCareerTypeCopy(selectedCareerType);

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
        title={copy.coreStepTitle}
        subtitle={copy.coreStepSubtitle}
      />

      <ResumeAssistantTextSection
        sectionTitle={copy.coreSectionTitle}
        sectionHint={copy.coreSectionHint}
        icon={<WorkspacePremium fontSize="small" sx={{ color: '#64748b' }} />}
        assistantTitle={copy.coreAssistantTitle}
        assistantPrompt={copy.coreAssistantPrompt}
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
        placeholder={copy.corePlaceholder}
      />
    </Box>
  );
};

export default CoreCompetenciesStep;
