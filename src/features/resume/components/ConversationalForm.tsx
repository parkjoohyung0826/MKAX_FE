'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion'; 

import BasicInfoStep from './steps/BasicInfoStep';
import EducationStep from './steps/EducationStep';
import WorkExperienceStep from './steps/WorkExperienceStep';
import CertificationsStep from './steps/CertificationsStep';
import FinalReviewStep from './steps/FinalReviewStep';

import { useResumeStore } from '../store';

interface Props {
  activeStep: number;
  direction: number;
  steps: string[];
}

const ConversationalForm = ({ activeStep, direction, steps }: Props) => {
  const { resumeData, setResumeData } = useResumeStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData({ [name]: value });
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: return <BasicInfoStep data={resumeData} handleChange={handleChange} />;
      case 1: return <EducationStep />;
      case 2: return <WorkExperienceStep />;
      case 3: return <CertificationsStep />;
      case 4: return <FinalReviewStep data={resumeData} />;
      default: return <Typography>알 수 없는 단계</Typography>;
    }
  }

  return (
    <Container maxWidth="md" disableGutters>
      

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
    </Container>
  );
};

export default ConversationalForm;
