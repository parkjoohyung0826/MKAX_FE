import React from 'react';
import { Box, Paper, Typography, Stack, alpha } from '@mui/material';
import { CheckCircleRounded } from '@mui/icons-material';
import StepHeader from '@/features/resume/components/steps/StepHeader';

export type CareerTypeOption = 'basic' | 'senior';

interface Props {
  title: string;
  subtitle: string;
  selectedId: CareerTypeOption | null;
  onSelect: (id: CareerTypeOption) => void;
}

const cards: Array<{
  id: CareerTypeOption;
  title: string;
  description: string;
  illustrationUrl: string;
}> = [
  {
    id: 'basic',
    title: '기본형 (청년/일반)',
    description: '표준 채용 공고에 맞춘 트렌디하고 열정적인 톤앤매너',
    illustrationUrl: 'https://illustrations.popsy.co/blue/freelancer.svg',
  },
  {
    id: 'senior',
    title: '시니어용 (경력/전문)',
    description: '풍부한 경험과 전문성을 강조하는 무게감 있고 신뢰가는 톤앤매너',
    illustrationUrl: 'https://illustrations.popsy.co/blue/success.svg',
  },
];

const CareerTypeSelectCards = ({ title, subtitle, selectedId, onSelect }: Props) => {
  return (
    <Box sx={{ py: 2 }}>
      <StepHeader title={title} subtitle={subtitle} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 3, md: 4 },
          mt: 4,
          px: { xs: 2, sm: 0 },
        }}
      >
        {cards.map((card) => {
          const isSelected = selectedId === card.id;

          return (
            <Paper
              key={card.id}
              elevation={0}
              onClick={() => onSelect(card.id)}
              sx={{
                aspectRatio: '1 / 1',
                position: 'relative',
                borderRadius: '32px',
                cursor: 'pointer',
                overflow: 'hidden',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: isSelected ? 'rgba(37, 99, 235, 0.5)' : 'rgba(255, 255, 255, 0.6)',
                boxShadow: isSelected
                  ? `0 24px 48px -12px ${alpha('#2563EB', 0.25)}, inset 0 2px 20px rgba(255,255,255,0.5)`
                  : '0 12px 32px -8px rgba(15, 23, 42, 0.08), inset 0 2px 20px rgba(255,255,255,0.5)',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: isSelected
                    ? `0 32px 50px -12px ${alpha('#2563EB', 0.3)}`
                    : '0 20px 40px -12px rgba(15, 23, 42, 0.12)',
                  '& .illustration-layer': {
                    transform: 'scale(1.05) translateY(-4px)',
                  },
                },
              }}
            >
              <Box
                className="illustration-layer"
                sx={{
                  position: 'absolute',
                  bottom: '2%',
                  right: '2%',
                  width: '60%',
                  height: '60%',
                  backgroundImage: `url(${card.illustrationUrl})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'bottom right',
                  opacity: isSelected ? 1 : 0.6,
                  transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
                  zIndex: 0,
                  filter: isSelected ? 'drop-shadow(0 10px 16px rgba(37,99,235,0.2))' : 'none',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '70%',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />

              <Stack justifyContent="space-between" sx={{ position: 'relative', zIndex: 2, height: '100%', p: { xs: 3, md: 4 } }}>
                <Box sx={{ maxWidth: '90%' }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      color: isSelected ? '#1e293b' : '#334155',
                      mb: 1.5,
                      fontSize: { xs: '1.2rem', md: '1.4rem' },
                      letterSpacing: '-0.5px',
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#64748b',
                      lineHeight: 1.5,
                      fontSize: { xs: '0.9rem', md: '0.95rem' },
                      fontWeight: 500,
                      wordBreak: 'keep-all',
                    }}
                  >
                    {card.description}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 40 }}>
                  {isSelected && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.8,
                        bgcolor: '#2563EB',
                        color: 'white',
                        px: 1.5,
                        py: 0.6,
                        borderRadius: '99px',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                        '@keyframes popIn': {
                          '0%': { transform: 'scale(0.8) translateY(10px)', opacity: 0 },
                          '100%': { transform: 'scale(1) translateY(0)', opacity: 1 },
                        },
                      }}
                    >
                      <CheckCircleRounded sx={{ fontSize: 18 }} />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>선택됨</Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default CareerTypeSelectCards;
