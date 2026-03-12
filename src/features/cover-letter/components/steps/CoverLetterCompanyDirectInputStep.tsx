import React from 'react';
import { Box, Button, Snackbar, Alert, useMediaQuery } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useCoverLetterStore } from '../../store';
import CoverLetterInputBox from './CoverLetterInputBox';
import ConversationalAssistant from '@/shared/components/ConversationalAssistant';

interface Props {
  activeStep: number;
}

const actionButtonSx = {
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 700,
  px: 2,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
};

const CoverLetterCompanyDirectInputStep = ({ activeStep }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { companyQuestions, setCompanyQuestionAnswer, setCompanyQuestionChatState } = useCoverLetterStore();
  const question = companyQuestions[activeStep];
  const [isAIModalOpen, setAIModalOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastSeverity, setToastSeverity] = React.useState<'success' | 'error'>('success');

  if (!question) return null;

  const hasLimit = question.hasCharacterLimit && typeof question.characterLimit === 'number' && question.characterLimit > 0;
  const limit = hasLimit ? question.characterLimit : null;

  const handleAIGenerate = async (prompt: string): Promise<{ missingInfo?: string; isComplete?: boolean }> => {
    try {
      if (!question.questionId) {
        throw new Error('문항 세트가 생성되지 않았습니다. 기업 문항 설정 단계에서 다음을 눌러주세요.');
      }
      setIsGenerating(true);

      const res = await fetch(`/api/cover-letter/custom-chat/${question.questionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userInput: prompt,
          currentSummary: question.summary ?? '',
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? 'AI 초안 생성에 실패했습니다.');

      const nextQuestion = String(data?.nextQuestion ?? '').trim();
      const summary = String(data?.summary ?? '').trim();
      const finalDraft = String(data?.finalDraft ?? '').trim();
      const isComplete = Boolean(data?.isComplete);

      if (!finalDraft) {
        return { missingInfo: nextQuestion || '생성을 위해 추가 정보가 필요합니다.', isComplete: false };
      }

      setCompanyQuestionChatState(question.id, {
        summary,
        finalDraft,
        isComplete,
      });
      const nextValue = hasLimit && limit ? finalDraft.slice(0, limit) : finalDraft;
      setCompanyQuestionAnswer(question.id, nextValue);
      setAIModalOpen(false);
      setToastMessage('AI 작성이 완료되었습니다.');
      setToastSeverity('success');
      setToastOpen(true);

      return { missingInfo: nextQuestion, isComplete };
    } catch (e: any) {
      setToastMessage(e?.message ?? 'AI 작성에 실패했습니다.');
      setToastSeverity('error');
      setToastOpen(true);
      throw e;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box sx={{ py: 2, mb: -5 }}>
      <CoverLetterInputBox
        title={`문항 ${activeStep + 1}`}
        description={question.question}
        value={question.answer}
        onChange={(value) => {
          const nextValue = hasLimit && limit ? value.slice(0, limit) : value;
          setCompanyQuestionAnswer(question.id, nextValue);
        }}
        placeholder="이 문항에 대한 답변을 작성해주세요."
        minRows={8}
        maxLength={hasLimit && limit ? limit : undefined}
        disabled={isGenerating}
        actions={(
          <Button
            size="small"
            variant="outlined"
            startIcon={<AutoAwesome />}
            onClick={() => setAIModalOpen(true)}
            disabled={isGenerating}
            sx={{
              ...actionButtonSx,
              borderRadius: isMobile ? '10px' : '12px',
              px: isMobile ? 1.2 : 2,
              py: isMobile ? 0.35 : undefined,
              minHeight: isMobile ? 34 : undefined,
              fontSize: isMobile ? '0.78rem' : '0.875rem',
              whiteSpace: 'nowrap',
              '& .MuiButton-startIcon': {
                mr: isMobile ? 0.5 : undefined,
                '& svg': { fontSize: isMobile ? '1rem' : '1.1rem' },
              },
              borderColor: 'rgba(37, 99, 235, 0.3)',
              color: '#2563EB',
              bgcolor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                borderColor: '#2563EB',
                bgcolor: 'rgba(37, 99, 235, 0.05)',
              },
            }}
          >
            {isMobile ? 'AI 초안' : 'AI 초안 작성'}
          </Button>
        )}
      />

      <ConversationalAssistant
        open={isAIModalOpen}
        onClose={() => setAIModalOpen(false)}
        onSubmit={handleAIGenerate}
        title={`문항 ${activeStep + 1} AI 초안 작성`}
        prompt="문항 의도에 맞게 강조할 경험/성과, 포함하고 싶은 키워드를 입력해주세요."
      />

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CoverLetterCompanyDirectInputStep;
