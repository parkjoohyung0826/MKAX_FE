import React from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';

interface Props {
  steps: string[];
  activeStep: number;
}

const ProgressStepper = ({ steps, activeStep }: Props) => {
  return (
    <Box sx={{ width: '100%', my: 5 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ProgressStepper;
