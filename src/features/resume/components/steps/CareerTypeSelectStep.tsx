import React from 'react';
import CareerTypeSelectCards from '@/shared/components/CareerTypeSelectCards';
import { useResumeStore } from '../../store';

const CareerTypeSelectStep = () => {
  const {
    selectedCareerType,
    setSelectedCareerType,
    setResumeData,
    setResumeValidation,
    setValidationLock,
  } = useResumeStore();

  const handleSelectCareerType = async (careerType: 'basic' | 'senior') => {
    const hasChanged = selectedCareerType !== null && selectedCareerType !== careerType;
    setSelectedCareerType(careerType);

    if (!hasChanged) return;

    setResumeData({
      coreCompetencies: '',
      certifications: '',
    });
    setResumeValidation({
      coreCompetencies: false,
      certifications: false,
    });
    setValidationLock({
      coreCompetencies: false,
      certifications: false,
    });

    await Promise.all(
      ['ACTIVITY', 'CERTIFICATION'].map((section) =>
        fetch('/api/recommend/chat/reset', {
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
      subtitle="지원하는 직무와 본인의 경력 단계에 맞는 최적의 템플릿을 선택하세요."
      selectedId={selectedCareerType}
      onSelect={handleSelectCareerType}
    />
  );
};

export default CareerTypeSelectStep;
