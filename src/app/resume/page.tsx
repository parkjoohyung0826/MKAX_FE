'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import FormPageLayout from '@/shared/components/FormPageLayout';
import Resume from '@/features/resume/components/Resume';

const ResumePage = () => {
  const router = useRouter();

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'resume' | 'coverLetter') => {
    if (newValue === 'coverLetter') {
      router.push('/cover-letter');
    }
  };

  return (
    <FormPageLayout activeTab="resume" onTabChange={handleTabChange}>
      <Resume onFinishResume={() => router.push('/cover-letter')} />
    </FormPageLayout>
  );
};

export default ResumePage;
