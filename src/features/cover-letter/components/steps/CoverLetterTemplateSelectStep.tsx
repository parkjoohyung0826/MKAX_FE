import React from 'react';
import { useCoverLetterStore } from '../../store';
import { CoverLetterTemplateId } from '../../types';
import TemplateSelectSection from '@/shared/components/TemplateSelectSection';
import { TemplateSelectItem } from '@/shared/components/TemplateSelectGrid';

const templates: Array<TemplateSelectItem & { id: CoverLetterTemplateId }> = [
  {
    id: 'classic',
    title: '기본 템플릿',
    description: '섹션 분리형 표 레이아웃으로 정돈된 인상',
    hoverDescription: '전통적인 표 구조로 가독성이 높고 채용 문서에 익숙한 톤을 유지합니다.',
    accent: '#2563eb',
    previewSrc: '/cover-letter-templates/defaultCoverLetter.png',
  },
  {
    id: 'modern',
    title: '모던 템플릿',
    description: '카드형 섹션과 강조 헤더로 간결한 구성',
    hoverDescription: '섹션 강조와 여백 중심 레이아웃으로 핵심 메시지를 돋보이게 합니다.',
    accent: '#2563eb',
    previewSrc: '/cover-letter-templates/modernCoverLetter.png',
  },
];

const CoverLetterTemplateSelectStep = () => {
  const { selectedTemplate, setSelectedTemplate } = useCoverLetterStore();

  return (
    <TemplateSelectSection
      title="템플릿 선택"
      subtitle="작성 전에 자기소개서 스타일을 선택해주세요."
      items={templates}
      selectedId={selectedTemplate}
      onSelect={setSelectedTemplate}
    />
  );
};

export default CoverLetterTemplateSelectStep;
