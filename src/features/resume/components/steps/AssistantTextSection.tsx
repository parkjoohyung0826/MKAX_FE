'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import ConversationalAssistant from '@/shared/components/ConversationalAssistant';

const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    padding: '16px',
    transition: 'all 0.3s ease',
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': { borderColor: 'rgba(37, 99, 235, 0.3)' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 8px 20px rgba(37, 99, 235, 0.15)',
      '& fieldset': { borderColor: '#2563EB', borderWidth: '1px' }
    }
  },
  '& .MuiInputLabel-root': { color: '#64748b' }
};

const aiButtonSx = {
  color: '#2563EB',
  fontWeight: 700,
  textTransform: 'none',
  bgcolor: 'rgba(37, 99, 235, 0.1)',
  borderRadius: '20px',
  px: 2,
  py: 0.5,
  fontSize: '0.85rem',
  '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.2)' }
};

type ResumeAssistantTextSectionProps = {
  sectionTitle: string;
  sectionHint?: string;
  icon: React.ReactNode;
  assistantTitle: string;
  assistantPrompt: string;
  onAssistantSubmit: (text: string) => Promise<{ missingInfo?: string; isComplete?: boolean } | void>;
  onValidate?: () => Promise<{ missingInfo?: string; isComplete?: boolean } | void>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rows: number;
  name: string;
  placeholder: string;
  buttonLabel?: string;
  validateLabel?: string;
};

const ResumeAssistantTextSection = ({
  sectionTitle,
  sectionHint,
  icon,
  assistantTitle,
  assistantPrompt,
  onAssistantSubmit,
  onValidate,
  value,
  onChange,
  rows,
  name,
  placeholder,
  buttonLabel = 'AI 작성 도우미',
  validateLabel = 'AI 검증하기',
}: ResumeAssistantTextSectionProps) => {
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [missingInfo, setMissingInfo] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (missingInfo) {
      setMissingInfo('');
    }
  }, [value]);

  const handleOpenAssistant = () => setAssistantOpen(true);
  const handleCloseAssistant = () => setAssistantOpen(false);

  const handleAssistantSubmit = async (
    text: string
  ): Promise<{ missingInfo?: string; isComplete?: boolean } | void> => {
    return onAssistantSubmit(text);
  };

  const handleValidate = async () => {
    if (!onValidate) return;
    setIsValidating(true);
    setMissingInfo('');
    try {
      const result = await onValidate();
      const info = typeof result?.missingInfo === 'string' ? result.missingInfo : '';
      const isComplete = result?.isComplete;
      if (info.trim().length > 0) {
        setMissingInfo(info);
      } else if (isComplete === true) {
        setToastOpen(true);
      }
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Box>
      <ConversationalAssistant
        open={isAssistantOpen}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title={assistantTitle}
        prompt={assistantPrompt}
      />

      <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1.5, px: 1 }}>
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={sectionHint ? 0.5 : 0}>
            {icon}
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
              {sectionTitle}
            </Typography>
          </Box>
          {sectionHint ? (
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', ml: 3.5 }}>
              {sectionHint}
            </Typography>
          ) : null}
        </Box>
        <Box display="flex" gap={1}>
          {onValidate && (
            <Button
              size="small"
              onClick={handleValidate}
              disabled={isValidating}
              sx={{
                color: '#0f172a',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: 'rgba(15, 23, 42, 0.06)',
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                fontSize: '0.85rem',
                '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.12)' }
              }}
            >
              {isValidating ? '검증 중...' : validateLabel}
            </Button>
          )}
          <Button size="small" onClick={handleOpenAssistant} startIcon={<AutoAwesome />} sx={aiButtonSx}>
            {buttonLabel}
          </Button>
        </Box>
      </Box>

      {missingInfo ? (
        <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, mb: 1, display: 'block' }}>
          {missingInfo}
        </Typography>
      ) : null}

      <TextField
        fullWidth
        multiline
        rows={rows}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        variant="outlined"
        sx={{
          ...glassInputSx,
          '& .MuiOutlinedInput-root': {
            ...(glassInputSx as any)['& .MuiOutlinedInput-root'],
            '& fieldset': {
              borderColor: missingInfo ? '#ef4444' : 'transparent',
            },
            '&:hover fieldset': {
              borderColor: missingInfo ? '#ef4444' : 'rgba(37, 99, 235, 0.3)',
            },
            '&.Mui-focused': {
              ...(glassInputSx as any)['& .MuiOutlinedInput-root']['&.Mui-focused'],
              '& fieldset': {
                borderColor: missingInfo ? '#ef4444' : '#2563EB',
                borderWidth: '1px',
              },
            },
          },
        }}
      />
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}
        >
          작성이 완료되었습니다.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumeAssistantTextSection;
