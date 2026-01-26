'use client';

import React from 'react';
import { Avatar, Box, Paper, Typography } from '@mui/material';

const panelShellSx = {
  p: 3,
  borderRadius: '28px',
  bgcolor: '#F8FAFC',
  border: '1px solid #F1F5F9',
  boxShadow: 'none',
  height: '100%'
};

const panelHeaderSx = {
  mb: 4,
  display: 'flex',
  alignItems: 'center',
  gap: 3,
  p: 3,
  borderRadius: '24px',
  background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
  border: '1px solid rgba(255,255,255,0.8)'
};

const panelAvatarSx = {
  width: 64,
  height: 64,
  bgcolor: '#eff6ff',
  color: '#2563EB',
  border: '4px solid #fff',
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
};

const baseCardSx = {
  p: 3,
  borderRadius: '20px',
  bgcolor: '#fff',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.2s ease',
  minHeight: '120px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
    borderColor: 'rgba(37, 99, 235, 0.2)'
  }
};

const tipBoxSx = {
  mt: 2,
  p: 2,
  borderRadius: '16px',
  bgcolor: 'rgba(37, 99, 235, 0.05)',
  display: 'flex',
  alignItems: 'center',
  gap: 1.5
};

type PanelShellProps = {
  children: React.ReactNode;
};

export const PanelShell = ({ children }: PanelShellProps) => (
  <Paper elevation={0} sx={panelShellSx}>
    {children}
  </Paper>
);

type PanelHeaderProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

export const PanelHeader = ({ icon, title, subtitle }: PanelHeaderProps) => (
  <Box sx={panelHeaderSx}>
    <Avatar sx={panelAvatarSx}>{icon}</Avatar>
    <Box>
      <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
        {subtitle}
      </Typography>
    </Box>
  </Box>
);

type PanelCardProps = {
  label?: string;
  labelVariant?: 'subtitle1' | 'caption';
  labelSx?: object;
  caption?: string;
  value?: string;
  placeholder: string;
  minHeight?: number;
  cardSx?: object;
};

export const PanelCard = ({
  label,
  labelVariant = 'subtitle1',
  labelSx,
  caption,
  value,
  placeholder,
  minHeight,
  cardSx,
}: PanelCardProps) => (
  <Paper elevation={0} sx={{ ...baseCardSx, ...(minHeight ? { minHeight } : null), ...cardSx }}>
    <Box sx={{ width: '100%' }}>
      {label ? (
        <Typography variant={labelVariant} sx={labelSx}>
          {label}
        </Typography>
      ) : null}
      {caption ? (
        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 2 }}>
          {caption}
        </Typography>
      ) : null}
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: value ? '#334155' : '#cbd5e1',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap'
        }}
      >
        {value || placeholder}
      </Typography>
    </Box>
  </Paper>
);

type PanelSectionTitleProps = {
  children: React.ReactNode;
};

export const PanelSectionTitle = ({ children }: PanelSectionTitleProps) => (
  <Box sx={{ mb: 1.5, px: 1 }}>
    <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
      {children}
    </Typography>
  </Box>
);

type PanelTipProps = {
  icon: React.ReactNode;
  text: string;
};

export const PanelTip = ({ icon, text }: PanelTipProps) => (
  <Box sx={tipBoxSx}>
    {icon}
    <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 600 }}>
      {text}
    </Typography>
  </Box>
);
