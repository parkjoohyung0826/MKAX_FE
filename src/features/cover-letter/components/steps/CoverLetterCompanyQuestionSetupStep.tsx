import React, { useEffect } from 'react';
import { alpha, Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useCoverLetterStore } from '../../store';
import { CompanyCoverLetterQuestion } from '../../types';

const MAX_COMPANY_QUESTIONS = 5;
const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    backgroundColor: 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.86)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255,255,255,0.95)',
      boxShadow: `0 0 0 3px ${alpha('#2563EB', 0.12)}`,
    },
  },
};

const createQuestion = (index: number): CompanyCoverLetterQuestion => ({
  id: `company-question-${Date.now()}-${index}`,
  question: '',
  answer: '',
  assistantId: 'balanced',
  hasCharacterLimit: false,
  characterLimit: null,
});

const CoverLetterCompanyQuestionSetupStep = () => {
  const { companyQuestions, setCompanyQuestions } = useCoverLetterStore();

  useEffect(() => {
    if (companyQuestions.length === 0) {
      setCompanyQuestions([createQuestion(1)]);
    }
  }, [companyQuestions.length, setCompanyQuestions]);

  const normalizedQuestions = companyQuestions;

  const updateQuestion = (id: string, patch: Partial<CompanyCoverLetterQuestion>) => {
    setCompanyQuestions(
      normalizedQuestions.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, ...patch };

        if (!next.hasCharacterLimit) {
          next.characterLimit = null;
        }

        if (next.hasCharacterLimit && typeof next.characterLimit === 'number' && next.characterLimit > 0) {
          next.answer = next.answer.slice(0, next.characterLimit);
        }

        return next;
      }),
    );
  };

  const handleAddQuestionBelow = (index: number) => {
    if (normalizedQuestions.length >= MAX_COMPANY_QUESTIONS) return;
    const next = [...normalizedQuestions];
    next.splice(index + 1, 0, createQuestion(index + 2));
    setCompanyQuestions(next);
  };

  const handleDeleteQuestion = (id: string) => {
    const next = normalizedQuestions.filter((item) => item.id !== id);
    setCompanyQuestions(next.length > 0 ? next : [createQuestion(1)]);
  };

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
        기업별 문항 설정
      </Typography>
      <Typography variant="body1" sx={{ color: '#64748b', mb: 2 }}>
        문항별로 질문과 글자수 제한을 설정해주세요. 최대 5개까지 추가할 수 있습니다.
      </Typography>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.6,
          borderRadius: '999px',
          bgcolor: alpha('#2563EB', 0.08),
          border: `1px solid ${alpha('#2563EB', 0.22)}`,
          color: '#1e40af',
          fontWeight: 700,
          fontSize: '0.82rem',
          mb: 3,
        }}
      >
        문항 {normalizedQuestions.length} / {MAX_COMPANY_QUESTIONS}
      </Box>

      <Stack spacing={2.2}>
        {normalizedQuestions.map((item, index) => {
          const canAdd = normalizedQuestions.length < MAX_COMPANY_QUESTIONS;

          return (
            <Box
              key={item.id}
              sx={{
                borderRadius: '20px',
                p: { xs: 1.6, sm: 2.2 },
                border: `1px solid ${alpha('#ffffff', 0.75)}`,
                background: 'linear-gradient(140deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.56) 100%)',
                boxShadow: '0 14px 30px -18px rgba(15,23,42,0.28), inset 0 1px 0 rgba(255,255,255,0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}>
                <Typography variant="subtitle2" sx={{ color: '#1e293b', fontWeight: 900 }}>
                  문항 {index + 1}
                </Typography>
                <Box
                  sx={{
                    px: 1,
                    py: 0.35,
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    bgcolor: item.hasCharacterLimit ? alpha('#2563EB', 0.12) : alpha('#64748b', 0.14),
                    color: item.hasCharacterLimit ? '#1d4ed8' : '#475569',
                  }}
                >
                  {item.hasCharacterLimit ? `${item.characterLimit ?? '-'}자 제한` : '제한 없음'}
                </Box>
              </Stack>
              <Stack spacing={1.2}>
                <TextField
                  fullWidth
                  label="문항"
                  value={item.question}
                  onChange={(e) => updateQuestion(item.id, { question: e.target.value })}
                  placeholder="예) 지원 동기와 입사 후 포부를 작성해주세요."
                  sx={inputSx}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="글자수 제한 여부"
                    value={item.hasCharacterLimit ? 'yes' : 'no'}
                    onChange={(e) => {
                      const enabled = e.target.value === 'yes';
                      updateQuestion(item.id, {
                        hasCharacterLimit: enabled,
                        characterLimit: enabled ? (item.characterLimit ?? 500) : null,
                      });
                    }}
                    sx={inputSx}
                  >
                    <MenuItem value="no">제한 없음</MenuItem>
                    <MenuItem value="yes">제한 있음</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    label="제한 글자수"
                    value={item.characterLimit ?? ''}
                    disabled={!item.hasCharacterLimit}
                    inputProps={{ min: 1, max: 5000 }}
                    onChange={(e) => {
                      const raw = Number(e.target.value);
                      if (!Number.isFinite(raw) || raw < 1) {
                        updateQuestion(item.id, { characterLimit: null });
                        return;
                      }
                      updateQuestion(item.id, { characterLimit: Math.min(5000, Math.floor(raw)) });
                    }}
                    sx={inputSx}
                  />
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteQuestion(item.id)}
                    disabled={normalizedQuestions.length <= 1}
                    sx={{
                      borderRadius: '12px',
                      px: 1.4,
                      borderColor: alpha('#ef4444', 0.35),
                      bgcolor: alpha('#ef4444', 0.04),
                    }}
                  >
                    문항 삭제
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleAddQuestionBelow(index)}
                    disabled={!canAdd}
                    sx={{
                      borderRadius: '12px',
                      fontWeight: 800,
                      minWidth: 72,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      boxShadow: '0 8px 18px -10px rgba(37,99,235,0.75)',
                    }}
                  >
                    +
                  </Button>
                </Stack>
                {!canAdd && (
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    문항은 최대 5개까지 추가할 수 있습니다.
                  </Typography>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default CoverLetterCompanyQuestionSetupStep;
