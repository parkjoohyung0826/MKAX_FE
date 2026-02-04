import React from 'react';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import StepHeader from './StepHeader';
import { useResumeStore } from '../../store';
import { ResumeTemplateId } from '../../types';

const templateCards: Array<{
  id: ResumeTemplateId;
  title: string;
  description: string;
  accent: string;
  background: string;
  previewSrc: string;
}> = [
  {
    id: 'classic',
    title: '기본 템플릿',
    description: '표 기반의 공문서 스타일로 정돈된 구조.',
    accent: '#2563eb',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    previewSrc: '/resume-templates/images/defaultResume.png',
  },
  {
    id: 'modern',
    title: '모던 템플릿',
    description: '헤더 강조 + 섹션 카드형 레이아웃.',
    accent: '#2563eb',
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    previewSrc: '/resume-templates/images/modernResume.png',
  },
];

const TemplatePreview = ({ src, title }: { src: string; title: string }) => (
  <Box
    component="img"
    src={src}
    alt={`${title} 미리보기`}
    className="template-image"
    sx={{
      width: '100%',
      aspectRatio: '4 / 3.4',
      display: 'block',
      borderRadius: 0,
      objectFit: 'cover',
      objectPosition: 'top center',
      transition: 'filter 0.2s ease, transform 0.2s ease',
    }}
  />
);

const TemplateSelectStep = () => {
  const { selectedTemplate, setSelectedTemplate } = useResumeStore();

  return (
    <Box sx={{ py: 2 }}>
      <StepHeader
        title="템플릿 선택"
        subtitle="작성 전에 원하는 이력서 디자인을 골라주세요. 이후에도 변경할 수 있습니다."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        {templateCards.map((template) => {
          const isSelected = selectedTemplate === template.id;
          return (
            <Paper
              key={template.id}
              elevation={0}
              onClick={() => setSelectedTemplate(template.id)}
              sx={{
                p: 0,
                borderRadius: '20px',
                border: isSelected ? `1px solid rgba(37, 99, 235, 0.55)` : '1px solid rgba(15, 23, 42, 0.08)',
                bgcolor: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                boxShadow: isSelected ? '0 10px 20px rgba(37, 99, 235, 0.08)' : '0 8px 20px rgba(15, 23, 42, 0.05)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 16px 28px rgba(15, 23, 42, 0.12)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '20px 20px 0 0',
                  overflow: 'hidden',
                  background: template.background,
                  '&:hover .template-image': {
                    filter: 'blur(6px)',
                    transform: 'scale(1.03)',
                  },
                  '&:hover .template-overlay': {
                    opacity: 1,
                  },
                }}
              >
                <TemplatePreview src={template.previewSrc} title={template.title} />
                <Box
                  className="template-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    px: 3,
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    background: 'rgba(15, 23, 42, 0.45)',
                    color: 'white',
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {template.description}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2.5,
                  py: 1.6,
                  borderTop: '1px solid rgba(15, 23, 42, 0.06)',
                }}
              >
                <Typography variant="h6" fontWeight={700} color="#0f172a">
                  {template.title}
                </Typography>
                {isSelected && (
                  <Chip
                    label="선택됨"
                    size="small"
                    sx={{
                      bgcolor: template.accent,
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: '999px',
                    }}
                  />
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default TemplateSelectStep;
