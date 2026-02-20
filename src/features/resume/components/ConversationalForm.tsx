'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';

import BasicInfoStep from './steps/BasicInfoStep';
import EducationStep from './steps/EducationStep';
import WorkExperienceStep from './steps/WorkExperienceStep';
import CoreCompetenciesStep from './steps/CoreCompetenciesStep';
import CertificationsStep from './steps/CertificationsStep';

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

  const stepContents = [
    <BasicInfoStep key="basic-info" data={resumeData} handleChange={handleChange} />,
    <EducationStep key="education" />,
    <WorkExperienceStep key="work-experience" />,
    <CoreCompetenciesStep key="core-competencies" />,
    <CertificationsStep key="certifications" />,
  ];

  return (
    <Container maxWidth="md" disableGutters>
      <Box sx={{ 
        position: 'relative', 
        minHeight: 320, 
        overflow: 'hidden' 
      }}>
        {stepContents.map((content, index) => (
          <Box
            key={index}
            sx={{
              display: activeStep === index ? 'block' : 'none',
            }}
          >
            {content}
          </Box>
        ))}
        {activeStep < 0 || activeStep >= stepContents.length ? (
          <Typography>알 수 없는 단계</Typography>
        ) : null}
      </Box>
    </Container>
  );
};

export default ConversationalForm;
