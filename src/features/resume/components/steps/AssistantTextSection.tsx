'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  keyframes,
  CircularProgress,
  InputAdornment,
  Collapse,
  useMediaQuery,
} from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import ConversationalAssistant from '@/shared/components/ConversationalAssistant';

const glowingPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.06), 0 0 0 1px rgba(37, 99, 235, 0.08);
    border-color: rgba(37, 99, 235, 0.22);
  }
  50% {
    box-shadow: 0 0 14px 2px rgba(37, 99, 235, 0.14), 0 0 0 1px rgba(37, 99, 235, 0.32);
    border-color: rgba(37, 99, 235, 0.5);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.06), 0 0 0 1px rgba(37, 99, 235, 0.08);
    border-color: rgba(37, 99, 235, 0.22);
  }
`;

const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    padding: '16px',
    transition: 'all 0.3s ease',
    '& fieldset': { borderColor: 'transparent', transition: 'border-color 0.3s ease' },
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
  isValidated?: boolean;
  onValidatedChange?: (validated: boolean) => void;
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
  validateLabel = '내용 검증하기',
  isValidated = false,
  onValidatedChange,
}: ResumeAssistantTextSectionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [missingInfo, setMissingInfo] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const abortControllerRef = useRef(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(event);
  };

  const handleOpenAssistant = () => setAssistantOpen(true);
  const handleCloseAssistant = () => setAssistantOpen(false);

  const handleAssistantSubmit = async (
    text: string
  ): Promise<{ missingInfo?: string; isComplete?: boolean } | void> => {
    return onAssistantSubmit(text);
  };

  const handleValidate = async () => {
    if (!onValidate) return;

    abortControllerRef.current = false;
    setIsValidating(true);
    setMissingInfo('');

    try {
      const result = await onValidate();
      
      if (abortControllerRef.current) return;

      const info = typeof result?.missingInfo === 'string' ? result.missingInfo : '';
      const isComplete = result?.isComplete;
      
      if (info.trim().length > 0) {
        setMissingInfo(info);
      } else if (isComplete === true) {
        onValidatedChange?.(true);
        setToastOpen(true);
      }
    } catch (error) {
      if (!abortControllerRef.current) {
        console.error("Validation failed", error);
      }
    } finally {
      if (!abortControllerRef.current) {
        setIsValidating(false);
      }
    }
  };

  const handleCancelValidate = () => {
    abortControllerRef.current = true; 
    setIsValidating(false); 
  };

  const handleUnlockValidation = () => {
    setMissingInfo('');
    onValidatedChange?.(false);
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

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={isMobile ? 'stretch' : 'flex-end'}
        sx={{ mb: 1.5, px: 1, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1.25 : 0 }}
      >
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
        <Box
          display="flex"
          gap={1}
          alignItems="center"
          justifyContent={isMobile ? 'flex-start' : 'flex-end'}
          flexWrap={isMobile ? 'wrap' : 'nowrap'}
          sx={{ ml: isMobile ? 0 : 1 }}
        >
          <Box>
            <Button
              size="small"
              onClick={handleOpenAssistant}
              startIcon={<AutoAwesome />}
              sx={{
                ...aiButtonSx,
                px: isMobile ? 1.4 : 2,
                py: isMobile ? 0.45 : 0.5,
                minHeight: isMobile ? 34 : undefined,
                fontSize: isMobile ? '0.78rem' : '0.85rem',
                borderRadius: isMobile ? '14px' : '20px',
                whiteSpace: 'nowrap',
              }}
              disabled={isValidated}
            >
              {buttonLabel}
            </Button>
          </Box>
          {onValidate && (
            <Box>
              <Button
                size="small"
                onClick={
                  isValidated
                    ? handleUnlockValidation
                    : isValidating
                      ? handleCancelValidate
                      : handleValidate
                }
                sx={{
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: isMobile ? '14px' : '20px',
                  px: isMobile ? 1.4 : 2,
                  py: isMobile ? 0.45 : 0.5,
                  minHeight: isMobile ? 34 : undefined,
                  fontSize: isMobile ? '0.78rem' : '0.85rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  ...(isValidated
                    ? {
                        color: '#0f172a',
                        bgcolor: 'rgba(15, 23, 42, 0.06)',
                        '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.12)' },
                      }
                    : isValidating
                    ? {
                        color: '#ef4444',
                        bgcolor: '#fee2e2',
                        '&:hover': { bgcolor: '#fecaca' },
                      }
                    : {
                        color: '#0f172a',
                        bgcolor: 'rgba(15, 23, 42, 0.06)',
                        '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.12)' },
                      }),
                }}
              >
                {isValidated ? '수정하기' : isValidating ? '검증 취소하기' : validateLabel}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Collapse in={Boolean(missingInfo)} timeout={250} unmountOnExit>
        <Box sx={{ px: 1 }}>
          <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, mb: 1, display: 'block' }}>
            {missingInfo}
          </Typography>
        </Box>
      </Collapse>

      <Box sx={{ px: 1, overflow: 'visible' }}>
        <TextField
          fullWidth
          multiline
          rows={rows}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          variant="outlined"
          disabled={isValidating || isValidated}
          InputProps={{
            endAdornment: isValidating ? (
              <InputAdornment position="end" sx={{ position: 'absolute', bottom: 16, right: 16 }}>
                <CircularProgress size={20} thickness={5} sx={{ color: '#2563EB' }} />
              </InputAdornment>
            ) : null,
          }}
        sx={{
          ...glassInputSx,
          position: 'relative',
          zIndex: 1,
          '& textarea': {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          },
          '& textarea::-webkit-scrollbar': {
            display: 'none',
          },
          '& .MuiInputBase-input::placeholder': {
            whiteSpace: 'pre-line',
          },
          '& .MuiOutlinedInput-input': {
            fontSize: isMobile ? '0.92rem' : '1rem',
            lineHeight: isMobile ? 1.6 : 1.7,
          },
          '& .MuiOutlinedInput-input::placeholder': {
            fontSize: isMobile ? '0.9rem' : '1rem',
            color: isMobile ? '#94a3b8' : undefined,
            opacity: isMobile ? 0.72 : 1,
          },
            '& .MuiOutlinedInput-root': {
              ...(glassInputSx as any)['& .MuiOutlinedInput-root'],
              animation: isValidating ? `${glowingPulse} 2s infinite ease-in-out` : 'none',
              backgroundColor: isValidating ? 'rgba(255, 255, 255, 0.9)' : (glassInputSx as any)['& .MuiOutlinedInput-root'].backgroundColor,

              '& fieldset': {
                borderColor: missingInfo ? '#ef4444' : (isValidating ? '#2563EB' : 'transparent'),
                borderWidth: isValidating ? '1px' : undefined,
              },
              '&:hover fieldset': {
                borderColor: missingInfo ? '#ef4444' : (isValidating ? '#2563EB' : 'rgba(37, 99, 235, 0.3)'),
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
      </Box>
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
          검증이 완료되었습니다.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumeAssistantTextSection;
