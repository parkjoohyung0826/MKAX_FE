import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useCoverLetterStore } from '../store';
import { CoverLetterData } from '../types';

interface Props {
  resumeName: string;
  data?: CoverLetterData;
}

const sections: Array<{ label: string; key: keyof CoverLetterData }> = [
  { label: '성장과정', key: 'growthProcess' },
  { label: '성격의 장, 단점', key: 'strengthsAndWeaknesses' },
  { label: '주요 경력 및 업무 강점', key: 'keyExperience' },
  { label: '지원 동기 및 입사 포부', key: 'motivation' },
];

const ModernCoverLetterTemplate = React.forwardRef<HTMLDivElement, Props>(({ resumeName, data }, ref) => {
  const { coverLetterData } = useCoverLetterStore();
  const displayData = data ?? coverLetterData;

  return (
    <Paper
      ref={ref}
      elevation={3}
      sx={{
        width: '210mm',
        minHeight: '297mm',
        p: '15mm',
        bgcolor: 'white',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: '18px',
          color: 'white',
          background: 'linear-gradient(120deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)',
        }}
      >
        <Typography variant="h5" fontWeight={800}>
          자기소개서
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
          {resumeName}
        </Typography>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sections.map((section) => (
          <Box
            key={section.key}
            sx={{
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              bgcolor: '#f8fafc',
              p: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 6, height: 6, bgcolor: '#2563eb', borderRadius: '50%' }} />
              <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                {section.label}
              </Typography>
            </Box>
            <Divider sx={{ my: 1.5, borderColor: 'rgba(15, 23, 42, 0.1)' }} />
            <Typography variant="body2" color="#334155" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
              {displayData[section.key] || ''}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
});

ModernCoverLetterTemplate.displayName = 'ModernCoverLetterTemplate';

export default ModernCoverLetterTemplate;
