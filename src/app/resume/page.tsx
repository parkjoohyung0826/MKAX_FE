'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import FormPageLayout from '@/shared/components/FormPageLayout';
import Resume from '@/features/resume/components/Resume';
import CoverLetter from '@/features/cover-letter/components/CoverLetter';
import LoadingIndicator from '@/shared/components/LoadingIndicator';
import { useResumeStore } from '@/features/resume/store';
import { useReportStore } from '@/features/report/store';
import { mockJobPostings } from '@/features/report/services/mockJobPostings';
import { ResultData } from '@/features/report/types';

const ResumePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter'>('resume');
  const [isGenerating, setIsGenerating] = useState(false);
  const { resumeData } = useResumeStore();
  const { setResultData } = useReportStore();

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'resume' | 'coverLetter') => {
    setActiveTab(newValue);
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
      activeTab={activeTab}
      onTabChange={handleTabChange}
      isLoading={isGenerating}
      loadingFallback={<LoadingIndicator />}
    >
      {activeTab === 'resume' ? (
        <Resume onFinishResume={() => setActiveTab('coverLetter')} />
      ) : (
        <CoverLetter handleGenerate={handleGenerate} isGenerating={isGenerating} />
      )}
    </FormPageLayout>
  );
};

export default ResumePage;
