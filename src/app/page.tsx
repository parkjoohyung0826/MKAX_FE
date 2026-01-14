'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, AppBar, Tabs, Tab, Button, ButtonGroup, 
  useTheme, useMediaQuery, Dialog, DialogContent, TextField, IconButton 
} from '@mui/material';
import { AutoAwesome, Restore, Close, VpnKey } from '@mui/icons-material'; // 아이콘 추가
import { motion, AnimatePresence } from 'framer-motion';

// 기존 컴포넌트 임포트 유지
import ResumeForm from '@/components/ResumeForm';
import CoverLetterEditor from '@/components/CoverLetterEditor';
import LoadingIndicator from '@/components/LoadingIndicator';
import GenerationResult from '@/components/GenerationResult';
import ConversationalForm, { ResumeData } from '@/components/ConversationalForm';
import { mockJobPostings } from '@/lib/mockJobPostings';

// ... (타입 정의 기존 유지) ...
type AppState = 'form' | 'loading' | 'result';
type TabValue = 'resume' | 'coverLetter';
type ResumeInputMode = 'direct' | 'ai';

interface CoverLetterData {
  growthProcess: string;
  strengthsAndWeaknesses: string;
  keyExperience: string;
  motivation: string;
}

interface ResultData {
  aiCoverLetter: string;
  aiResumeSummary: string;
  jobPostings: any[];
  resumeData: ResumeData;
}

// 배경 파티클 애니메이션 (Type Error 수정됨)
const particleVariant = (i: number) => ({
  animate: {
    y: [0, -30, 0],
    x: [0, 20, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: 15 + i * 2,
      repeat: Infinity,
      ease: "linear" as const // as const 추가로 타입 에러 방지
    }
  }
});

// 모달 내부 입력창 스타일
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

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [appState, setAppState] = useState<AppState>('form');
  const [activeTab, setActiveTab] = useState<TabValue>('resume');
  const [resumeInputMode, setResumeInputMode] = useState<ResumeInputMode>('ai');
  
  // --- 상태 추가: 기록 불러오기 ---
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  // 데이터 상태 관리
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '', desiredJob: '', education: '', workExperience: '', coreCompetencies: '', certifications: ''
  });
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    growthProcess: '', strengthsAndWeaknesses: '', keyExperience: '', motivation: ''
  });
  const [resultData, setResultData] = useState<ResultData | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => { setMounted(true); }, []);

  // --- 핸들러: 기록 불러오기 ---
  const handleLoadData = () => {
    if (!accessCode.trim()) return;
    
    // TODO: 실제 API 연동 부분 (accessCode로 DB 조회)
    console.log(`Loading data for code: ${accessCode}`);
    
    // 모의 동작: 성공했다고 가정하고 모달 닫기
    alert(`${accessCode} 코드로 저장된 이력서를 불러왔습니다.`);
    setIsLoadModalOpen(false);
    setAccessCode('');
    
    // 예시: 불러온 데이터로 상태 업데이트 (필요 시 구현)
    // setResumeData({ ... });
  };

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
  const isGeneratingApplication = appState === 'loading';

  if (!mounted) return null;

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }}>
      
      {/* 배경 파티클 */}
      {[...Array(5)].map((_, i) => (
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

      {/* --- 헤더 (수정됨) --- */}
      <AppBar position="fixed" elevation={0} sx={{ background: 'transparent', pt: 2, zIndex: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            background: 'rgba(255, 255, 255, 0.65)', 
            backdropFilter: 'blur(16px)', 
            borderRadius: '50px', 
            px: 3, py: 1,
            display: 'flex', 
            justifyContent: 'space-between', // 좌우 배치
            alignItems: 'center', 
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            {/* 로고 영역 */}
            <Box display="flex" alignItems="center">
              <AutoAwesome sx={{ mr: 1.5, color: '#2563EB', fontSize: '1.8rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                Naeil<span style={{color:'#2563EB'}}>Ro</span>
              </Typography>
            </Box>

            {/* 우측 버튼: 기록 불러오기 */}
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
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(24px)',
            borderRadius: '32px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}>
            {appState === 'form' && (
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
                    <Tab label="01. 이력서 정보" value="resume" />
                    <Tab label="02. 자기소개서 생성" value="coverLetter" disabled={isNextDisabled} />
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
                                {mode === 'ai' ? '단계 별 AI 인터뷰' : '직접 입력'}
                              </Button>
                            ))}
                          </ButtonGroup>

                          {resumeInputMode === 'direct' ? (
                            <>
                              <ResumeForm formData={resumeData} handleChange={handleResumeChange} />
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
                                <Button 
                                  variant="contained" 
                                  size="large" 
                                  onClick={() => setActiveTab('coverLetter')} 
                                  disabled={isNextDisabled} 
                                  sx={{ 
                                    px: 5, py: 1.8, 
                                    borderRadius: '50px', 
                                    fontSize: '1.1rem', 
                                    fontWeight: 700,
                                    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)',
                                    background: 'linear-gradient(45deg, #2563EB, #4F46E5)'
                                  }}
                                >
                                  다음 단계
                                </Button>
                              </Box>
                            </>
                          ) : (
                            <ConversationalForm onSubmit={handleResumeSubmit} />
                          )}
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
            )}

            {appState === 'loading' && <LoadingIndicator />}
            {appState === 'result' && resultData && <GenerationResult data={resultData} onReset={handleReset} />}
          </Box>
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

    </Box>
  );
}