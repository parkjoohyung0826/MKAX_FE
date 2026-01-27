'use client';

import { Box, Typography } from '@mui/material';
import { CoverLetterData } from '../../types';

interface Props {
  data: Partial<CoverLetterData>;
  section: keyof CoverLetterData;
  title: string;
}

const QuestionPanel = ({ data, section, title }: Props) => {
  const content = data[section];
  const supportsSummary =
    section === 'growthProcess' ||
    section === 'strengthsAndWeaknesses' ||
    section === 'keyExperience' ||
    section === 'motivation';
  const summary =
    section === 'growthProcess'
      ? data.growthProcessSummary
      : section === 'strengthsAndWeaknesses'
        ? data.strengthsAndWeaknessesSummary
        : section === 'keyExperience'
          ? data.keyExperienceSummary
          : section === 'motivation'
            ? data.motivationSummary
          : undefined;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>{title}</Typography>
      {supportsSummary && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, mb: 1 }}>
            요약
          </Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: '#334155',
              lineHeight: 1.6,
              bgcolor: 'rgba(148, 163, 184, 0.12)',
              borderRadius: '12px',
              px: 2,
              py: 1.5,
            }}
          >
            {summary || <span style={{ color: '#94a3b8' }}>(요약 대기 중...)</span>}
          </Typography>
        </Box>
      )}
      <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, mb: 1 }}>
        {supportsSummary ? '최종 작성' : '내용'}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          color: '#334155',
          lineHeight: 1.6,
        }}
      >
        {content || <span style={{ color: '#94a3b8' }}>(입력 대기 중...)</span>}
      </Typography>
    </Box>
  );
};

export default QuestionPanel;
