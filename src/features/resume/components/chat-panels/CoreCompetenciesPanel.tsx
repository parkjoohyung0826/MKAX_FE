'use client';

import React from 'react';
import { Box } from '@mui/material';
import { WorkspacePremiumOutlined } from '@mui/icons-material';
import { getResumeCareerTypeCopy } from '../../careerTypeCopy';
import { useResumeStore } from '../../store';
import { ResumeData } from '../../types';
import { PanelCard, PanelHeader, PanelSectionTitle, PanelShell } from './PanelLayout';

interface Props {
  data: Partial<ResumeData>;
}

const CoreCompetenciesPanel = ({ data }: Props) => {
  const { selectedCareerType } = useResumeStore();
  const copy = getResumeCareerTypeCopy(selectedCareerType);
  const coreCompetenciesText = data.coreCompetencies ?? '';

  return (
    <PanelShell>
      <PanelHeader
        icon={<WorkspacePremiumOutlined sx={{ fontSize: 32 }} />}
        title={copy.coreStepTitle}
        subtitle={copy.coreStepSubtitle}
      />

      <Box sx={{ px: 1, mb: 4 }}>
        <PanelSectionTitle>{copy.coreSectionTitle}</PanelSectionTitle>
        <PanelCard
          value={coreCompetenciesText}
          placeholder={copy.corePlaceholder.replace(/\n/g, '&#13;&#10;')}
          minHeight={120}
          cardSx={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            alignItems: 'flex-start',
            '&:hover': {
              borderColor: 'rgba(37, 99, 235, 0.3)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)',
            },
          }}
        />
      </Box>
    </PanelShell>
  );
};

export default CoreCompetenciesPanel;
