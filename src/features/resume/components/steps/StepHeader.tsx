'use client';

import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type StepHeaderProps = {
  title: string;
  subtitle: string;
  marginBottom?: number;
  align?: 'left' | 'center' | 'right';
  hideOnMobile?: boolean;
  hideSubtitleOnMobile?: boolean;
};

const StepHeader = ({
  title,
  subtitle,
  marginBottom = 4,
  align = 'left',
  hideOnMobile = false,
  hideSubtitleOnMobile = false,
}: StepHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (hideOnMobile && isMobile) return null;

  return (
    <Box sx={{ mb: marginBottom, textAlign: align }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
        {title}
      </Typography>
      {!(hideSubtitleOnMobile && isMobile) && (
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default StepHeader;
