'use client';

import React from 'react';
import { Box } from '@mui/material';
import { ExtensionOutlined } from '@mui/icons-material';
import { ResumeData } from '../../types';
import { PanelCard, PanelHeader, PanelSectionTitle, PanelShell } from './PanelLayout';

interface Props {
  data: Partial<ResumeData>;
}

const SkillsPanel = ({ data }: Props) => {
  const coreCompetenciesText = data.coreCompetencies ?? '';
  const certificationsText = data.certifications ?? '';

  return (
    <PanelShell>
      <PanelHeader
        icon={<ExtensionOutlined sx={{ fontSize: 32 }} />}
        title="주요 활동 및 자격"
        subtitle="교육, 대외활동, 자격증 등 역량을 보여줄 수 있는 활동입니다."
      />

      {/* 2. 섹션 영역 */}
      <Box sx={{ px: 1 }}>
        {/* 섹션 1: 교육사항 / 대외활동 */}
        <Box sx={{ mb: 4 }}>
          <PanelSectionTitle>교육사항 / 대외활동</PanelSectionTitle>
          <PanelCard
            value={coreCompetenciesText}
            placeholder="예: 삼성 청년 SW 아카데미 (SSAFY) 10기 수료 (2023.07 ~ 2024.01)&#13;&#10;OOO 대외활동 (2022.01 ~ 2022.06) - 프로젝트 관리 및 기획 담당"
            minHeight={100}
            cardSx={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              alignItems: 'flex-start',
              '&:hover': {
                borderColor: 'rgba(37, 99, 235, 0.3)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
              }
            }}
          />
        </Box>

        {/* 섹션 2: 자격증 및 어학 */}
        <Box sx={{ mb: 4 }}>
          <PanelSectionTitle>자격증 및 어학</PanelSectionTitle>
          <PanelCard
            value={certificationsText}
            placeholder="예: 정보처리기사 (2023.05)&#13;&#10;TOEIC 900 (2023.08)"
            minHeight={100}
            cardSx={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              alignItems: 'flex-start',
              '&:hover': {
                borderColor: 'rgba(37, 99, 235, 0.3)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
              }
            }}
          />
        </Box>
      </Box>
    </PanelShell>
  );
};

export default SkillsPanel;
