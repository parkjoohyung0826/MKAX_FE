import React from 'react';
import { Box, Button, ButtonGroup, useMediaQuery } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useTheme } from '@mui/material/styles';

type InputMode = 'ai' | 'direct';

interface Props {
  currentMode: InputMode;
  onModeChange: (mode: InputMode) => void;
  onReset: () => void;
  resetDisabled?: boolean;
}

const ModeToggleBar = ({ currentMode, onModeChange, onReset, resetDisabled = false }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isMobile ? 1 : 2,
        flexDirection: 'row',
        flexWrap: 'nowrap',
      }}
    >
      <ButtonGroup
        sx={{
          width: isMobile ? '100%' : 'auto',
          p: 0.5,
          bgcolor: '#f1f5f9',
          borderRadius: '999px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
          flex: isMobile ? 1 : 'initial',
          minWidth: 0,
        }}
      >
        {(['ai', 'direct'] as InputMode[]).map((mode) => (
          <Button
            key={mode}
            variant={currentMode === mode ? 'contained' : 'text'}
            onClick={() => onModeChange(mode)}
            sx={{
              borderRadius: '999px !important',
              py: isMobile ? 0.9 : 1,
              px: isMobile ? 1.2 : 2.5,
              flex: isMobile ? 1 : 'initial',
              minWidth: 0,
              boxShadow: currentMode === mode ? '0 6px 14px rgba(59,130,246,0.2)' : 'none',
              bgcolor: currentMode === mode ? '#4f8ff5' : 'transparent',
              color: currentMode === mode ? 'white' : '#64748b',
              border: 'none',
              fontSize: isMobile ? '0.76rem' : '0.9rem',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              '&:hover': {
                bgcolor: currentMode === mode ? '#3b82f6' : 'rgba(0,0,0,0.05)',
                border: 'none',
              },
            }}
          >
            {mode === 'ai'
              ? (isMobile ? '챗봇 모드' : 'AI 챗봇으로 작성')
              : (isMobile ? '직접 입력 모드' : '단계별로 직접 입력')}
          </Button>
        ))}
      </ButtonGroup>
      <Button
        onClick={onReset}
        startIcon={<RefreshRoundedIcon sx={{ fontSize: '1.1rem' }} />}
        size="small"
        disabled={resetDisabled}
        sx={{
          flexShrink: 0,
          color: 'text.secondary',
          fontSize: isMobile ? '0.78rem' : '0.8rem',
          fontWeight: 500,
          textTransform: 'none',
          borderRadius: isMobile ? '14px' : '20px',
          bgcolor: 'action.hover',
          minWidth: 'auto',
          px: isMobile ? 1.1 : 2,
          py: isMobile ? 0.8 : 0.5,
          border: '1px solid transparent',
          whiteSpace: 'nowrap',
          justifyContent: 'center',
          '& .MuiButton-startIcon': {
            mr: isMobile ? 0.4 : undefined,
            ml: isMobile ? -0.2 : undefined,
            '& svg': { fontSize: isMobile ? '1rem' : '1.1rem' },
          },
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: 'action.selected',
            color: 'error.main',
            borderColor: 'error.light',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          },
          '&.Mui-disabled': {
            opacity: 0.5,
            color: 'text.secondary',
          },
        }}
      >
        {isMobile ? '다시쓰기' : '처음부터 다시 쓰기'}
      </Button>
    </Box>
  );
};

export default ModeToggleBar;
