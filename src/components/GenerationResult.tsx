/** @jsxImportSource @emotion/react */
'use client';

import { useRef, useState, RefObject } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Work, Download, CheckCircle } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ResumeDisplay from './ResumeDisplay';
import CoverLetterDisplay from './CoverLetterDisplay';
import JobPostingList from './JobPostingList';
import { JobPosting } from '@/types/job'; 

// --- 타입 정의 ---

interface CoverLetterData {
  growthProcess: string;
  strengthsAndWeaknesses: string;
  keyExperience: string;
  motivation: string;
}

interface ResumeData {
  name: string;
  desiredJob: string;
  education: string;
  workExperience: string;
  coreCompetencies: string;
  certifications: string;
}

interface ResultData {
  aiCoverLetter: string;
  aiResumeSummary: string;
  jobPostings: JobPosting[]; // 타입을 JobPosting 배열로 수정
  resumeData: ResumeData;
}

interface Props {
  data: ResultData;
  onReset: () => void;
}

// --- Helper 함수 ---

const parseCoverLetter = (text: string): CoverLetterData => {
  const data: CoverLetterData = {
    growthProcess: '',
    strengthsAndWeaknesses: '',
    keyExperience: '',
    motivation: '',
  };

  if (!text) {
    return data;
  }

  const sectionTitles = {
    growthProcess: '[성장과정]',
    strengthsAndWeaknesses: '[성격의 장, 단점]',
    keyExperience: '[주요 경력 및 업무 강점]',
    motivation: '[지원 동기 및 입사 포부]',
  };

  const foundSections = (Object.keys(sectionTitles) as Array<keyof CoverLetterData>)
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


// --- 컴포넌트 ---
const GenerationResult = ({ data, onReset }: Props) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const coverLetterRef = useRef<HTMLDivElement>(null);
  const { resumeData } = data;
  const [activeView, setActiveView] = useState('resume');

  const coverLetterData = parseCoverLetter(data.aiCoverLetter);

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
    if (newView !== null) {
      setActiveView(newView);
    }
  };

  // PDF 다운로드 핸들러
  const handleDownloadPDF = async (targetRef: RefObject<HTMLDivElement | null>, fileName: string) => {
    if (!targetRef.current) return;

    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

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
      console.error('PDF 생성 중 오류 발생:', error);
      alert('PDF 생성에 실패했습니다. 관리자에게 문의해주세요.');
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: '#333' }}>
          🎉 생성이 완료되었습니다!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {activeView === 'resume'
            ? '아래 생성된 이력서를 확인하고 PDF로 다운로드하세요.'
            : '아래 생성된 자기소개서를 확인하고 PDF로 다운로드하세요.'}
        </Typography>
        
        {activeView === 'resume' && (
          <Button
            variant="contained"
            size="large"
            startIcon={<Download />}
            onClick={() => handleDownloadPDF(resumeRef, `${resumeData.name}_이력서.pdf`)}
            sx={{ 
              py: 1.5, px: 4, 
              fontSize: '1.1rem', fontWeight: 700,
              bgcolor: '#2563EB', '&:hover': { bgcolor: '#1d4ed8' },
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            이력서 PDF 다운로드
          </Button>
        )}

        {activeView === 'coverLetter' && (
          <Button
            variant="contained"
            size="large"
            startIcon={<Download />}
            onClick={() => handleDownloadPDF(coverLetterRef, `${resumeData.name}_자기소개서.pdf`)}
            sx={{ 
              py: 1.5, px: 4, 
              fontSize: '1.1rem', fontWeight: 700,
              bgcolor: '#2563EB', '&:hover': { bgcolor: '#1d4ed8' },
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            자기소개서 PDF 다운로드
          </Button>
        )}
      </Box>

      {/* --- 보기 전환 버튼 --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ToggleButtonGroup
          value={activeView}
          exclusive
          onChange={handleViewChange}
          aria-label="view toggle"
        >
          <ToggleButton value="resume" aria-label="resume" sx={{ px: 5, fontWeight: 600 }}>
            이력서
          </ToggleButton>
          <ToggleButton value="coverLetter" aria-label="cover letter" sx={{ px: 5, fontWeight: 600 }}>
            자기소개서
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>


      {/* --- 표시 영역 --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
        {activeView === 'resume' ? (
          <ResumeDisplay ref={resumeRef} data={resumeData} />
        ) : (
          <CoverLetterDisplay ref={coverLetterRef} data={coverLetterData} resumeName={resumeData.name} />

)}
      </Box>

      {/* --- AI 분석 결과 및 채용 정보 --- */}
      <Box sx={{ maxWidth: '210mm', mx: 'auto' }}>
        <Divider sx={{ my: 6, borderBottomWidth: 2 }} />
        
        <Typography variant="h5" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircle sx={{ mr: 1.5, color: 'primary.main' }} /> AI 역량 분석 요약
        </Typography>
        <Card sx={{ mb: 5, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{data.aiResumeSummary}</Typography>
          </CardContent>
        </Card>

        <Typography variant="h5" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Work sx={{ mr: 1.5, color: 'primary.main' }} /> 맞춤 채용 정보
        </Typography>
        
        <JobPostingList jobPostings={data.jobPostings} />

        <Box sx={{ textAlign: 'center', pb: 8, mt: 6 }}>
          <Button onClick={onReset} variant="outlined" size="large" sx={{ py: 1.5, px: 6, fontSize: '1.1rem', fontWeight: 600, borderWidth: 2 }}>
            처음으로 돌아가기
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default GenerationResult;