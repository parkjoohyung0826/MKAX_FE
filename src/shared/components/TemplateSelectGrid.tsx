'use client';

import React from 'react';
import { Box, Paper, Typography, Stack, alpha } from '@mui/material';
import { CheckCircleRounded, CallMadeRounded } from '@mui/icons-material';

export interface TemplateSelectItem {
  id: string;
  title: string;
  description: string;
  hoverDescription?: string;
  accent: string;
  previewSrc: string;
}

interface Props<T extends string> {
  items: Array<TemplateSelectItem & { id: T }>;
  selectedId: T | null;
  onSelect: (id: T) => void;
}

const COLORS = {
  bg: '#FFFFFF',
  textTitle: '#111827',
  textBody: '#6B7280',
  border: '#E5E7EB',
};

const TemplateSelectGrid = <T extends string>({ items, selectedId, onSelect }: Props<T>) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: { xs: 1.25, sm: 3 },
      }}
    >
      {items.map((item) => {
        const isSelected = selectedId === item.id;

        return (
          <Paper
            key={item.id}
            elevation={0}
            onClick={() => onSelect(item.id)}
            sx={{
              p: 0,
              borderRadius: { xs: '18px', sm: '32px' },
              bgcolor: COLORS.bg,
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '1 / 1',
              border: '1.5px solid',
              borderColor: isSelected ? alpha(item.accent, 0.5) : 'rgba(255, 255, 255, 0.6)',
              background: isSelected
                ? `linear-gradient(135deg, ${alpha(item.accent, 0.08)} 0%, ${alpha(item.accent, 0.02)} 100%)`
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
              boxShadow: isSelected
                ? `0 24px 48px -12px ${alpha(item.accent, 0.25)}, inset 0 2px 20px rgba(255,255,255,0.5)`
                : '0 12px 32px -8px rgba(15, 23, 42, 0.08), inset 0 2px 20px rgba(255,255,255,0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              
              '&:hover': {
                transform: { xs: 'none', sm: 'translateY(-8px)' },
                boxShadow: isSelected
                  ? `0 32px 50px -12px ${alpha(item.accent, 0.3)}`
                  : '0 20px 40px -12px rgba(15, 23, 42, 0.12)',
                '& .hover-arrow': {
                  opacity: 1,
                  transform: 'translate(0, 0)',
                }
              },
            }}
          >
            <Stack spacing={0} sx={{ height: '100%' }}>
              
              {/* 1. 이미지 및 오버레이 영역 (4:3 비율 유지) */}
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: { xs: '70%', sm: '72%' },
                  
                  '&:hover .template-image': {
                    filter: 'blur(4px)',
                    transform: 'scale(1.05)',
                  },
                  '&:hover .template-overlay': {
                    opacity: 1,
                  },
                }}
              >
                <Box
                  component="img"
                  src={item.previewSrc}
                  alt={`${item.title} 미리보기`}
                  className="template-image"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    transition: 'filter 0.4s ease, transform 0.4s ease',
                  }}
                />
                
                {/* 오버레이 박스 */}
                <Box
                  className="template-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    px: 3,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    background: 'rgba(17, 24, 39, 0.5)',
                    color: 'white',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.5, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    {item.hoverDescription ?? item.description}
                  </Typography>
                </Box>
              </Box>

              {/* 2. 하단 텍스트 영역 (높이 최소화) */}
              <Box 
                sx={{ 
                  px: { xs: 1.2, sm: 2 }, 
                  py: { xs: 0.55, sm: 1.5 },
                  borderTop: `1px solid ${alpha(COLORS.border, 0.8)}`,
                  bgcolor: isSelected ? alpha(item.accent, 0.04) : '#FFFFFF',
                  flexGrow: 1,
                  transition: 'background-color 0.3s ease',
                }}
              >
                <Stack spacing={{ xs: 0.2, sm: 0.5 }} justifyContent="center" sx={{ height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Stack direction="row" alignItems="center" gap={0.5}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: { xs: '0.82rem', sm: '1rem' }, 
                          lineHeight: 1.3,
                          color: isSelected ? item.accent : COLORS.textTitle, 
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {item.title}
                      </Typography>
                      
                      <Box 
                        className="hover-arrow"
                        sx={{
                          display: { xs: 'none', sm: 'flex' },
                          opacity: 0,
                          transform: 'translate(-4px, 4px)',
                          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          color: item.accent,
                        }}
                      >
                        <CallMadeRounded sx={{ fontSize: 16 }} />
                      </Box>
                    </Stack>

                    {/* 선택됨 배지 */}
                    {isSelected && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          bgcolor: item.accent,
                          color: 'white',
                          px: 0.8,
                          py: 0.25,
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          boxShadow: `0 2px 6px ${alpha(item.accent, 0.3)}`,
                          animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                          '@keyframes popIn': {
                            '0%': { transform: 'scale(0.8)', opacity: 0 },
                            '100%': { transform: 'scale(1)', opacity: 1 },
                          }
                        }}
                      >
                        <CheckCircleRounded sx={{ fontSize: 12 }} />
                        <Box component="span">선택됨</Box>
                      </Box>
                    )}
                  </Box>

                </Stack>
              </Box>
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
};

export type TemplateSelectGridProps<T extends string> = Props<T>;

export default TemplateSelectGrid;
