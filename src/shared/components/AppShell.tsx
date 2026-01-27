'use client';

import React, { ReactNode, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AutoAwesome, Close, Restore, VpnKey } from '@mui/icons-material';
import { motion } from 'framer-motion';

const particleVariant = (i: number) => ({
  animate: {
    y: [0, -30, 0],
    x: [0, 20, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: 15 + i * 2,
      repeat: Infinity,
      ease: 'linear' as const,
    },
  },
});

const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(37, 99, 235, 0.3)' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
      '& fieldset': { borderColor: '#2563EB' },
    },
  },
};

interface Props {
  children: ReactNode;
  showParticles?: boolean;
}

const AppShell = ({ children, showParticles = false }: Props) => {
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLoadData = () => {
    if (!accessCode.trim()) return;
    console.log(`Loading data for code: ${accessCode}`);
    alert(`${accessCode} 코드로 저장된 이력서를 불러왔습니다.`);
    setIsLoadModalOpen(false);
    setAccessCode('');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      {showParticles &&
        [...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={particleVariant(i)}
            animate="animate"
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
              filter: 'blur(50px)',
              zIndex: 0,
            }}
          />
        ))}

      <AppBar position="fixed" elevation={0} sx={{ background: 'transparent', pt: 2, zIndex: 10 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(16px)',
              borderRadius: '50px',
              px: 3,
              py: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <Box display="flex" alignItems="center">
              <AutoAwesome sx={{ mr: 1.5, color: '#2563EB', fontSize: '1.8rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                Naeil<span style={{ color: '#2563EB' }}>Ro</span>
              </Typography>
            </Box>

            <Button
              startIcon={<Restore />}
              onClick={() => setIsLoadModalOpen(true)}
              sx={{
                color: '#64748b',
                fontWeight: 600,
                borderRadius: '20px',
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563EB',
                },
              }}
            >
              {isMobile ? '불러오기' : '기록 불러오기'}
            </Button>
          </Box>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, pt: 15, pb: 8 }}>
        {children}
      </Container>

      <Dialog
        open={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: '400px',
            p: 1,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1, pt: 1 }}>
          <IconButton onClick={() => setIsLoadModalOpen(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 4, pb: 4, pt: 0, textAlign: 'center' }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              bgcolor: 'rgba(37, 99, 235, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <VpnKey sx={{ color: '#2563EB' }} />
          </Box>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            이전 기록 불러오기
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            이전에 발급받은 인증 코드를 입력하면
            <br />
            작성 중이던 이력서와 자기소개서를 불러옵니다.
          </Typography>

          <TextField
            fullWidth
            placeholder="인증 코드 입력 (예: AB12-CD34)"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            sx={glassInputSx}
            InputProps={{
              sx: { textAlign: 'center' },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLoadData}
            disabled={!accessCode}
            sx={{
              mt: 3,
              py: 1.4,
              borderRadius: '16px',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2563EB, #1d4ed8)',
            }}
          >
            불러오기
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AppShell;
