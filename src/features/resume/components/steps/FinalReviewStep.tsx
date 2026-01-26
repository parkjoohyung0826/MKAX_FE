'use client';

import { Box, Typography } from '@mui/material';
import { PersonOutline, WorkOutline, School, BusinessCenter, WorkspacePremium, Verified } from '@mui/icons-material';
import { ResumeData } from '../../types';
import StepHeader from './StepHeader';

interface Props {
  data: ResumeData;
}

// 읽기 전용 데이터 박스 스타일
const glassBox = {
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: '16px',
  p: 3,
  height: '100%', // 높이를 꽉 채우도록 설정
  border: '1px solid rgba(255, 255, 255, 0.6)',
  boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 10px 15px rgba(0,0,0,0.05)',
  }
};

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
    <Icon fontSize="small" sx={{ color: '#2563EB' }} />
    <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
      {title}
    </Typography>
  </Box>
);

const SectionContent = ({ content }: { content: string }) => (
  <Typography 
    variant="body1" 
    sx={{ 
      whiteSpace: 'pre-wrap', 
      wordBreak: 'break-word',
      color: '#334155',
      lineHeight: 1.6,
      fontSize: '0.95rem'
    }}
  >
    {content || <span style={{ color: '#94a3b8' }}>(입력된 내용이 없습니다)</span>}
  </Typography>
);

const FinalReviewStep = ({ data }: Props) => {
  const formatContent = (value?: string) => value ?? '';

  return (
    <Box sx={{ py: 2 }}>
      <StepHeader
        title="최종 검토"
        subtitle="작성하신 이력서 내용을 마지막으로 확인해주세요. 수정이 필요하면 이전 단계로 돌아갈 수 있습니다."
      />

      {/* 전체 컨텐츠를 감싸는 Flex 컨테이너 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* 1. 기본 정보 (CSS Grid: 모바일 1열 / 태블릿 이상 2열) */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
          gap: 3 
        }}>
          <Box sx={glassBox}>
            <SectionHeader icon={PersonOutline} title="성함" />
            <Typography variant="h6" fontWeight={700} color="#1e293b">
              {data.name || '(미입력)'}
            </Typography>
          </Box>
          <Box sx={glassBox}>
            <SectionHeader icon={WorkOutline} title="희망 직무" />
            <Typography variant="h6" fontWeight={700} color="#1e293b">
              {data.desiredJob || '(미입력)'}
            </Typography>
          </Box>
        </Box>

        {/* 2. 학력 사항 (전체 너비) */}
        <Box sx={glassBox}>
          <SectionHeader icon={School} title="학력 사항" />
          <SectionContent content={formatContent(data.education)} />
        </Box>

        {/* 3. 경력 사항 (전체 너비) */}
        <Box sx={glassBox}>
          <SectionHeader icon={BusinessCenter} title="주요 경력" />
          <SectionContent content={formatContent(data.workExperience)} />
        </Box>

        {/* 4. 기술 및 자격증 */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 3 
        }}>
          <Box sx={glassBox}>
            <SectionHeader icon={WorkspacePremium} title="주요 활동 및 역량" />
            <SectionContent content={formatContent(data.coreCompetencies)} />
          </Box>
          <Box sx={glassBox}>
            <SectionHeader icon={Verified} title="자격증 및 기타" />
            <SectionContent content={formatContent(data.certifications)} />
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default FinalReviewStep;
