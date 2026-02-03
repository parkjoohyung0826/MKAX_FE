'use client';

import React from 'react';
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from '@mui/material';
import {
  AutoFixHigh,
  CancelOutlined,
  CheckCircleOutline,
  FactCheckOutlined,
  TipsAndUpdatesOutlined,
  ArrowDownwardRounded,
} from '@mui/icons-material';

type FeedbackItem = {
  title: string;
  deductionItems?: string[];
  before: string;
  deductionReason?: string;
  improvement?: string[];
  after?: string;
};

type CommonPattern = {
  pattern: string;
  description: string;
};

interface Props {
  sectionTitleSx?: Record<string, unknown>;
  resumeFeedback: FeedbackItem[];
  coverLetterFeedback: FeedbackItem[];
  commonPatterns: CommonPattern[];
  showDivider?: boolean;
}

const COLORS = {
  bg: '#FFFFFF', 
  textTitle: '#202124', 
  textBody: '#3C4043', 
  textSub: '#5F6368',   
  textLight: '#9AA0A6', 
  primary: '#4285F4',   
  primaryBg: '#F8FAFF', 
  surface: '#F8F9FA',   
  error: '#EA4335',     
  success: '#34A853',  
  border: '#E8EAED',  
};

const STYLES = {
  card: {
    bgcolor: '#FFFFFF',
    borderRadius: '28px', 
    boxShadow: '0 12px 40px -8px rgba(0, 0, 0, 0.08)', 
    border: '1px solid rgba(0,0,0,0.02)',
    overflow: 'hidden',
    p: { xs: 3, md: 5 }, 
    mb: 5,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 50px -12px rgba(66, 133, 244, 0.12)',
    },
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    mb: 2,
  },
  analysisBox: {
    bgcolor: COLORS.surface,
    borderRadius: '16px',
    p: 3,
    mt: 2.5,
  },
  improvementBox: {
    bgcolor: alpha(COLORS.primary, 0.06),
    borderRadius: '16px',
    p: 3,
    mt: 2.5,
    border: `1px solid ${alpha(COLORS.primary, 0.1)}`,
  },
};

const FeedbackCard = ({ item, index }: { item: FeedbackItem; index: number }) => {
  const improvementText = item.improvement?.filter(Boolean).join('\n');

  return (
    <Paper elevation={0} sx={STYLES.card}>
      {/* 1. 헤더: 번호 및 제목 */}
      <Box sx={{ mb: 5 }}>
        <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
          <Box
            sx={{
              bgcolor: COLORS.primary,
              color: '#fff',
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
            }}
          >
            {index + 1}
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: COLORS.textTitle, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
            {item.title}
          </Typography>
        </Stack>

        {/* 감점 태그: 둥근 칩 스타일 */}
        {item.deductionItems && item.deductionItems.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ ml: 6, flexWrap: 'wrap', gap: 0.5 }}>
            {item.deductionItems.map((tag, i) => (
              <Chip
                key={i}
                label={tag}
                size="small"
                sx={{
                  bgcolor: '#FEF2F2',
                  color: COLORS.error,
                  fontWeight: 600,
                  borderRadius: '12px',
                  border: 'none',
                  px: 0.5
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      {/* 2. 본문: 세로 배치 (Before -> After) */}
      <Box>
        <Box sx={{ mb: 4, position: 'relative' }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <CancelOutlined sx={{ fontSize: 20, color: COLORS.textLight }} />
            <Typography variant="subtitle2" fontWeight={700} color={COLORS.textSub}>
              아쉬운 표현 (Before)
            </Typography>
          </Stack>
          
          <Box sx={{ pl: 3, borderLeft: `3px solid ${COLORS.border}` }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: COLORS.textSub, 
                lineHeight: 1.8, 
                fontStyle: 'italic',
              }}
            >
              "{item.before}"
            </Typography>
          </Box>

          {item.deductionReason && (
            <Box sx={STYLES.analysisBox}>
              <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1.5 }}>
                <TipsAndUpdatesOutlined sx={{ fontSize: 20, color: COLORS.textSub }} />
                <Typography variant="subtitle2" fontWeight={800} color={COLORS.textBody}>
                  AI 분석
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: COLORS.textBody, lineHeight: 1.7 }}>
                {item.deductionReason}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: '50%', 
            bgcolor: '#F1F3F4', 
            display: 'flex', 
            color: COLORS.textLight 
          }}>
            <ArrowDownwardRounded sx={{ fontSize: 20 }} />
          </Box>
        </Box>

        <Box>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <CheckCircleOutline sx={{ fontSize: 20, color: COLORS.primary }} />
            <Typography variant="subtitle2" fontWeight={800} color={COLORS.primary}>
              수정 제안 (After)
            </Typography>
          </Stack>

          <Box sx={{ pl: 3, borderLeft: `3px solid ${COLORS.primary}` }}>
             <Typography 
              variant="body2" 
              sx={{ 
                color: COLORS.textTitle, 
                fontWeight: 500,
                lineHeight: 1.8, 
                whiteSpace: 'pre-line',
              }}
            >
              {item.after || "(수정 제안 문구가 없습니다)"}
            </Typography>
          </Box>

          {improvementText && (
            <Box sx={STYLES.improvementBox}>
              <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1.5 }}>
                <AutoFixHigh sx={{ fontSize: 20, color: COLORS.primary }} />
                <Typography variant="subtitle2" fontWeight={800} color={COLORS.primary}>
                  개선 포인트
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: '#174EA6', lineHeight: 1.7, fontWeight: 500 }}>
                {improvementText}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

const SectionTwoSentenceFeedback = ({
  resumeFeedback,
  coverLetterFeedback,
  commonPatterns,
  showDivider = true,
}: Props) => {
  if (resumeFeedback.length === 0 && coverLetterFeedback.length === 0 && commonPatterns.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto' }}>
      {showDivider && <Divider sx={{ my: 8, borderColor: 'transparent' }} />}

      {/* 섹션 인트로: Antigravity Title */}
      <Box sx={{ mb: 6, px: 1, textAlign: 'left' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 800, 
            color: COLORS.textTitle, 
            mb: 2,
            letterSpacing: '-1px',
            background: `linear-gradient(90deg, ${COLORS.textTitle} 0%, #5F6368 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          문장 구조 및 표현 진단
        </Typography>
        <Typography variant="body1" sx={{ color: COLORS.textSub, lineHeight: 1.6, fontSize: '1.05rem', maxWidth: '600px' }}>
          AI가 문서의 완성도를 해치는 표현을 찾아내고,<br />
          신뢰감을 줄 수 있는 더 나은 문장으로 교정해 드립니다.
        </Typography>
      </Box>

      {resumeFeedback.length > 0 && (
        <Box sx={{ mb: 8 }}>
           <Chip 
            label="Resume Feedback" 
            sx={{ 
              mb: 3, 
              fontWeight: 700, 
              bgcolor: alpha(COLORS.primary, 0.08), 
              color: COLORS.primary,
              fontSize: '0.85rem',
              borderRadius: '8px',
              height: '32px'
            }} 
           />
          <Box>
            {resumeFeedback.map((item, index) => (
              <FeedbackCard key={`resume-${index}`} item={item} index={index} />
            ))}
          </Box>
        </Box>
      )}

      {coverLetterFeedback.length > 0 && (
        <Box sx={{ mb: 8 }}>
           <Chip 
            label="Cover Letter Feedback" 
            sx={{ 
              mb: 3, 
              fontWeight: 700, 
              bgcolor: alpha(COLORS.primary, 0.08), 
              color: COLORS.primary,
              fontSize: '0.85rem',
              borderRadius: '8px',
              height: '32px'
            }} 
           />
          <Box>
            {coverLetterFeedback.map((item, index) => (
              <FeedbackCard key={`cl-${index}`} item={item} index={index} />
            ))}
          </Box>
        </Box>
      )}

      {commonPatterns.length > 0 && (
        <Box sx={{ px: 2, mb: 5 }}>
           <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 3 }}>
            <Box 
              sx={{ 
                width: 6, 
                height: 28, 
                borderRadius: 4, 
                bgcolor: COLORS.primary, 
                flexShrink: 0 
              }} 
            />
             <Typography variant="h5" fontWeight={800} sx={{ color: COLORS.textTitle }}>
              공통 패턴 요약
            </Typography>
          </Stack>
          
          <TableContainer
            component={Box}
            sx={{
              bgcolor: 'transparent',
              borderRadius: 0,
              border: 'none',
              mt: 2,
              p: 0 
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ borderBottom: `2px solid ${COLORS.border}` }}>
                  <TableCell 
                    sx={{ 
                      fontWeight: 800, 
                      color: COLORS.textLight, 
                      py: 2, 
                      pl: 0, 
                      width: '28%', 
                      fontSize: '0.75rem', 
                      letterSpacing: '1.5px', 
                      textTransform: 'uppercase' 
                    }}
                  >
                    Pattern Type
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 800, 
                      color: COLORS.textLight, 
                      py: 2, 
                      pl: 0, 
                      fontSize: '0.75rem', 
                      letterSpacing: '1.5px', 
                      textTransform: 'uppercase' 
                    }}
                  >
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commonPatterns.map((pattern, idx) => (
                  <TableRow 
                    key={`${pattern.pattern}-${idx}`}
                    sx={{ 
                      borderBottom: `1px solid ${COLORS.border}`, 
                      '&:last-child': { borderBottom: 'none' }, 
                      '&:hover': { bgcolor: 'transparent' } 
                    }}
                  >
                    <TableCell 
                      sx={{ 
                        color: COLORS.textTitle, 
                        fontWeight: 700, 
                        py: 3.5, 
                        pl: 0, 
                        fontSize: '1rem', 
                        verticalAlign: 'top', 
                        letterSpacing: '-0.3px' 
                      }}
                    >
                      {pattern.pattern}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        color: COLORS.textBody, 
                        py: 3.5, 
                        pl: 0, 
                        lineHeight: 1.8, 
                        fontSize: '0.95rem' 
                      }}
                    >
                      {pattern.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  ); 
};

export default SectionTwoSentenceFeedback;