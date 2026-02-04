import React from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

type InputMode = 'ai' | 'direct';

interface Props {
  currentMode: InputMode;
  onModeChange: (mode: InputMode) => void;
  onReset: () => void;
  resetDisabled?: boolean;
}

const ModeToggleBar = ({ currentMode, onModeChange, onReset, resetDisabled = false }: Props) => {
  return (
    <Box
      sx={{
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: { xs: 'wrap', md: 'nowrap' },
      }}
    >
      <ButtonGroup
        sx={{
          p: 0.5,
          bgcolor: '#f1f5f9',
          borderRadius: '999px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        {(['ai', 'direct'] as InputMode[]).map((mode) => (
          <Button
            key={mode}
            variant={currentMode === mode ? 'contained' : 'text'}
            onClick={() => onModeChange(mode)}
            sx={{
              borderRadius: '999px !important',
              py: 1,
              px: 2.5,
              boxShadow: currentMode === mode ? '0 6px 14px rgba(59,130,246,0.2)' : 'none',
              bgcolor: currentMode === mode ? '#4f8ff5' : 'transparent',
              color: currentMode === mode ? 'white' : '#64748b',
              border: 'none',
              minWidth: 0,
              '&:hover': {
                bgcolor: currentMode === mode ? '#3b82f6' : 'rgba(0,0,0,0.05)',
                border: 'none',
              },
            }}
          >
            {mode === 'ai' ? 'AI 챗봇으로 작성' : '단계별로 직접 입력'}
          </Button>
        ))}
      </ButtonGroup>
      <Button
        onClick={onReset}
        startIcon={<RefreshRoundedIcon sx={{ fontSize: '1.1rem' }} />}
        size="small"
        disabled={resetDisabled}
        sx={{
          color: 'text.secondary',
          fontSize: '0.8rem',
          fontWeight: 500,
          textTransform: 'none',
          borderRadius: '20px',
          bgcolor: 'action.hover',
          px: 2,
          py: 0.5,
          border: '1px solid transparent',
          whiteSpace: 'nowrap',
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
        처음부터 다시 쓰기
      </Button>
    </Box>
  );
};

export default ModeToggleBar;
