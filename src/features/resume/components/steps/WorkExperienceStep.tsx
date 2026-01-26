'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { BusinessCenter } from '@mui/icons-material';
import { useResumeStore } from '../../store';
import ResumeAssistantTextSection from './AssistantTextSection';
import StepHeader from './StepHeader';

const WorkExperienceStep = () => {
  const { resumeData, setResumeData } = useResumeStore();

  const handleAssistantSubmit = async (text: string): Promise<void> => {
    const res = await fetch('/api/recommend/career', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput: text }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? '경력 정보 생성에 실패했습니다.');
    }

    const data = await res.json();
    // expected: { fullDescription, companyName, period, mainTask, leavingReason }
    setResumeData({ workExperience: [data] });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    // 사용자가 직접 입력 시, 첫 번째 학력 정보의 fullDescription을 업데이트
    // 또는 학력 정보가 없다면 새로운 항목으로 생성
    const newWorkExperience = [...resumeData.workExperience];
    if (newWorkExperience.length > 0) {
      newWorkExperience[0] = { ...newWorkExperience[0], fullDescription: value };
    } else {
      newWorkExperience.push({
        companyName: '',
        period: '',
        mainTask: '',
        leavingReason: '',
        fullDescription: value,
      });
    }
    setResumeData({ workExperience: newWorkExperience });
  };

  return (
    <Box sx={{ py: 2 }}>
      <StepHeader
        title="경력 사항 입력"
        subtitle="직무와 관련된 주요 프로젝트와 성과를 중심으로 작성해주세요."
      />

      <ResumeAssistantTextSection
        sectionTitle="주요 경력 상세"
        sectionHint="최신순 기재 권장 (회사명, 기간, 직급, 주요 성과 등)"
        icon={<BusinessCenter fontSize="small" sx={{ color: '#64748b' }} />}
        assistantTitle="경력 상세 AI"
        assistantPrompt="주요 경력, 담당했던 프로젝트, 역할, 그리고 성과(수치 등)에 대해 자유롭게 이야기해주세요. AI가 내용을 구조화해드립니다."
        onAssistantSubmit={handleAssistantSubmit}
        value={resumeData.workExperience.map((wor) => wor.fullDescription).join('\n\n')}
        onChange={handleChange}
        rows={7}
        name="workExperience"
        placeholder="예: (주)테크스타트업 (2021.01 ~ 재직중)\n- 주요 역할: 백엔드 리드 개발자\n- 주요 성과: 레거시 시스템 마이그레이션을 통해 서버 비용 40% 절감\n- 사용 기술: Node.js, AWS, Docker"
      />
    </Box>
  );
};

export default WorkExperienceStep;
