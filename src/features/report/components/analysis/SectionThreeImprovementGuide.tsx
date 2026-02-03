'use client';

import React from 'react';
import {
  Box,
  Chip,
  Divider,
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
  alpha,
} from '@mui/material';
import {
  CheckCircleOutline,
  FlagOutlined,
  EmojiObjectsOutlined,
  PlaylistAddCheckCircleOutlined,
} from '@mui/icons-material';

// --- Types ---
type GapSummaryItem = {
  category: string;
  gap: string;
  description: string;
};

type CategoryGuide = {
  title: string;
  currentState?: string[];
  direction?: string[];
  examples?: string[];
};

type RoadmapItem = {
  week: string;
  title: string;
  tasks?: string[];
};

type PriorityStrategyItem = {
  priority: number;
  item: string;
  reason: string;
};

interface Props {
  sectionTitleSx?: Record<string, unknown>;
  gapSummary: GapSummaryItem[];
  categoryGuides: CategoryGuide[];
  roadmap: RoadmapItem[];
  priorityStrategy: PriorityStrategyItem[];
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
  warning: '#FBBC04',
  border: '#E8EAED',  
};

// ☁️ Antigravity Styles
const STYLES = {
  // 메인 카드 (Deep Shadow & Floating Effect)
  card: {
    bgcolor: '#FFFFFF',
    borderRadius: '24px',
    boxShadow: `0 10px 30px -5px ${alpha(COLORS.textTitle, 0.04)}, 0 1px 3px -1px ${alpha(COLORS.textTitle, 0.02)}`,
    border: `1px solid ${alpha(COLORS.textTitle, 0.03)}`,
    overflow: 'hidden',
    p: { xs: 3, md: 5 },
    mb: 4,
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: `0 20px 40px -5px ${alpha(COLORS.primary, 0.15)}, 0 5px 10px -2px ${alpha(COLORS.primary, 0.05)}`,
    },
  },
  // 제목 옆 둥근 선 포인트 (Accent Bar)
  titleAccent: {
    width: 6,
    height: 28,
    borderRadius: 4,
    bgcolor: COLORS.primary,
    flexShrink: 0,
  },
  // 테이블 컨테이너 (Borderless)
  tableContainer: {
    bgcolor: 'transparent',
    borderRadius: 0,
    border: 'none',
    p: 0,
    mt: 2,
  },
  // 내부 섹션 박스 (예시 등)
  innerBox: {
    bgcolor: COLORS.surface,
    borderRadius: '16px',
    p: 3,
    // border: `1px solid ${COLORS.border}`,
  },
};

const SectionThreeImprovementGuide = ({
  gapSummary,
  categoryGuides,
  roadmap,
  priorityStrategy,
  showDivider = true,
}: Props) => {
  if (
    gapSummary.length === 0 &&
    categoryGuides.length === 0 &&
    roadmap.length === 0 &&
    priorityStrategy.length === 0
  ) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '860px', mx: 'auto' }}>
      {showDivider && <Divider sx={{ my: 8, borderColor: 'transparent' }} />}

      {/* 1. Header with Accent Bar */}
      <Box sx={{ mb: 7, px: 2 }}>
        <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2.5 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              color: COLORS.textTitle,
              letterSpacing: '-0.5px',
            }}
          >
            내용 및 스펙 보완 가이드
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ color: COLORS.textSub, lineHeight: 1.6, fontSize: '1.05rem', maxWidth: '800px' }}>
          현재 경험의 깊이와 범위를 분석하여, 부족한 역량을 식별하고<br/>
          이를 효과적으로 보완하기 위한 구체적인 실행 로드맵을 제시합니다.
        </Typography>
      </Box>

      {/* 2. 부족 영역 진단 (Vertically Centered Description) */}
      {gapSummary.length > 0 && (
        <Box sx={{ mb: 8, px: 2 }}>
          {/* 섹션 타이틀 */}
          <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 2 }}>
            <Box sx={STYLES.titleAccent} />
             <Typography variant="h5" fontWeight={800} sx={{ color: COLORS.textTitle }}>
              부족 영역 진단 요약
            </Typography>
          </Stack>

          {/* 리스트 헤더 */}
          <Grid container sx={{ borderBottom: `2px solid ${COLORS.border}`, pb: 1, display: { xs: 'none', md: 'flex' } }}>
            <Grid item md={4.5} sx={{ pl: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.textLight, letterSpacing: '1px' }}>GAP ANALYSIS</Typography>
            </Grid>
            <Grid item md={7.5}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: COLORS.textLight, letterSpacing: '1px' }}>DESCRIPTION</Typography>
            </Grid>
          </Grid>

          {/* 리스트 바디 */}
          <Box>
            {gapSummary.map((item, idx) => (
              <Grid 
                container 
                key={`${item.category}-${idx}`}
                sx={{ 
                  py: 3, 
                  borderBottom: `1px solid ${COLORS.border}`,
                  '&:last-child': { borderBottom: 'none' },
                  alignItems: 'center' // ✨ 핵심 수정: 수직 중앙 정렬
                }}
              >
                {/* 왼쪽 열: 카테고리 태그 + 부족 요소 */}
                <Grid item xs={12} md={4.5} sx={{ pr: 3, mb: { xs: 2, md: 0 } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    
                    {/* 1. 카테고리 태그 */}
                    <Chip 
                      label={item.category} 
                      size="small"
                      sx={{ 
                        bgcolor: COLORS.surface, 
                        color: COLORS.textSub, 
                        fontWeight: 700, 
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        height: '24px',
                        border: `1px solid ${COLORS.border}`,
                        mb: 1.5
                      }} 
                    />
                    
                    {/* 2. 부족 요소 (Gap Analysis) */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: COLORS.error, mt: 0.9, flexShrink: 0 }} />
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          color: COLORS.textTitle, 
                          fontWeight: 700, 
                          lineHeight: 1.5,
                          fontSize: '0.95rem'
                        }}
                      >
                        {item.gap}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* 오른쪽 열: 설명 (Description) */}
                <Grid item xs={12} md={7.5}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: COLORS.textBody, 
                      lineHeight: 1.7, 
                      fontSize: '0.95rem'
                      // pt 제거됨 (중앙 정렬이므로 불필요)
                    }}
                  >
                    {item.description}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Box>
      )}

      {/* 3. 카테고리별 보완 가이드 (Vertical Cards) */}
      {categoryGuides.length > 0 && (
        <Box sx={{ mb: 8, px: 2 }}>
           <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 4 }}>
            <Box sx={STYLES.titleAccent} />
             <Typography variant="h5" fontWeight={800} sx={{ color: COLORS.textTitle }}>
              상세 보완 가이드
            </Typography>
          </Stack>

          <Stack spacing={4}>
            {categoryGuides.map((guide, idx) => (
              <Paper key={`${guide.title}-${idx}`} elevation={0} sx={STYLES.card}>
                {/* 카드 헤더 */}
                <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 4 }}>
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
                      fontWeight: 800,
                      boxShadow: `0 4px 12px ${alpha(COLORS.primary, 0.4)}`,
                    }}
                  >
                    {idx + 1}
                  </Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: COLORS.textTitle, fontSize: '1.25rem' }}>
                    {guide.title}
                  </Typography>
                </Stack>

                <Stack spacing={3}>
                  {/* 현재 상태 */}
                  {guide.currentState && guide.currentState.length > 0 && (
                    <Box>
                      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
                        <CheckCircleOutline sx={{ fontSize: 18, color: COLORS.textSub }} />
                        <Typography variant="subtitle2" sx={{ color: COLORS.textSub, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                          Current State
                        </Typography>
                      </Stack>
                      <List dense disablePadding sx={{ pl: 1 }}>
                        {guide.currentState.map((text, i) => (
                          <ListItem key={i} sx={{ px: 0, py: 0.5, alignItems: 'flex-start' }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: COLORS.textLight, mt: 0.8, mr: 1.5, flexShrink: 0 }} />
                            <Typography variant="body2" color={COLORS.textBody} sx={{ lineHeight: 1.7 }}>{text}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  <Divider sx={{ borderStyle: 'dashed', borderColor: COLORS.border }} />

                  {/* 보완 방향 */}
                  {guide.direction && guide.direction.length > 0 && (
                    <Box>
                      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
                        <FlagOutlined sx={{ fontSize: 18, color: COLORS.primary }} />
                        <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                          Direction
                        </Typography>
                      </Stack>
                      <List dense disablePadding sx={{ pl: 1 }}>
                        {guide.direction.map((text, i) => (
                          <ListItem key={i} sx={{ px: 0, py: 0.5, alignItems: 'flex-start' }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: COLORS.primary, mt: 0.8, mr: 1.5, flexShrink: 0 }} />
                            <Typography variant="body2" color={COLORS.textTitle} sx={{ lineHeight: 1.7, fontWeight: 500 }}>{text}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* 추천 예시 */}
                  {guide.examples && guide.examples.length > 0 && (
                    <Box sx={STYLES.innerBox}>
                       <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.5 }}>
                        <EmojiObjectsOutlined sx={{ fontSize: 18, color: COLORS.warning }} />
                        <Typography variant="subtitle2" sx={{ color: COLORS.textBody, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                          Recommended Examples
                        </Typography>
                      </Stack>
                      <List dense disablePadding>
                        {guide.examples.map((text, i) => (
                          <ListItem key={i} sx={{ px: 0, py: 0.5, alignItems: 'flex-start' }}>
                            <Typography variant="body2" color={COLORS.textBody} sx={{ lineHeight: 1.7, fontSize: '0.95rem' }}>• {text}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {/* 4. 실행 로드맵 (Modern Timeline Cards) */}
      {roadmap.length > 0 && (
        <Box sx={{ mb: 8, px: 2 }}>
           <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 4 }}>
            <Box sx={STYLES.titleAccent} />
             <Typography variant="h5" fontWeight={800} sx={{ color: COLORS.textTitle }}>
              단계별 실행 로드맵
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {roadmap.map((step, idx) => (
              <Grid item xs={12} md={6} key={`${step.week}-${idx}`}>
                <Paper elevation={0} sx={{ ...STYLES.card, mb: 0, height: '100%', display: 'flex', flexDirection: 'column', p: 4 }}>
                  <Box sx={{ mb: 2.5 }}>
                    <Chip 
                      label={step.week} 
                      size="small" 
                      sx={{ 
                        bgcolor: alpha(COLORS.primary, 0.08), 
                        color: COLORS.primary, 
                        fontWeight: 700, 
                        borderRadius: '8px',
                        mb: 1.5,
                        height: '28px'
                      }} 
                    />
                    <Typography variant="h6" fontWeight={800} color={COLORS.textTitle} sx={{ fontSize: '1.2rem', lineHeight: 1.4 }}>
                      {step.title}
                    </Typography>
                  </Box>
                  
                  {step.tasks && step.tasks.length > 0 && (
                    <List dense disablePadding sx={{ mt: 'auto' }}>
                      {step.tasks.map((task, i) => (
                        <ListItem key={i} sx={{ px: 0, py: 0.5, alignItems: 'flex-start' }}>
                           <PlaylistAddCheckCircleOutlined sx={{ fontSize: 18, color: COLORS.textLight, mt: 0.3, mr: 1.5, flexShrink: 0 }} />
                          <Typography variant="body2" color={COLORS.textBody} sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}>{task}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* 5. 우선순위 전략 (Borderless Table) */}
      {priorityStrategy.length > 0 && (
        <Box sx={{ px: 2 }}>
           <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 3 }}>
            <Box sx={STYLES.titleAccent} />
             <Typography variant="h5" fontWeight={800} sx={{ color: COLORS.textTitle }}>
              우선순위 기반 전략
            </Typography>
          </Stack>
          
          <TableContainer component={Box} sx={STYLES.tableContainer}>
            <Table>
              <TableHead>
                <TableRow sx={{ borderBottom: `2px solid ${COLORS.border}` }}>
                  <TableCell sx={{ fontWeight: 800, color: COLORS.textLight, py: 2, pl: 0, width: '15%', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    Priority
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: COLORS.textLight, py: 2, pl: 0, width: '30%', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    Action Item
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: COLORS.textLight, py: 2, pl: 0, fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    Reasoning
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {priorityStrategy.map((item, idx) => (
                  <TableRow 
                    key={`${item.priority}-${idx}`}
                    sx={{ 
                      borderBottom: `1px solid ${COLORS.border}`,
                      '&:last-child': { borderBottom: 'none' },
                      '&:hover': { bgcolor: 'transparent' }
                    }}
                  >
                    <TableCell sx={{ py: 3, pl: 0 }}>
                       <Box 
                        sx={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 28, 
                          height: 28, 
                          borderRadius: '50%', 
                          bgcolor: idx === 0 ? COLORS.primary : alpha(COLORS.textTitle, 0.08),
                          color: idx === 0 ? '#fff' : COLORS.textBody,
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}
                      >
                        {item.priority}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: COLORS.textTitle, fontWeight: 600, py: 3, pl: 0, fontSize: '0.95rem' }}>
                      {item.item}
                    </TableCell>
                    <TableCell sx={{ color: COLORS.textBody, py: 3, pl: 0, lineHeight: 1.7, fontSize: '0.95rem' }}>
                      {item.reason}
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

export default SectionThreeImprovementGuide;