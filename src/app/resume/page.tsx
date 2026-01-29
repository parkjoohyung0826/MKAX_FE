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
  const { resumeData, setFormattedResume } = useResumeStore();
  const { setResultData } = useReportStore();

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'resume' | 'coverLetter') => {
    setActiveTab(newValue);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/recommend/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? '이력서 포맷 정리에 실패했습니다.');
      }

      const formatted = await res.json();
      setFormattedResume(formatted);

      const mockResult: ResultData = {
        aiCoverLetter: `[AI 생성 자소서 예시]...`,
        aiResumeSummary: `${resumeData.name}님의 경력 분석...`,
        jobPostings: mockJobPostings,
        resumeData: resumeData,
      };
      setResultData(mockResult);
      router.push('/report');
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : '이력서 포맷 정리에 실패했습니다.'
      );
    } finally {
      setIsGenerating(false);
    }
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
