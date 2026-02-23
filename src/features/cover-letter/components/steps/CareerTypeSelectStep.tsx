import React from 'react';
import CareerTypeSelectCards from '@/shared/components/CareerTypeSelectCards';
import { useCoverLetterStore } from '../../store';

const CareerTypeSelectStep = () => {
  const { selectedCareerType, setSelectedCareerType, setCoverLetterData } = useCoverLetterStore();

  const handleSelectCareerType = async (careerType: 'basic' | 'senior') => {
    const hasChanged = selectedCareerType !== null && selectedCareerType !== careerType;
    setSelectedCareerType(careerType);

    if (!hasChanged) return;

    setCoverLetterData({
      growthProcess: '',
      growthProcessSummary: '',
      strengthsAndWeaknesses: '',
      strengthsAndWeaknessesSummary: '',
      keyExperience: '',
      keyExperienceSummary: '',
      motivation: '',
      motivationSummary: '',
    });

    await Promise.all(
      ['GROWTH_PROCESS', 'PERSONALITY', 'CAREER_STRENGTH', 'MOTIVATION_ASPIRATION'].map((section) =>
        fetch('/api/cover-letter/chat/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ section }),
        }).catch(() => undefined)
      )
    );
  };

  return (
    <CareerTypeSelectCards
      title="작성 유형 선택"
      subtitle="자기소개서 작성을 시작하기 전에 지원 유형을 먼저 선택해주세요."
      selectedId={selectedCareerType}
      onSelect={handleSelectCareerType}
    />
  );
};

export default CareerTypeSelectStep;
