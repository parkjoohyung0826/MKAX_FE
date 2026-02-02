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

const defaultReport = {
  totalScoreText: '78 / 100점',
  summary:
    '기본적인 직무 적합성과 경험 구조는 갖추었으나, 성과 중심 표현과 직무 핵심 역량을 드러내는 깊이가 부족한 상태입니다.',
  overallEvaluation:
    '제출된 이력서와 자기소개서는 신입 지원자 기준으로 전반적인 구성과 흐름은 안정적이며, 프로젝트 경험과 학습 과정이 비교적 명확하게 드러나 있습니다.\n\n다만, 각 경험이 어떤 문제를 해결했고 어떤 결과를 만들었는지에 대한 설명이 충분하지 않아, 실무 역량을 판단하기에는 정보가 다소 제한적으로 전달되고 있습니다.\n\n또한 일부 문장은 기술 나열 또는 추상적인 표현에 머물러 있어, 지원자의 강점이 명확히 부각되지 못하는 부분이 존재합니다.',
  strengths: [
    '이력서와 자기소개서의 전체적인 구조가 잘 정리되어 있음',
    '직무와 관련된 프로젝트 및 학습 경험이 명확히 드러남',
    '챗봇/직접 입력을 통해 생성된 문서임에도 문맥의 일관성이 유지됨',
    '자기소개서에서 지원 동기와 성장 과정이 자연스럽게 연결됨'
  ],
  improvements: [
    '프로젝트 경험에서 성과 및 결과에 대한 구체성 부족',
    '직무 핵심 키워드(성과, 협업, 문제 해결 등) 활용 빈도 낮음',
    '일부 문장에서 추상적 표현 및 유사한 문장 반복',
    '자기소개서 문항별 의도에 비해 경험 설명이 다소 분산됨'
  ],
  scoreDetails: [
    { category: '직무 적합성', score: '18 / 25', reason: '직무와 연결된 경험은 있으나, 실무 관점의 깊이가 충분히 드러나지 않음' },
    { category: '경험의 구체성', score: '15 / 20', reason: '프로젝트 결과 및 성과가 수치·결과 중심으로 표현되지 않음' },
    { category: '문장 표현력', score: '16 / 20', reason: '일부 문장이 기술 나열형 또는 추상적 표현에 머무름' },
    { category: '구조 및 가독성', score: '14 / 15', reason: '전체 구조는 안정적이나, 일부 문단 길이가 길어 집중도가 떨어짐' },
    { category: '자기소개서 완성도', score: '15 / 20', reason: '문항 의도는 충족하나 경험 정리가 다소 분산되어 전달력이 약함' },
    { category: '총점', score: '78 / 100', reason: '' }
  ]
};

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
  const evaluationParagraphs = overallEvaluation.split('\n\n').filter(Boolean);

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
                {scoreRows.map((row) => (
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
      </Paper>
    </Box>
  );
};

export default CareerAnalysisReport;
