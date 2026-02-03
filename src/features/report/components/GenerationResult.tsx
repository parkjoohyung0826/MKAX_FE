/** @jsxImportSource @emotion/react */
'use client';

import { useRef, useState, RefObject, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Paper,
  Fade,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Work, 
  Download, 
  Assessment, 
  Description, 
  Article,
  CheckCircle,
  ContentCopy,
  Visibility,
  VisibilityOff,
  Key
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 하위 컴포넌트 임포트
import ResumeDisplay from '@/features/resume/components/ResumeDisplay';
import CoverLetterDisplay from '@/features/cover-letter/components/CoverLetterDisplay';
import JobPostingList from './JobPostingList';
import CareerAnalysisReport from './CareerAnalysisReport';
import { ResultData } from '../types';
import { CoverLetterData } from '@/features/cover-letter/types';
import { useCoverLetterStore } from '../../cover-letter/store';
import { useResumeStore } from '../../resume/store';

interface Props {
  data: ResultData;
  onReset: () => void;
}

type CoverLetterSectionKey = 'growthProcess' | 'strengthsAndWeaknesses' | 'keyExperience' | 'motivation';

const parseCoverLetter = (text: string): CoverLetterData => {
  const data: CoverLetterData = {
    growthProcess: '', strengthsAndWeaknesses: '', keyExperience: '', motivation: '',
  };
  if (!text) return data;

  const sectionTitles: Record<CoverLetterSectionKey, string> = {
    growthProcess: '[성장과정]',
    strengthsAndWeaknesses: '[성격의 장, 단점]',
    keyExperience: '[주요 경력 및 업무 강점]',
    motivation: '[지원 동기 및 입사 포부]',
  };

  const foundSections = (Object.keys(sectionTitles) as CoverLetterSectionKey[])
    .map(key => ({
      key,
      title: sectionTitles[key],
      index: text.indexOf(sectionTitles[key]),
    }))
    .filter(section => section.index !== -1)
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
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [showCode, setShowCode] = useState(false); // 코드 표시 토글

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
      setActiveTab(newTab);
    }
  };

  const handleCopyAccessCode = async () => {
    if (!data.accessCode) return;
    try {
      await navigator.clipboard.writeText(data.accessCode);
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy access code:', error);
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

  // 탭 버튼 스타일 (기존 유지 + 배경 투명화)
  const toggleBtnSx = {
    border: 'none',
    borderRadius: '50px !important',
    px: { xs: 2, md: 3 },
    py: 1,
    mx: 0.5,
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(37, 99, 235, 0.05)',
      color: '#2563EB',
    },
    '&.Mui-selected': {
      backgroundColor: '#fff',
      color: '#2563EB',
      fontWeight: 800,
      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
      '&:hover': {
        backgroundColor: '#fff',
      }
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      
      {/* 1. 통합 컨트롤 바 (탭 + 인증코드) */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, position: 'relative', zIndex: 10 }}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // 모바일에서는 세로, PC는 가로
            alignItems: 'center',
            p: 0.8,
            borderRadius: '50px',
            bgcolor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.08)',
            gap: { xs: 2, md: 0 }
          }}
        >
          {/* 왼쪽: 탭 그룹 */}
          <ToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={handleTabChange}
            aria-label="result tabs"
            sx={{ bgcolor: 'transparent' }}
          >
            <ToggleButton value="report" sx={toggleBtnSx}>
              <Assessment sx={{ mr: 1, fontSize: 18 }} /> 분석 리포트
            </ToggleButton>
            <ToggleButton value="resume" sx={toggleBtnSx}>
              <Description sx={{ mr: 1, fontSize: 18 }} /> 이력서
            </ToggleButton>
            <ToggleButton value="coverLetter" sx={toggleBtnSx}>
              <Article sx={{ mr: 1, fontSize: 18 }} /> 자기소개서
            </ToggleButton>
          </ToggleButtonGroup>

          {/* 구분선 (PC에서만 보임) */}
          <Divider 
            orientation="vertical" 
            flexItem 
            sx={{ 
              mx: 2, 
              display: { xs: 'none', md: 'block' },
              borderColor: 'rgba(0,0,0,0.08)' 
            }} 
          />

          {/* 오른쪽: 인증코드 (통합됨) */}
          {data.accessCode && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                pl: { xs: 0, md: 1 },
                pr: 2,
                pb: { xs: 1, md: 0 }
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: '#f1f5f9', 
                  borderRadius: '20px', 
                  px: 1.5, 
                  py: 0.5,
                  border: '1px solid #e2e8f0'
                }}
              >
                <Key sx={{ fontSize: 16, color: '#94a3b8', mr: 1 }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: 'monospace', 
                    fontWeight: 700, 
                    color: showCode ? '#334155' : '#94a3b8',
                    mr: 1,
                    minWidth: '60px',
                    textAlign: 'center',
                    fontSize: '0.85rem'
                  }}
                >
                  {showCode ? data.accessCode : '••••••'}
                </Typography>
                
                <Tooltip title={showCode ? "숨기기" : "코드 확인"}>
                  <IconButton 
                    size="small" 
                    onClick={() => setShowCode(!showCode)}
                    sx={{ p: 0.5, color: '#64748b' }}
                  >
                    {showCode ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                  </IconButton>
                </Tooltip>
              </Box>

              <Tooltip title="인증코드 복사">
                <IconButton 
                  size="small"
                  onClick={handleCopyAccessCode}
                  sx={{ 
                    bgcolor: isCodeCopied ? '#dcfce7' : '#eff6ff', 
                    color: isCodeCopied ? '#16a34a' : '#3b82f6',
                    '&:hover': { bgcolor: isCodeCopied ? '#dcfce7' : '#dbeafe' }
                  }}
                >
                  {isCodeCopied ? <CheckCircle sx={{ fontSize: 18 }} /> : <ContentCopy sx={{ fontSize: 18 }} />}
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Paper>
      </Box>

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
                  <ResumeDisplay ref={resumeRef} />
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
    </Box>
  );
};

export default GenerationResult;
