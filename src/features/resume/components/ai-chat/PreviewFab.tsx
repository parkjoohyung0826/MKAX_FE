'use client';

import React from 'react';
import { Badge, Fab, Tooltip, Zoom } from '@mui/material';
import { ArticleOutlined } from '@mui/icons-material';

const badgeRippleSx = {
  '& .MuiBadge-badge': {
    backgroundColor: '#ef4444',
    color: '#ef4444',
    boxShadow: '0 0 0 2px #fff',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      animationIterationCount: 3,
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': { transform: 'scale(0.8)', opacity: 1 },
    '100%': { transform: 'scale(2.4)', opacity: 0 },
  },
};

type PreviewFabProps = {
  isOpen: boolean;
  hasUnreadChanges: boolean;
  messageCount: number;
  onOpen: () => void;
};

const PreviewFab = ({ isOpen, hasUnreadChanges, messageCount, onOpen }: PreviewFabProps) => (
  <Zoom in={!isOpen} unmountOnExit>
    <Tooltip title="작성된 내용 확인" placement="left">
      <Fab
        color="primary"
        aria-label="preview"
        onClick={onOpen}
        sx={{
          position: 'absolute',
          bottom: 110,
          right: 16,
          zIndex: 20,
          bgcolor: '#fff',
          color: '#2563EB',
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.25)',
          width: 56,
          height: 56,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            bgcolor: '#f8fafc',
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 25px rgba(37, 99, 235, 0.35)',
          },
        }}
      >
        <Badge
          key={messageCount}
          color="error"
          variant="dot"
          invisible={!hasUnreadChanges}
          sx={badgeRippleSx}
        >
          <ArticleOutlined sx={{ fontSize: 26 }} />
        </Badge>
      </Fab>
    </Tooltip>
  </Zoom>
);

export default PreviewFab;
