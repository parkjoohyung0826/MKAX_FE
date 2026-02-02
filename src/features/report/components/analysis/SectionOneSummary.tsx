'use client';

import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
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
import { CheckCircleOutline, LightbulbOutlined } from '@mui/icons-material';
import { AnalysisReportScoreDetail } from '../../types';

interface Props {
  glassCardSx: Record<string, unknown>;
  sectionTitleSx: Record<string, unknown>;
  totalScore: string;
  summary: string;
  evaluationParagraphs: string[];
  strengths: string[];
  improvements: string[];
  scoreRows: AnalysisReportScoreDetail[];
}

const SectionOneSummary = ({
  glassCardSx,
  sectionTitleSx,
  totalScore,
  summary,
  evaluationParagraphs,
  strengths,
  improvements,
  scoreRows,
}: Props) => (
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
          border: '1px solid rgba(37, 99, 235, 0.12)',
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
        <Typography
          key={idx}
          variant="body1"
          sx={{ color: '#475569', lineHeight: 1.9, mb: idx === evaluationParagraphs.length - 1 ? 0 : 2 }}
        >
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
          border: '1px solid rgba(0,0,0,0.06)',
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
                <TableCell sx={{ color: '#475569' }}>{row.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Paper>
);

export default SectionOneSummary;
