import React from 'react';
import { Box } from '@mui/material';
import TemplateSelectGrid, { TemplateSelectGridProps } from './TemplateSelectGrid';
import StepHeader from '@/features/resume/components/steps/StepHeader';

interface Props<T extends string> extends TemplateSelectGridProps<T> {
  title: string;
  subtitle: string;
}

const TemplateSelectSection = <T extends string>({ title, subtitle, items, selectedId, onSelect }: Props<T>) => {
  return (
    <Box sx={{ py: 2 }}>
      <StepHeader title={title} subtitle={subtitle} />
      <TemplateSelectGrid items={items} selectedId={selectedId} onSelect={onSelect} />
    </Box>
  );
};

export default TemplateSelectSection;
