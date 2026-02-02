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
  sectionTitleSx: Record<string, unknown>;
  resumeFeedback: FeedbackItem[];
  coverLetterFeedback: FeedbackItem[];
  commonPatterns: CommonPattern[];
  showDivider?: boolean;
}

const renderFeedbackItem = (item: FeedbackItem, index: number) => {
  const improvementText = item.improvement?.filter(Boolean).join('\n');
  return (
    <Paper
      key={`${item.title}-${index}`}
      elevation={0}
      sx={{
        bgcolor: 'rgba(255,255,255,0.7)',
        borderRadius: '16px',
        p: 3,
        border: '1px solid rgba(0,0,0,0.06)',
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
            border: '1px solid rgba(37, 99, 235, 0.12)',
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
              border: '1px solid rgba(16, 185, 129, 0.18)',
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

const SectionTwoSentenceFeedback = ({
  sectionTitleSx,
  resumeFeedback,
  coverLetterFeedback,
  commonPatterns,
  showDivider = true,
}: Props) => {
  if (resumeFeedback.length === 0 && coverLetterFeedback.length === 0 && commonPatterns.length === 0) {
    return null;
  }

  return (
    <>
      {showDivider && <Divider sx={{ my: 6 }} />}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
          2. 문장 구조 및 표현 개선 피드백
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          표현·구조 중심 / 표면적 개선 영역
        </Typography>
        <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.9, mt: 2 }}>
          본 섹션에서는 이력서 및 자기소개서의 문장 구조, 표현 방식, 전달력 측면에서 감점이 발생한
          부분을 중심으로 구체적인 수정 가이드를 제공합니다. 각 항목은 실제 작성 문장을 인용하여, 왜
          감점되었는지와 어떻게 개선할 수 있는지를 함께 제시합니다.
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
            2-2. 자기소개서 문장 표현 피드백
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {coverLetterFeedback.map((item, index) => renderFeedbackItem(item, index))}
          </Box>
        </Box>
      )}

      {commonPatterns.length > 0 && (
        <Box>
          <Typography variant="h6" sx={sectionTitleSx}>
            2-3. 공통 감점 패턴 요약 (AI 분석)
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
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b', width: '30%' }}>
                    감점 패턴
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b' }}>설명</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commonPatterns.map((pattern, idx) => (
                  <TableRow key={`${pattern.pattern}-${idx}`}>
                    <TableCell sx={{ color: '#334155', fontWeight: 600 }}>{pattern.pattern}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{pattern.description}</TableCell>
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

export default SectionTwoSentenceFeedback;
