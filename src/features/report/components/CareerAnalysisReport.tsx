'use client';

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { AnalysisReport, AnalysisReportScoreDetail, JobPosting } from '../types';
import defaultAnalysisReport from '../constants/defaultAnalysisReport';
import SectionOneSummary from './analysis/SectionOneSummary';
import SectionTwoSentenceFeedback from './analysis/SectionTwoSentenceFeedback';
import SectionThreeImprovementGuide from './analysis/SectionThreeImprovementGuide';
import JobPostingList from './JobPostingList';

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
  flexDirection: 'column',
};

const sectionTitleSx = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 800,
  color: '#1e293b',
  mb: 3,
  fontSize: '1.2rem',
};

interface Props {
  analysisReport?: AnalysisReport | null;
  jobPostings: JobPosting[];
}

const defaultReport = defaultAnalysisReport;

const resolveScoreDetails = (raw?: AnalysisReport | null): AnalysisReportScoreDetail[] => {
  if (!raw) return defaultReport.scoreDetails;
  if (raw.scoreBreakdown && raw.scoreBreakdown.length > 0) {
    return raw.scoreBreakdown.map((item) => ({
      category: item.item,
      score: item.scoreText ?? `${item.score}${item.maxScore ? ` / ${item.maxScore}` : ''}`,
      reason: item.deductionReason ?? '',
    }));
  }
  return raw.scoreDetails || raw.scoreItems || raw.scores || defaultReport.scoreDetails;
};

const resolveTextBlock = (value?: string | string[]) => {
  if (Array.isArray(value)) return value.filter(Boolean).join('\n\n');
  return value ?? '';
};

const CareerAnalysisReport = ({ analysisReport, jobPostings }: Props) => {
  const [currentSection, setCurrentSection] = useState(0);

  const handleSectionChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentSection(newValue);
  };

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
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
          종합 커리어 분석 리포트
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
          AI가 진단한 지원자님의 직무 역량과 취업 전략입니다.
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={currentSection}
          onChange={handleSectionChange}
          aria-label="analysis report sections"
          variant="fullWidth"
        >
          <Tab label="종합 요약" />
          <Tab label="문장별 피드백" />
          <Tab label="역량 개선 가이드" />
          <Tab label="맞춤 채용 정보" />
        </Tabs>
      </Box>

      <Box>
        {currentSection === 0 && (
          <SectionOneSummary
            glassCardSx={glassCardSx}
            sectionTitleSx={sectionTitleSx}
            totalScore={totalScore}
            summary={summary}
            evaluationParagraphs={evaluationParagraphs}
            strengths={strengths}
            improvements={improvements}
            scoreRows={scoreRowsWithTotal}
          />
        )}
        {currentSection === 1 && (
          <SectionTwoSentenceFeedback
            sectionTitleSx={sectionTitleSx}
            resumeFeedback={resumeFeedback}
            coverLetterFeedback={coverLetterFeedback}
            commonPatterns={commonPatterns}
          />
        )}
        {currentSection === 2 && (
          <SectionThreeImprovementGuide
            sectionTitleSx={sectionTitleSx}
            gapSummary={gapSummary}
            categoryGuides={categoryGuides}
            roadmap={roadmap}
            priorityStrategy={priorityStrategy}
          />
        )}
        {currentSection === 3 && <JobPostingList jobPostings={jobPostings} />}
      </Box>
    </Box>
  );
};

export default CareerAnalysisReport;
