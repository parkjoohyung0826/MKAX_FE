'use client';

import React from 'react';
import { Box } from '@mui/material';
import { BusinessCenterOutlined, AutoAwesome } from '@mui/icons-material';
import { ResumeData } from '../../types';
import { PanelCard, PanelHeader, PanelShell, PanelTip } from './PanelLayout';

interface Props {
  data: Partial<ResumeData>;
}

const WorkExperiencePanel = ({ data }: Props) => {
  const workExperienceText = data.workExperience ?? '';

  return (
    <PanelShell>
      <PanelHeader
        icon={<BusinessCenterOutlined sx={{ fontSize: 32 }} />}
        title="경력 사항"
        subtitle="직무와 관련된 주요 프로젝트와 성과를 확인해주세요."
      />

      {/* 2. 상세 정보 카드 (아이콘 없는 버전 사용) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <PanelCard
          label="주요 경력 상세"
          labelVariant="subtitle1"
          labelSx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}
          caption="최신순 기재 권장 (회사명, 기간, 직급, 주요 성과 등)"
          value={workExperienceText}
          placeholder="예: (주)테크스타트업 (2021.01 ~ 재직중)&#13;&#10;- 주요 역할: 백엔드 리드 개발자&#13;&#10;- 주요 성과: 레거시 시스템 마이그레이션을 통해 서버 비용 40% 절감&#13;&#10;- 사용 기술: Node.js, AWS, Docker"
        />

        {/* 3. AI 가이드 팁 */}
        {!workExperienceText && (
          <PanelTip
            icon={<AutoAwesome sx={{ color: '#2563EB', fontSize: 20 }} />}
            text="Tip: 구체적인 수치(%)나 성과 위주로 작성하면 면접관의 눈길을 끌 수 있어요!"
          />
        )}
      </Box>
    </PanelShell>
  );
};

export default WorkExperiencePanel;
