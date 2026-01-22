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

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>{title}</Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-word',
          color: '#334155',
          lineHeight: 1.6
        }}
      >
        {content || <span style={{ color: '#94a3b8' }}>(입력 대기 중...)</span>}
      </Typography>
    </Box>
  );
};

export default QuestionPanel;
