import React from 'react';
import { useResumeStore } from '../../store';
import { ResumeTemplateId } from '../../types';
import TemplateSelectSection from '@/shared/components/TemplateSelectSection';
import { TemplateSelectItem } from '@/shared/components/TemplateSelectGrid';

const templateCards: Array<TemplateSelectItem & { id: ResumeTemplateId }> = [
  {
    id: 'classic',
    title: '기본 템플릿',
    description: '표 기반의 공문서 스타일로 정돈된 구조',
    hoverDescription: '공공기관/전통 양식에 맞춘 정갈한 표 구성으로 깔끔하고 안정적인 인상을 줍니다.',
    accent: '#2563eb',
    previewSrc: '/resume-templates/images/defaultResume.png',
  },
  {
    id: 'modern',
    title: '모던 템플릿',
    description: '헤더 강조 + 섹션 카드형 레이아웃',
    hoverDescription: '강조 헤더와 카드형 섹션으로 핵심 정보를 빠르게 전달하는 세련된 스타일입니다.',
    accent: '#2563eb',
    previewSrc: '/resume-templates/images/modernResume.png',
  },
];

const TemplateSelectStep = () => {
  const { selectedTemplate, setSelectedTemplate } = useResumeStore();

  return (
    <TemplateSelectSection
      title="템플릿 선택"
      subtitle="작성 전에 원하는 이력서 디자인을 골라주세요. 이후에도 변경할 수 있습니다."
      items={templateCards}
      selectedId={selectedTemplate}
      onSelect={setSelectedTemplate}
    />
  );
};

export default TemplateSelectStep;
