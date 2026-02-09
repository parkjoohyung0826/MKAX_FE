'use client';

import React, { useState } from 'react';
import { 
  Alert, 
  Box, 
  Button, 
  Paper, 
  Snackbar, 
  Stack, 
  Typography, 
  useMediaQuery, 
  alpha 
} from '@mui/material';
import { 
  CloudUploadRounded, 
  PictureAsPdfRounded, 
  CheckCircleRounded, 
  ChangeCircleOutlined,
  ArrowForwardRounded
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import AppShell from '@/shared/components/AppShell';
import LoadingIndicator from '@/shared/components/LoadingIndicator';
import { requestPdfAnalysisReport } from '@/features/report/services/requestPdfAnalysisReport';
import { useReportStore } from '@/features/report/store';
import { mockJobPostings } from '@/features/report/services/mockJobPostings';
import { ResultData } from '@/features/report/types';
import { ResumeData } from '@/features/resume/types';
import { useRouter } from 'next/navigation';

const ReportOnlyPage = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { setResultData } = useReportStore();
  const router = useRouter();

  const emptyResumeData: ResumeData = {
    name: '', englishName: '', dateOfBirth: '', email: '', phoneNumber: '',
    emergencyContact: '', address: '', photo: '', desiredJob: '',
    education: '', workExperience: '', coreCompetencies: '', certifications: '',
  };

  const canSubmit = Boolean(resumeFile && coverLetterFile) && !isSubmitting;

  const handleGenerateReport = async () => {
    if (!resumeFile || !coverLetterFile || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { code, report, resumeUrl, coverLetterUrl } = await requestPdfAnalysisReport(
        resumeFile ?? undefined,
        coverLetterFile ?? undefined
      );
      const result: ResultData = {
        aiCoverLetter: '',
        aiResumeSummary: '',
        jobPostings: mockJobPostings,
        resumeData: emptyResumeData,
        accessCode: code,
        analysisReport: report ?? null,
        resumeUrl,
        coverLetterUrl,
        analysisReportSourceType: 'pdf',
      };
      setResultData(result);
      setToastMessage('리포트 생성이 완료되었습니다.');
      setToastSeverity('success');
      setToastOpen(true);
      router.push('/report');
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'PDF 분석 요청 실패');
      setToastSeverity('error');
      setToastOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      {isSubmitting ? (
        <LoadingIndicator />
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key="report-title"
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
                  AI 리포트 전용
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  이력서와 자기소개서 PDF를 업로드하면 분석 리포트만 생성합니다.
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
                maxWidth: 900,
                mx: 'auto',
                p: { xs: 3, md: 5 },
                borderRadius: '32px',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* PDF 업로드 카드 그리드 */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <FileDropCard
                  title="이력서 PDF"
                  file={resumeFile}
                  onChange={setResumeFile}
                />
                <FileDropCard
                  title="자기소개서 PDF"
                  file={coverLetterFile}
                  onChange={setCoverLetterFile}
                />
              </Box>

              {/* 하단 유도 문구 및 버튼 영역 */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' }, 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mt: 5,
                  gap: 3,
                  px: 1
                }}
              >
                {/* 좌측: 텍스트 링크 스타일 섹션 */}
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#94a3b8', 
                    fontWeight: 600, 
                    display: 'block', 
                    mb: 0.8,
                    letterSpacing: '0.02em' 
                  }}
                >
                  준비된 서류가 없으신가요?
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
                  AI와 함께 5분 만에 서류 작성하기
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <ArrowForwardRounded 
                      sx={{ 
                        fontSize: 18, 
                        transform: 'translateY(0.5px)'
                      }} 
                    />
                  </motion.span>
                </Typography>
              </Box>

                {/* 우측: 리포트 생성 버튼 */}
                <Button
                  variant="contained"
                  disabled={!canSubmit}
                  onClick={handleGenerateReport}
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
                      background: '#e2e8f0',
                      color: '#94a3b8'
                    }
                  }}
                >
                  리포트 생성
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </>
      )}

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
    </AppShell>
  );
};

// --- FileDropCard Component ---

type FileDropCardProps = {
  title: string;
  file: File | null;
  onChange: (file: File | null) => void;
};

const FileDropCard = ({ title, file, onChange }: FileDropCardProps) => {
  return (
    <Button
      component="label"
      sx={{
        width: '100%',
        minHeight: '280px',
        p: 0,
        borderRadius: '24px',
        overflow: 'hidden',
        border: '2px dashed',
        borderColor: file ? 'primary.main' : 'rgba(15, 23, 42, 0.12)',
        bgcolor: file ? alpha('#2563EB', 0.03) : 'rgba(248, 250, 252, 0.4)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        textTransform: 'none',
        '&:hover': {
          bgcolor: file ? alpha('#2563EB', 0.06) : 'rgba(241, 245, 249, 0.7)',
          borderColor: 'primary.main',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.04)'
        },
      }}
    >
      <input
        type="file"
        hidden
        accept="application/pdf"
        onChange={(event) => {
          const nextFile = event.target.files?.[0] ?? null;
          onChange(nextFile);
        }}
      />
      
      <Box sx={{ width: '100%', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <Box 
                sx={{ 
                  width: 64, height: 64, borderRadius: '18px', 
                  bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.06)', mb: 2
                }}
              >
                <PictureAsPdfRounded sx={{ fontSize: 30, color: '#ef4444' }} />
              </Box>
              
              <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
                <Typography variant="subtitle1" fontWeight={800} color="#1e293b">
                  {title} 선택됨
                </Typography>
                <CheckCircleRounded sx={{ fontSize: 18, color: '#22c55e' }} />
              </Stack>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </Typography>

              <Box 
                sx={{ 
                  display: 'flex', alignItems: 'center', gap: 1, 
                  color: 'primary.main', fontSize: '0.815rem', fontWeight: 700,
                  bgcolor: 'white', px: 2.5, py: 1, borderRadius: '99px',
                  border: '1px solid', borderColor: alpha('#2563EB', 0.15),
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <ChangeCircleOutlined fontSize="small" />
                파일 변경
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="file-empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <Box 
                sx={{ 
                  width: 64, height: 64, borderRadius: '50%', 
                  bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid', borderColor: '#f1f5f9', mb: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}
              >
                <CloudUploadRounded sx={{ fontSize: 32, color: '#cbd5e1' }} />
              </Box>
              
              <Typography variant="h6" fontWeight={800} color="#334155" gutterBottom>
                {title} 업로드
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                클릭하여 PDF 파일을 선택하세요
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Button>
  );
};

export default ReportOnlyPage;