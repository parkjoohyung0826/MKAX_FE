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
      <Box
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
      />

      {/* 1. Hero Section: 점수와 요약의 결합 */}
      <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1, mb: 4 }}>
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

      {/* 3. 강점 & 보완점 (Modern Cards) */}
      <Grid container spacing={3} sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ ...STYLES.glassCard, p: 0, height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)', bgcolor: alpha('#EFF6FF', 0.5), display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ color: '#2563EB', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={800} color="#1e293b">강점 포인트</Typography>
            </Box>
            <List dense sx={{ p: 2 }}>
              {strengths.map((text, i) => (
                <ListItem key={i} sx={{ px: 0, py: 0.5, alignItems: 'flex-start' }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#3B82F6', mt: 0.5, mr: 1.5, flexShrink: 0 }} />
                  <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.5 }}>{text}</Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ ...STYLES.glassCard, p: 0, height: '100%' }}>
             <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.05)', bgcolor: alpha('#FEF2F2', 0.5), display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorOutline sx={{ color: '#EF4444', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={800} color="#1e293b">보완 포인트</Typography>
            </Box>
            <List dense sx={{ p: 2 }}>
              {improvements.map((text, i) => (
                <ListItem key={i} sx={{ px: 0, py: 0.5, alignItems: 'flex-start' }}>
                  <Lens sx={{ fontSize: 8, color: '#EF4444', mt: 0.8, mr: 2, flexShrink: 0 }} />
                  <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.5 }}>{text}</Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* 4. 점수 상세 테이블 (Clean Grid) */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 2, pl: 1, textTransform: 'uppercase', letterSpacing: '1px' }}>
          세부 평가 항목별 점수 및 감점 사유
        </Typography>
        <TableContainer component={Paper} elevation={0} sx={{ ...STYLES.glassCard, borderRadius: '16px' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: alpha('#F1F5F9', 0.5) }}>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>평가 항목</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>점수</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 2 }}>감점 사유</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scoreRows.map((row, index) => {
                const isTotal = row.category === '총점';
                return (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: isTotal ? 800 : 600, color: '#1e293b' }}>
                      {row.category}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.score} 
                        size="small"
                        sx={{ 
                          fontWeight: 800, 
                          bgcolor: isTotal ? '#3B82F6' : alpha('#E2E8F0', 0.5), 
                          color: isTotal ? '#fff' : '#475569',
                          height: '24px',
                          minWidth: '40px'
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.875rem', py: 2 }}>{row.reason}</TableCell>
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