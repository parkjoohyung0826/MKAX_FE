'use client';

import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { Grid } from '@mui/material/Grid'; 
import { ResumeData } from '../ConversationalForm';

interface Props {
  data: ResumeData;
}

const Section = ({ title, content }: { title: string; content: string }) => (
  <Box mb={2}>
    <Typography variant="overline" color="text.secondary" fontWeight={600}>
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
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        📝 마지막으로, 입력하신 내용을 최종 확인해주세요.
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Section title="성함" content={data.name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Section title="희망 직무" content={data.desiredJob} />
          </Grid>
        </Grid>

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
