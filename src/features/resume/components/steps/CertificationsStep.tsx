'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { WorkspacePremium, Verified } from '@mui/icons-material';
import { useResumeStore } from '../../store';
import ResumeAssistantTextSection from './AssistantTextSection';
import StepHeader from './StepHeader';

const CertificationsStep = () => {
  const { resumeData, setResumeData } = useResumeStore();

  const submitCoreCompetencies = async (text: string): Promise<void> => {
    const res = await fetch('/api/recommend/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput: text }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? '교육사항/대외활동 생성에 실패했습니다.');
    }

    const data = await res.json();
    setResumeData({ coreCompetencies: [data] });
  };

  const handleChangeActivity = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const newCoreCompetencies = [...resumeData.coreCompetencies];
    
    if (newCoreCompetencies.length > 0) {
      newCoreCompetencies[0] = { ...newCoreCompetencies[0], fullDescription: value };
    } else {
      newCoreCompetencies.push({
        fullDescription: value,
        period: '',
        courseName: '',
        institution: '',
      });
    }
    setResumeData({ coreCompetencies: newCoreCompetencies });
  };

  const submitCertifications = async (text: string): Promise<void> => {
    const res = await fetch("/api/recommend/certification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput: text }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? "자격증/어학 생성에 실패했습니다.");
    }

    const data = await res.json();
    // { fullDescription, period, certificationName, institution }

    setResumeData({ certifications: [data] });
  };

  const handleChangeCertifacation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const newCertification = [...resumeData.certifications];
    if (newCertification.length > 0) {
      newCertification[0] = { ...newCertification[0], fullDescription: value };
    } else {
      newCertification.push({
        fullDescription: value,
        period: '',
        certificationName: '',
        institution: '',
      });
    }
    setResumeData({ certifications: newCertification });
  };

  return (
    <Box sx={{ py: 2 }}>
      <StepHeader
        title="주요 활동 및 자격"
        subtitle="교육 및 대외활동, 자격증, 어학 능력 등 주요 활동과 자격 사항을 입력해주세요."
      />
      
      <Box display="grid" gap={4}>
        {/* 핵심 기술 */}
        <ResumeAssistantTextSection
          sectionTitle="교육사항 / 대외활동"
          icon={<WorkspacePremium fontSize="small" sx={{ color: '#64748b' }} />}
          assistantTitle="교육사항/대외활동 AI"
          assistantPrompt="참여했던 교육 프로그램, 대외 활동, 동아리 활동 등에 대해 자유롭게 이야기해주세요."
          onAssistantSubmit={submitCoreCompetencies}
          value={resumeData.coreCompetencies.map((cor) => cor.fullDescription).join('\n\n')}
          onChange={handleChangeActivity}
          rows={4}
          name="coreCompetencies"
          placeholder="예: 삼성 청년 SW 아카데미 (SSAFY) 10기 수료 (2023.07 ~ 2024.01)\nOOO 대외활동 (2022.01 ~ 2022.06) - 프로젝트 관리 및 기획 담당"
        />

        {/* 자격증 */}
        <ResumeAssistantTextSection
          sectionTitle="자격증 및 어학"
          icon={<Verified fontSize="small" sx={{ color: '#64748b' }} />}
          assistantTitle="자격증/어학 AI"
          assistantPrompt="취득한 자격증, 면허, 어학 성적 등에 대해 자유롭게 이야기해주세요."
          onAssistantSubmit={submitCertifications}
          value={resumeData.certifications.map((cor) => cor.fullDescription).join('\n\n')}
          onChange={handleChangeCertifacation}
          rows={3}
          name="certifications"
          placeholder="예: 정보처리기사 (2023.05)\nTOEIC 900 (2023.08)"
        />
      </Box>
    </Box>
  );
};

export default CertificationsStep;
