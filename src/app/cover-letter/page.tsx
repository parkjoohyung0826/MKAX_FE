'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import FormPageLayout from '@/shared/components/FormPageLayout';
import CoverLetter from '@/features/cover-letter/components/CoverLetter';
import LoadingIndicator from '@/shared/components/LoadingIndicator';
import { useResumeStore } from '@/features/resume/store';
import { useReportStore } from '@/features/report/store';
import { mockJobPostings } from '@/features/report/services/mockJobPostings';
import { ResultData } from '@/features/report/types';

const CoverLetterPage = () => {
  const router = useRouter();

  const { resumeData } = useResumeStore();
  const { setResultData } = useReportStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const handleTabChange = (_: React.SyntheticEvent, newValue: 'resume' | 'coverLetter') => {
    if (newValue === 'resume') {
      router.push('/resume');
      return;
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockResult: ResultData = {
        aiCoverLetter: `[AI 생성 자소서 예시]...`,
        aiResumeSummary: `${resumeData.name}님의 경력 분석...`,
        jobPostings: mockJobPostings,
        resumeData: resumeData,
      };
      setResultData(mockResult);
      router.push('/report');
    }, 2000);
  };

  return (
    <FormPageLayout
      activeTab="coverLetter"
      onTabChange={handleTabChange}
      isLoading={isGenerating}
      loadingFallback={<LoadingIndicator />}
    >
      <CoverLetter handleGenerate={handleGenerate} isGenerating={isGenerating} />
    </FormPageLayout>
  );
};

export default CoverLetterPage;
