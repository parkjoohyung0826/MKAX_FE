import React from 'react';
import { Box, Stepper, Step, StepLabel, StepConnector, stepConnectorClasses, StepIconProps } from '@mui/material';
import { Check, Circle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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
  const handleStepClick = (stepIndex: number) => {
    if (onStepClick) {
      onStepClick(stepIndex);
    }
  };

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