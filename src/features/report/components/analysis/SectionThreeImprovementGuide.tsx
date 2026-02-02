'use client';

import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

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
  sectionTitleSx: Record<string, unknown>;
  gapSummary: GapSummaryItem[];
  categoryGuides: CategoryGuide[];
  roadmap: RoadmapItem[];
  priorityStrategy: PriorityStrategyItem[];
  showDivider?: boolean;
}

const SectionThreeImprovementGuide = ({
  sectionTitleSx,
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
    <>
      {showDivider && <Divider sx={{ my: 6 }} />}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
          3. 내용 및 스펙 보완 가이드
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          경험·역량 중심 / 장기 개선 영역
        </Typography>
        <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.9, mt: 2 }}>
          본 섹션에서는 이력서와 자기소개서에 드러난 경험의 깊이와 범위를 기준으로, 현재 부족한 역량
          영역을 식별하고 이를 어떤 방향으로, 어떤 순서로 보완하면 좋은지에 대한 실행 가이드를
          제시합니다.
        </Typography>
      </Box>

      {gapSummary.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={sectionTitleSx}>
            현재 문서 기준 부족 영역 진단
          </Typography>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b', mb: 2 }}>
            핵심 부족 영역 요약
          </Typography>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(37, 99, 235, 0.06)' }}>
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '25%' }}>카테고리</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '25%' }}>부족 요소</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b' }}>설명</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gapSummary.map((item, idx) => (
                  <TableRow key={`${item.category}-${idx}`}>
                    <TableCell sx={{ color: '#334155', fontWeight: 600 }}>{item.category}</TableCell>
                    <TableCell sx={{ color: '#334155', fontWeight: 600 }}>{item.gap}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{item.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {categoryGuides.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={sectionTitleSx}>
            카테고리별 보완 방향 및 예시
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {categoryGuides.map((guide, idx) => (
              <Paper
                key={`${guide.title}-${idx}`}
                elevation={0}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.7)',
                  borderRadius: '16px',
                  p: 3,
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mb: 2 }}>
                  {idx + 1}) {guide.title}
                </Typography>

                {guide.currentState && guide.currentState.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
                      현재 상태
                    </Typography>
                    <List dense disablePadding>
                      {guide.currentState.map((text, i) => (
                        <ListItem key={`current-${i}`} disablePadding sx={{ mb: 0.5 }}>
                          <ListItemText
                            primary={`- ${text}`}
                            primaryTypographyProps={{ variant: 'body2', color: '#475569' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {guide.direction && guide.direction.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
                      보완 방향
                    </Typography>
                    <List dense disablePadding>
                      {guide.direction.map((text, i) => (
                        <ListItem key={`direction-${i}`} disablePadding sx={{ mb: 0.5 }}>
                          <ListItemText
                            primary={`- ${text}`}
                            primaryTypographyProps={{ variant: 'body2', color: '#475569' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {guide.examples && guide.examples.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
                      추천 보완 예시
                    </Typography>
                    <List dense disablePadding>
                      {guide.examples.map((text, i) => (
                        <ListItem key={`example-${i}`} disablePadding sx={{ mb: 0.5 }}>
                          <ListItemText
                            primary={`- ${text}`}
                            primaryTypographyProps={{ variant: 'body2', color: '#475569' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {roadmap.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={sectionTitleSx}>
            보완을 위한 단계별 실행 커리큘럼 (추천 로드맵)
          </Typography>
          {/* <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b', mb: 2 }}>
            🗓 4주 실행 커리큘럼 예시
          </Typography> */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {roadmap.map((step, idx) => (
              <Paper
                key={`${step.week}-${idx}`}
                elevation={0}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.7)',
                  borderRadius: '16px',
                  p: 3,
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#2563EB', mb: 1 }}>
                  {step.week}: {step.title}
                </Typography>
                {step.tasks && step.tasks.length > 0 && (
                  <List dense disablePadding>
                    {step.tasks.map((task, i) => (
                      <ListItem key={`task-${i}`} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemText
                          primary={`- ${task}`}
                          primaryTypographyProps={{ variant: 'body2', color: '#475569' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {priorityStrategy.length > 0 && (
        <Box>
          <Typography variant="h6" sx={sectionTitleSx}>
            우선순위 기반 보완 전략
          </Typography>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(37, 99, 235, 0.06)' }}>
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '18%' }}>우선순위</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '32%' }}>보완 항목</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b' }}>이유</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {priorityStrategy.map((item, idx) => (
                  <TableRow key={`${item.priority}-${idx}`}>
                    <TableCell sx={{ color: '#334155', fontWeight: 700 }}>{item.priority}순위</TableCell>
                    <TableCell sx={{ color: '#334155', fontWeight: 600 }}>{item.item}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{item.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};

export default SectionThreeImprovementGuide;
