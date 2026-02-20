'use client';

import React from 'react';
import { Box } from '@mui/material';
import { VerifiedOutlined } from '@mui/icons-material';
import { getResumeCareerTypeCopy } from '../../careerTypeCopy';
import { useResumeStore } from '../../store';
import { ResumeData } from '../../types';
import { PanelCard, PanelHeader, PanelSectionTitle, PanelShell } from './PanelLayout';

interface Props {
  data: Partial<ResumeData>;
}

const CertificationsPanel = ({ data }: Props) => {
  const { selectedCareerType } = useResumeStore();
  const copy = getResumeCareerTypeCopy(selectedCareerType);
  const certificationsText = data.certifications ?? '';

  return (
    <PanelShell>
      <PanelHeader
        icon={<VerifiedOutlined sx={{ fontSize: 32 }} />}
        title={copy.certStepTitle}
        subtitle={copy.certStepSubtitle}
      />

      <Box sx={{ px: 1, mb: 4 }}>
        <PanelSectionTitle>{copy.certSectionTitle}</PanelSectionTitle>
        <PanelCard
          value={certificationsText}
          placeholder={copy.certPlaceholder.replace(/\n/g, '&#13;&#10;')}
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

export default CertificationsPanel;
