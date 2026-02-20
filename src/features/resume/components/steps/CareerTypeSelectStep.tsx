import React from 'react';
import CareerTypeSelectCards from '@/shared/components/CareerTypeSelectCards';
import { useResumeStore } from '../../store';

const CareerTypeSelectStep = () => {
  const { selectedCareerType, setSelectedCareerType } = useResumeStore();

  return (
    <CareerTypeSelectCards
      title="작성 유형 선택"
      subtitle="지원하는 직무와 본인의 경력 단계에 맞는 최적의 템플릿을 선택하세요."
      selectedId={selectedCareerType}
      onSelect={setSelectedCareerType}
    />
  );
};

export default CareerTypeSelectStep;
