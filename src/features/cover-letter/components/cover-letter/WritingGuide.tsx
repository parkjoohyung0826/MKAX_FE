'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { ResumeData, ResumeFormatResult } from '@/features/resume/types';
import { LightbulbOutlined } from '@mui/icons-material';

interface WritingGuideProps {
  section: string;
  resumeData?: ResumeData | ResumeFormatResult;
}

const guideBoxSx = {
  backgroundColor: 'rgba(241, 245, 249, 0.6)', 
  borderRadius: '16px',
  p: 3,
  mb: 2,
  border: '1px solid rgba(0,0,0,0.05)',
};

const getGuidance = (section: string, resumeData?: ResumeData | ResumeFormatResult) => {
  const desiredJob = resumeData?.desiredJob || '지원 직무';
  
  const workExperience = Array.isArray(resumeData?.workExperience)
    ? resumeData?.workExperience
        .map((exp) => exp?.companyName)
        .filter(Boolean)
        .join(', ')
    : typeof resumeData?.workExperience === 'string'
      ? resumeData.workExperience.trim()
      : '';
  const coreCompetencies = Array.isArray(resumeData?.coreCompetencies)
    ? resumeData?.coreCompetencies
        .map((comp) => comp?.courseName)
        .filter(Boolean)
        .join(', ')
    : typeof resumeData?.coreCompetencies === 'string'
      ? resumeData.coreCompetencies.trim()
      : '';
  const workExperienceLabel = workExperience || '주요 경력';
  const coreCompetenciesLabel = coreCompetencies || '핵심 역량';

  switch (section) {
    case 'growthProcess':
      return [
        <span key="1">
          성장 과정을 통해 <strong>{desiredJob}</strong> 직무에 관심을 갖게 된 구체적인 계기를 설명해보세요.
        </span>,
        <span key="2">
          단순한 연대기 나열보다는, 직무 관련 가치관이 형성된 <strong>결정적인 사건이나 경험</strong>을 중심으로 스토리텔링하는 것이 좋습니다.
        </span>,
      ];
    case 'strengthsAndWeaknesses':
      return [
        <span key="1">
          <strong>{desiredJob}</strong> 업무를 수행하는 데 있어 가장 강력한 무기가 될 본인의 장점을 <strong>{coreCompetenciesLabel}</strong>와 연결해보세요.
        </span>,
        <span key="2">
          단점은 솔직하게 언급하되, 치명적인 단점보다는 극복 가능한 것을 선택하고 <strong>구체적인 개선 노력</strong>을 함께 적어야 합니다.
        </span>,
      ];
    case 'keyExperience':
      return [
        <span key="1">
          <strong>{workExperienceLabel}</strong> 경험 중에서 지원하는 직무와 가장 연관성 높은 프로젝트 1~2개를 선정하세요.
        </span>,
        <span key="2">
          {"'역할 - 행동 - 결과'"} 구조로 작성하며, 가능하다면 <strong>수치화된 성과</strong>(예: 효율 20% 개선)를 포함하는 것이 신뢰도를 높입니다.
        </span>

      ];
    case 'motivation':
      return [
        <span key="1">
           회사의 비전이나 사업 방향이 본인의 커리어 목표와 어떻게 일치하는지 설명하고, 왜 꼭 <strong>이 회사</strong>여야 하는지 설득하세요.
        </span>,
        <span key="2">
          입사 후 <strong>{desiredJob}</strong>로서 단기적으로 어떤 기여를 할 수 있는지, 장기적으로는 어떻게 성장하고 싶은지 구체적인 계획을 제시하세요.
        </span>,
      ];
    default:
      return [<span key="1">해당 항목에 대한 가이드를 준비 중입니다.</span>];
  }
};

const WritingGuide = ({ section, resumeData }: WritingGuideProps) => {
  const content = getGuidance(section, resumeData);

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: '#2563EB' }}>
        <LightbulbOutlined sx={{ mr: 1 }} />
        <Typography variant="subtitle1" fontWeight={700}>
          작성 팁
        </Typography>
      </Box>
      
      {content.map((item, index) => (
        <Box key={index} sx={guideBoxSx}>
          {/* 부모 Typography (p 태그) */}
          <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#334155' }}>
            {item} {/* 내부는 이제 span이므로 p > span 구조가 되어 유효함 */}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default WritingGuide;
