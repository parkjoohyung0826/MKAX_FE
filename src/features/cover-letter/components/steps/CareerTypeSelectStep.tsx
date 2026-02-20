import React from 'react';
import CareerTypeSelectCards from '@/shared/components/CareerTypeSelectCards';
import { useCoverLetterStore } from '../../store';

const CareerTypeSelectStep = () => {
  const { selectedCareerType, setSelectedCareerType } = useCoverLetterStore();

  return (
    <CareerTypeSelectCards
      title="작성 유형 선택"
      subtitle="자기소개서 작성을 시작하기 전에 지원 유형을 먼저 선택해주세요."
      selectedId={selectedCareerType}
      onSelect={setSelectedCareerType}
    />
  );
};

export default CareerTypeSelectStep;
