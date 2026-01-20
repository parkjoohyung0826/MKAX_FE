'use client';

import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { BusinessCenterOutlined, AutoAwesome } from '@mui/icons-material';
import { ResumeData } from '../../types';

interface Props {
  data: Partial<ResumeData>;
}

// [수정됨] 아이콘이 없는 긴 텍스트 카드
const LongInfoCardNoIcon = ({ 
  label, 
  value, 
  placeholder 
}: { 
  label: string; 
  value?: string; 
  placeholder?: string;
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: '20px',
      bgcolor: '#fff',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column', // 아이콘 제거 후 수직 정렬
      transition: 'all 0.2s ease',
      minHeight: '120px',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
        borderColor: 'rgba(37, 99, 235, 0.2)'
      }
    }}
  >
    {/* 텍스트 영역 (아이콘 없이 전체 너비 사용) */}
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
        최신순 기재 권장 (회사명, 기간, 직급, 주요 성과 등)
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          fontWeight: 500, 
          color: value ? '#334155' : '#cbd5e1',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap' // 줄바꿈 보존
        }}
      >
        {value || placeholder}
      </Typography>
    </Box>
  </Paper>
);

const WorkExperiencePanel = ({ data }: Props) => {
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
      {/* 1. 헤더 섹션 */}
      <Box 
        sx={{ 
          mb: 4, 
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
        {/* 아이콘 */}
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
          <BusinessCenterOutlined sx={{ fontSize: 32 }} />
        </Avatar>
        
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>
            경력 사항
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            직무와 관련된 주요 프로젝트와 성과를 확인해주세요.
          </Typography>
        </Box>
      </Box>

      {/* 2. 상세 정보 카드 (아이콘 없는 버전 사용) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <LongInfoCardNoIcon 
          label="주요 경력 상세" 
          value={data.workExperience} 
          placeholder="예: (주)테크스타트업 (2021.01 ~ 재직중)&#13;&#10;- 주요 역할: 백엔드 리드 개발자&#13;&#10;- 주요 성과: 레거시 시스템 마이그레이션을 통해 서버 비용 40% 절감&#13;&#10;- 사용 기술: Node.js, AWS, Docker"
        />

        {/* 3. AI 가이드 팁 */}
        {!data.workExperience && (
          <Box 
            sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: '16px', 
              bgcolor: 'rgba(37, 99, 235, 0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5 
            }}
          >
            <AutoAwesome sx={{ color: '#2563EB', fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 600 }}>
              Tip: 구체적인 수치(%)나 성과 위주로 작성하면 면접관의 눈길을 끌 수 있어요!
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default WorkExperiencePanel;