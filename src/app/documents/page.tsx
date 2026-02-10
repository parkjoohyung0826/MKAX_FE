'use client';

import React, { useState } from 'react';
import { 
  Alert, 
  Box, 
  Button, 
  CircularProgress,
  Snackbar, 
  TextField, 
  Typography, 
  Paper, 
  useMediaQuery,
  alpha,
  InputAdornment
} from '@mui/material';
import { ArrowForwardRounded, KeyRounded } from '@mui/icons-material'; 
import { useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import AppShell from '@/shared/components/AppShell';
import { useRouter } from 'next/navigation';
import { useReportStore } from '@/features/report/store';
import { useResumeStore } from '@/features/resume/store';
import { useCoverLetterStore } from '@/features/cover-letter/store';
import { mockJobPostings } from '@/features/report/services/mockJobPostings';
import { mapMatchedRecruitmentsToJobPostings } from '@/features/report/services/fetchMatchedRecruitments';
import { ResultData } from '@/features/report/types';

const DocumentsPage = () => {
  const [accessCode, setAccessCode] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { setResultData } = useReportStore();
  const { setFormattedResume } = useResumeStore();
  const { setCoverLetterData } = useCoverLetterStore();

  const toCoverLetterData = () => ({
    growthProcess: '',
    strengthsAndWeaknesses: '',
    keyExperience: '',
    motivation: '',
  });

  const toCoverLetterText = (data: ReturnType<typeof toCoverLetterData>) =>
    `[성장과정]\n${data.growthProcess}\n\n[성격의 장, 단점]\n${data.strengthsAndWeaknesses}\n\n[주요 경력 및 업무 강점]\n${data.keyExperience}\n\n[지원 동기 및 입사 포부]\n${data.motivation}`.trim();

  const normalizeCoverLetter = (coverLetter: any) => {
    if (!Array.isArray(coverLetter)) return null;
    const sectionMap: Record<string, keyof ReturnType<typeof toCoverLetterData>> = {
      GROWTH_PROCESS: 'growthProcess',
      STRENGTHS_AND_WEAKNESSES: 'strengthsAndWeaknesses',
      KEY_EXPERIENCE: 'keyExperience',
      MOTIVATION: 'motivation',
    };
    const base = toCoverLetterData();
    coverLetter.forEach((item: any) => {
      const key = sectionMap[item?.section];
      if (!key) return;
      base[key] = item?.finalDraft ?? item?.summary ?? '';
    });
    return base;
  };

  const fetchByCode = async (code: string) => {
    const res = await fetch('/api/archive/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      let message = err?.message ?? '인증코드 조회 실패';
      if (message === 'Backend error' && err?.detail) {
        try {
          const parsed = JSON.parse(err.detail);
          message = parsed?.message ?? err.detail;
        } catch {
          message = err.detail;
        }
      }
      throw new Error(message);
    }

    return res.json();
  };

  const handleLoadData = async () => {
    const code = accessCode.trim();
    if (!code || isLoading) return;

    try {
      const startTime = Date.now();
      setIsLoading(true);
      const data = await fetchByCode(code);
      const normalizedCoverLetter = normalizeCoverLetter(data.coverLetter);
      if (normalizedCoverLetter) {
        setCoverLetterData(normalizedCoverLetter);
      }

      const resumeUrl =
        data.resumeUrl ??
        data.resume_url ??
        data.resumePdfUrl ??
        data.resume_pdf_url ??
        data.resumePDFUrl ??
        data.analysisReportSourceUrls?.resumeUrl ??
        data.analysis_report_source_urls?.resumeUrl;
      const coverLetterUrl =
        data.coverLetterUrl ??
        data.cover_letter_url ??
        data.coverLetterPdfUrl ??
        data.cover_letter_pdf_url ??
        data.coverLetterPDFUrl ??
        data.analysisReportSourceUrls?.coverLetterUrl ??
        data.analysis_report_source_urls?.coverLetterUrl;
      const inferredSource =
        data.analysisReportSourceType ??
        data.analysis_report_source_type ??
        (resumeUrl || coverLetterUrl ? 'pdf' : 'json');
      const recruitmentMatch = data.recruitmentMatch ?? data.recruitment_match;
      const matchedItems = Array.isArray(recruitmentMatch?.items) ? recruitmentMatch.items : [];
      const mappedJobPostings =
        matchedItems.length > 0
          ? mapMatchedRecruitmentsToJobPostings(matchedItems)
          : mockJobPostings;
      const mockResult: ResultData = {
        aiCoverLetter: normalizedCoverLetter ? toCoverLetterText(normalizedCoverLetter) : (data.coverLetter ?? ''),
        aiResumeSummary: `${data?.resume?.name ?? ''}님의 경력 분석...`,
        jobPostings: mappedJobPostings,
        resumeData: data.resume ?? {},
        accessCode: code,
        analysisReport: data.analysisReport ?? null,
        resumeUrl,
        coverLetterUrl,
        analysisReportSourceType: inferredSource,
      };
      if (data.resume) {
        setFormattedResume(data.resume);
      }
      setResultData(mockResult);
      const elapsed = Date.now() - startTime;
      if (elapsed < 3000) {
        await new Promise((resolve) => setTimeout(resolve, 3000 - elapsed));
      }
      setToastMessage('문서 조회가 완료되었습니다.');
      setToastSeverity('success');
      setToastOpen(true);
      router.push('/report');
    } catch (error) {
      console.error(error);
      setToastMessage(
        error instanceof Error ? error.message : '인증코드 조회 실패'
      );
      setToastSeverity('error');
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key="documents-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              fontWeight={900}
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #1e293b 30%, #2563EB 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-1px',
                wordBreak: 'keep-all',
              }}
            >
              문서 조회
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              이전에 발급받은 인증 코드를 입력하면
              <br />
              작성 중이던 이력서와 자기소개서를 불러옵니다.
            </Typography>
          </Box>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            p: { xs: 2, md: 4 },
            borderRadius: '32px',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 1)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)',
          }}
        >
          <TextField
            fullWidth
            placeholder="인증 코드를 입력하세요"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyRounded sx={{ color: accessCode ? '#2563EB' : '#94a3b8', ml: 1, transition: 'color 0.3s' }} />
                </InputAdornment>
              ),
              sx: { 
                height: '64px',
                fontSize: '1rem',
                fontWeight: 600,
                '& input::placeholder': { color: '#cbd5e1', opacity: 1 }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(248, 250, 252, 0.5)',
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1px' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.1)',
                  '& fieldset': { borderColor: '#2563EB', borderWidth: '2px' },
                },
              },
            }}
          />
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mt: 5,
              gap: 3,
              px: 1
            }}
          >
            {/* 왼쪽: 문서 작성 유도 섹션 */}
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography 
                variant="caption" 
                sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5, letterSpacing: '0.02em' }}
              >
                작성된 문서가 없으신가요?
              </Typography>
              
              <Typography
                variant="body2"
                onClick={() => router.push('/resume')}
                sx={{
                  color: '#2563EB',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  lineHeight: 1,
                  gap: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: '#1d4ed8',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                  }
                }}
              >
                AI로 새로 작성하기
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <ArrowForwardRounded sx={{ fontSize: 16, transform: 'translateY(0.5px)' }} />
                </motion.span>
              </Typography>
            </Box>

            {/* 오른쪽: 불러오기 버튼 */}
            <Button
              variant="contained"
              disabled={!accessCode || isLoading}
              onClick={handleLoadData}
              sx={{
                px: 4,
                py: 1.3,
                borderRadius: '30px',
                fontWeight: 700,
                minWidth: '160px',
                boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)',
                background: 'linear-gradient(45deg, #2563EB, #1d4ed8)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1d4ed8, #1e40af)',
                },
                '&.Mui-disabled': {
                  background: isLoading ? '#2563EB' : '#e2e8f0',
                  color: isLoading ? '#f8fafc' : '#94a3b8'
                }
                  }}
            >
              {isLoading ? (
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} thickness={5} sx={{ color: '#f8fafc' }} />
                  불러오는 중...
                </Box>
              ) : (
                '불러오기'
              )}
            </Button>
          </Box>
        </Paper>
      </motion.div>

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
          sx={{
            width: '100%',
            borderRadius: '12px',
            fontWeight: 600,
            bgcolor: toastSeverity === 'success' ? '#16a34a' : undefined,
            color: toastSeverity === 'success' ? '#f0fdf4' : undefined,
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </AppShell>
  );
};

export default DocumentsPage;
