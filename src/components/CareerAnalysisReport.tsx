'use client';

import React from 'react';
import { 
  Box, Typography, Paper, LinearProgress, Chip, 
  List, ListItem, ListItemIcon, ListItemText, Divider 
} from '@mui/material';
import { 
  TrendingUp, Psychology, Business, Flag, 
  CheckCircleOutline, LightbulbOutlined, Star 
} from '@mui/icons-material';

// --- 데이터 타입 정의 ---
export interface CareerAnalysisData {
  summary: string;
  competencies: { name: string; score: number; comment: string }[];
  industryFit: { industry: string; matchRate: number }[];
  roadmap: { step: string; action: string }[];
  strengths: string[];
  improvements: string[];
}

interface Props {
  summaryText: string;
}

// --- Glassmorphism 스타일 ---
const glassCardSx = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
  p: 4,
  height: '100%', // 부모 높이에 맞춤
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

// --- 더미 데이터 생성기 ---
const generateMockAnalysis = (name: string = '지원자'): CareerAnalysisData => ({
  // [수정] 한 줄 더 추가하여 내용 보강
  summary: `${name}님의 이력서와 경험을 종합적으로 분석한 결과, 풍부한 실무 경험을 바탕으로 한 문제 해결 능력과 리더십이 돋보이는 인재입니다.\n\n특히 프로젝트 관리 경험에서 보여주신 위기 관리 능력은 팀의 안정적인 운영에 크게 기여할 것으로 판단됩니다. 다양한 유관 부서와 협업하며 이끌어낸 성과는 ${name}님의 뛰어난 소통 능력을 증명하고 있습니다.\n\n안정적인 프로세스 구축이 필요한 중견/대기업의 관리직 또는 PM(Project Manager) 포지션에 매우 적합하며, 향후 최신 트렌드 기술을 접목한다면 대체 불가능한 핵심 인재로 성장할 가능성이 매우 높습니다.`,
  
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
  const data = generateMockAnalysis(); 

  return (
    <Box sx={{ mt: 4 }}>
      {/* 타이틀 영역 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={800} sx={{ color: '#1e293b', mb: 1 }}>
          종합 커리어 분석 리포트
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI가 진단한 {`지원자`}님의 직무 역량과 취업 전략입니다.
        </Typography>
      </Box>

      {/* 메인 레이아웃: Flexbox 사용 */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        mb: 3,
        alignItems: 'stretch'
      }}>
        
        {/* 1. 좌측 열 (7 비율) */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '7' }, minWidth: 0 }}>
          <Paper sx={glassCardSx}>
            <Typography variant="h6" sx={sectionTitleSx}>
              <Psychology sx={{ mr: 1, color: '#2563EB' }} /> 핵심 역량 진단
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: '#475569', flexGrow: 1, whiteSpace: 'pre-line' }}>
              {data.summary}
            </Typography>

            {/* [추가됨] 구분선 */}
            <Divider sx={{ my: 3, opacity: 0.6 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 'auto' }}>
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
        </Box>

        {/* 2. 우측 열 (5 비율) */}
        <Box sx={{ 
          flex: { xs: '1 1 100%', md: '5' }, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3,
          minWidth: 0
        }}>
          {/* 산업군 추천 */}
          <Paper sx={{ ...glassCardSx, flex: '0 0 auto', height: 'auto' }}>
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
          <Paper sx={{ ...glassCardSx, flex: '1 1 auto' }}>
            <Typography variant="h6" sx={sectionTitleSx}>
              <TrendingUp sx={{ mr: 1, color: '#2563EB' }} /> 강점 & 보완점
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
              <Box sx={{ flex: 1 }}>
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
              </Box>

              <Divider />

              <Box sx={{ flex: 1 }}>
                 <Typography variant="subtitle2" color="#EF4444" fontWeight={700} mb={1}>
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
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* 3. 취업 성공 로드맵 */}
      <Paper sx={{ ...glassCardSx, background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(240,249,255,0.8))', height: 'auto' }}>
        <Typography variant="h6" sx={sectionTitleSx}>
          <Flag sx={{ mr: 1, color: '#2563EB' }} /> 취업 성공 로드맵
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, 
          gap: 2 
        }}>
          {data.roadmap.map((step, index) => (
            <Box key={index} sx={{ 
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
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default CareerAnalysisReport;