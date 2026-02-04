import React from 'react';
import { useResumeStore } from '../store';
import ResumeDisplay from './ResumeDisplay';
import ModernTemplate from '../templates/ModernTemplate';
import { ResumeData, ResumeFormatResult, ResumeTemplateId } from '../types';

interface Props {
  data?: ResumeData | ResumeFormatResult;
  formattedData?: ResumeFormatResult | null;
  templateId?: ResumeTemplateId;
}

const ResumeTemplateRenderer = React.forwardRef<HTMLDivElement, Props>(({ data, formattedData, templateId }, ref) => {
  const { selectedTemplate } = useResumeStore();
  const resolvedTemplate = templateId ?? selectedTemplate;

  if (resolvedTemplate === 'modern') {
    return <ModernTemplate ref={ref} data={data} formattedData={formattedData} />;
  }

  return <ResumeDisplay ref={ref} data={data} formattedData={formattedData} />;
});

ResumeTemplateRenderer.displayName = 'ResumeTemplateRenderer';

export default ResumeTemplateRenderer;
