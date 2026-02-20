'use client';

import React from 'react';
import { Box } from '@mui/material';
import { VerifiedOutlined } from '@mui/icons-material';
import { ResumeData } from '../../types';
import { PanelCard, PanelHeader, PanelSectionTitle, PanelShell } from './PanelLayout';

interface Props {
  data: Partial<ResumeData>;
}

const CertificationsPanel = ({ data }: Props) => {
  const certificationsText = data.certifications ?? '';

  return (
    <PanelShell>
      <PanelHeader
        icon={<VerifiedOutlined sx={{ fontSize: 32 }} />}
        title="자격증"
        subtitle="자격증, 면허, 어학 성적 등 객관적인 인증 정보를 정리합니다."
      />

      <Box sx={{ px: 1, mb: 4 }}>
        <PanelSectionTitle>자격증 및 어학</PanelSectionTitle>
        <PanelCard
          value={certificationsText}
          placeholder="예: 정보처리기사 (2023.05)&#13;&#10;TOEIC 900 (2023.08)"
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
