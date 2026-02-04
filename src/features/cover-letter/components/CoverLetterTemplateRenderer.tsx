import React from 'react';
import { useCoverLetterStore } from '../store';
import { CoverLetterData, CoverLetterTemplateId } from '../types';
import CoverLetterDisplay from './CoverLetterDisplay';
import ModernCoverLetterTemplate from '../templates/ModernCoverLetterTemplate';

interface Props {
  resumeName: string;
  templateId?: CoverLetterTemplateId;
  data?: CoverLetterData;
}

const CoverLetterTemplateRenderer = React.forwardRef<HTMLDivElement, Props>(({ resumeName, templateId, data }, ref) => {
  const { selectedTemplate } = useCoverLetterStore();
  const resolvedTemplate = templateId ?? selectedTemplate;

  if (resolvedTemplate === 'modern') {
    return <ModernCoverLetterTemplate ref={ref} resumeName={resumeName} data={data} />;
  }

  return <CoverLetterDisplay ref={ref} resumeName={resumeName} data={data} />;
});

CoverLetterTemplateRenderer.displayName = 'CoverLetterTemplateRenderer';

export default CoverLetterTemplateRenderer;
