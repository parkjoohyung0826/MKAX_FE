import React, { useEffect } from 'react';
import { alpha, Box, MenuItem, Stack, TextField, Typography, IconButton, Chip } from '@mui/material';
import { AddRounded, DeleteOutlineRounded } from '@mui/icons-material';
import { useCoverLetterStore } from '../../store';
import { CompanyCoverLetterQuestion } from '../../types';

const MAX_COMPANY_QUESTIONS = 5;

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(8px)',
    '& fieldset': { 
      borderColor: 'rgba(15, 23, 42, 0.08)',
      borderWidth: '1.5px',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    '&:hover fieldset': { 
      borderColor: 'rgba(37, 99, 235, 0.3)' 
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      boxShadow: '0 8px 24px -6px rgba(37, 99, 235, 0.2)',
      '& fieldset': { borderColor: '#2563EB', borderWidth: '1.5px' },
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
    fontWeight: 600,
  }
};

const recruitmentFilterMenuProps = {
  PaperProps: {
    sx: {
      borderRadius: '12px',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
      border: '1px solid #F2F4F6',
      mt: 1,
      '& .MuiMenu-list': { p: 1 },
    },
  },
};

const createQuestion = (index: number): CompanyCoverLetterQuestion => ({
  id: `company-question-${Date.now()}-${index}`,
  questionId: null,
  question: '',
  answer: '',
  summary: '',
  finalDraft: '',
  isComplete: false,
  assistantId: 'balanced',
  hasCharacterLimit: false,
  characterLimit: null,
});

const CoverLetterCompanyQuestionSetupStep = () => {
  const { companyName, setCompanyName, companyQuestions, setCompanyQuestions } = useCoverLetterStore();

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
        const questionChanged =
          typeof patch.question === 'string' &&
          patch.question.trim() !== item.question.trim();
        const next = {
          ...item,
          ...patch,
          ...(questionChanged ? { questionId: null, summary: '', isComplete: false } : {}),
        };

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
    <Box sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
      {/* 헤더 영역 */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
            기업별 문항 설정
          </Typography>
        </Stack>
        
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
            문항별 질문과 글자수 제한을 설정해주세요.
          </Typography>
          
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 2,
              py: 0.8,
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: `1px solid rgba(255, 255, 255, 0.8)`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              color: '#1e40af',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            추가된 문항 <Box component="span" sx={{ color: '#2563EB', ml: 1, mr: 0.5 }}>{normalizedQuestions.length}</Box> / {MAX_COMPANY_QUESTIONS}
          </Box>
        </Stack>
        <TextField
          fullWidth
          label="기업명"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="예) 네이버"
          sx={{ ...inputSx, mt: 2 }}
        />
      </Box>

      {/* 리스트 영역 */}
      <Stack spacing={3}>
        {normalizedQuestions.map((item, index) => {
          const canAdd = normalizedQuestions.length < MAX_COMPANY_QUESTIONS;
          const isLast = index === normalizedQuestions.length - 1;

          return (
            <Box key={item.id}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '28px',
                  p: { xs: 2.5, sm: 3.5 },
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.35) 100%)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: `
                    0 20px 40px -12px rgba(15, 23, 42, 0.08), 
                    inset 0 1px 0 rgba(255, 255, 255, 1)
                  `,
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': {
                    boxShadow: `
                      0 32px 50px -12px rgba(37, 99, 235, 0.15), 
                      inset 0 1px 0 rgba(255, 255, 255, 1)
                    `,
                  }
                }}
              >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 800 }}>
                  문항 {index + 1}
                </Typography>
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <Chip
                    label={item.hasCharacterLimit ? `${item.characterLimit ?? '-'}자 제한` : '제한 없음'}
                    size="small"
                    sx={{
                      height: 30,
                      fontWeight: 700,
                      borderRadius: '999px',
                      bgcolor: item.hasCharacterLimit ? alpha('#2563EB', 0.1) : alpha('#64748b', 0.08),
                      color: item.hasCharacterLimit ? '#1d4ed8' : '#64748b',
                    }}
                  />
                  <IconButton
                    onClick={() => handleDeleteQuestion(item.id)}
                    disabled={normalizedQuestions.length <= 1}
                    size="small"
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '999px',
                      color: '#ef4444',
                      bgcolor: alpha('#ef4444', 0.08),
                      '&:hover': { bgcolor: alpha('#ef4444', 0.12) },
                      '&.Mui-disabled': { color: '#cbd5e1', borderColor: '#e2e8f0' },
                    }}
                  >
                    <DeleteOutlineRounded fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="문항 질문"
                  value={item.question}
                  onChange={(e) => updateQuestion(item.id, { question: e.target.value })}
                  placeholder="예) 당사에 지원하게 된 동기와 입사 후 포부를 작성해주세요."
                  sx={inputSx}
                />
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    select
                    fullWidth
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
                    SelectProps={{ MenuProps: recruitmentFilterMenuProps }}
                  >
                    <MenuItem
                      value="no"
                      sx={{
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        minHeight: 36,
                        px: 1.5,
                        '&.Mui-selected': { color: '#3182F6', fontWeight: 600, backgroundColor: 'transparent' },
                      }}
                    >
                      제한 없음
                    </MenuItem>
                    <MenuItem
                      value="yes"
                      sx={{
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        minHeight: 36,
                        px: 1.5,
                        '&.Mui-selected': { color: '#3182F6', fontWeight: 600, backgroundColor: 'transparent' },
                      }}
                    >
                      제한 있음
                    </MenuItem>
                  </TextField>
                  
                  <TextField
                    fullWidth
                    type="number"
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
                    sx={{
                       ...inputSx,
                       opacity: item.hasCharacterLimit ? 1 : 0.6,
                    }}
                  />
                </Stack>

              </Stack>
              </Box>
              {isLast && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.1 }}>
                  <IconButton
                    onClick={() => handleAddQuestionBelow(index)}
                    disabled={!canAdd}
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '999px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      boxShadow: '0 8px 20px -8px rgba(37,99,235,0.5)',
                      '&:hover': { boxShadow: '0 12px 24px -8px rgba(37,99,235,0.7)' },
                      '&.Mui-disabled': { background: '#e2e8f0', color: '#94a3b8', boxShadow: 'none' },
                    }}
                  >
                    <AddRounded />
                  </IconButton>
                </Box>
              )}
              {isLast && !canAdd && (
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', textAlign: 'center', mt: 0.6 }}>
                  최대 5개까지 추가 가능합니다.
                </Typography>
              )}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default CoverLetterCompanyQuestionSetupStep;
