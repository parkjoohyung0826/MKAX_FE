'use client';

import React from 'react';
import { Box, Typography, Grid, Avatar, Paper } from '@mui/material';
import { 
  PersonOutline, 
  EmailOutlined, 
  PhoneOutlined, 
  HomeOutlined, 
  CalendarTodayOutlined, 
  BadgeOutlined, 
  WorkOutline,
  ContactPhoneOutlined,
  CameraAltOutlined
} from '@mui/icons-material';
import { ResumeData } from '../../types';

interface Props {
  data: Partial<ResumeData>;
}

// 개별 정보 카드 컴포넌트
const InfoCard = ({ 
  icon, 
  label, 
  value, 
  placeholder = '미입력' 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value?: string; 
  placeholder?: string;
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: '20px',
      bgcolor: '#fff',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.04)',
        borderColor: 'rgba(37, 99, 235, 0.2)'
      }
    }}
  >
    {/* 아이콘 영역 */}
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: '14px',
        bgcolor: value ? 'rgba(37, 99, 235, 0.08)' : '#f1f5f9',
        color: value ? '#2563EB' : '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      {icon}
    </Box>

    {/* 텍스트 영역 */}
    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
      <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', display: 'block', mb: 0.2 }}>
        {label}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 600, 
          color: value ? '#1e293b' : '#cbd5e1',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {value || placeholder}
      </Typography>
    </Box>
  </Paper>
);

const BasicInfoPanel = ({ data }: Props) => {
  return (
    <Box sx={{ p: 1 }}>
      {/* 1. 프로필 헤더 섹션 */}
      <Box 
        sx={{ 
          mb: 5, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3,
          p: 3,
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
          border: '1px solid rgba(255,255,255,0.6)'
        }}
      >
        {/* 사진 영역 (아바타 스타일) */}
        <Box sx={{ position: 'relative' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: '#fff',
              border: '4px solid rgba(255,255,255,0.8)',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.15)',
              color: '#cbd5e1'
            }}
          >
            <PersonOutline sx={{ fontSize: 40 }} />
          </Avatar>
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              right: 0, 
              bgcolor: '#2563EB', 
              borderRadius: '50%', 
              p: 0.5,
              border: '2px solid #fff'
            }}
          >
            <CameraAltOutlined sx={{ fontSize: 14, color: '#fff' }} />
          </Box>
        </Box>
        
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', letterSpacing: '-0.5px' }}>
            {data.name || '지원자명'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 500 }}>
            {data.desiredJob || '희망 직무를 입력해주세요'}
          </Typography>
        </Box>
      </Box>

      {/* 2. 상세 정보 그리드 */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <InfoCard 
            icon={<BadgeOutlined fontSize="small" />} 
            label="성함" 
            value={data.name} 
            placeholder="홍길동" 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoCard 
            icon={<PersonOutline fontSize="small" />} 
            label="영문 이름" 
            value={data.englishName} 
            placeholder="Gildong Hong" 
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <InfoCard 
            icon={<CalendarTodayOutlined fontSize="small" />} 
            label="생년월일" 
            value={data.dateOfBirth} 
            placeholder="YYYY. MM. DD" 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoCard 
            icon={<EmailOutlined fontSize="small" />} 
            label="이메일" 
            value={data.email} 
            placeholder="example@email.com" 
          />
        </Grid>

        <Grid item xs={12}>
          <InfoCard 
            icon={<HomeOutlined fontSize="small" />} 
            label="주소" 
            value={data.address} 
            placeholder="시/군/구 동 까지 입력해주세요" 
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InfoCard 
            icon={<PhoneOutlined fontSize="small" />} 
            label="연락처" 
            value={data.phoneNumber} 
            placeholder="010-0000-0000" 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoCard 
            icon={<ContactPhoneOutlined fontSize="small" />} 
            label="비상 연락처" 
            value={data.emergencyContact} 
            placeholder="010-0000-0000" 
          />
        </Grid>

        {/* 희망 직무 강조 섹션 */}
        <Grid item xs={12}>
           <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: 2.5,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#fff',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
           >
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
               <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                 <WorkOutline sx={{ color: '#fff' }} />
               </Box>
               <Box>
                 <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>희망 직무</Typography>
                 <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                   {data.desiredJob || '아직 입력되지 않았습니다'}
                 </Typography>
               </Box>
             </Box>
             {/* 장식용 아이콘 */}
             <WorkOutline sx={{ fontSize: 60, opacity: 0.1, transform: 'rotate(-15deg)' }} />
           </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicInfoPanel;