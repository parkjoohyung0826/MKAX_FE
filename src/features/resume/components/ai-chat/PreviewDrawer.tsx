'use client';

import React from 'react';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

const drawerPaperSx = {
  width: { xs: '100%', sm: '450px' },
  boxSizing: 'border-box',
  backdropFilter: 'blur(16px)',
  boxShadow: '-10px 0 50px rgba(0,0,0,0.1)',
  borderLeft: '1px solid rgba(255,255,255,0.5)',
  p: 4,
  pt: 8,
};

type PreviewDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const PreviewDrawer = ({ open, onClose, title, subtitle, children }: PreviewDrawerProps) => (
  <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: drawerPaperSx }}>
    <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
      <IconButton
        onClick={onClose}
        sx={{
          bgcolor: '#f1f5f9',
          '&:hover': { bgcolor: '#e2e8f0', transform: 'rotate(90deg)' },
          transition: 'all 0.3s',
        }}
      >
        <Close />
      </IconButton>
    </Box>

    <Box sx={{ mb: 5, mt: 1 }}>
      <Typography variant="h5" fontWeight={800} color="#1e293b" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        {subtitle}
      </Typography>
    </Box>

    <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>{children}</Box>
  </Drawer>
);

export default PreviewDrawer;
