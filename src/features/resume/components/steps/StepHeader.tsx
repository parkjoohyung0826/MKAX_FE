'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

type StepHeaderProps = {
  title: string;
  subtitle: string;
  marginBottom?: number;
  align?: 'left' | 'center' | 'right';
};

const StepHeader = ({ title, subtitle, marginBottom = 4, align = 'left' }: StepHeaderProps) => (
  <Box sx={{ mb: marginBottom, textAlign: align }}>
    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="body1" sx={{ color: '#64748b' }}>
      {subtitle}
    </Typography>
  </Box>
);

export default StepHeader;
