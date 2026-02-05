'use client';

import React, { useState } from 'react';
import { Alert, Box, Button, Paper, Snackbar, Typography, useMediaQuery } from '@mui/material';
import { CloudUploadOutlined, DescriptionOutlined } from '@mui/icons-material';
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
    name: '',
    englishName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    emergencyContact: '',
    address: '',
    photo: '',
    desiredJob: '',
    education: '',
    workExperience: '',
    coreCompetencies: '',
    certifications: '',
  };

  const canSubmit = Boolean(resumeFile && coverLetterFile) && !isSubmitting;

  const handleGenerateReport = async () => {
    if (!resumeFile || !coverLetterFile || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { code, report } = await requestPdfAnalysisReport(
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
                borderRadius: '28px',
                bgcolor: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
              }}
            >
              <Box sx={{ display: 'grid', gap: 3 }}>
                <FileDropCard
                  title="이력서 PDF"
                  description="이력서 파일(PDF)을 업로드하세요."
                  file={resumeFile}
                  onChange={setResumeFile}
                />
                <FileDropCard
                  title="자기소개서 PDF"
                  description="자기소개서 파일(PDF)을 업로드하세요."
                  file={coverLetterFile}
                  onChange={setCoverLetterFile}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  variant="contained"
                  disabled={!canSubmit}
                  onClick={handleGenerateReport}
                  sx={{
                    px: 4,
                    py: 1.3,
                    borderRadius: '30px',
                    fontWeight: 700,
                    boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)',
                    background: 'linear-gradient(45deg, #2563EB, #1d4ed8)',
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

type FileDropCardProps = {
  title: string;
  description: string;
  file: File | null;
  onChange: (file: File | null) => void;
};

const FileDropCard = ({ title, description, file, onChange }: FileDropCardProps) => (
  <Box
    sx={{
      borderRadius: '20px',
      border: '1px dashed rgba(15, 23, 42, 0.2)',
      p: { xs: 3, md: 4 },
      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.6) 100%)',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <DescriptionOutlined sx={{ color: '#2563EB' }} />
      <Typography variant="h6" fontWeight={800} color="#0f172a">
        {title}
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      {description}
    </Typography>

    <Box
      sx={{
        borderRadius: '16px',
        border: '1px solid rgba(148, 163, 184, 0.4)',
        bgcolor: 'white',
        px: 2.5,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box>
        <Typography variant="body2" color="#475569" fontWeight={600}>
          {file ? file.name : '업로드된 파일이 없습니다.'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          PDF 형식만 지원합니다.
        </Typography>
      </Box>
      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUploadOutlined />}
        sx={{
          borderRadius: '999px',
          textTransform: 'none',
          fontWeight: 700,
          px: 2.5,
        }}
      >
        파일 선택
        <input
          type="file"
          hidden
          accept="application/pdf"
          onChange={(event) => {
            const nextFile = event.target.files?.[0] ?? null;
            onChange(nextFile);
          }}
        />
      </Button>
    </Box>
  </Box>
);

export default ReportOnlyPage;
