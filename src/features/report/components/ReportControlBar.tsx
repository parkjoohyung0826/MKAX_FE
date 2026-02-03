/** @jsxImportSource @emotion/react */
'use client';

import { useState } from 'react';
import {
  Box,
  Divider,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Assessment,
  Article,
  CheckCircle,
  ContentCopy,
  DeleteOutline,
  Description,
  Key,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

interface Props {
  activeTab: 'report' | 'resume' | 'coverLetter';
  onTabChange: (
    event: React.MouseEvent<HTMLElement>,
    newTab: 'report' | 'resume' | 'coverLetter' | null
  ) => void;
  accessCode?: string;
  isDeleting: boolean;
  onRequestDelete: () => void;
}

const toggleBtnSx = {
  border: 'none',
  borderRadius: '50px !important',
  px: { xs: 2, md: 3 },
  py: 1,
  mx: 0.5,
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#64748b',
  textTransform: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    color: '#2563EB',
  },
  '&.Mui-selected': {
    backgroundColor: '#fff',
    color: '#2563EB',
    fontWeight: 800,
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
    '&:hover': {
      backgroundColor: '#fff',
    },
  },
};

const ReportControlBar = ({ activeTab, onTabChange, accessCode, isDeleting, onRequestDelete }: Props) => {
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleCopyAccessCode = async () => {
    if (!accessCode) return;
    try {
      await navigator.clipboard.writeText(accessCode);
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy access code:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, position: 'relative', zIndex: 10 }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          p: 0.8,
          borderRadius: '50px',
          bgcolor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.08)',
          gap: { xs: 2, md: 0 },
        }}
      >
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={onTabChange}
          aria-label="result tabs"
          sx={{ bgcolor: 'transparent' }}
        >
          <ToggleButton value="report" sx={toggleBtnSx}>
            <Assessment sx={{ mr: 1, fontSize: 18 }} /> 분석 리포트
          </ToggleButton>
          <ToggleButton value="resume" sx={toggleBtnSx}>
            <Description sx={{ mr: 1, fontSize: 18 }} /> 이력서
          </ToggleButton>
          <ToggleButton value="coverLetter" sx={toggleBtnSx}>
            <Article sx={{ mr: 1, fontSize: 18 }} /> 자기소개서
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            mx: 2,
            display: { xs: 'none', md: 'block' },
            borderColor: 'rgba(0,0,0,0.08)',
          }}
        />

        {accessCode && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pl: { xs: 0, md: 1 },
              pr: 2,
              pb: { xs: 1, md: 0 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f1f5f9',
                borderRadius: '20px',
                px: 1.5,
                py: 0.5,
                border: '1px solid #e2e8f0',
              }}
            >
              <Key sx={{ fontSize: 16, color: '#94a3b8', mr: 1 }} />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: showCode ? '#334155' : '#94a3b8',
                  mr: 1,
                  minWidth: '60px',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                }}
              >
                {showCode ? accessCode : '••••••'}
              </Typography>

              <Tooltip title={showCode ? '숨기기' : '코드 확인'}>
                <IconButton size="small" onClick={() => setShowCode(!showCode)} sx={{ p: 0.5, color: '#64748b' }}>
                  {showCode ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                </IconButton>
              </Tooltip>
            </Box>

            <Tooltip title="인증코드 복사">
              <IconButton
                size="small"
                onClick={handleCopyAccessCode}
                sx={{
                  bgcolor: isCodeCopied ? '#dcfce7' : '#eff6ff',
                  color: isCodeCopied ? '#16a34a' : '#3b82f6',
                  '&:hover': { bgcolor: isCodeCopied ? '#dcfce7' : '#dbeafe' },
                }}
              >
                {isCodeCopied ? <CheckCircle sx={{ fontSize: 18 }} /> : <ContentCopy sx={{ fontSize: 18 }} />}
              </IconButton>
            </Tooltip>

            <Tooltip title="문서 삭제">
              <IconButton
                size="small"
                onClick={onRequestDelete}
                disabled={isDeleting}
                sx={{
                  bgcolor: '#fef2f2',
                  color: '#ef4444',
                  '&:hover': { bgcolor: '#fee2e2' },
                  '&.Mui-disabled': { color: '#fca5a5', bgcolor: '#fef2f2' },
                }}
              >
                <DeleteOutline sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ReportControlBar;
