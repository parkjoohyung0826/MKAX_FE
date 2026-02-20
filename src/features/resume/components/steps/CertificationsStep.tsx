'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Verified } from '@mui/icons-material';
import { useResumeStore } from '../../store';
import { getResumeCareerTypeCopy } from '../../careerTypeCopy';
import ResumeAssistantTextSection from './AssistantTextSection';
import StepHeader from './StepHeader';

const CertificationsStep = () => {
  const { resumeData, setResumeData, setResumeValidation, validationLock, setValidationLock, selectedCareerType } = useResumeStore();
  const copy = getResumeCareerTypeCopy(selectedCareerType);

  const submitCertifications = async (
    text: string
  ): Promise<{ missingInfo?: string; isComplete?: boolean }> => {
    const res = await fetch('/api/recommend/certification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userInput: text, currentSummary: resumeData.certifications }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? '자격증/어학 생성에 실패했습니다.');
    }

    const data = await res.json();
    const missingInfo = String(data?.missingInfo ?? '');
    const isComplete =
      typeof data?.isComplete === 'boolean'
        ? data.isComplete
        : missingInfo.trim().length === 0;
    const fullDescription = String(data?.fullDescription ?? '').trim();
    if (fullDescription.length > 0) {
      setResumeData({ certifications: fullDescription });
    }
    setResumeValidation({ certifications: isComplete });
    return {
      missingInfo,
      isComplete,
    };
  };

  const handleValidateCertifications = async (): Promise<{ missingInfo?: string; isComplete?: boolean }> => {
    const text = resumeData.certifications.trim();
    const res = await fetch('/api/recommend/certification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ userInput: text, currentSummary: resumeData.certifications }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? '자격증/어학 검증에 실패했습니다.');
    }

    const data = await res.json();
    const missingInfo = String(data?.missingInfo ?? '');
    const isComplete =
      typeof data?.isComplete === 'boolean'
        ? data.isComplete
        : missingInfo.trim().length === 0;
    const fullDescription = String(data?.fullDescription ?? '').trim();
    if (fullDescription.length > 0) {
      setResumeData({ certifications: fullDescription });
    }
    setResumeValidation({ certifications: isComplete });
    return { missingInfo, isComplete };
  };

  const handleChangeCertifacation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setResumeData({ certifications: value });
    setResumeValidation({ certifications: false });
    setValidationLock({ certifications: false });
  };

  return (
    <Box sx={{ py: 2 }}>
      <StepHeader
        title={copy.certStepTitle}
        subtitle={copy.certStepSubtitle}
      />

      <ResumeAssistantTextSection
        sectionTitle={copy.certSectionTitle}
        sectionHint={copy.certSectionHint}
        icon={<Verified fontSize="small" sx={{ color: '#64748b' }} />}
        assistantTitle={copy.certAssistantTitle}
        assistantPrompt={copy.certAssistantPrompt}
        onAssistantSubmit={submitCertifications}
        onValidate={handleValidateCertifications}
        value={resumeData.certifications}
        onChange={handleChangeCertifacation}
        isValidated={validationLock.certifications}
        onValidatedChange={(validated) => {
          setValidationLock({ certifications: validated });
          if (!validated) {
            setResumeValidation({ certifications: false });
          }
        }}
        rows={6}
        name="certifications"
        placeholder={copy.certPlaceholder}
      />
    </Box>
  );
};

export default CertificationsStep;
