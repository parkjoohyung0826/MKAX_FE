'use client';

import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion'; 
import ProgressStepper from '@/shared/components/ProgressStepper';
import BasicInfoStep from './steps/BasicInfoStep';
import EducationStep from './steps/EducationStep';
import WorkExperienceStep from './steps/WorkExperienceStep';
import CertificationsStep from './steps/CertificationsStep';
import FinalReviewStep from './steps/FinalReviewStep';

import { ResumeData } from '../types';

interface Props {
  onSubmit: (data: ResumeData) => void;
}

const steps = ['기본 정보', '학력 사항', '경력 사항', '자격증/주요활동', '최종 검토'];

const ConversationalForm = ({ onSubmit }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0); 
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '', 
    englishName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    emergencyContact: '',
    address: '',
    photo: '',
    desiredJob: '', 
    education: '', 
    workExperience: '', 
    coreCompetencies: '', 
    certifications: '',
  });

  const handleNext = () => {
    setDirection(1);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: return <BasicInfoStep data={resumeData} handleChange={handleChange} />;
      case 1: return <EducationStep data={resumeData} handleChange={handleChange} />;
      case 2: return <WorkExperienceStep data={resumeData} handleChange={handleChange} />;
      case 3: return <CertificationsStep data={resumeData} handleChange={handleChange} />;
      case 4: return <FinalReviewStep data={resumeData} />;
      default: return <Typography>알 수 없는 단계</Typography>;
    }
  }

  const handleSubmit = () => {
    onSubmit(resumeData);
  }

  return (
    <Container maxWidth="md" disableGutters>
      {/* Stepper 영역 커스텀 (필요 시 ProgressStepper 내부 스타일도 투명하게 조정 권장) */}
      <Box sx={{ mb: 4, opacity: 0.9 }}>
        <ProgressStepper steps={steps} activeStep={activeStep} />
      </Box>

      {/* 컨텐츠 영역: 내부 Paper 제거하고 투명한 글래스 스타일 유지 */}
      <Box sx={{ 
        position: 'relative', 
        minHeight: 320, 
        overflow: 'hidden' 
      }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeStep}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {getStepContent(activeStep)}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* 하단 네비게이션 버튼 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 6, 
        pt: 3, 
        borderTop: '1px solid rgba(0,0,0,0.05)' 
      }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ 
            color: '#64748b', 
            fontWeight: 600,
            px: 3, py: 1,
            borderRadius: '20px',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
          }}
        >
          이전 단계
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ 
              px: 4, py: 1.2, 
              borderRadius: '30px', 
              fontWeight: 700,
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)',
              background: 'linear-gradient(45deg, #2563EB, #1d4ed8)'
            }}
          >
            이력서 작성 완료
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleNext}
            sx={{ 
              px: 4, py: 1.2, 
              borderRadius: '30px', 
              fontWeight: 700,
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)',
              background: 'linear-gradient(45deg, #2563EB, #4F46E5)'
            }}
          >
            다음
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default ConversationalForm;