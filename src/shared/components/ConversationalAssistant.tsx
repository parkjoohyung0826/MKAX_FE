'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Backdrop,
  Fade,
  Snackbar,
  Alert,
  keyframes,
  Collapse,
  CircularProgress,
} from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => Promise<AssistantSubmitResult | void>;
  title: string;
  prompt: string;
}

export type AssistantSubmitResult = {
  missingInfo?: string;
  isComplete?: boolean;
};

// --- 애니메이션 정의 ---
const softPulse = keyframes`
  0% { border-color: #e2e8f0; box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
  50% { border-color: #2563eb; box-shadow: 0 0 12px 0 rgba(37, 99, 235, 0.15); }
  100% { border-color: #e2e8f0; box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
`;

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '92%', md: 560 },
  bgcolor: '#ffffff',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
  borderRadius: '20px',
  outline: 'none',
  overflow: 'hidden',
};

const ConversationalAssistant = ({ open, onClose, onSubmit, title, prompt }: Props) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingInfo, setMissingInfo] = useState<string>('');
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setError(null);
      setMissingInfo('');
      setLoading(false);
      setText('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setMissingInfo('');

    try {
      const result = await onSubmit(text);
      const info = typeof result?.missingInfo === 'string' ? result.missingInfo : '';
      const isComplete = result?.isComplete;

      if (isComplete === true) {
        onClose();
        setSuccessOpen(true);
        return;
      }

      if (isComplete === false || info.trim().length > 0) {
        setMissingInfo(info);
        return;
      }
    } catch (e: any) {
      setError(e?.message ?? 'AI 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 400,
            sx: { backgroundColor: 'rgba(15, 23, 42, 0.25)', backdropFilter: 'blur(2px)' },
          },
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            {/* Header */}
            <Box
              sx={{
                px: 3,
                py: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {title}
              </Typography>
              <IconButton onClick={onClose} size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#64748b' } }}>
                <XMarkIcon width={20} />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ px: 3.5, pb: 2 }}>
              <Typography variant="body2" sx={{ mb: 3, color: '#64748b', lineHeight: 1.6 }}>
                {prompt}
              </Typography>

              <Collapse in={!!missingInfo}>
                <Box sx={{ mb: 2, p: 1.3, bgcolor: '#fff1f2', borderRadius: '12px',  }}>
                  <Typography variant="caption" sx={{ color: '#e11d48', fontWeight: 600, display: 'block' }}>
                    추가 정보 필요: {missingInfo}
                  </Typography>
                </Box>
              </Collapse>

              <TextField
                fullWidth
                multiline
                rows={6}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                placeholder="AI에게 도움받고 싶은 내용을 입력해주세요."
                disabled={loading}
                sx={{
                  '& textarea': {
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  },
                  '& textarea::-webkit-scrollbar': {
                    display: 'none',
                  },
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.925rem',
                    borderRadius: '14px',
                    transition: 'all 0.2s ease',
                    backgroundColor: loading ? '#fcfdfe' : '#ffffff',
                    '& fieldset': { 
                      borderColor: missingInfo ? '#fda4af' : '#e2e8f0',
                      borderWidth: '1px !important', 
                    },
                    '&:hover fieldset': {
                      borderColor: '#cbd5e1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563eb',
                      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.06)',
                    },
                    ...(loading && {
                      animation: `${softPulse} 2s infinite ease-in-out`,
                    }),
                  },
                }}
              />

              <Collapse in={!!error}>
                <Typography variant="caption" sx={{ color: '#e11d48', fontWeight: 600, mt: 1.5, display: 'block' }}>
                  {error}
                </Typography>
              </Collapse>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                p: 2.5,
                bgcolor: '#f8fafc',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Button
                onClick={onClose}
                disabled={loading}
                sx={{ 
                  color: '#64748b', 
                  fontWeight: 600, 
                  fontSize: '0.875rem', 
                  px: 2,
                  '&:hover': { bgcolor: 'transparent', color: '#334155' } 
                }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                disableElevation
                sx={{
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 3,
                  py: 1,
                  bgcolor: '#2563eb',
                  minWidth: '110px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#1d4ed8' },
                  '&.Mui-disabled': { bgcolor: loading ? '#2563eb' : '#e2e8f0', opacity: loading ? 0.7 : 1 }
                }}
              >
                {loading ? (
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                ) : (
                  '생성하기'
                )}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          variant="filled" 
          sx={{ borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, bgcolor: '#0f172a' }}
        >
          정리가 완료되었습니다.
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConversationalAssistant;
