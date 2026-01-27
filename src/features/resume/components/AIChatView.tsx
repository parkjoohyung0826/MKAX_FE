'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import MessageList from './ai-chat/MessageList';
import ChatInputBar from './ai-chat/ChatInputBar';
import PreviewFab from './ai-chat/PreviewFab';
import PreviewDrawer from './ai-chat/PreviewDrawer';
import { ChatMessage } from './ai-chat/types';

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

export interface ConversationStep<T> {
  title: string;
  panel: (data: Partial<T>) => React.ReactNode;
  fields: {
    field: keyof T;
    question: string;
  }[];
}

interface AIChatViewProps<T> {
  activeStep: number;
  steps: string[];
  onStepComplete: () => void;
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  conversationSteps: ConversationStep<T>[];
  fieldApiConfigs?: Partial<Record<keyof T, FieldApiConfig<T>>>;
}

type FieldApiConfig<T> = {
  endpoint: string;
  summaryField?: keyof T;
  buildBody?: (args: { userInput: string; currentSummary: string; data: T }) => Record<string, unknown>;
};

const AIChatView = <T extends Record<string, any>>({
  activeStep,
  steps,
  onStepComplete,
  data,
  setData,
  conversationSteps,
  fieldApiConfigs,
}: AIChatViewProps<T>) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [apiDraft, setApiDraft] = useState('');
  const [isCurrentStepComplete, setIsCurrentStepComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasUnreadChanges, setHasUnreadChanges] = useState(false);
  const [pendingIntro, setPendingIntro] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const stepStateRef = useRef<Record<number, {
    messages: ChatMessage[];
    userInput: string;
    questionIndex: number;
    isCurrentStepComplete: boolean;
    isTyping: boolean;
    isDrawerOpen: boolean;
    hasUnreadChanges: boolean;
    apiDraft: string;
  }>>({});
  const prevStepRef = useRef<number | null>(null);

  const currentStepConfig = conversationSteps[activeStep];
  const panelRenderer = currentStepConfig?.panel;
  const currentField = currentStepConfig?.fields?.[questionIndex]?.field;
  const fieldApiConfig = currentField ? fieldApiConfigs?.[currentField] : undefined;
  const isProfileStep = activeStep === 0 && currentField === 'name';
  const isApiStep =
    Boolean(fieldApiConfig) ||
    isProfileStep ||
    currentField === 'education' ||
    currentField === 'workExperience' ||
    currentField === 'coreCompetencies' ||
    currentField === 'certifications';

  useEffect(() => {
    if (prevStepRef.current === activeStep) {
      return;
    }

    if (prevStepRef.current !== null) {
      stepStateRef.current[prevStepRef.current] = {
        messages,
        userInput,
        questionIndex,
        isCurrentStepComplete,
        isTyping,
        isDrawerOpen,
        hasUnreadChanges,
        apiDraft,
      };
    }

    const savedState = stepStateRef.current[activeStep];
    if (savedState) {
      setMessages(savedState.messages);
      setUserInput(savedState.userInput);
      setQuestionIndex(savedState.questionIndex);
      setIsCurrentStepComplete(savedState.isCurrentStepComplete);
      setIsTyping(savedState.isTyping);
      setIsDrawerOpen(savedState.isDrawerOpen);
      setHasUnreadChanges(savedState.hasUnreadChanges);
      setApiDraft(savedState.apiDraft);
      setPendingIntro(null);
      prevStepRef.current = activeStep;
      return;
    }

    setQuestionIndex(0);
    setIsCurrentStepComplete(false);
    setApiDraft('');
    if (currentStepConfig && currentStepConfig.fields.length > 0) {
      setMessages([]);
      setIsTyping(true);
      setPendingIntro(currentStepConfig.fields[0].question);
    }
    prevStepRef.current = activeStep;
  }, [activeStep, currentStepConfig]);

  useEffect(() => {
    if (!pendingIntro) return;
    const timer = setTimeout(() => {
      setMessages([{ id: 0, sender: 'ai', text: pendingIntro }]);
      setIsTyping(false);
      setPendingIntro(null);
    }, 800);
    return () => clearTimeout(timer);
  }, [pendingIntro]);

  useEffect(() => {
    if (isApiStep) {
      setApiDraft('');
    }
  }, [currentField, isApiStep]);

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
    const scrollTimer = setTimeout(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text: userInput };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput('');
    setIsTyping(true);

    if (isApiStep) {
      if (fieldApiConfig && currentField) {
        const summaryField = fieldApiConfig.summaryField ?? currentField;
        const currentSummary = String(data?.[summaryField] ?? '');
        const body = fieldApiConfig.buildBody
          ? fieldApiConfig.buildBody({ userInput, currentSummary, data })
          : { userInput, currentSummary };

        try {
          const res = await fetch(fieldApiConfig.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.message ?? 'AI 응답 생성에 실패했습니다.');
          }

          const responseData = await res.json();
          const nextQuestion = String(responseData?.nextQuestion ?? '추가 정보를 알려주세요.').trim();
          const summary = String(responseData?.summary ?? '').trim();
          const finalDraft = String(responseData?.finalDraft ?? '').trim();
          const isComplete = Boolean(responseData?.isComplete);

          if (summary.length > 0 || finalDraft.length > 0) {
            let hasDiff = false;
            setData((prev) => {
              const next = { ...prev };
              if (summary.length > 0) {
                hasDiff = summary !== String(prev?.[summaryField] ?? '') || hasDiff;
                next[summaryField] = summary as T[keyof T];
              }
              if (finalDraft.length > 0 && currentField) {
                hasDiff = finalDraft !== String(prev?.[currentField] ?? '') || hasDiff;
                next[currentField] = finalDraft as T[keyof T];
              }
              return next;
            });
            if (hasDiff) {
              setHasUnreadChanges(true);
            }
          }

          if (isComplete) {
            setIsCurrentStepComplete(true);
            onStepComplete();
            setIsDrawerOpen(true);
          }

          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, sender: 'ai', text: nextQuestion },
          ]);
        } catch (e: any) {
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, sender: 'ai', text: e?.message ?? '응답 처리 중 문제가 발생했습니다.' },
          ]);
        } finally {
          setIsTyping(false);
        }
        return;
      }

      const combinedInput = apiDraft ? `${apiDraft}\n${userInput}` : userInput;
      setApiDraft(combinedInput);
      try {
        const endpoint = isProfileStep
          ? '/api/recommend/profile'
          : currentField === 'education'
            ? '/api/recommend/education'
            : currentField === 'workExperience'
              ? '/api/recommend/career'
              : currentField === 'coreCompetencies'
                ? '/api/recommend/activity'
                : '/api/recommend/certification';
        const body = isProfileStep
          ? { description: combinedInput }
          : currentField === 'education'
            ? { description: combinedInput }
            : { userInput: combinedInput };
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message ?? 'AI 응답 생성에 실패했습니다.');
        }

        const data = await res.json();
        const missingInfo = String(data?.missingInfo ?? '');
        const isComplete =
          typeof data?.isComplete === 'boolean'
            ? data.isComplete
            : missingInfo.trim().length === 0;

        if (isProfileStep) {
          const profileUpdate = {
            name: String(data?.name ?? ''),
            englishName: String(data?.englishName ?? ''),
            dateOfBirth: String(data?.dateOfBirth ?? ''),
            email: String(data?.email ?? ''),
            phoneNumber: String(data?.phoneNumber ?? ''),
            emergencyContact: String(data?.emergencyContact ?? ''),
            address: String(data?.address ?? ''),
            desiredJob: String(data?.desiredJob ?? ''),
          };
          let hasDiff = false;
          setData((prev) => {
            hasDiff = (Object.keys(profileUpdate) as Array<keyof typeof profileUpdate>).some(
              (key) => profileUpdate[key].trim().length > 0 && profileUpdate[key] !== String(prev[key] ?? '')
            );
            return { ...prev, ...profileUpdate };
          });
          if (hasDiff) {
            setHasUnreadChanges(true);
          }
        } else {
          const fullDescription = String(data?.fullDescription ?? '');
          if (fullDescription.trim().length > 0) {
            let hasDiff = false;
            setData((prev) => {
              hasDiff = fullDescription !== String(prev[currentField] ?? '');
              return { ...prev, [currentField]: fullDescription };
            });
            if (hasDiff) {
              setHasUnreadChanges(true);
            }
          }
        }

        if (isComplete) {
          if (currentField === 'coreCompetencies' && currentStepConfig.fields[questionIndex + 1]) {
            const nextQuestion = currentStepConfig.fields[questionIndex + 1].question;
            setQuestionIndex(questionIndex + 1);
            setApiDraft('');
            setMessages((prev) => [
              ...prev,
              { id: Date.now() + 1, sender: 'ai', text: nextQuestion },
            ]);
          } else {
            const wasComplete = isCurrentStepComplete;
            setIsCurrentStepComplete(true);
            onStepComplete();
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 1,
                sender: 'ai',
                text: `'${currentStepConfig.title}' 작성이 완료되었습니다. 추가로 수정하거나 보완할 내용이 있으면 계속 입력해주세요.`,
              },
            ]);
            setIsDrawerOpen(true);
          }
        } else {
          const nextQuestion = missingInfo.trim().length > 0 ? missingInfo : '추가 정보를 알려주세요.';
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, sender: 'ai', text: nextQuestion },
          ]);
        }
      } catch (e: any) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: e?.message ?? '응답 처리 중 문제가 발생했습니다.' },
        ]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    setHasUnreadChanges(true);

    const nextQuestionIndex = questionIndex + 1;

    setTimeout(() => {
      setIsTyping(false);

        if (nextQuestionIndex < currentStepConfig.fields.length) {
          setQuestionIndex(nextQuestionIndex);
          const nextQuestion = currentStepConfig.fields[nextQuestionIndex].question;
          setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: nextQuestion }]);
        } else {
          const wasComplete = isCurrentStepComplete;
          setIsCurrentStepComplete(true);
          onStepComplete();
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'ai',
              text: `'${currentStepConfig.title}' 작성이 완료되었습니다. 추가로 수정하거나 보완할 내용이 있으면 계속 입력해주세요.`,
            },
          ]);
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
              overflow: 'hidden',
            }}
          >
            <MessageList
              messages={messages}
              isTyping={isTyping}
              messageListRef={messageListRef}
              chatEndRef={chatEndRef}
            />
          </motion.div>
        </AnimatePresence>

        <ChatInputBar
          userInput={userInput}
          onChange={setUserInput}
          onSend={handleSendMessage}
          isTyping={isTyping}
          inputRef={inputRef}
        />
      </Box>

      <PreviewFab
        isOpen={isDrawerOpen}
        hasUnreadChanges={hasUnreadChanges}
        messageCount={messages.length}
        onOpen={toggleDrawer(true)}
      />

      <PreviewDrawer
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        title="입력 정보 확인"
        subtitle="AI와 대화한 내용이 실시간으로 정리됩니다."
      >
        {panelRenderer ? panelRenderer(data) : null}
      </PreviewDrawer>
    </Box>
  );
};

export default AIChatView;
