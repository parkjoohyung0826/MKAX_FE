'use client';

import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import CoverLetterDirectInputStep from './steps/CoverLetterDirectInputStep';
import FinalReviewStep from './steps/FinalReviewStep';
import ProgressStepper from '@/shared/components/ProgressStepper';

import { CoverLetterData } from '../types';

const coverLetterSteps = ['성장과정', '성격의 장단점', '주요 경력 및 업무 강점', '지원 동기 및 포부', '최종 검토'];

interface Props {
  coverLetterData: CoverLetterData;
  setCoverLetterData: React.Dispatch<React.SetStateAction<CoverLetterData>>;
  handleGenerate: () => void;
  isGenerating: boolean;
}

const CoverLetterDirectInput = ({ coverLetterData, setCoverLetterData, handleGenerate, isGenerating }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCoverLetterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (activeStep === coverLetterSteps.length - 1) {
      handleGenerate();
    } else {
      setDirection(1);
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    setDirection(-1);
    setActiveStep((prev) => prev - 1);
  };
  
  const renderContent = () => {
    const isFinalStep = activeStep === coverLetterSteps.length - 1;

    if (isFinalStep) {
      return <FinalReviewStep data={coverLetterData} />;
    }
    
    return <CoverLetterDirectInputStep
            activeStep={activeStep}
            coverLetterData={coverLetterData}
            handleChange={handleChange}
            setCoverLetterData={setCoverLetterData}
            isGenerating={isGenerating}
           />;
  };

  return (
    <Box>
       <Box sx={{ mt: -3, mb: 4, opacity: 0.9 }}>
        <ProgressStepper steps={coverLetterSteps} activeStep={activeStep} />
       </Box>
       
       <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <Button disabled={activeStep === 0} onClick={handleBackStep} sx={{ color: '#64748b', fontWeight: 600, px: 3, py: 1, borderRadius: '20px', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }} >
          이전 단계
        </Button>
        <Button variant="contained" onClick={handleNextStep} sx={{ px: 4, py: 1.2, borderRadius: '30px', fontWeight: 700, boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)', background: 'linear-gradient(45deg, #2563EB, #1d4ed8)' }} >
          {activeStep === coverLetterSteps.length - 1 ? '자기소개서 완성하기' : '다음'}
        </Button>
      </Box>
    </Box>
  );
};

export default CoverLetterDirectInput;
