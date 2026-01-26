'use client';

import { Box } from '@mui/material';
import { SchoolOutlined, AutoAwesome } from '@mui/icons-material';
import { ResumeData } from '../../types';
import { PanelCard, PanelHeader, PanelShell, PanelTip } from './PanelLayout';

interface Props {
  data: Partial<ResumeData>;
}

const EducationPanel = ({ data }: Props) => {
  const educationText = data.education ?? '';

  return (
    <PanelShell>
      <PanelHeader
        icon={<SchoolOutlined sx={{ fontSize: 32 }} />}
        title="학력 정보"
        subtitle="전공 분야와 학습하신 내용을 중심으로 확인해주세요."
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <PanelCard
          label="최종 학력 상세"
          labelVariant="caption"
          labelSx={{ fontWeight: 700, color: '#94a3b8', display: 'block', mb: 1 }}
          value={educationText}
          placeholder="예: OO대학교 컴퓨터공학과 졸업 (2018.03 ~ 2024.02)&#13;&#10;- 주요 수강 과목: 데이터베이스, 알고리즘&#13;&#10;- 졸업 프로젝트: AI 기반 추천 시스템 개발"
        />

        {!educationText && (
          <PanelTip
            icon={<AutoAwesome sx={{ color: '#2563EB', fontSize: 20 }} />}
            text="Tip: 학교명, 전공, 졸업 여부, 재학 기간을 포함하여 구체적으로 작성하면 더 좋아요!"
          />
        )}
      </Box>
    </PanelShell>
  );
};

export default EducationPanel;
