// src/components/ConversationalAssistant.tsx
'use client';

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  title: string;
  prompt: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)', // A softer shadow
  borderRadius: 4,
  overflow: 'hidden', // Ensures the child corners are also rounded
};

const ConversationalAssistant = ({ open, onClose, onSubmit, title, prompt }: Props) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    onSubmit(text);
    setText('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="conversational-assistant-title">
      <Paper sx={style}>
        {/* Header */}
        <Box 
          sx={{ 
            p: 2.5, 
            bgcolor: 'grey.100',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <Typography variant="h6" component="h2" id="conversational-assistant-title" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} sx={{ bgcolor: 'grey.200' }}>
            <XMarkIcon width={20} />
          </IconButton>
        </Box>

        <Divider />

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary" mb={3} sx={{ lineHeight: 1.6 }}>
            {prompt}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="AI에게 전달할 내용을 자유롭게 작성해주세요. 예) ABC 회사에서 2년간 프론트엔드 개발자로 근무하며 React와 TypeScript를 사용해 매출을 20% 늘렸습니다."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'grey.50'
              }
            }}
          />
        </Box>
        
        <Divider />

        {/* Footer */}
        <Box sx={{ p: 2, bgcolor: 'grey.100', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="secondary">
            취소
          </Button>
          <Button variant="contained" onClick={handleSubmit} disableElevation>
            생성
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ConversationalAssistant;