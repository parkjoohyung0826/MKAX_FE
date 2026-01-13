'use client';

import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { ResumeData } from '../ConversationalForm';

interface Props {
  data: ResumeData;
}

const Section = ({ title, content }: { title: string; content: string }) => (
  <Box mb={2}>
    <Typography
      variant="overline"
      color="text.secondary"
      fontWeight={600}
      display="block"
    >
      {title}
    </Typography>
    <Typography
      variant="body1"
      sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
    >
      {content || '입력된 내용이 없습니다.'}
    </Typography>
  </Box>
);

const FinalReviewStep = ({ data }: Props) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        📝 마지막으로, 입력하신 내용을 최종 확인해주세요.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'grey.50',
        }}
      >
        {/* 상단 2열 영역 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
            },
            gap: 3,
          }}
        >
          <Section title="성함" content={data.name} />
          <Section title="희망 직무" content={data.desiredJob} />
        </Box>

        <Divider sx={{ my: 2 }} />
        <Section title="학력 사항" content={data.education} />

        <Divider sx={{ my: 2 }} />
        <Section title="주요 경력" content={data.workExperience} />

        <Divider sx={{ my: 2 }} />
        <Section title="핵심 기술 및 역량" content={data.coreCompetencies} />

        <Divider sx={{ my: 2 }} />
        <Section title="자격증 및 기타" content={data.certifications} />
      </Paper>
    </Box>
  );
};

export default FinalReviewStep;
