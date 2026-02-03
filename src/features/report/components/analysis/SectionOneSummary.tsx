'use client';

import React from 'react';
import {
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import {
  AutoAwesome,
  TrendingUp,
  ErrorOutline,
  CheckCircle,
  Lens,
} from '@mui/icons-material';
import { AnalysisReportScoreDetail } from '../../types';

interface Props {
  glassCardSx?: Record<string, unknown>;
  sectionTitleSx?: Record<string, unknown>;
  totalScore: string;
  summary: string;
  evaluationParagraphs: string[];
  strengths: string[];
  improvements: string[];
  scoreRows: AnalysisReportScoreDetail[];
}

// ✨ Antigravity Design System
const STYLES = {
  // 메인 컨테이너 (은은한 그라디언트 배경)
  container: {
    position: 'relative' as const,
    overflow: 'hidden',
    borderRadius: '24px',
    background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
    border: '1px solid #E2E8F0',
    p: { xs: 2, md: 3 },
  },
  // 유리 카드 (매우 얇은 테두리, 블러)
  glassCard: {
    bgcolor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(16px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 4px 20px rgba(148, 163, 184, 0.1)', // 아주 부드러운 그림자
    overflow: 'hidden',
  },
  // 강조 텍스트 그라디언트
  gradientText: {
    background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
  },
};

const SectionOneSummary = ({
  totalScore,
  summary,
  evaluationParagraphs,
  strengths,
  improvements,
  scoreRows,
}: Props) => {
  const theme = useTheme();
  const scoreNum = parseInt(totalScore, 10) || 0;

  return (
    <Box>
      {/* 배경 장식 (Ambient Light) */}
      {/* <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -50,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      /> */}

      {/* 1. Hero Section: 점수와 요약의 결합 */}
      <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1, mb: 4, mt: 3}}>
        {/* 점수 영역 (왼쪽) */}
        <Grid item xs={12} md={4.5}>
          <Paper
            elevation={0}
            sx={{
              ...STYLES.glassCard,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.5) 100%)',
            }}
          >
            <Chip
              icon={<AutoAwesome sx={{ fontSize: '14px !important' }} />}
              label="AI 종합 분석"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 700,
                mb: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            />
            
            {/* 점수 원형 데코레이션 */}
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
              {/* 뒤쪽 흐릿한 원 */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, #3B82F6, #A855F7, #3B82F6)',
                  opacity: 0.15,
                  filter: 'blur(15px)',
                }}
              />
              {/* 점수 텍스트 */}
              <Box sx={{ textAlign: 'center', zIndex: 2 }}>
                <Typography  sx={{ ...STYLES.gradientText, fontSize: '2.5rem', lineHeight: 1, letterSpacing: '-2px' }}>
                  {totalScore}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}>
                  TOTAL SCORE
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* 요약 영역 (오른쪽) */}
        <Grid item xs={12} md={7.5}>
          <Paper
            elevation={0}
            sx={{
              ...STYLES.glassCard,
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ width: 4, height: 16, bgcolor: '#8B5CF6', borderRadius: 4 }} />
              핵심 분석 요약
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: '0.95rem' }}>
              {summary}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 2. 상세 평가 텍스트 */}
      <Box sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            ...STYLES.glassCard,
            p: 3,
            borderLeft: '4px solid #3B82F6', // 왼쪽 강조선
            bgcolor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <Stack spacing={2}>
            {evaluationParagraphs.map((text, idx) => (
              <Typography key={idx} variant="body2" sx={{ color: '#475569', lineHeight: 1.8 }}>
                {text}
              </Typography>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* 3. 강점 & 보완점 (Clean Vertical Split) */}
      <Box sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
        <Paper elevation={0} sx={{ ...STYLES.glassCard, p: 0, overflow: 'hidden' }}>
          
          {/* 🔵 강점 섹션 */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '12px', 
                  bgcolor: '#EFF6FF', // 아주 연한 블루
                  color: '#2563EB',   // 블루 텍스트
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
                }}
              >
                <TrendingUp sx={{ fontSize: 22 }} />
              </Box>
              <Typography variant="h6" fontWeight={800} color="#1e293b" sx={{ letterSpacing: '-0.5px' }}>
                강점 포인트
              </Typography>
            </Box>
            <List dense disablePadding sx={{ pl: 1 }}>
              {strengths.map((text, i) => (
                <ListItem key={i} sx={{ px: 0, py: 1, alignItems: 'flex-start' }}>
                  <CheckCircle sx={{ fontSize: 18, color: '#3B82F6', mt: 0.5, mr: 2, flexShrink: 0 }} />
                  <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {text}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* 구분선 (점선으로 세련되게) */}
          <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.08)', mx: 4 }} />

          {/* 🔴 보완점 섹션 (배경색 제거, 화이트 유지) */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '12px', 
                  bgcolor: '#FEF2F2', // 아주 연한 레드 (아이콘 배경만)
                  color: '#EF4444',   // 레드 텍스트
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
                }}
              >
                <ErrorOutline sx={{ fontSize: 22 }} />
              </Box>
              <Typography variant="h6" fontWeight={800} color="#1e293b" sx={{ letterSpacing: '-0.5px' }}>
                보완 포인트
              </Typography>
            </Box>
            <List dense disablePadding sx={{ pl: 1 }}>
              {improvements.map((text, i) => (
                <ListItem key={i} sx={{ px: 0, py: 1, alignItems: 'flex-start' }}>
                  <Lens sx={{ fontSize: 8, color: '#EF4444', mt: 1, mr: 2.5, flexShrink: 0 }} />
                  <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {text}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>

        </Paper>
      </Box>
{/* 4. 점수 상세 테이블 (High-Quality Borderless Style) */}
      <Box sx={{ position: 'relative', zIndex: 1, px: 1 }}> {/* px: 1 추가하여 여백 확보 */}
        
        {/* 제목: 아이콘 대신 둥근 선(Accent Bar) 적용 */}
        <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 3 }}>
          <Box 
            sx={{ 
              width: 6, 
              height: 28, 
              borderRadius: 4, 
              bgcolor: '#3B82F6', // 메인 블루
              flexShrink: 0 
            }} 
          />
          <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>
            세부 평가 항목별 점수 및 감점 사유
          </Typography>
        </Stack>
        
        {/* 테이블: Paper 제거 -> Box로 변경 (투명 배경, 무테) */}
        <TableContainer 
          component={Box} 
          sx={{ 
            bgcolor: 'transparent', 
            p: 0,
            border: 'none' 
          }}
        >
          <Table>
            <TableHead>
              {/* 헤더: 하단 굵은 선 (2px), 대문자, 자간 넓힘 */}
              <TableRow sx={{ borderBottom: '2px solid #E2E8F0' }}>
                <TableCell sx={{ 
                  color: '#64748b', 
                  fontWeight: 800, 
                  fontSize: '0.75rem', 
                  py: 2, 
                  pl: 0, 
                  width: '25%',
                  letterSpacing: '1px'
                }}>
                  평가 항목
                </TableCell>
                <TableCell sx={{ 
                  color: '#64748b', 
                  fontWeight: 800, 
                  fontSize: '0.75rem', 
                  py: 2, 
                  pl: 0,
                  width: '15%',
                  letterSpacing: '1px'
                }}>
                  점수
                </TableCell>
                <TableCell sx={{ 
                  color: '#64748b', 
                  fontWeight: 800, 
                  fontSize: '0.75rem', 
                  py: 2, 
                  pl: 0,
                  letterSpacing: '1px'
                }}>
                  감점 사유
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scoreRows.map((row, index) => {
                const isTotal = row.category === '총점';
                return (
                  <TableRow 
                    key={index} 
                    sx={{ 
                      borderBottom: '1px solid #E2E8F0', // 행 사이 얇은 선
                      '&:last-child': { borderBottom: 'none' }, // 마지막 행 선 제거
                      '&:hover': { bgcolor: 'transparent' } // 호버 효과 제거
                    }}
                  >
                    <TableCell sx={{ 
                      fontWeight: isTotal ? 800 : 700, 
                      color: isTotal ? '#1e293b' : '#334155',
                      fontSize: isTotal ? '1.05rem' : '0.95rem',
                      py: 3,
                      pl: 0
                    }}>
                      {row.category}
                    </TableCell>
                    <TableCell sx={{ py: 3, pl: 0 }}>
                      <Chip 
                        label={row.score} 
                        size="small"
                        sx={{ 
                          fontWeight: 800, 
                          bgcolor: isTotal ? '#3B82F6' : alpha('#3B82F6', 0.08), 
                          color: isTotal ? '#fff' : '#3B82F6',
                          height: '28px',
                          minWidth: '48px',
                          borderRadius: '8px',
                          fontSize: '0.9rem'
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ 
                      color: '#475569', 
                      fontSize: '0.95rem', 
                      py: 3, 
                      pl: 0,
                      lineHeight: 1.7
                    }}>
                      {row.reason}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SectionOneSummary;