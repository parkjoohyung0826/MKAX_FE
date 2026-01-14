'use client';

import React from 'react';
import { 
  Box, Typography, Grid, Paper, LinearProgress, Chip, 
  List, ListItem, ListItemIcon, ListItemText, Divider 
} from '@mui/material';
import { 
  TrendingUp, Psychology, Business, Flag, 
  CheckCircleOutline, LightbulbOutlined, Star 
} from '@mui/icons-material';

// --- 데이터 타입 정의 (AI가 이 형태로 데이터를 준다고 가정) ---
export interface CareerAnalysisData {
  summary: string;
  competencies: { name: string; score: number; comment: string }[];
  industryFit: { industry: string; matchRate: number }[];
  roadmap: { step: string; action: string }[];
  strengths: string[];
  improvements: string[];
}

interface Props {
  summaryText: string; // 기존의 단순 텍스트 데이터 (백업용)
}

// --- Glassmorphism 스타일 ---
const glassCardSx = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
  p: 4,
  height: '100%'
};

const sectionTitleSx = {
  display: 'flex', 
  alignItems: 'center', 
  fontWeight: 800, 
  color: '#1e293b', 
  mb: 3,
  fontSize: '1.2rem'
};

// --- 더미 데이터 생성기 (실제 AI 연동 전 UI 테스트용) ---
const generateMockAnalysis = (name: string = '지원자'): CareerAnalysisData => ({
  summary: `${name}님은 풍부한 실무 경험을 바탕으로 문제 해결 능력과 리더십이 돋보이는 인재입니다. 특히 위기 관리 능력과 팀 조직력 강화에 강점이 있어, 안정적인 운영이 필요한 중견/대기업 관리직에 매우 적합합니다.`,
  competencies: [
    { name: '직무 전문성', score: 92, comment: '동종 업계 상위 10% 수준' },
    { name: '리더십 & 소통', score: 88, comment: '팀 빌딩 및 코칭 능력 우수' },
    { name: '문제 해결력', score: 85, comment: '위기 상황 대처 경험 풍부' },
    { name: '디지털 적응력', score: 70, comment: '최신 툴 학습 필요' },
  ],
  industryFit: [
    { industry: 'IT / 플랫폼 서비스', matchRate: 95 },
    { industry: '금융 / 핀테크', matchRate: 80 },
    { industry: '유통 / 물류', matchRate: 75 },
  ],
  strengths: [
    '10년 이상의 실무 경험에서 나오는 인사이트',
    '다양한 유관 부서와의 협업 및 커뮤니케이션 스킬',
    '데이터 기반의 의사결정 능력'
  ],
  improvements: [
    '최신 AI 도구 활용 능력 보완 필요',
    '영어 비즈니스 회화 능력 강화 권장'
  ],
  roadmap: [
    { step: '단기 (1개월)', action: '포트폴리오 구체화 및 핵심 성과 수치화 정리' },
    { step: '중기 (3개월)', action: '관심 기업 타겟팅 및 맞춤형 자소서 지원 (주 3회)' },
    { step: '장기 (6개월)', action: '직무 관련 최신 자격증 취득 및 네트워킹 확장' },
  ]
});

const CareerAnalysisReport = ({ summaryText }: Props) => {
  // 실제로는 summaryText를 분석하거나, 상위에서 객체 데이터를 받아야 함
  // 현재는 UI 보여주기 위해 더미 데이터 사용
  const data = generateMockAnalysis(); 

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
          종합 커리어 분석 리포트
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI가 진단한 {`지원자`}님의 직무 역량과 취업 전략입니다.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 1. 종합 요약 & 역량 차트 */}
        <Grid item xs={12} md={7}>
          <Paper sx={glassCardSx}>
            <Typography variant="h6" sx={sectionTitleSx}>
              <Psychology sx={{ mr: 1, color: '#2563EB' }} /> 핵심 역량 진단
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7, color: '#475569' }}>
              {data.summary}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {data.competencies.map((item) => (
                <Box key={item.name}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="subtitle2" fontWeight={700} color="#334155">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" fontWeight={600} color="#2563EB">
                      {item.comment} ({item.score}점)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.score} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      bgcolor: 'rgba(37, 99, 235, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: `linear-gradient(90deg, #2563EB ${item.score}%, #60A5FA 100%)`
                      }
                    }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* 2. 산업군 적합도 & SWOT */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
            {/* 산업군 추천 */}
            <Paper sx={{ ...glassCardSx, flex: 1, p: 3 }}>
              <Typography variant="h6" sx={sectionTitleSx}>
                <Business sx={{ mr: 1, color: '#2563EB' }} /> 추천 산업군
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {data.industryFit.map((fit, idx) => (
                  <Chip 
                    key={fit.industry}
                    label={`${fit.industry} ${fit.matchRate}%`}
                    icon={idx === 0 ? <Star style={{ color: '#FFD700' }} /> : undefined}
                    sx={{ 
                      bgcolor: idx === 0 ? '#2563EB' : 'white',
                      color: idx === 0 ? 'white' : '#475569',
                      border: idx === 0 ? 'none' : '1px solid #e2e8f0',
                      fontWeight: 600,
                      py: 2,
                      px: 1
                    }}
                  />
                ))}
              </Box>
            </Paper>

            {/* 강점과 보완점 */}
            <Paper sx={{ ...glassCardSx, flex: 2, p: 3 }}>
              <Typography variant="h6" sx={sectionTitleSx}>
                <TrendingUp sx={{ mr: 1, color: '#2563EB' }} /> 강점 & 보완점
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="#2563EB" fontWeight={700} mb={1}>
                    PLUS (강점)
                  </Typography>
                  <List dense disablePadding>
                    {data.strengths.map((text, i) => (
                      <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircleOutline fontSize="small" sx={{ color: '#2563EB' }} />
                        </ListItemIcon>
                        <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2', color: '#475569' }} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12}>
                   <Divider sx={{ my: 1 }} />
                   <Typography variant="subtitle2" color="#EF4444" fontWeight={700} mb={1} mt={1}>
                    NEEDS (보완)
                  </Typography>
                   <List dense disablePadding>
                    {data.improvements.map((text, i) => (
                      <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <LightbulbOutlined fontSize="small" sx={{ color: '#EF4444' }} />
                        </ListItemIcon>
                        <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2', color: '#475569' }} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>

        {/* 3. 취업 성공 로드맵 */}
        <Grid item xs={12}>
          <Paper sx={{ ...glassCardSx, background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(240,249,255,0.8))' }}>
            <Typography variant="h6" sx={sectionTitleSx}>
              <Flag sx={{ mr: 1, color: '#2563EB' }} /> 취업 성공 로드맵
            </Typography>
            <Grid container spacing={2}>
              {data.roadmap.map((step, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Box sx={{ 
                    p: 2.5, 
                    borderRadius: '16px', 
                    bgcolor: 'white',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ 
                      position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', 
                      bgcolor: index === 0 ? '#2563EB' : index === 1 ? '#60A5FA' : '#93C5FD' 
                    }} />
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={700} mb={1}>
                      STEP {index + 1}. {step.step}
                    </Typography>
                    <Typography variant="body1" fontWeight={600} color="#1e293b">
                      {step.action}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CareerAnalysisReport;