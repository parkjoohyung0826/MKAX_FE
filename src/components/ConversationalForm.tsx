'use client';

import React, { useState } from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import ProgressStepper from './ProgressStepper';
import BasicInfoStep from './steps/BasicInfoStep';
import EducationStep from './steps/EducationStep';
import WorkExperienceStep from './steps/WorkExperienceStep';
import CertificationsStep from './steps/CertificationsStep';
import FinalReviewStep from './steps/FinalReviewStep';

// Define the data structure for the whole form
export interface ResumeData {
  name: string;
  desiredJob: string;
  education: string;
  workExperience: string;
  coreCompetencies: string;
  certifications: string;
}

// Define the props for the component, which will include the final submit handler
interface Props {
  onSubmit: (data: ResumeData) => void;
}

const steps = ['기본 정보', '학력 사항', '경력 사항', '자격증/보유기술', '최종 검토'];

const ConversationalForm = ({ onSubmit }: Props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    desiredJob: '',
    education: '',
    workExperience: '',
    coreCompetencies: '',
    certifications: '',
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <BasicInfoStep data={resumeData} handleChange={handleChange} />;
      case 1:
        return <EducationStep data={resumeData} handleChange={handleChange} />;
      case 2:
        return <WorkExperienceStep data={resumeData} handleChange={handleChange} />;
      case 3:
        return <CertificationsStep data={resumeData} handleChange={handleChange} />;
      case 4:
        return <FinalReviewStep data={resumeData} />;
      default:
        return <Typography>알 수 없는 단계</Typography>;
    }
  }

  const handleSubmit = () => {
    // In the last step, call the onSubmit prop
    onSubmit(resumeData);
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={2} sx={{ p: 4, my: 4 }}>
        <ProgressStepper steps={steps} activeStep={activeStep} />

        <Box sx={{ my: 4, p: 3, border: '1px solid #ddd', borderRadius: 2, minHeight: 300, display: 'flex', flexDirection: 'column' }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            이전
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              이력서 생성
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              다음
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ConversationalForm;
