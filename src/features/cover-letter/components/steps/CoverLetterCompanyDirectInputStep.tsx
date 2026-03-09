import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useCoverLetterStore } from '../../store';

interface Props {
  activeStep: number;
}

const CoverLetterCompanyDirectInputStep = ({ activeStep }: Props) => {
  const { companyQuestions, setCompanyQuestionAnswer } = useCoverLetterStore();
  const question = companyQuestions[activeStep];

  if (!question) return null;

  const hasLimit = question.hasCharacterLimit && typeof question.characterLimit === 'number' && question.characterLimit > 0;
  const limit = hasLimit ? question.characterLimit : null;
  const currentLength = question.answer.length;

  return (
    <Box sx={{ py: 2, mb: -5 }}>
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '24px',
          p: 4,
          border: '1px solid rgba(255, 255, 255, 0.6)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155', mb: 0.75 }}>
          {question.question}
        </Typography>
        {hasLimit && (
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
            글자수 제한: {limit}자
          </Typography>
        )}
        <TextField
          fullWidth
          multiline
          minRows={10}
          value={question.answer}
          onChange={(e) => {
            const raw = e.target.value;
            const nextValue = hasLimit && limit ? raw.slice(0, limit) : raw;
            setCompanyQuestionAnswer(question.id, nextValue);
          }}
          placeholder="이 문항에 대한 답변을 작성해주세요."
          inputProps={hasLimit && limit ? { maxLength: limit } : undefined}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '16px',
            },
          }}
        />
        <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, display: 'block', textAlign: 'right' }}>
          {hasLimit && limit ? `${currentLength} / ${limit}자` : `${currentLength}자`}
        </Typography>
      </Box>
    </Box>
  );
};

export default CoverLetterCompanyDirectInputStep;
