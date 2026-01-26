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
} from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { AutoAwesome } from '@mui/icons-material';

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

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 600 },
  bgcolor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.9)',
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
            timeout: 500,
            sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.2)' },
          },
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            {/* Header */}
            <Box
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    p: 1,
                    bgcolor: 'rgba(37, 99, 235, 0.1)',
                    borderRadius: '12px',
                    color: '#2563EB',
                    display: 'flex',
                  }}
                >
                  <AutoAwesome fontSize="small" />
                </Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                  {title}
                </Typography>
              </Box>
              <IconButton
                onClick={onClose}
                sx={{
                  color: '#94a3b8',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.05)', color: '#64748b' },
                }}
              >
                <XMarkIcon width={24} />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ p: 4 }}>
              <Typography variant="body1" sx={{ mb: 3, color: '#475569', lineHeight: 1.7 }}>
                {prompt}
              </Typography>
              {missingInfo ? (
                <Typography
                  variant="caption"
                  sx={{ color: '#ef4444', fontWeight: 600, mb: 1, display: 'block' }}
                >
                  {missingInfo}
                </Typography>
              ) : null}
              <TextField
                fullWidth
                multiline
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="AI에게 도움받고 싶은 내용을 입력해주세요."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    transition: 'all 0.2s',
                    '& fieldset': { borderColor: missingInfo ? '#ef4444' : 'rgba(0,0,0,0.1)' },
                    '&:hover fieldset': {
                      borderColor: missingInfo ? '#ef4444' : 'rgba(37, 99, 235, 0.3)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#fff',
                      boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
                      '& fieldset': { borderColor: missingInfo ? '#ef4444' : '#2563EB' },
                    },
                  },
                }}
              />
              {error ? (
                <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, mt: 1 }}>
                  {error}
                </Typography>
              ) : null}
            </Box>

            {/* Footer */}
            <Box
              sx={{
                p: 3,
                bgcolor: 'rgba(241, 245, 249, 0.5)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1.5,
              }}
            >
              <Button
                onClick={onClose}
                sx={{
                  color: '#64748b',
                  fontWeight: 600,
                  px: 2,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
                }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                startIcon={<AutoAwesome />}
                sx={{
                  borderRadius: '12px',
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  bgcolor: '#2563EB',
                  '&:hover': { bgcolor: '#1d4ed8' },
                }}
              >
                {loading ? '생성 중...' : 'AI 생성하기'}
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
          onClose={() => setSuccessOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}
        >
          작성이 완료되었습니다.
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConversationalAssistant;
