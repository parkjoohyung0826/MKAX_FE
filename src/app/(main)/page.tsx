'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Container, Typography, AppBar, Tabs, Tab, Button, ButtonGroup, 
  useTheme, useMediaQuery, Dialog, DialogContent, TextField, IconButton,
  Snackbar, Alert 
} from '@mui/material';
import { AutoAwesome, Restore, Close, VpnKey } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import CoverLetterEditor from '@/features/cover-letter/components/CoverLetterEditor';
import LoadingIndicator from '@/shared/components/LoadingIndicator';
import GenerationResult from '@/features/report/components/GenerationResult';
import ConversationalForm from '@/features/resume/components/ConversationalForm';
import AIChatView from '@/features/resume/components/AIChatView';
import FinalReviewStep from '@/features/resume/components/steps/FinalReviewStep';
import { mockJobPostings } from '@/features/report/services/mockJobPostings';

import { ResumeData } from '@/features/resume/types';
import { CoverLetterData } from '@/features/cover-letter/types';
import { ResultData } from '@/features/report/types';

// api 테스트

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchItems() {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  const res = await fetch(`${API_BASE}/items`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}
//

type AppState = 'form' | 'loading' | 'result';
type TabValue = 'resume' | 'coverLetter';
type ResumeInputMode = 'direct' | 'ai';

const particleVariant = (i: number) => ({
  animate: {
    y: [0, -30, 0],
    x: [0, 20, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: 15 + i * 2,
      repeat: Infinity,
      ease: "linear" as const
    }
  }
});

const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '16px',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(37, 99, 235, 0.3)' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
      '& fieldset': { borderColor: '#2563EB' }
    }
  }
};

const resumeSteps = ['기본 정보', '학력 사항', '경력 사항', '자격증/주요활동', '최종 검토'];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [appState, setAppState] = useState<AppState>('form');
  const [activeTab, setActiveTab] = useState<TabValue>('resume');
  const [resumeInputMode, setResumeInputMode] = useState<ResumeInputMode>('ai');
  
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isStepComplete, setIsStepComplete] = useState(false);

  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  // --- 상태 추가: 유효성 검사 알림 ---
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [resumeData, setResumeData] = useState<ResumeData>({
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
  });
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    growthProcess: '', strengthsAndWeaknesses: '', keyExperience: '', motivation: ''
  });
  const [resultData, setResultData] = useState<ResultData | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  //api 테스트
  const [items, setItems] = useState<any[]>([]);

  const loadItems = useCallback(async () => {
    try {
      const data = await fetchItems();
      setItems(data);
      console.log("items:", data);
    } catch (e) {
      console.error(e);
      setToastMessage("아이템 목록을 불러오지 못했습니다.");
      setToastOpen(true);
    }
  }, []);
  //

  // useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    setMounted(true);
    loadItems();
  }, [loadItems]);
  useEffect(() => {
    console.log("API BASE:", process.env.NEXT_PUBLIC_API_BASE_URL);

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/items`)
      .then(res => {
        console.log("STATUS:", res.status);
        return res.json();
      })
      .then(data => console.log("DATA:", data))
      .catch(err => console.error("ERROR:", err));
  }, []);
  
  // Reset step when input mode changes
  useEffect(() => {
    setActiveStep(0);
    setDirection(0);
    setIsStepComplete(false);
  }, [resumeInputMode]);


  // 이력서 완료 여부 체크 (최소 조건: 이름과 희망 직무)
  const isResumeComplete = !!resumeData.name && !!resumeData.desiredJob;

  // --- 탭 변경 핸들러 수정 ---
  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    // 자기소개서 탭으로 이동하려고 하는데, 이력서가 미완성인 경우
    if (newValue === 'coverLetter' && !isResumeComplete) {
      setToastMessage('이력서의 기본 정보(이름, 희망 직무)를 먼저 입력해주세요.');
      setToastOpen(true);
      return; // 탭 변경 막음
    }
    setActiveTab(newValue);
  };

  // --- 다음 단계 버튼 핸들러 수정 ---
  const handleNextStep = () => {
    if (activeStep === resumeSteps.length - 1) {
      // Final step -> go to cover letter
      setActiveTab('coverLetter');
    } else {
      setDirection(1);
      setActiveStep((prev) => prev + 1);
      setIsStepComplete(false); // Reset for next step
    }
  };

  const handleBackStep = () => {
    setDirection(-1);
    setActiveStep((prev) => prev - 1);
    setIsStepComplete(true); // Assume previous step is always complete
  };


  const handleLoadData = () => {
    if (!accessCode.trim()) return;
    console.log(`Loading data for code: ${accessCode}`);
    alert(`${accessCode} 코드로 저장된 이력서를 불러왔습니다.`);
    setIsLoadModalOpen(false);
    setAccessCode('');
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
    setResumeData({
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
    });
    setActiveTab('resume');
    setActiveStep(0);
    setDirection(0); 
    setIsStepComplete(false); 
  };

  const isGeneratingApplication = appState === 'loading';

  const renderResumeContent = () => {
    const isFinalStep = activeStep === resumeSteps.length - 1;

    if (resumeInputMode === 'ai' && isFinalStep) {
        return <FinalReviewStep data={resumeData} />;
    }
    
    if (resumeInputMode === 'ai') {
      return <AIChatView 
               activeStep={activeStep} 
               steps={resumeSteps}
               onStepComplete={() => setIsStepComplete(true)} 
               resumeData={resumeData}
               setResumeData={setResumeData}
             />;
    }
    
    if (resumeInputMode === 'direct') {
      return <ConversationalForm 
               activeStep={activeStep}
               direction={direction}
               steps={resumeSteps}
               resumeData={resumeData}
               setResumeData={setResumeData}
             />;
    }
  };

  if (!mounted) return null;

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }}>
      
      {/* 배경 파티클 */}
      {appState !== 'form' && [...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={particleVariant(i)}
          animate="animate"
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${150 + i * 50}px`,
            height: `${150 + i * 50}px`,
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
            filter: 'blur(50px)',
            zIndex: 0,
          }}
        />
      ))}

      {/* 헤더 */}
      <AppBar position="fixed" elevation={0} sx={{ background: 'transparent', pt: 2, zIndex: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            background: 'rgba(255, 255, 255, 0.65)', 
            backdropFilter: 'blur(16px)', 
            borderRadius: '50px', 
            px: 3, py: 1,
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center', 
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            <Box display="flex" alignItems="center">
              <AutoAwesome sx={{ mr: 1.5, color: '#2563EB', fontSize: '1.8rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                Naeil<span style={{color:'#2563EB'}}>Ro</span>
              </Typography>
            </Box>

            <Button
              startIcon={<Restore />}
              onClick={() => setIsLoadModalOpen(true)}
              sx={{
                color: '#64748b',
                fontWeight: 600,
                borderRadius: '20px',
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563EB'
                }
              }}
            >
              {isMobile ? '불러오기' : '기록 불러오기'}
            </Button>
          </Box>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, pt: 15, pb: 8 }}>
        
        {/* 타이틀 영역 */}
        <AnimatePresence mode="wait">
          {appState === 'form' && (
            <motion.div
              key="form-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant={isMobile ? "h4" : "h3"} fontWeight={900} gutterBottom sx={{ 
                  background: 'linear-gradient(45deg, #1e293b 30%, #2563EB 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-1px',
                  wordBreak: 'keep-all' 
                }}>
                  당신의 경험이 <br className={isMobile ? 'block' : 'hidden'} />새로운 내일이 됩니다
                </Typography>
                
                <Typography variant="h6" sx={{ 
                  color: 'text.secondary', 
                  fontWeight: 500, 
                  opacity: 0.8,
                  lineHeight: 1.6,
                  mt: 2,
                  wordBreak: 'keep-all',
                  maxWidth: '800px',
                  mx: 'auto'
                }}>
                  복잡한 서류 준비는 AI에게 맡기세요.<br/>
                  이력서·자기소개서 자동 완성부터 맞춤 일자리 추천까지, <br className={isMobile ? 'block' : 'hidden'} /> <strong>내일로</strong>가 도와드립니다.
                </Typography>
              </Box>
            </motion.div>
          )}
          {appState === 'result' && (
            <motion.div
              key="result-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography 
                  variant={isMobile ? "h4" : "h3"}
                  fontWeight={900} 
                  gutterBottom 
                  sx={{ 
                    color: '#1e293b',
                    textShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    letterSpacing: '-1px'
                  }}
                >
                  분석 및 생성이 완료되었습니다!
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight={500} sx={{ opacity: 0.8, mt: 2, wordBreak: 'keep-all' }}>
                  AI가 분석한 커리어 리포트와 완성된 서류를 탭을 눌러 확인해보세요.
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {appState === 'form' && (
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(24px)',
              borderRadius: '32px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}>
              <>
                <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)', px: 4 }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    variant="fullWidth" 
                    sx={{ 
                      '& .MuiTabs-indicator': { height: 4, borderRadius: 2, background: '#2563EB' },
                      '& .MuiTab-root': { py: 4, fontSize: '1rem', fontWeight: 700, color: '#64748b' },
                      '& .Mui-selected': { color: '#2563EB !important' }
                    }}
                  >
                    <Tab label="01. 이력서 작성" value="resume" />
                    <Tab label="02. 자기소개서 작성" value="coverLetter" />
                  </Tabs>
                </Box>
                
                <Box sx={{ p: { xs: 3, md: 6 } }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === 'resume' && (
                        <Box>
                          <ButtonGroup fullWidth sx={{ 
                            mb: 5, 
                            p: 0.5, 
                            bgcolor: '#f1f5f9', 
                            borderRadius: '16px',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                          }}>
                            {['ai', 'direct'].map((mode) => (
                              <Button 
                                key={mode}
                                variant={resumeInputMode === mode ? 'contained' : 'text'} 
                                onClick={() => setResumeInputMode(mode as ResumeInputMode)}
                                sx={{ 
                                  borderRadius: '12px !important',
                                  py: 1.5,
                                  boxShadow: resumeInputMode === mode ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
                                  bgcolor: resumeInputMode === mode ? '#2563EB' : 'transparent',
                                  color: resumeInputMode === mode ? 'white' : '#64748b',
                                  border: 'none',
                                  '&:hover': { bgcolor: resumeInputMode === mode ? '#1d4ed8' : 'rgba(0,0,0,0.05)', border: 'none' }
                                }}
                              >
                                {mode === 'ai' ? 'AI 챗봇으로 작성' : '단계별로 직접 입력'}
                              </Button>
                            ))}
                          </ButtonGroup>
                          
                          {renderResumeContent()}

                           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <Button disabled={activeStep === 0} onClick={handleBackStep} sx={{ color: '#64748b', fontWeight: 600, px: 3, py: 1, borderRadius: '20px', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }} >
                              이전 단계
                            </Button>
                            <Button variant="contained" onClick={handleNextStep} sx={{ px: 4, py: 1.2, borderRadius: '30px', fontWeight: 700, boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)', background: 'linear-gradient(45deg, #2563EB, #1d4ed8)' }} >
                              {activeStep === resumeSteps.length - 1 ? '자기소개서 작성' : '다음'}
                            </Button>
                          </Box>

                        </Box>
                      )}
                      
                      {activeTab === 'coverLetter' && (
                        <CoverLetterEditor 
                          coverLetterData={coverLetterData} 
                          setCoverLetterData={setCoverLetterData} 
                          handleChange={handleCoverLetterChange} 
                          handleGenerate={handleGenerate} 
                          isGenerating={isGeneratingApplication} 
                          resumeData={resumeData} 
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Box>
              </>
            </Box>
          )}

          {appState === 'loading' && <LoadingIndicator />}
          {appState === 'result' && resultData && <GenerationResult data={resultData} onReset={handleReset} />}
        </motion.div>
      </Container>

      {/* --- 기록 불러오기 모달 --- */}
      <Dialog 
        open={isLoadModalOpen} 
        onClose={() => setIsLoadModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: '400px',
            p: 1
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1, pt: 1 }}>
          <IconButton onClick={() => setIsLoadModalOpen(false)} size="small">
            <Close fontSize="small" />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 4, pb: 4, pt: 0, textAlign: 'center' }}>
          <Box sx={{ 
            width: 50, height: 50, 
            bgcolor: 'rgba(37, 99, 235, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2
          }}>
            <VpnKey sx={{ color: '#2563EB' }} />
          </Box>
          <Typography variant="h6" fontWeight={800} gutterBottom>
            이전 기록 불러오기
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            이전에 발급받은 인증 코드를 입력하면<br/>
            작성 중이던 이력서와 자기소개서를 불러옵니다.
          </Typography>
          
          <TextField
            fullWidth
            placeholder="인증 코드 입력 (예: AB12-CD34)"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            sx={glassInputSx}
            InputProps={{
              sx: { textAlign: 'center' }
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLoadData}
            disabled={!accessCode}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 700,
              bgcolor: '#2563EB',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              '&:hover': { bgcolor: '#1d4ed8' }
            }}
          >
            불러오기
          </Button>
        </DialogContent>
      </Dialog>

      {/* --- 알림용 Snackbar --- */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setToastOpen(false)} 
          severity="warning" 
          variant="filled"
          sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
}
