'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { CheckCircleOutline, LightbulbOutlined } from '@mui/icons-material';
import { AnalysisReport, AnalysisReportScoreDetail } from '../types';
import defaultAnalysisReport from '../constants/defaultAnalysisReport';

// --- Glassmorphism 스타일 ---
const glassCardSx = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
  p: 4,
  height: '100%', 
  display: 'flex',
  flexDirection: 'column'
};

const sectionTitleSx = {
  display: 'flex', 
  alignItems: 'center', 
  fontWeight: 800, 
  color: '#1e293b', 
  mb: 3,
  fontSize: '1.2rem'
};

interface Props {
  analysisReport?: AnalysisReport | null;
}

const defaultReport = defaultAnalysisReport;

const resolveScoreDetails = (raw?: AnalysisReport | null): AnalysisReportScoreDetail[] => {
  if (!raw) return defaultReport.scoreDetails;
  if (raw.scoreBreakdown && raw.scoreBreakdown.length > 0) {
    return raw.scoreBreakdown.map((item) => ({
      category: item.item,
      score: item.scoreText ?? `${item.score}${item.maxScore ? ` / ${item.maxScore}` : ''}`,
      reason: item.deductionReason ?? ''
    }));
  }
  return (
    raw.scoreDetails ||
    raw.scoreItems ||
    raw.scores ||
    defaultReport.scoreDetails
  );
};

const resolveTextBlock = (value?: string | string[]) => {
  if (Array.isArray(value)) return value.filter(Boolean).join('\n\n');
  return value ?? '';
};

const renderFeedbackItem = (
  item: {
    title: string;
    deductionItems?: string[];
    before: string;
    deductionReason?: string;
    improvement?: string[];
    after?: string;
  },
  index: number
) => {
  const improvementText = item.improvement?.filter(Boolean).join('\n');
  return (
    <Paper
      key={`${item.title}-${index}`}
      elevation={0}
      sx={{
        bgcolor: 'rgba(255,255,255,0.7)',
        borderRadius: '16px',
        p: 3,
        border: '1px solid rgba(0,0,0,0.06)'
      }}
    >
      <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
        🔎 항목 {index + 1}. {item.title}
      </Typography>
      {item.deductionItems && item.deductionItems.length > 0 && (
        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
          (감점 항목: {item.deductionItems.join(' / ')})
        </Typography>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
          인용 문장 (Before)
        </Typography>
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'rgba(37, 99, 235, 0.05)',
            borderRadius: '12px',
            p: 2,
            border: '1px solid rgba(37, 99, 235, 0.12)'
          }}
        >
          <Typography variant="body2" sx={{ color: '#334155', whiteSpace: 'pre-line' }}>
            {item.before}
          </Typography>
        </Paper>
      </Box>

      {item.deductionReason && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
            감점 사유
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569', whiteSpace: 'pre-line' }}>
            {item.deductionReason}
          </Typography>
        </Box>
      )}

      {improvementText && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
            개선 방향
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569', whiteSpace: 'pre-line' }}>
            {improvementText}
          </Typography>
        </Box>
      )}

      {item.after && (
        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
            수정 예시 (After)
          </Typography>
          <Paper
            elevation={0}
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.06)',
              borderRadius: '12px',
              p: 2,
              border: '1px solid rgba(16, 185, 129, 0.18)'
            }}
          >
            <Typography variant="body2" sx={{ color: '#0f172a', whiteSpace: 'pre-line' }}>
              {item.after}
            </Typography>
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

const CareerAnalysisReport = ({ analysisReport }: Props) => {
  const raw = analysisReport as (AnalysisReport & Record<string, unknown>) | null | undefined;
  const totalScore =
    raw?.totalScoreText ||
    (typeof raw?.totalScore === 'number' ? `${raw.totalScore} / 100점` : raw?.totalScore) ||
    defaultReport.totalScoreText;
  const summary =
    resolveTextBlock(
      (raw?.summary as string | string[] | undefined) ||
        (raw?.oneLineSummary as string | string[] | undefined) ||
        ((raw as Record<string, unknown>)?.summaryText as string | string[] | undefined)
    ) || defaultReport.summary;
  const overallEvaluation =
    resolveTextBlock(raw?.overallEvaluation) ||
    resolveTextBlock(raw?.evaluation as string | string[] | undefined) ||
    resolveTextBlock(raw?.overallDescription) ||
    defaultReport.overallEvaluation;
  const strengths = raw?.strengths ?? defaultReport.strengths;
  const improvements = raw?.improvements ?? defaultReport.improvements;
  const scoreRows = resolveScoreDetails(raw);
  const totalRow: AnalysisReportScoreDetail | null = (() => {
    const total = raw?.scoreBreakdownTotal;
    if (total?.scoreText) {
      return { category: '총점', score: total.scoreText, reason: '' };
    }
    if (typeof total?.score === 'number' && typeof total?.maxScore === 'number') {
      return { category: '총점', score: `${total.score} / ${total.maxScore}`, reason: '' };
    }
    if (typeof raw?.totalScoreText === 'string') {
      return { category: '총점', score: raw.totalScoreText, reason: '' };
    }
    if (typeof raw?.totalScore === 'number') {
      return { category: '총점', score: `${raw.totalScore} / 100`, reason: '' };
    }
    return null;
  })();
  const scoreRowsWithTotal =
    totalRow && !scoreRows.some((row) => row.category === '총점')
      ? [...scoreRows, totalRow]
      : scoreRows;
  const evaluationParagraphs = overallEvaluation.split('\n\n').filter(Boolean);
  const sentenceFeedback = raw?.sentenceFeedback;
  const resumeFeedback = sentenceFeedback?.resume ?? [];
  const coverLetterFeedback = sentenceFeedback?.coverLetter ?? [];
  const commonPatterns = sentenceFeedback?.commonPatterns ?? [];
  const improvementGuide = raw?.improvementGuide;
  const gapSummary = improvementGuide?.gapSummary ?? [];
  const categoryGuides = improvementGuide?.categoryGuides ?? [];
  const roadmap = improvementGuide?.roadmap ?? [];
  const priorityStrategy = improvementGuide?.priorityStrategy ?? [];

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
          종합 커리어 분석 리포트
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI가 진단한 지원자님의 직무 역량과 취업 전략입니다.
        </Typography>
      </Box>

      <Paper sx={glassCardSx}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
            종합 점수
          </Typography>
          <Typography variant="h3" fontWeight={900} sx={{ color: '#2563EB' }}>
            {totalScore}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', mb: 2 }}>
            한 줄 분석 요약
          </Typography>
          <Paper
            elevation={0}
            sx={{
              bgcolor: 'rgba(37, 99, 235, 0.05)',
              borderRadius: '16px',
              p: 3,
              border: '1px solid rgba(37, 99, 235, 0.12)'
            }}
          >
            <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {summary}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', mb: 2 }}>
            종합 평가 설명
          </Typography>
          {evaluationParagraphs.map((text, idx) => (
            <Typography key={idx} variant="body1" sx={{ color: '#475569', lineHeight: 1.9, mb: idx === evaluationParagraphs.length - 1 ? 0 : 2 }}>
              {text}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
          <Paper sx={{ ...glassCardSx, flex: 1, p: 3 }}>
            <Typography variant="h6" sx={sectionTitleSx}>
              강점 요약
            </Typography>
            <List dense disablePadding>
              {strengths.map((text, i) => (
                <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CheckCircleOutline fontSize="small" sx={{ color: '#2563EB' }} />
                  </ListItemIcon>
                  <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2', color: '#475569' }} />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper sx={{ ...glassCardSx, flex: 1, p: 3 }}>
            <Typography variant="h6" sx={sectionTitleSx}>
              보완이 필요한 부분
            </Typography>
            <List dense disablePadding>
              {improvements.map((text, i) => (
                <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <LightbulbOutlined fontSize="small" sx={{ color: '#EF4444' }} />
                  </ListItemIcon>
                  <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2', color: '#475569' }} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', mb: 2 }}>
            세부 평가 항목별 점수 및 감점 사유
          </Typography>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.06)'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(37, 99, 235, 0.06)' }}>
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '28%' }}>평가 항목</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '18%' }}>점수</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b' }}>감점 사유</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scoreRowsWithTotal.map((row) => (
                  <TableRow key={row.category}>
                    <TableCell sx={{ color: '#334155', fontWeight: row.category === '총점' ? 800 : 600 }}>
                      {row.category}
                    </TableCell>
                    <TableCell sx={{ color: '#334155', fontWeight: row.category === '총점' ? 800 : 600 }}>
                      {row.score}
                    </TableCell>
                    <TableCell sx={{ color: '#475569' }}>
                      {row.reason}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {(resumeFeedback.length > 0 ||
          coverLetterFeedback.length > 0 ||
          commonPatterns.length > 0) && (
          <>
            <Divider sx={{ my: 6 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
                2. 문장 구조 및 표현 개선 피드백
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                표현·구조 중심 / 표면적 개선 영역
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.9, mt: 2 }}>
                본 섹션에서는 이력서 및 자기소개서의 문장 구조, 표현 방식, 전달력 측면에서 감점이
                발생한 부분을 중심으로 구체적인 수정 가이드를 제공합니다. 각 항목은 실제 작성
                문장을 인용하여, 왜 감점되었는지와 어떻게 개선할 수 있는지를 함께 제시합니다.
              </Typography>
            </Box>

            {resumeFeedback.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={sectionTitleSx}>
                  2-1. 이력서 문장 표현 피드백
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {resumeFeedback.map((item, index) => renderFeedbackItem(item, index))}
                </Box>
              </Box>
            )}

            {coverLetterFeedback.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={sectionTitleSx}>
                  자기소개서 문장 표현 피드백
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {coverLetterFeedback.map((item, index) => renderFeedbackItem(item, index))}
                </Box>
              </Box>
            )}

            {commonPatterns.length > 0 && (
              <Box>
                <Typography variant="h6" sx={sectionTitleSx}>
                  공통 감점 패턴 요약 (AI 분석)
                </Typography>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '16px',
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'rgba(37, 99, 235, 0.06)' }}>
                        <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '30%' }}>
                          감점 패턴
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#1e293b' }}>
                          설명
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {commonPatterns.map((pattern, idx) => (
                        <TableRow key={`${pattern.pattern}-${idx}`}>
                          <TableCell sx={{ color: '#334155', fontWeight: 600 }}>
                            {pattern.pattern}
                          </TableCell>
                          <TableCell sx={{ color: '#475569' }}>
                            {pattern.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
        )}

        {(gapSummary.length > 0 ||
          categoryGuides.length > 0 ||
          roadmap.length > 0 ||
          priorityStrategy.length > 0) && (
          <>
            <Divider sx={{ my: 6 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
                3. 내용 및 스펙 보완 가이드
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                경험·역량 중심 / 장기 개선 영역
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.9, mt: 2 }}>
                본 섹션에서는 이력서와 자기소개서에 드러난 경험의 깊이와 범위를 기준으로,
                현재 부족한 역량 영역을 식별하고 이를 어떤 방향으로, 어떤 순서로 보완하면 좋은지에 대한
                실행 가이드를 제시합니다.
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
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'rgba(37, 99, 235, 0.06)' }}>
                        <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '25%' }}>
                          카테고리
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '25%' }}>
                          부족 요소
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#1e293b' }}>
                          설명
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {gapSummary.map((item, idx) => (
                        <TableRow key={`${item.category}-${idx}`}>
                          <TableCell sx={{ color: '#334155', fontWeight: 600 }}>
                            {item.category}
                          </TableCell>
                          <TableCell sx={{ color: '#334155', fontWeight: 600 }}>
                            {item.gap}
                          </TableCell>
                          <TableCell sx={{ color: '#475569' }}>
                            {item.description}
                          </TableCell>
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
                        border: '1px solid rgba(0,0,0,0.06)'
                      }}
                    >
                      <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b', mb: 2 }}>
                        🔹 {idx + 1}) {guide.title}
                      </Typography>

                      {guide.currentState && guide.currentState.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b', mb: 1 }}>
                            현재 상태
                          </Typography>
                          <List dense disablePadding>
                            {guide.currentState.map((text, i) => (
                              <ListItem key={`current-${i}`} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemText primary={`- ${text}`} primaryTypographyProps={{ variant: 'body2', color: '#475569' }} />
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
                                <ListItemText primary={`- ${text}`} primaryTypographyProps={{ variant: 'body2', color: '#475569' }} />
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
                                <ListItemText primary={`- ${text}`} primaryTypographyProps={{ variant: 'body2', color: '#475569' }} />
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
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                  {roadmap.map((step, idx) => (
                    <Paper
                      key={`${step.week}-${idx}`}
                      elevation={0}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.7)',
                        borderRadius: '16px',
                        p: 3,
                        border: '1px solid rgba(0,0,0,0.06)'
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#2563EB', mb: 1 }}>
                        ▶ {step.week}: {step.title}
                      </Typography>
                      {step.tasks && step.tasks.length > 0 && (
                        <List dense disablePadding>
                          {step.tasks.map((task, i) => (
                            <ListItem key={`task-${i}`} disablePadding sx={{ mb: 0.5 }}>
                              <ListItemText primary={`- ${task}`} primaryTypographyProps={{ variant: 'body2', color: '#475569' }} />
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
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'rgba(37, 99, 235, 0.06)' }}>
                        <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '18%' }}>
                          우선순위
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '32%' }}>
                          보완 항목
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#1e293b' }}>
                          이유
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {priorityStrategy.map((item, idx) => (
                        <TableRow key={`${item.priority}-${idx}`}>
                          <TableCell sx={{ color: '#334155', fontWeight: 700 }}>
                            {item.priority}순위
                          </TableCell>
                          <TableCell sx={{ color: '#334155', fontWeight: 600 }}>
                            {item.item}
                          </TableCell>
                          <TableCell sx={{ color: '#475569' }}>
                            {item.reason}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default CareerAnalysisReport;
