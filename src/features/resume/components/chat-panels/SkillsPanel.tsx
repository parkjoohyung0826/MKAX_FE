'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ResumeData } from '../../types';

interface Props {
  data: Partial<ResumeData>;
}

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{label}</Typography>
    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{value || '...'}</Typography>
  </Box>
);

const SkillsPanel = ({ data }: Props) => {
  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'transparent' }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>역량 및 자격</Typography>
      <InfoRow label="핵심 역량" value={data.coreCompetencies} />
      <InfoRow label="자격증" value={data.certifications} />
    </Paper>
  );
};

export default SkillsPanel;
