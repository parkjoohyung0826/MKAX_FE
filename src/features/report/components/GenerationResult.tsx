/** @jsxImportSource @emotion/react */
'use client';

import { useRef, useState, RefObject, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Fade,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Work, 
  Download, 
  CheckCircle
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 하위 컴포넌트 임포트
import ResumeTemplateRenderer from '@/features/resume/components/ResumeTemplateRenderer';
import CoverLetterDisplay from '@/features/cover-letter/components/CoverLetterDisplay';
import JobPostingList from './JobPostingList';
import CareerAnalysisReport from './CareerAnalysisReport';
import ReportControlBar from './ReportControlBar';
import ArchiveDeleteDialog from './ArchiveDeleteDialog';
import { ResultData } from '../types';
import { CoverLetterData } from '@/features/cover-letter/types';
import { useCoverLetterStore } from '../../cover-letter/store';
import { useResumeStore } from '../../resume/store';
import { requestArchiveDelete } from '../services/requestArchiveDelete';

interface Props {
  data: ResultData;
  onReset: () => void;
}

type CoverLetterSectionKey = 'growthProcess' | 'strengthsAndWeaknesses' | 'keyExperience' | 'motivation';
type CoverLetterSectionApiKey = 'GROWTH_PROCESS' | 'STRENGTHS_AND_WEAKNESSES' | 'KEY_EXPERIENCE' | 'MOTIVATION';

const toEmptyCoverLetterData = (): CoverLetterData => ({
  growthProcess: '',
  strengthsAndWeaknesses: '',
  keyExperience: '',
  motivation: '',
});

const parseCoverLetter = (text: unknown): CoverLetterData => {
  const data = toEmptyCoverLetterData();
  if (!text) return data;

  if (Array.isArray(text)) {
    const sectionMap: Record<CoverLetterSectionApiKey, CoverLetterSectionKey> = {
      GROWTH_PROCESS: 'growthProcess',
      STRENGTHS_AND_WEAKNESSES: 'strengthsAndWeaknesses',
      KEY_EXPERIENCE: 'keyExperience',
      MOTIVATION: 'motivation',
    };
    text.forEach((item: any) => {
      const key = sectionMap[item?.section as CoverLetterSectionApiKey];
      if (!key) return;
      data[key] = item?.finalDraft ?? item?.summary ?? '';
    });
    return data;
  }

  if (typeof text === 'object') {
    const obj = text as Partial<CoverLetterData>;
    return {
      growthProcess: obj.growthProcess ?? '',
      strengthsAndWeaknesses: obj.strengthsAndWeaknesses ?? '',
      keyExperience: obj.keyExperience ?? '',
      motivation: obj.motivation ?? '',
    };
  }

  if (typeof text !== 'string') return data;

  const sectionTitles: Record<CoverLetterSectionKey, string> = {
    growthProcess: '[성장과정]',
    strengthsAndWeaknesses: '[성격의 장, 단점]',
    keyExperience: '[주요 경력 및 업무 강점]',
    motivation: '[지원 동기 및 입사 포부]',
  };

  const foundSections = (Object.keys(sectionTitles) as CoverLetterSectionKey[])
    .map((key) => ({
      key,
      title: sectionTitles[key],
      index: text.indexOf(sectionTitles[key]),
    }))
    .filter((section) => section.index !== -1)
    .sort((a, b) => a.index - b.index);

  if (foundSections.length === 0) {
    data.growthProcess = text;
    return data;
  }

  for (let i = 0; i < foundSections.length; i++) {
    const currentSection = foundSections[i];
    const nextSection = foundSections[i + 1];
    const startIndex = currentSection.index + currentSection.title.length;
    const endIndex = nextSection ? nextSection.index : text.length;
    data[currentSection.key] = text.substring(startIndex, endIndex).trim();
  }
  return data;
};

const GenerationResult = ({ data, onReset }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const resumeRef = useRef<HTMLDivElement>(null);
  const coverLetterRef = useRef<HTMLDivElement>(null);
  const { resumeData } = data;
  const { coverLetterData, setCoverLetterData } = useCoverLetterStore();
  const { setResumeData } = useResumeStore();
  
  const [activeTab, setActiveTab] = useState<'report' | 'resume' | 'coverLetter'>('report');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const parsedData = parseCoverLetter(data.aiCoverLetter);
    const hasParsedContent = Object.values(parsedData).some((value) => String(value ?? '').trim().length > 0);
    const hasStoredContent = Object.values(coverLetterData).some((value) => String(value ?? '').trim().length > 0);
    if (hasParsedContent && !hasStoredContent) {
      setCoverLetterData(parsedData);
    }
    setResumeData(data.resumeData);
  }, [coverLetterData, data.aiCoverLetter, data.resumeData, setCoverLetterData, setResumeData]);

  const handleTabChange = (event: React.MouseEvent<HTMLElement>, newTab: 'report' | 'resume' | 'coverLetter' | null) => {
    if (newTab !== null) {
      if (newTab === 'coverLetter') {
        console.log('[report] coverLetterData', coverLetterData);
      }
      setActiveTab(newTab);
    }
  };

  const handleDownloadPDF = async (targetRef: RefObject<HTMLDivElement | null>, fileName: string) => {
    if (!targetRef.current) return;
    try {
      const canvas = await html2canvas(targetRef.current, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; 
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF Error:', error);
      alert('PDF 생성 실패');
    }
  };

  const handleDeleteArchive = async () => {
    if (!data.accessCode || isDeleting) return;
    setIsDeleting(true);
    try {
      await requestArchiveDelete(data.accessCode);
      setToastMessage('문서가 삭제되었습니다.');
      setToastSeverity('success');
      setToastOpen(true);
      setTimeout(() => onReset(), 800);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : '삭제 요청 실패');
      setToastSeverity('error');
      setToastOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <ReportControlBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        accessCode={data.accessCode}
        isDeleting={isDeleting}
        onRequestDelete={() => setConfirmOpen(true)}
      />

      {/* 2. 메인 컨텐츠 영역 */}
      <Paper 
        elevation={0}
        sx={{ 
          maxWidth: '1100px', 
          mx: 'auto', 
          minHeight: '600px',
          borderRadius: '40px',
          bgcolor: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
          p: { xs: 3, md: 6 }, 
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Fade in={true} key={activeTab} timeout={500}>
          <Box>
            {/* 탭 1: 분석 리포트 & 채용 */}
            {activeTab === 'report' && (
              <Box>
                <CareerAnalysisReport
                  analysisReport={data.analysisReport}
                  jobPostings={data.jobPostings}
                />
              </Box>
            )}

            {/* 탭 2: 이력서 */}
            {activeTab === 'resume' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ mb: 5, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={700} color="#334155">
                     생성된 이력서 미리보기
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Download />}
                    onClick={() => handleDownloadPDF(resumeRef, `${resumeData.name}_이력서.pdf`)}
                    sx={{ 
                      py: 1.2, px: 3, 
                      fontSize: '1rem', fontWeight: 700,
                      bgcolor: '#2563EB', '&:hover': { bgcolor: '#1d4ed8' },
                      borderRadius: '16px',
                      boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
                    }}
                  >
                    PDF 다운로드
                  </Button>
                </Box>
                <Box sx={{ 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)', 
                  borderRadius: '4px', 
                  overflow: 'hidden' 
                }}>
                  <ResumeTemplateRenderer ref={resumeRef} />
                </Box>
              </Box>
            )}

            {/* 탭 3: 자기소개서 */}
            {activeTab === 'coverLetter' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ mb: 5, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Typography variant="h6" fontWeight={700} color="#334155">
                     생성된 자기소개서 미리보기
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Download />}
                    onClick={() => handleDownloadPDF(coverLetterRef, `${resumeData.name}_자기소개서.pdf`)}
                    sx={{ 
                      py: 1.2, px: 3, 
                      fontSize: '1rem', fontWeight: 700,
                      bgcolor: '#2563EB', '&:hover': { bgcolor: '#1d4ed8' },
                      borderRadius: '16px',
                      boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
                    }}
                  >
                    PDF 다운로드
                  </Button>
                </Box>
                <Box sx={{ 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <CoverLetterDisplay ref={coverLetterRef} resumeName={resumeData.name} />
                </Box>
              </Box>
            )}
          </Box>
        </Fade>

        {/* 하단 공통 버튼 */}
        <Box sx={{ textAlign: 'center', mt: 3, pt: 4, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <Button 
            onClick={onReset} 
            variant="text" 
            size="large" 
            startIcon={<CheckCircle />}
            sx={{ 
              color: '#64748b', 
              fontWeight: 600,
              px: 4, py: 1.5,
              borderRadius: '20px',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', color: '#334155' }
            }}
          >
            처음으로 돌아가기
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toastSeverity} variant="filled" onClose={() => setToastOpen(false)}>
          {toastMessage}
        </Alert>
      </Snackbar>

      <ArchiveDeleteDialog
        open={confirmOpen}
        isDeleting={isDeleting}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          void handleDeleteArchive();
        }}
      />
    </Box>
  );
};

export default GenerationResult;
