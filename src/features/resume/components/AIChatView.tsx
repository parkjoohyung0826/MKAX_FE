'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Paper, Typography, Avatar, Drawer, IconButton, Fade, Grow, Fab, Tooltip, Badge, Zoom } from '@mui/material';
import { Send, AutoAwesome, Close, ArticleOutlined, SmartToyOutlined } from '@mui/icons-material';
import { ResumeData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

import BasicInfoPanel from './chat-panels/BasicInfoPanel';
import EducationPanel from './chat-panels/EducationPanel';
import WorkExperiencePanel from './chat-panels/WorkExperiencePanel';
import SkillsPanel from './chat-panels/SkillsPanel';
import ProgressStepper from '@/shared/components/ProgressStepper';

const TypingIndicator = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, p: 2, px: 2.5, bgcolor: '#fff', borderRadius: '20px', borderTopLeftRadius: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: 'fit-content' }}>
    {[0, 1, 2].map((i) => (
      <Box 
        key={i}
        sx={{ 
          width: 8, height: 8, bgcolor: '#3B82F6', borderRadius: '50%', 
          animation: 'wave 1.2s infinite ease-in-out both', 
          animationDelay: `${i * 0.15}s`,
          '@keyframes wave': { '0%, 60%, 100%': { transform: 'translateY(0)' }, '30%': { transform: 'translateY(-6px)' } } 
        }} 
      />
    ))}
  </Box>
);

const mainContainerSx = {
  height: '75vh', 
  maxHeight: '800px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  bgcolor: 'transparent', 
  boxShadow: 'none',      
  border: 'none',       
  mb: -5,
};

const messageListSx = {
  flexGrow: 1,
  overflowY: 'auto',
  px: 2, 
  py: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  scrollbarWidth: 'none', 
  '&::-webkit-scrollbar': { display: 'none' },
  pb: '120px', 
  maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 100%)',
};

const floatingInputWrapperSx = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  p: 3,
  display: 'flex',
  justifyContent: 'center',
  zIndex: 10
};

const inputPaperSx = {
  width: '100%',
  maxWidth: '700px',
  p: '8px 8px 8px 24px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '32px',
  bgcolor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  border: '1px solid rgba(255,255,255,0.8)',
  transition: 'all 0.3s ease',
  '&:focus-within': {
    transform: 'translateY(-2px)',
    boxShadow: '0 15px 50px rgba(37, 99, 235, 0.15)',
    border: '1px solid rgba(37, 99, 235, 0.3)',
  }
};

const chatInputSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { border: 'none' },
    '& input': { padding: '10px 0', fontSize: '1.05rem' }
  }
};

const drawerPaperSx = {
  width: { xs: '100%', sm: '450px' },
  boxSizing: 'border-box',
  backdropFilter: 'blur(16px)',
  boxShadow: '-10px 0 50px rgba(0,0,0,0.1)',
  borderLeft: '1px solid rgba(255,255,255,0.5)',
  p: 4,
  pt: 8
};

const badgeRippleSx = {
  '& .MuiBadge-badge': {
    backgroundColor: '#ef4444',
    color: '#ef4444',
    boxShadow: '0 0 0 2px #fff', 
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out', 
      animationIterationCount: 3, 
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': { transform: 'scale(0.8)', opacity: 1 },
    '100%': { transform: 'scale(2.4)', opacity: 0 },
  },
};

interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
}

interface AIChatViewProps {
  activeStep: number;
  steps: string[];
  onStepComplete: () => void;
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const conversationSteps = [
  {
    title: '기본 정보',
    panel: (data: Partial<ResumeData>) => <BasicInfoPanel data={data} />,
    fields: [
      { field: 'name', question: '안녕하세요! 이력서 작성을 도와드릴게요.\n먼저 성함(한글)을 알려주세요.' },
      { field: 'englishName', question: '영문 이름도 알려주시겠어요?' },
      { field: 'desiredJob', question: '지원하고자 하는 희망 직무는 무엇인가요?' },
      { field: 'dateOfBirth', question: '생년월일(YYYY-MM-DD)을 입력해주세요.' },
      { field: 'email', question: '이메일 주소를 알려주세요.' },
      { field: 'phoneNumber', question: '연락 가능한 휴대폰 번호를 알려주세요.' },
      { field: 'address', question: '거주 중인 주소를 입력해주세요.' },
      { field: 'emergencyContact', question: '비상 연락처도 하나 남겨주세요.' },
    ]
  },
  {
    title: '학력 사항',
    panel: (data: Partial<ResumeData>) => <EducationPanel data={data} />,
    fields: [
      { field: 'education', question: '학력 사항에 대해 알려주세요.\n(예: OO대학교 컴퓨터공학과 졸업, 2018.03 ~ 2024.02)' },
    ]
  },
  {
    title: '경력 사항',
    panel: (data: Partial<ResumeData>) => <WorkExperiencePanel data={data} />,
    fields: [
      { field: 'workExperience', question: '경력 사항이 있다면 최신순으로 알려주세요.\n(회사명, 기간, 주요 업무 등)' },
    ]
  },
  {
    title: '자격증/주요활동',
    panel: (data: Partial<ResumeData>) => <SkillsPanel data={data} />,
    fields: [
      { field: 'coreCompetencies', question: '보유하신 핵심 역량이나 기술 스택을 자유롭게 말씀해주세요.' },
      { field: 'certifications', question: '자격증, 어학 성적, 또는 주요 대외활동 경험이 있다면 알려주세요.' },
    ]
  }
];

const AIChatView = ({ activeStep, steps, onStepComplete, resumeData, setResumeData }: AIChatViewProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isCurrentStepComplete, setIsCurrentStepComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasUnreadChanges, setHasUnreadChanges] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  const currentStepConfig = conversationSteps[activeStep];

  useEffect(() => {
    setQuestionIndex(0);
    setIsCurrentStepComplete(false);
    if (currentStepConfig && currentStepConfig.fields.length > 0) {
      setMessages([]);
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{ id: 0, sender: 'ai', text: currentStepConfig.fields[0].question }]);
        setIsTyping(false);
      }, 800);
    }
  }, [activeStep, currentStepConfig]);

  useEffect(() => {
    if (!isTyping && !isCurrentStepComplete) {
      const timer = setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isTyping, isCurrentStepComplete]);

  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;

    // setTimeout을 사용하여 Framer Motion 애니메이션이 DOM에 공간을 차지한 직후에 스크롤되도록 함
    const scrollTimer = setTimeout(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth', // 부드럽게 스크롤 (즉시 이동을 원하시면 'auto'로 변경)
      });
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [messages, isTyping]);


  const handleSendMessage = () => {
    if (!userInput.trim() || isCurrentStepComplete) return;

    const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text: userInput };
    const currentField = currentStepConfig.fields[questionIndex].field as keyof ResumeData;
    
    setMessages(prev => [...prev, newUserMessage]);
    setResumeData(prev => ({ ...prev, [currentField]: userInput }));
    setUserInput('');
    setIsTyping(true);

    setHasUnreadChanges(true);

    const nextQuestionIndex = questionIndex + 1;

    setTimeout(() => {
      setIsTyping(false);
      
      if (nextQuestionIndex < currentStepConfig.fields.length) {
        setQuestionIndex(nextQuestionIndex);
        const nextQuestion = currentStepConfig.fields[nextQuestionIndex].question;
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: nextQuestion }]);
      } else {
        setIsCurrentStepComplete(true);
        onStepComplete();
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: `'${currentStepConfig.title}' 작성이 완료되었습니다. 다음 단계로 이동해주세요.` }]);
        setIsDrawerOpen(true);
      }
    }, 1000);
  };
  
  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
    if (newOpen) {
      setHasUnreadChanges(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', p: 0, position: 'relative' }}>
      
      <Box sx={{ mt: -3, mb: 4, opacity: 0.9 }}>
        <ProgressStepper steps={steps} activeStep={activeStep} />
      </Box>

      <Box sx={mainContainerSx}>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden' 
            }}
          >
            <Box ref={messageListRef} sx={messageListSx}>
              <Box sx={{ textAlign: 'center', py: -5, opacity: 0.5 }}>
                <SmartToyOutlined sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#94a3b8' }}>
                  AI 채용 코디네이터가 입력을 도와드립니다
                </Typography>
              </Box>

              {messages.map((msg) => (
                <Grow in={true} key={msg.id} timeout={500}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
                    alignItems: 'flex-start',
                    mb: 1
                  }}>
                    {msg.sender === 'ai' && (
                      <Avatar sx={{ 
                        width: 38, height: 38, 
                        bgcolor: '#fff', color: '#2563EB', 
                        mr: 2, mt: 0.5,
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
                      }}>
                        <AutoAwesome sx={{ fontSize: 20 }} />
                      </Avatar>
                    )}
                    
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        px: 3,
                        maxWidth: '80%',
                        borderRadius: '26px',
                        borderTopLeftRadius: msg.sender === 'ai' ? '4px' : '26px',
                        borderTopRightRadius: msg.sender === 'user' ? '4px' : '26px',
                        bgcolor: msg.sender === 'ai' ? '#fff' : '#2563EB',
                        background: msg.sender === 'user' ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : '#fff',
                        color: msg.sender === 'ai' ? '#334155' : '#fff',
                        boxShadow: msg.sender === 'ai' 
                          ? '0 4px 20px rgba(0,0,0,0.05)' 
                          : '0 8px 25px rgba(37, 99, 235, 0.3)',
                        fontSize: '1rem',
                        lineHeight: 1.6,
                      }}
                    >
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{msg.text}</Typography>
                    </Paper>
                  </Box>
                </Grow>
              ))}
              
              {isTyping && (
                <Fade in={true}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 7 }}>
                    <TypingIndicator />
                  </Box>
                </Fade>
              )}
              <div ref={chatEndRef} />
            </Box>
          </motion.div>
        </AnimatePresence>

        <Box sx={floatingInputWrapperSx}>
          <Paper sx={inputPaperSx} elevation={0}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={isTyping ? "답변을 기다리는 중..." : "답변을 입력해주세요..."}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isCurrentStepComplete || isTyping}
              sx={chatInputSx}
              inputRef={inputRef}
            />
            <IconButton 
              onClick={handleSendMessage} 
              disabled={isCurrentStepComplete || !userInput.trim() || isTyping} 
              sx={{ 
                bgcolor: (!userInput.trim() || isTyping) ? '#f1f5f9' : '#2563EB',
                color: (!userInput.trim() || isTyping) ? '#cbd5e1' : '#fff',
                width: 48,
                height: 48,
                ml: 1,
                transition: 'all 0.2s',
                '&:hover': { bgcolor: '#1d4ed8', transform: 'scale(1.1)' }
              }} 
            >
              <Send fontSize="small" />
            </IconButton>
          </Paper>
        </Box>
      </Box>

      {/* 4. 우측 하단 버튼 */}
      <Zoom in={!isDrawerOpen} unmountOnExit>
        <Tooltip title="작성된 내용 확인" placement="left">
          <Fab 
            color="primary"
            aria-label="preview" 
            onClick={toggleDrawer(true)}
            sx={{ 
              position: 'absolute', 
              bottom: 110, 
              right: 16, 
              zIndex: 20,
              bgcolor: '#fff', 
              color: '#2563EB',
              boxShadow: '0 4px 20px rgba(37, 99, 235, 0.25)',
              width: 56,
              height: 56,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { 
                bgcolor: '#f8fafc', 
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 25px rgba(37, 99, 235, 0.35)',
              }
            }}
          >
            <Badge 
              key={messages.length}
              color="error" 
              variant="dot" 
              invisible={!hasUnreadChanges}
              sx={badgeRippleSx} 
            >
              <ArticleOutlined sx={{ fontSize: 26 }} />
            </Badge>
          </Fab>
        </Tooltip>
      </Zoom>

      {/* 5. 정보 확인 Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ sx: drawerPaperSx }}
      >
        <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
          <IconButton onClick={toggleDrawer(false)} sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0', transform: 'rotate(90deg)' }, transition: 'all 0.3s' }}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ mb: 5, mt: 1 }}>
          <Typography variant="h5" fontWeight={800} color="#1e293b" gutterBottom>
            입력 정보 확인
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            AI와 대화한 내용이 실시간으로 정리됩니다.
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
          {currentStepConfig.panel(resumeData)}
        </Box>
      </Drawer>
    </Box>
  );
};

export default AIChatView;