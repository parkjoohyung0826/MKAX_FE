'use client';

import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { ExtensionOutlined } from '@mui/icons-material';
import { ResumeData } from '../../types';

interface Props {
  data: Partial<ResumeData>;
}

// [수정됨] 아이콘과 AI 뱃지가 제거된 섹션 컴포넌트
const ActivitySection = ({ 
  label, 
  value, 
  placeholder 
}: { 
  label: string; 
  value?: string; 
  placeholder: string; 
}) => (
  <Box sx={{ mb: 4 }}>
    {/* 섹션 헤더 (아이콘/뱃지 제거, 텍스트만 남김) */}
    <Box sx={{ mb: 1.5, px: 1 }}>
      <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
        {label}
      </Typography>
    </Box>

    {/* 컨텐츠 박스 */}
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '20px',
        bgcolor: '#fff',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'flex-start',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'rgba(37, 99, 235, 0.3)',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
        }
      }}
    >
      <Typography 
        variant="body1" 
        sx={{ 
          color: value ? '#334155' : '#cbd5e1', 
          lineHeight: 1.7, 
          whiteSpace: 'pre-wrap',
          fontWeight: 500
        }}
      >
        {value || placeholder}
      </Typography>
    </Paper>
  </Box>
);

const SkillsPanel = ({ data }: Props) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: '28px',
        bgcolor: '#F8FAFC', // Cool White 배경
        border: '1px solid #F1F5F9',
        boxShadow: 'none',
        height: '100%'
      }}
    >
      {/* 1. 메인 헤더 */}
      <Box 
        sx={{ 
          mb: 5, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3,
          p: 3,
          borderRadius: '24px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          border: '1px solid rgba(255,255,255,0.8)'
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: '#eff6ff',
            color: '#2563EB',
            border: '4px solid #fff',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
          }}
        >
          <ExtensionOutlined sx={{ fontSize: 32 }} />
        </Avatar>
        
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>
            주요 활동 및 자격
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            교육, 대외활동, 자격증 등 역량을 보여줄 수 있는 활동입니다.
          </Typography>
        </Box>
      </Box>

      {/* 2. 섹션 영역 */}
      <Box sx={{ px: 1 }}>
        {/* 섹션 1: 교육사항 / 대외활동 */}
        <ActivitySection 
          label="교육사항 / 대외활동" 
          value={data.coreCompetencies} 
          placeholder="예: 삼성 청년 SW 아카데미 (SSAFY) 10기 수료 (2023.07 ~ 2024.01)&#13;&#10;OOO 대외활동 (2022.01 ~ 2022.06) - 프로젝트 관리 및 기획 담당"
        />

        {/* 섹션 2: 자격증 및 어학 */}
        <ActivitySection 
          label="자격증 및 어학" 
          value={data.certifications} 
          placeholder="예: 정보처리기사 (2023.05)&#13;&#10;TOEIC 900 (2023.08)"
        />
      </Box>
    </Paper>
  );
};

export default SkillsPanel;