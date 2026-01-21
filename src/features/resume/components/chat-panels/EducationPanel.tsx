'use client';

import { Box, Typography, Paper, Avatar } from '@mui/material';
import { SchoolOutlined, AutoAwesome } from '@mui/icons-material';
import { ResumeData } from '../../types';

interface Props {
  data: Partial<ResumeData>;
}

const LongInfoCardNoIcon = ({ 
  label, 
  value, 
  placeholder 
}: { 
  label: string; 
  value?: string; 
  placeholder: string;
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
      flexDirection: 'column', 
      transition: 'all 0.2s ease',
      minHeight: '120px',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
        borderColor: 'rgba(37, 99, 235, 0.2)'
      }
    }}
  >
    <Box sx={{ width: '100%' }}>
      <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', display: 'block', mb: 1 }}>
        {label}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          fontWeight: 500, 
          color: value ? '#334155' : '#cbd5e1',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap' 
        }}
      >
        {value || placeholder}
      </Typography>
    </Box>
  </Paper>
);

const EducationPanel = ({ data }: Props) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: '28px',
        bgcolor: '#F8FAFC',
        border: '1px solid #F1F5F9',
        boxShadow: 'none',
        height: '100%'
      }}
    >
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
          <SchoolOutlined sx={{ fontSize: 32 }} />
        </Avatar>
        
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>
            학력 정보
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            전공 분야와 학습하신 내용을 중심으로 확인해주세요.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <LongInfoCardNoIcon 
          label="최종 학력 상세" 
          value={data.education} 
          placeholder="예: OO대학교 컴퓨터공학과 졸업 (2018.03 ~ 2024.02)&#13;&#10;- 주요 수강 과목: 데이터베이스, 알고리즘&#13;&#10;- 졸업 프로젝트: AI 기반 추천 시스템 개발"
        />

        {!data.education && (
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
              Tip: 학교명, 전공, 졸업 여부, 재학 기간을 포함하여 구체적으로 작성하면 더 좋아요!
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default EducationPanel;