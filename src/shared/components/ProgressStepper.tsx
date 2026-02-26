import React, { MouseEvent, useEffect, useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  Button,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Chip,
  useMediaQuery,
} from '@mui/material';
import { Check, Circle } from '@mui/icons-material';
import { MenuRounded } from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';

interface Props {
  steps: string[];
  activeStep: number;
  onStepClick?: (step: number) => void;
  completedSteps?: boolean[];
}

// 1. 고정된 색상의 연결선 (회색 유지)
const FixedColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#e2e8f0', 
    borderTopWidth: 2,
    borderRadius: 1,
  },
}));

// 2. 아이콘 스타일
const StyledStepIconRoot = styled('div')<{ ownerState: { active?: boolean; completed?: boolean } }>(
  ({ theme, ownerState }) => ({
    backgroundColor: '#fff',
    zIndex: 1,
    color: '#cbd5e1', // 기본: 연한 회색
    width: 32,
    height: 32,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #e2e8f0', // 기본 테두리
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

    // [Active] 현재 단계
    ...(ownerState.active && {
      borderColor: '#2563EB',
      color: '#2563EB',
      backgroundColor: '#fff',
      transform: 'scale(1.1)',
      boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
    }),

    // [Completed] 완료된 단계
    ...(ownerState.completed && {
      borderColor: '#2563EB',
      backgroundColor: '#2563EB',
      color: '#fff',
    }),
  }),
);

// 3. 아이콘 컴포넌트
function StyledStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    // [수정] 호버 타겟팅을 위해 'step-icon' 클래스 추가
    <StyledStepIconRoot ownerState={{ active, completed }} className={`${className} step-icon`}>
      {completed ? (
        <Check sx={{ fontSize: 18 }} />
      ) : active ? (
        <Circle sx={{ fontSize: 10 }} />
      ) : (
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'currentColor' }} /> 
      )}
    </StyledStepIconRoot>
  );
}

const ProgressStepper = ({ steps, activeStep, onStepClick, completedSteps = [] }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<HTMLElement | null>(null);
  const openMobileSteps = Boolean(mobileMenuAnchorEl);

  useEffect(() => {
    setMobileMenuAnchorEl(null);
  }, [activeStep]);

  const handleStepClick = (stepIndex: number) => {
    if (onStepClick) {
      onStepClick(stepIndex);
    }
  };

  const handleOpenMobileMenu = (event: MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuAnchorEl(null);
  };

  if (isMobile) {
    const currentLabel = steps[activeStep] ?? '';
    const completedCount = completedSteps.length > 0
      ? completedSteps.filter(Boolean).length
      : activeStep;

    return (
      <>
        <Box
          sx={{
            my: 2.5,
            p: 1.25,
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            bgcolor: 'rgba(255,255,255,0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={0.8}
              alignItems="center"
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 0.35, rowGap: 0.5 }}
            >
              <Typography sx={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                진행 단계
              </Typography>
              <Chip
                size="small"
                label={`${Math.min(activeStep + 1, steps.length)}/${steps.length}`}
                sx={{
                  height: 20,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  bgcolor: 'rgba(37, 99, 235, 0.08)',
                  color: '#2563EB',
                }}
              />
              <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                완료 {completedCount}단계
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontSize: '0.88rem',
                color: '#0f172a',
                fontWeight: 800,
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentLabel}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<MenuRounded />}
            onClick={handleOpenMobileMenu}
            sx={{
              flexShrink: 0,
              minWidth: 'auto',
              px: 1.4,
              py: 0.8,
              borderRadius: '12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'none',
              borderColor: 'rgba(148, 163, 184, 0.28)',
              color: '#334155',
              '&:hover': {
                borderColor: 'rgba(37, 99, 235, 0.3)',
                bgcolor: 'rgba(37, 99, 235, 0.04)',
              },
            }}
          >
            단계
          </Button>
        </Box>

        <Menu
          anchorEl={mobileMenuAnchorEl}
          open={openMobileSteps}
          onClose={handleCloseMobileMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                width: 'min(86vw, 340px)',
                mt: 1,
                p: 1,
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.94)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(226,232,240,0.9)',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
              },
            },
          }}
          MenuListProps={{ sx: { p: 0.5 } }}
        >
          {steps.map((label, index) => {
            const isCompleted = completedSteps.length > 0 ? completedSteps[index] : index < activeStep;
            const isActive = index === activeStep;
            const isClickable = !!onStepClick;

            return (
              <MenuItem
                key={`${label}-${index}`}
                onClick={() => {
                  if (!isClickable) return;
                  handleStepClick(index);
                  handleCloseMobileMenu();
                }}
                disabled={!isClickable}
                sx={{
                  borderRadius: '10px',
                  py: 1,
                  px: 1,
                  mb: 0.5,
                  alignItems: 'flex-start',
                  bgcolor: isActive ? 'rgba(37,99,235,0.06)' : 'transparent',
                  '&:last-of-type': { mb: 0 },
                  '&.Mui-disabled': { opacity: 1 },
                }}
              >
                <Stack direction="row" spacing={1.1} alignItems="center" sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      border: '1.5px solid',
                      borderColor: isCompleted || isActive ? '#2563EB' : '#cbd5e1',
                      bgcolor: isCompleted ? '#2563EB' : '#fff',
                      color: isCompleted ? '#fff' : isActive ? '#2563EB' : '#94a3b8',
                      flexShrink: 0,
                      mt: 0.15,
                    }}
                  >
                    {isCompleted ? <Check sx={{ fontSize: 13 }} /> : index + 1}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '0.82rem',
                        fontWeight: isActive ? 800 : 700,
                        color: isActive ? '#1d4ed8' : '#334155',
                        lineHeight: 1.25,
                        wordBreak: 'keep-all',
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', mt: 0.1 }}>
                      {isActive ? '현재 단계' : isCompleted ? '완료됨' : '이동하기'}
                    </Typography>
                  </Box>
                </Stack>
              </MenuItem>
            );
          })}
        </Menu>
      </>
    );
  }

  return (
    <Box sx={{ width: '100%', my: 5 }}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<FixedColorConnector />}>
        {steps.map((label, index) => {
          const isCompleted = completedSteps.length > 0 ? completedSteps[index] : index < activeStep;
          const isActive = index === activeStep;
          const isClickable = !!onStepClick;

          return (
            <Step key={label} completed={isCompleted}>
              <StepLabel
                StepIconComponent={StyledStepIcon}
                onClick={() => handleStepClick(index)}
                sx={{
                  cursor: isClickable ? 'pointer' : 'default',
                  '& .MuiStepLabel-label': {
                    mt: 1,
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#1e293b' : '#94a3b8',
                    transition: 'color 0.2s ease',
                  },
                  // [수정됨] 호버 시 텍스트와 아이콘 모두 효과 적용
                  '&:hover': isClickable ? {
                    '& .MuiStepLabel-label': { 
                      color: '#2563EB', // 텍스트 파란색
                    },
                    '& .step-icon': {
                      borderColor: '#2563EB', // 아이콘 테두리 파란색
                      color: '#2563EB',       // 내부 점 색상 파란색
                      transform: 'scale(1.1)', // 아이콘 살짝 확대
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)', // 부드러운 그림자 추가
                    }
                  } : {},
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default ProgressStepper;
