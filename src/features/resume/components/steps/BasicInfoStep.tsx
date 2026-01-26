'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, Avatar } from '@mui/material';
import { 
  PersonOutline, 
  WorkOutline, 
  AutoAwesome, 
  MailOutline, 
  PhoneOutlined,
  HomeOutlined,
  CakeOutlined,
  ContactPhoneOutlined,
  AccountCircleOutlined,
  CloudUploadOutlined,
  Edit
} from '@mui/icons-material';
import { ResumeData } from '../../types';
import ConversationalAssistant from '@/shared/components/ConversationalAssistant';
import StepHeader from './StepHeader';

interface Props {
  data: ResumeData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease', 
    '& fieldset': { border: '1px solid rgba(0,0,0,0.08)' },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    '&:hover fieldset': { 
      borderColor: 'rgba(37, 99, 235, 0.5)', 
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 8px 20px rgba(37, 99, 235, 0.15)',
      '& fieldset': { borderColor: '#2563EB', borderWidth: '1.5px' }
    }
  },
  '& .MuiInputLabel-root': { color: '#64748b' }
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body2" fontWeight={700} sx={{ mb: 0.8, ml: 0.5, color: '#475569' }}>
    {children}
  </Typography>
);

const BasicInfoStep = ({ data, handleChange }: Props) => {
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  const handleOpenAssistant = () => setAssistantOpen(true);
  const handleCloseAssistant = () => setAssistantOpen(false);

  // const handleAssistantSubmit = (text: string) => {
  //   const syntheticEvent = {
  //     target: { name: 'desiredJob', value: text },
  //   } as React.ChangeEvent<HTMLInputElement>;
  //   handleChange(syntheticEvent);
  //   handleCloseAssistant();
  // };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const syntheticEvent = {
          target: { name: 'photo', value: event.target?.result as string },
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(syntheticEvent);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAssistantSubmit = async (text: string): Promise<void> => {
    const res = await fetch("/api/recommend/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: text }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? "직무 추천에 실패했습니다.");
    }

    const data = await res.json();
    // { recommendedJob, reason }

    const syntheticEvent = {
      target: { name: "desiredJob", value: data.recommendedJob },
    } as React.ChangeEvent<HTMLInputElement>;

    handleChange(syntheticEvent);
  };

  return (
    <Box sx={{ py: 1 }}>
       <ConversationalAssistant
        open={isAssistantOpen}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title="직무 탐색 AI"
        prompt="본인의 경험이나 관심사를 자유롭게 말씀해주세요. AI가 적합한 직무명을 추천해드립니다."
      />

      <StepHeader
        title="기본 정보 입력"
        subtitle="면접관에게 가장 먼저 보여지는 핵심 정보입니다."
        marginBottom={5}
      />
      
      {/* 메인 레이아웃 (Flex & CSS Grid) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        
        {/* 1. 상단 프로필 섹션 (사진 + 주요 정보) */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 4, 
          alignItems: 'stretch' 
        }}>
          
          <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box 
              component="label"
              sx={{ 
                width: 160, 
                height: 200, 
                borderRadius: '24px', 
                border: '2px dashed #cbd5e1',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                transition: 'border-color 0.2s, background-color 0.2s', 
                backgroundColor: data.photo ? 'transparent' : 'rgba(255,255,255,0.5)',
                '&:hover': { borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.02)' }
              }}
            >
              <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
              {data.photo ? (
                <>
                  <Avatar src={data.photo} sx={{ width: '100%', height: '100%', borderRadius: 0 }} />
                  <Box sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, 
                    bgcolor: 'rgba(0,0,0,0.5)', p: 1, display: 'flex', justifyContent: 'center'
                  }}>
                    <Edit sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: '50%', mb: 2 }}>
                    <CloudUploadOutlined sx={{ color: '#2563EB' }} />
                  </Box>
                  <Typography variant="caption" fontWeight={600} color="text.secondary">사진 업로드</Typography>
                </>
              )}
            </Box>
          </Box>

          <Box sx={{ 
            flexGrow: 1, 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
            gap: 2.5 
          }}>
            <Box>
              <Label>성함</Label>
              <TextField fullWidth name="name" placeholder="홍길동" value={data.name} onChange={handleChange} sx={glassInputSx} InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutline sx={{ color: '#94a3b8' }} /></InputAdornment> }} />
            </Box>
            <Box>
              <Label>영문 이름</Label>
              <TextField fullWidth name="englishName" placeholder="Gildong Hong" value={data.englishName} onChange={handleChange} sx={glassInputSx} InputProps={{ startAdornment: <InputAdornment position="start"><AccountCircleOutlined sx={{ color: '#94a3b8' }} /></InputAdornment> }} />
            </Box>
            <Box>
              <Label>생년월일</Label>
              <TextField fullWidth name="dateOfBirth" type="date" value={data.dateOfBirth} onChange={handleChange} sx={glassInputSx} InputProps={{ startAdornment: <InputAdornment position="start"><CakeOutlined sx={{ color: '#94a3b8' }} /></InputAdornment> }} />
            </Box>
            <Box>
              <Label>이메일</Label>
              <TextField fullWidth name="email" placeholder="example@email.com" value={data.email} onChange={handleChange} sx={glassInputSx} InputProps={{ startAdornment: <InputAdornment position="start"><MailOutline sx={{ color: '#94a3b8' }} /></InputAdornment> }} />
            </Box>
          </Box>
        </Box>

        <Box>
          <Label>주소</Label>
          <TextField fullWidth name="address" placeholder="시/군/구 동 까지 입력해주세요 (예: 서울시 강남구 역삼동)" value={data.address} onChange={handleChange} sx={glassInputSx} InputProps={{ startAdornment: <InputAdornment position="start"><HomeOutlined sx={{ color: '#94a3b8' }} /></InputAdornment> }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Label>연락처</Label>
            <TextField fullWidth name="phoneNumber" placeholder="010-1234-5678" value={data.phoneNumber} onChange={handleChange} sx={glassInputSx} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlined sx={{ color: '#94a3b8' }} /></InputAdornment> }} />
          </Box>
          <Box>
            <Label>비상 연락처</Label>
            <TextField fullWidth name="emergencyContact" placeholder="010-5678-1234" value={data.emergencyContact} onChange={handleChange} sx={glassInputSx} InputProps={{ startAdornment: <InputAdornment position="start"><ContactPhoneOutlined sx={{ color: '#94a3b8' }} /></InputAdornment> }} />
          </Box>
        </Box>

        
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1 }}>
            <Label>희망 직무</Label>
            <Button 
              size="small" 
              onClick={handleOpenAssistant} 
              startIcon={<AutoAwesome />} 
              sx={{ 
                color: '#2563EB', 
                bgcolor: 'rgba(37, 99, 235, 0.1)', 
                fontWeight: 700, 
                textTransform: 'none',
                borderRadius: '20px', 
                px: 2, 
                '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.2)' } 
              }} 
            >
              AI 추천받기
            </Button>
          </Box>
          <TextField 
            fullWidth 
            name="desiredJob" 
            placeholder="예: 시니어 마케팅 전문가" 
            value={data.desiredJob} 
            onChange={handleChange} 
            sx={glassInputSx} 
            InputProps={{ 
              startAdornment: <InputAdornment position="start"><WorkOutline sx={{ color: '#94a3b8' }} /></InputAdornment> 
            }} 
          />
        </Box>

      </Box>
    </Box>
  );
};

export default BasicInfoStep;
