'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { School } from '@mui/icons-material';
import { useResumeStore } from '../../store';
import ResumeAssistantTextSection from './AssistantTextSection';
import StepHeader from './StepHeader';

const EducationStep = () => {
  const { resumeData, setResumeData, setResumeValidation, validationLock, setValidationLock } = useResumeStore();

  const handleAssistantSubmit = async (
    text: string
  ): Promise<{ missingInfo?: string; isComplete?: boolean }> => {
    const res = await fetch("/api/recommend/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ description: text, currentSummary: resumeData.education }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? "학력 정보 생성에 실패했습니다.");
    }

    const data = await res.json();
    const missingInfo = String(data?.missingInfo ?? '');
    const isComplete =
      typeof data?.isComplete === 'boolean'
        ? data.isComplete
        : missingInfo.trim().length === 0;
    const fullDescription = String(data?.fullDescription ?? '').trim();
    if (fullDescription.length > 0) {
      setResumeData({ education: fullDescription });
    }
    setResumeValidation({ education: isComplete });
    return {
      missingInfo,
      isComplete,
    };
  };

  const handleValidate = async (): Promise<{ missingInfo?: string; isComplete?: boolean }> => {
    const text = resumeData.education.trim();
    const res = await fetch("/api/recommend/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ description: text, currentSummary: resumeData.education }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? "학력 정보 검증에 실패했습니다.");
    }

    const data = await res.json();
    const missingInfo = String(data?.missingInfo ?? '');
    const isComplete =
      typeof data?.isComplete === 'boolean'
        ? data.isComplete
        : missingInfo.trim().length === 0;
    const fullDescription = String(data?.fullDescription ?? '').trim();
    if (fullDescription.length > 0) {
      setResumeData({ education: fullDescription });
    }
    setResumeValidation({ education: isComplete });
    return { missingInfo, isComplete };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setResumeData({ education: value });
    setResumeValidation({ education: false });
    setValidationLock({ education: false });
  };


  return (
    <Box sx={{ py: 2 }}>
      <StepHeader
        title="학력 사항 입력"
        subtitle="전공 분야와 학습하신 내용을 중심으로 작성해주세요."
        hideOnMobile
      />
      
      <ResumeAssistantTextSection
        sectionTitle="최종 학력 상세"
        sectionHint="가장 높은 학력부터 순서대로 작성해주세요."
        icon={<School fontSize="small" sx={{ color: '#64748b' }} />}
        assistantTitle="학력 정보 AI"
        assistantPrompt="최종 학력, 학교명, 전공, 재학 기간, 주요 수강 과목이나 학점 등을 자유롭게 이야기해주세요. AI가 깔끔하게 정리해드립니다."
        onAssistantSubmit={handleAssistantSubmit}
        onValidate={handleValidate}
        value={resumeData.education}
        onChange={handleChange}
        isValidated={validationLock.education}
        onValidatedChange={(validated) => {
          setValidationLock({ education: validated });
          if (!validated) {
            setResumeValidation({ education: false });
          }
        }}
        rows={5}
        name="education"
        placeholder={`예: OO대학교 컴퓨터공학과 졸업 (2018.03 ~ 2024.02)\n- 주요 수강 과목: 데이터베이스, 알고리즘, 웹프로그래밍\n- 졸업 프로젝트: AI 기반 추천 시스템 개발`}
      />
    </Box>
  );
};

export default EducationStep;
