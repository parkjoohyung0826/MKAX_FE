'use client';

import React from 'react';
import { Box, IconButton, Paper, TextField } from '@mui/material';
import { Send } from '@mui/icons-material';

const floatingInputWrapperSx = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  p: 3,
  display: 'flex',
  justifyContent: 'center',
  zIndex: 10,
};

const inputPaperSx = {
  width: '100%',
  maxWidth: '700px',
  p: '8px 8px 8px 24px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '32px',
  bgcolor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  border: '1px solid rgba(255,255,255,0.8)',
  transition: 'all 0.3s ease',
  '&:focus-within': {
    transform: 'translateY(-2px)',
    boxShadow: '0 15px 50px rgba(37, 99, 235, 0.15)',
    border: '1px solid rgba(37, 99, 235, 0.3)',
  },
};

const chatInputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { border: 'none' },
    '& input': { padding: '10px 0', fontSize: '1.05rem' },
  },
};

type ChatInputBarProps = {
  userInput: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

const ChatInputBar = ({
  userInput,
  onChange,
  onSend,
  isTyping,
  isComplete,
  inputRef,
}: ChatInputBarProps) => {
  const isDisabled = isTyping;
  const isEmpty = !userInput.trim();

  return (
    <Box sx={floatingInputWrapperSx}>
      <Paper sx={inputPaperSx} elevation={0}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={isTyping ? '답변을 기다리는 중...' : '답변을 입력해주세요...'}
          value={userInput}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
          disabled={isDisabled}
          sx={chatInputSx}
          inputRef={inputRef}
        />
        <IconButton
          onClick={onSend}
          disabled={isEmpty || isTyping}
          sx={{
            bgcolor: isEmpty || isTyping ? '#f1f5f9' : '#2563EB',
            color: isEmpty || isTyping ? '#cbd5e1' : '#fff',
            width: 48,
            height: 48,
            ml: 1,
            transition: 'all 0.2s',
            '&:hover': { bgcolor: '#1d4ed8', transform: 'scale(1.1)' },
          }}
        >
          <Send fontSize="small" />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatInputBar;
