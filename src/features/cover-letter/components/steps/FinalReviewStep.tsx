'use client';

import { Box, Typography } from '@mui/material';
import { Create, FavoriteBorder, StarBorder, Flare } from '@mui/icons-material';
import { CoverLetterData } from '../../types';

interface Props {
  data: CoverLetterData;
}

const glassBox = {
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: '16px',
  p: 3,
  height: '100%',
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
  const sections = [
    { id: 'growthProcess', label: '성장과정', icon: Create },
    { id: 'strengthsAndWeaknesses', label: '성격의 장단점', icon: FavoriteBorder },
    { id: 'keyExperience', label: '주요 경력 및 업무 강점', icon: StarBorder },
    { id: 'motivation', label: '지원 동기 및 포부', icon: Flare },
  ];

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#1e293b' }}>
          자기소개서 최종 검토
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          작성하신 자기소개서 내용을 마지막으로 확인해주세요. 수정이 필요하면 이전 단계로 돌아갈 수 있습니다.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sections.map((section) => (
          <Box sx={glassBox} key={section.id}>
            <SectionHeader icon={section.icon} title={section.label} />
            <SectionContent content={data[section.id as keyof CoverLetterData]} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FinalReviewStep;
