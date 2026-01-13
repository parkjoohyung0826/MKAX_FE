// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, AppBar, Toolbar, Tabs, Tab, Card, Button, ButtonGroup } from '@mui/material';
import { Elderly, Article, Badge } from '@mui/icons-material';
import ResumeForm from '@/components/ResumeForm';
import CoverLetterEditor from '@/components/CoverLetterEditor';
import LoadingIndicator from '@/components/LoadingIndicator';
import GenerationResult from '@/components/GenerationResult';
import ConversationalForm, { ResumeData } from '@/components/ConversationalForm';
import { mockJobPostings } from '@/lib/mockJobPostings';

// 타입 정의
type AppState = 'form' | 'loading' | 'result';
type TabValue = 'resume' | 'coverLetter';
type ResumeInputMode = 'direct' | 'ai';

// 자기소개서 데이터 타입
interface CoverLetterData {
  growthProcess: string;
  strengthsAndWeaknesses: string;
  keyExperience: string;
  motivation: string;
}

// 결과 데이터 타입
interface ResultData {
  aiCoverLetter: string;    
  aiResumeSummary: string;     
  jobPostings: any[];
  resumeData: ResumeData;    
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [appState, setAppState] = useState<AppState>('form');
  const [activeTab, setActiveTab] = useState<TabValue>('resume');
  const [resumeInputMode, setResumeInputMode] = useState<ResumeInputMode>('ai');
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '', desiredJob: '', education: '', workExperience: '', coreCompetencies: '', certifications: ''
  });
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    growthProcess: '', strengthsAndWeaknesses: '', keyExperience: '', motivation: ''
  });
  const [resultData, setResultData] = useState<ResultData | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => setActiveTab(newValue);
  
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeSubmit = (data: ResumeData) => {
    setResumeData(data);
    setActiveTab('coverLetter');
  };

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCoverLetterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = () => {
    setAppState('loading');
    setTimeout(() => {
      const mockResult: ResultData = {
        aiCoverLetter: `[AI 생성 자소서 예시]...`,
        aiResumeSummary: `${resumeData.name}님의 경력 분석...`,
        jobPostings: mockJobPostings,
        resumeData: resumeData, 
      };
      setResultData(mockResult);
      setAppState('result');
    }, 2000);
  };

  const handleReset = () => {
    setAppState('form');
    setResultData(null);
    setResumeData({ name: '', desiredJob: '', education: '', workExperience: '', coreCompetencies: '', certifications: '' });
    setActiveTab('resume');
  };

  const isNextDisabled = !resumeData.name || !resumeData.desiredJob;

  if (!mounted) return null;

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ height: 70 }}>
          <Elderly sx={{ mr: 1.5, color: 'primary.main', fontSize: '2.2rem' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: '-0.5px' }}>
            내일로 
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box>
            {appState === 'form' && (
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: 'text.primary' }}>
                  당신의 경험을 <span style={{ color: '#2563EB' }}>가치</span>로 만들어드립니다.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  간단한 입력만으로 AI가 전문적인 이력서와 자기소개서를 완성해드립니다.
                </Typography>
              </Box>
            )}

            {appState === 'form' && (
              <Card sx={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', borderRadius: 3, overflow: 'visible', bgcolor: 'background.paper' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                  <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ '& .MuiTab-root': { py: 3, fontSize: '1rem', fontWeight: 600 } }}>
                    <Tab icon={<Badge sx={{ mb: 1 }} />} label="1. 이력서 정보" value="resume" />
                    <Tab icon={<Article sx={{ mb: 1 }} />} label="2. 자기소개서 작성" value="coverLetter" disabled={isNextDisabled} />
                  </Tabs>
                </Box>
                
                <Box sx={{ p: { xs: 3, md: 5 } }}>
                  {activeTab === 'resume' && (
                    <Box sx={{ animation: 'fadeIn 0.5s' }}>
                      <ButtonGroup fullWidth sx={{ mb: 3 }}>
                        <Button variant={resumeInputMode === 'ai' ? 'contained' : 'outlined'} onClick={() => setResumeInputMode('ai')}>
                          AI로 작성 (단계별)
                        </Button>
                        <Button variant={resumeInputMode === 'direct' ? 'contained' : 'outlined'} onClick={() => setResumeInputMode('direct')}>
                          직접 작성
                        </Button>
                      </ButtonGroup>

                      {resumeInputMode === 'direct' ? (
                        <>
                          <ResumeForm formData={resumeData} handleChange={handleResumeChange} />
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                            <Button variant="contained" size="large" onClick={() => setActiveTab('coverLetter')} disabled={isNextDisabled} sx={{ px: 4, py: 1.5, fontWeight: 700 }}>
                              다음 단계로 이동
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <ConversationalForm onSubmit={handleResumeSubmit} />
                      )}
                    </Box>
                  )}
                  {activeTab === 'coverLetter' && (
                    <Box sx={{ animation: 'fadeIn 0.5s' }}>
                      <CoverLetterEditor coverLetterData={coverLetterData} setCoverLetterData={setCoverLetterData} handleChange={handleCoverLetterChange} handleGenerate={handleGenerate} isGenerating={appState === 'loading'} resumeData={resumeData} />
                    </Box>
                  )}
                </Box>
              </Card>
            )}

            {appState === 'loading' && <LoadingIndicator />}
            {appState === 'result' && resultData && <GenerationResult data={resultData} onReset={handleReset} />}
        </Box>
      </Container>
    </Box>
  );
}
