'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Verified } from '@mui/icons-material';
import { useResumeStore } from '../../store';
import ResumeAssistantTextSection from './AssistantTextSection';
import StepHeader from './StepHeader';

const CertificationsStep = () => {
  const { resumeData, setResumeData, setResumeValidation, validationLock, setValidationLock } = useResumeStore();

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
        title="자격증"
        subtitle="자격증 및 어학 정보를 입력해주세요."
      />

      <ResumeAssistantTextSection
        sectionTitle="자격증 및 어학"
        sectionHint="취득일 최신순 기재 권장 (자격증명/점수, 발급기관, 취득일)"
        icon={<Verified fontSize="small" sx={{ color: '#64748b' }} />}
        assistantTitle="자격증/어학 AI"
        assistantPrompt="취득한 자격증, 면허, 어학 성적 등에 대해 자유롭게 이야기해주세요."
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
        placeholder={`예: 정보처리기사 (2023.05)\nTOEIC 900 (2023.08)`}
      />
    </Box>
  );
};

export default CertificationsStep;
