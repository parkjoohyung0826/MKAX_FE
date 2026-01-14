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
  Backdrop,
  Fade,
} from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { AutoAwesome } from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  title: string;
  prompt: string;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 600 },
  bgcolor: 'rgba(255, 255, 255, 0.85)', // 투명도 적용
  backdropFilter: 'blur(20px)', // 내부 블러
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.9)',
  outline: 'none',
  overflow: 'hidden',
};

const ConversationalAssistant = ({ open, onClose, onSubmit, title, prompt }: Props) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    onSubmit(text);
    setText('');
    onClose();
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.2)' } // 뒷 배경 블러 처리
        },
      }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          {/* Header */}
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.06)'
          }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{ 
                p: 1, 
                bgcolor: 'rgba(37, 99, 235, 0.1)', 
                borderRadius: '12px', 
                color: '#2563EB',
                display: 'flex' 
              }}>
                <AutoAwesome fontSize="small" />
              </Box>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                {title}
              </Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ 
              color: '#94a3b8', 
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)', color: '#64748b' } 
            }}>
              <XMarkIcon width={24} />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ p: 4 }}>
            <Typography variant="body1" sx={{ mb: 3, color: '#475569', lineHeight: 1.7 }}>
              {prompt}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="예) 지난 2년 동안 팀 리더로서 프로젝트를 성공적으로 이끌었으며, React와 Next.js를 활용한 웹 서비스 개발 경험이 풍부합니다..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.2s',
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(37, 99, 235, 0.3)' },
                  '&.Mui-focused': {
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
                    '& fieldset': { borderColor: '#2563EB' }
                  }
                }
              }}
            />
          </Box>
          
          {/* Footer */}
          <Box sx={{ 
            p: 3, 
            bgcolor: 'rgba(241, 245, 249, 0.5)', // 아주 연한 하단 배경
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 1.5 
          }}>
            <Button 
              onClick={onClose} 
              sx={{ 
                color: '#64748b', 
                fontWeight: 600, 
                px: 2,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } 
              }}
            >
              취소
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disableElevation
              startIcon={<AutoAwesome />}
              sx={{
                borderRadius: '12px',
                fontWeight: 700,
                px: 3,
                py: 1,
                bgcolor: '#2563EB',
                '&:hover': { bgcolor: '#1d4ed8' }
              }}
            >
              AI 생성하기
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ConversationalAssistant;