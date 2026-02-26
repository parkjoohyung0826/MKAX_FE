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
  useMediaQuery,
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
import { useTheme } from '@mui/material/styles';

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
  px: { xs: 1.2, sm: 2, md: 3 },
  py: { xs: 0.75, sm: 1 },
  mx: { xs: 0.15, sm: 0.5 },
  minHeight: { xs: 38, sm: 44 },
  fontSize: { xs: '0.78rem', sm: '0.9rem' },
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
          alignItems: { xs: 'stretch', md: 'center' },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: '100%', md: 'none' },
          p: { xs: 0.6, sm: 0.8 },
          borderRadius: { xs: '20px', sm: '50px' },
          bgcolor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.08)',
          gap: { xs: 1.2, md: 0 },
        }}
      >
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={onTabChange}
          aria-label="result tabs"
          sx={{
            bgcolor: 'transparent',
            width: { xs: '100%', md: 'auto' },
            display: { xs: 'grid', md: 'inline-flex' },
            gridTemplateColumns: { xs: '1fr 1fr 1fr', md: 'unset' },
            '& .MuiToggleButtonGroup-grouped': {
              border: { xs: 'none', md: undefined },
            },
          }}
        >
          <ToggleButton value="report" sx={toggleBtnSx}>
            {!isMobile && <Assessment sx={{ mr: 1, fontSize: 18 }} />} 분석 리포트
          </ToggleButton>
          <ToggleButton value="resume" sx={toggleBtnSx}>
            {!isMobile && <Description sx={{ mr: 1, fontSize: 18 }} />} 이력서
          </ToggleButton>
          <ToggleButton value="coverLetter" sx={toggleBtnSx}>
            {!isMobile && <Article sx={{ mr: 1, fontSize: 18 }} />} 자기소개서
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
              justifyContent: { xs: 'space-between', md: 'flex-start' },
              flexWrap: { xs: 'nowrap', md: 'wrap' },
              gap: { xs: 0.6, sm: 1 },
              pl: { xs: 0.6, md: 1 },
              pr: { xs: 0.6, md: 2 },
              pb: { xs: 0.35, md: 0 },
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f1f5f9',
                borderRadius: { xs: '16px', sm: '20px' },
                px: { xs: 1.1, sm: 1.5 },
                py: { xs: 0.35, sm: 0.5 },
                border: '1px solid #e2e8f0',
                width: { xs: 'auto', sm: 'fit-content' },
                minWidth: 'unset',
                maxWidth: { xs: '58%', sm: 'none' },
                flex: { xs: '0 1 auto', sm: '0 1 auto' },
                flexShrink: 1,
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
                  minWidth: 'unset',
                  maxWidth: { xs: '24vw', sm: 'none' },
                  textAlign: 'center',
                  fontSize: { xs: '0.78rem', sm: '0.85rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
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

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.4,
                bgcolor: { xs: 'rgba(241,245,249,0.95)', sm: 'transparent' },
                border: { xs: '1px solid #e2e8f0', sm: 'none' },
                borderRadius: { xs: '16px', sm: 0 },
                p: { xs: 0.35, sm: 0 },
                flexShrink: 0,
              }}
            >
              <Tooltip title="인증코드 복사">
                <IconButton
                  size="small"
                  onClick={handleCopyAccessCode}
                  sx={{
                    width: { xs: 32, sm: 34 },
                    height: { xs: 32, sm: 34 },
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
                    width: { xs: 32, sm: 34 },
                    height: { xs: 32, sm: 34 },
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
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ReportControlBar;
