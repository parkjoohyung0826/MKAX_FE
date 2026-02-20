'use client';

import React from 'react';
import { Box } from '@mui/material';
import { WorkspacePremiumOutlined } from '@mui/icons-material';
import { ResumeData } from '../../types';
import { PanelCard, PanelHeader, PanelSectionTitle, PanelShell } from './PanelLayout';

interface Props {
  data: Partial<ResumeData>;
}

const CoreCompetenciesPanel = ({ data }: Props) => {
  const coreCompetenciesText = data.coreCompetencies ?? '';

  return (
    <PanelShell>
      <PanelHeader
        icon={<WorkspacePremiumOutlined sx={{ fontSize: 32 }} />}
        title="주요활동"
        subtitle="교육, 대외활동, 프로젝트 경험 등 역량을 보여줄 활동을 정리합니다."
      />

      <Box sx={{ px: 1, mb: 4 }}>
        <PanelSectionTitle>교육사항 / 대외활동</PanelSectionTitle>
        <PanelCard
          value={coreCompetenciesText}
          placeholder="예: 삼성 청년 SW 아카데미 (SSAFY) 10기 수료 (2023.07 ~ 2024.01)&#13;&#10;OOO 대외활동 (2022.01 ~ 2022.06) - 프로젝트 관리 및 기획 담당"
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
