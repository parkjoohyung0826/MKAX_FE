'use client';

import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Box, Button } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { AnimatePresence, motion } from 'framer-motion';
import MessageList from './ai-chat/MessageList';
import ChatInputBar from './ai-chat/ChatInputBar';
import PreviewFab from './ai-chat/PreviewFab';
import PreviewDrawer from './ai-chat/PreviewDrawer';
import { ChatMessage } from './ai-chat/types';
import { resumeApiByMode } from '@/shared/constants/careerModeApi';

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
  onFieldComplete?: (field: keyof T) => void;
  onFieldsReset?: (fields: Array<keyof T>) => void;
  onResetChat?: (args?: { section?: string; sections?: string[] }) => void | Promise<void>;
  hideResetButton?: boolean;
  resetSectionMap?: Partial<Record<keyof T, string>>;
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  conversationSteps: ConversationStep<T>[];
  fieldApiConfigs?: Partial<Record<keyof T, FieldApiConfig<T>>>;
  resumeType?: 'basic' | 'senior';
}

type FieldApiConfig<T> = {
  endpoint: string;
  summaryField?: keyof T;
  resetSection?: string;
  buildBody?: (args: { userInput: string; currentSummary: string; data: T }) => Record<string, unknown>;
};

type SectionState = {
  draftInput: string;
  items: string[];
  followUpQuestion: string;
};

type SectionFinalizeDecision = 'move' | 'stay' | 'unknown';

type StepFieldConfig<T> = ConversationStep<T>['fields'][number];

type StepViewState = {
  messages: ChatMessage[];
  userInput: string;
  questionIndex: number;
  isCurrentStepComplete: boolean;
  isTyping: boolean;
  isDrawerOpen: boolean;
  hasUnreadChanges: boolean;
};

const normalizeDateInputValue = (raw: unknown): string => {
  const text = String(raw ?? '').trim();
  if (!text) return '';

  const directIso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (directIso) return text;

  const compact = text.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compact) return `${compact[1]}-${compact[2]}-${compact[3]}`;

  const dottedOrSlashed = text.match(/^(\d{4})[./년\s-]+(\d{1,2})[./월\s-]+(\d{1,2})/);
  if (dottedOrSlashed) {
    const year = dottedOrSlashed[1];
    const month = dottedOrSlashed[2].padStart(2, '0');
    const day = dottedOrSlashed[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return text;
};

const parseSectionFinalizeDecision = (raw: string): SectionFinalizeDecision => {
  const normalized = raw.replace(/\s+/g, '').toLowerCase();
  const moveKeywords = ['다음', '넘어가', '없음', '없어요', '없습니다', '끝', '마침', '그만'];

  if (moveKeywords.some((keyword) => normalized.includes(keyword))) return 'move';
  return 'stay';
};

const createAiMessage = (text: string): ChatMessage => ({
  id: Date.now() + 1,
  sender: 'ai',
  text,
});

async function requestAiJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as { message?: string }));
    throw new Error(err?.message ?? 'AI 응답 생성에 실패했습니다.');
  }
  return res.json() as Promise<T>;
}

function getResumeRecommendationRequest<T extends Record<string, any>>(args: {
  isProfileStep: boolean;
  currentField?: keyof T;
  resumeType: 'basic' | 'senior';
  userInput: string;
}) {
  const { isProfileStep, currentField, resumeType, userInput } = args;

  const endpoint = isProfileStep
    ? '/api/recommend/profile'
    : currentField === 'education'
      ? '/api/recommend/education'
      : currentField === 'workExperience'
        ? '/api/recommend/career'
        : currentField === 'coreCompetencies'
          ? resumeApiByMode[resumeType].activity
          : resumeApiByMode[resumeType].certification;

  const body =
    isProfileStep || currentField === 'education' ? { description: userInput } : { userInput };

  return { endpoint, body };
}

function buildResetPlan<T extends Record<string, any>>(args: {
  fields: StepFieldConfig<T>[];
  fieldApiConfigs?: Partial<Record<keyof T, FieldApiConfig<T>>>;
  resetSectionMap?: Partial<Record<keyof T, string>>;
}) {
  const { fields, fieldApiConfigs, resetSectionMap } = args;
  const resetSections = new Set<string>();
  const resetFields: Array<keyof T> = [];
  const updates: Partial<T> = {};

  fields.forEach(({ field }) => {
    const apiConfig = fieldApiConfigs?.[field];
    const summaryField = apiConfig?.summaryField ?? field;
    const resetSection = apiConfig?.resetSection ?? resetSectionMap?.[field];

    if (resetSection) {
      resetSections.add(resetSection);
    }

    resetFields.push(field);
    updates[summaryField] = '' as T[keyof T];
    updates[field] = '' as T[keyof T];
  });

  return {
    resetSections: Array.from(resetSections),
    resetFields,
    updates,
  };
}

export interface AIChatViewHandle {
  resetCurrentStep: () => void;
}

const AIChatView = React.forwardRef(function AIChatView<T extends Record<string, any>>(
  {
  activeStep,
  steps,
  onStepComplete,
  onFieldComplete,
  onFieldsReset,
  onResetChat,
  hideResetButton,
  resetSectionMap,
  data,
  setData,
  conversationSteps,
  fieldApiConfigs,
  resumeType = 'basic',
}: AIChatViewProps<T>,
  ref: React.Ref<AIChatViewHandle>
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isCurrentStepComplete, setIsCurrentStepComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasUnreadChanges, setHasUnreadChanges] = useState(false);
  const [pendingIntro, setPendingIntro] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const sectionStateRef = useRef<Partial<Record<keyof T, SectionState>>>({});
  const sectionFinalizePendingRef = useRef<Partial<Record<keyof T, boolean>>>({});
  const stepStateRef = useRef<Record<number, StepViewState>>({});
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
      setPendingIntro(null);
      prevStepRef.current = activeStep;
      return;
    }

    setQuestionIndex(0);
    setIsCurrentStepComplete(false);
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

  const appendAiText = (text: string) => {
    setMessages((prev) => [...prev, createAiMessage(text)]);
  };

  const appendAiError = (error: unknown) => {
    appendAiText(error instanceof Error ? error.message : '응답 처리 중 문제가 발생했습니다.');
  };

  const moveToNextQuestion = () => {
    if (!currentStepConfig?.fields?.[questionIndex + 1]) return false;
    const nextQuestion = currentStepConfig.fields[questionIndex + 1].question;
    setQuestionIndex(questionIndex + 1);
    appendAiText(nextQuestion);
    return true;
  };

  const getSectionState = (field: keyof T): SectionState => {
    const saved = sectionStateRef.current[field];
    if (saved) return saved;
    const raw = String(data?.[field] ?? '').trim();
    const items =
      raw.length > 0 ? raw.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean) : [];
    const nextState: SectionState = {
      draftInput: '',
      items,
      followUpQuestion: '',
    };
    sectionStateRef.current[field] = nextState;
    return nextState;
  };

  const completeCurrentStep = (message: string) => {
    setIsCurrentStepComplete(true);
    onStepComplete();
    appendAiText(message);
    setIsDrawerOpen(true);
  };

  const handleConfiguredFieldApiStep = async (inputText: string) => {
    if (!fieldApiConfig || !currentField) return;

    const summaryField = fieldApiConfig.summaryField ?? currentField;
    const currentSummary = String(data?.[summaryField] ?? '');
    const body = fieldApiConfig.buildBody
      ? fieldApiConfig.buildBody({ userInput: inputText, currentSummary, data })
      : { userInput: inputText, currentSummary };

    if (fieldApiConfig.endpoint.startsWith('/api/cover-letter/')) {
      console.info('[cover-letter chat] sending request with cookies', {
        endpoint: fieldApiConfig.endpoint,
        credentials: 'include',
        hasDocumentCookie: typeof document !== 'undefined' && Boolean(document.cookie),
      });
    }

    try {
      const res = await fetch(fieldApiConfig.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const responseData = await requestAiJson<any>(res);
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
        onFieldComplete?.(currentField);
        setIsCurrentStepComplete(true);
        onStepComplete();
        setIsDrawerOpen(true);
      }

      appendAiText(nextQuestion);
    } catch (error) {
      appendAiError(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRecommendationApiStep = async (inputText: string) => {
    const sectionState = currentField ? getSectionState(currentField) : null;
    if (sectionState) {
      sectionState.draftInput = sectionState.draftInput
        ? `${sectionState.draftInput}\n${inputText}`
        : inputText;
    }

    try {
      const { endpoint, body } = getResumeRecommendationRequest<T>({
        isProfileStep,
        currentField,
        resumeType,
        userInput: inputText,
      });
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const responseData = await requestAiJson<any>(res);
      const missingInfo = String(responseData?.missingInfo ?? '');
      const isComplete =
        typeof responseData?.isComplete === 'boolean'
          ? responseData.isComplete
          : missingInfo.trim().length === 0;

      if (isProfileStep) {
        const profileUpdate = {
          name: String(responseData?.name ?? ''),
          englishName: String(responseData?.englishName ?? ''),
          dateOfBirth: normalizeDateInputValue(responseData?.dateOfBirth),
          email: String(responseData?.email ?? ''),
          phoneNumber: String(responseData?.phoneNumber ?? ''),
          emergencyContact: String(responseData?.emergencyContact ?? ''),
          address: String(responseData?.address ?? ''),
          desiredJob: String(responseData?.desiredJob ?? ''),
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
        const fullDescription = String(responseData?.fullDescription ?? '').trim();
        if (currentField && sectionState) {
          if (isComplete) {
            const finalizedItem =
              fullDescription.length > 0 ? fullDescription : sectionState.draftInput.trim();

            if (finalizedItem.length > 0) {
              sectionState.items = [...sectionState.items, finalizedItem];
            }
            sectionState.draftInput = '';
            sectionState.followUpQuestion = '추가 항목이 있으면 이어서 입력해주세요.';

            let hasDiff = false;
            setData((prev) => {
              const joinedValue = sectionState.items.join('\n\n');
              hasDiff = joinedValue !== String(prev[currentField] ?? '');
              return { ...prev, [currentField]: joinedValue };
            });
            if (hasDiff) {
              setHasUnreadChanges(true);
            }
          } else {
            sectionState.draftInput =
              fullDescription.length > 0 ? fullDescription : sectionState.draftInput;

            const previewItems =
              sectionState.draftInput.trim().length > 0
                ? [...sectionState.items, sectionState.draftInput.trim()]
                : [...sectionState.items];
            let hasDiff = false;
            setData((prev) => {
              const joinedValue = previewItems.join('\n\n');
              hasDiff = joinedValue !== String(prev[currentField] ?? '');
              return { ...prev, [currentField]: joinedValue };
            });
            if (hasDiff) {
              setHasUnreadChanges(true);
            }
          }
        }
      }

      if (isComplete) {
        if (currentField) {
          onFieldComplete?.(currentField);
        }
        if (currentField === 'coreCompetencies' && currentStepConfig?.fields[questionIndex + 1]) {
          sectionFinalizePendingRef.current[currentField] = true;
          appendAiText(
            "현재 항목을 저장했어요. 추가 내용이 있으면 이어서 입력해주세요. 없으면 '다음'이라고 입력하면 다음 항목 작성으로 넘어갈게요."
          );
        } else if (currentStepConfig) {
          completeCurrentStep(`'${currentStepConfig.title}' 작성이 완료되었습니다. 추가 항목이 있으면 이어서 입력해주세요.`);
        }
      } else {
        const nextQuestion = missingInfo.trim().length > 0 ? missingInfo : '추가 정보를 알려주세요.';
        if (currentField && sectionState) {
          sectionState.followUpQuestion = nextQuestion;
        }
        appendAiText(nextQuestion);
      }
    } catch (error) {
      appendAiError(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePlainStepProgression = () => {
    setHasUnreadChanges(true);

    const nextQuestionIndex = questionIndex + 1;

    setTimeout(() => {
      setIsTyping(false);

      if (!currentStepConfig) return;

      if (nextQuestionIndex < currentStepConfig.fields.length) {
        setQuestionIndex(nextQuestionIndex);
        appendAiText(currentStepConfig.fields[nextQuestionIndex].question);
      } else {
        completeCurrentStep(
          `'${currentStepConfig.title}' 작성이 완료되었습니다. 추가로 수정하거나 보완할 내용이 있으면 계속 입력해주세요.`
        );
      }
    }, 1000);
  };

  const handleSendMessage = async () => {
    const inputText = userInput;
    if (!inputText.trim()) return;

    const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text: inputText };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput('');
    setIsTyping(true);

    if (currentField === 'coreCompetencies' && sectionFinalizePendingRef.current[currentField]) {
      const decision = parseSectionFinalizeDecision(inputText);
      if (decision === 'move') {
        sectionFinalizePendingRef.current[currentField] = false;
        setTimeout(() => {
          moveToNextQuestion();
          setIsTyping(false);
        }, 2000);
        return;
      }
      sectionFinalizePendingRef.current[currentField] = false;
    }

    if (isApiStep) {
      if (fieldApiConfig && currentField) {
        await handleConfiguredFieldApiStep(inputText);
        return;
      }
      await handleRecommendationApiStep(inputText);
      return;
    }

    handlePlainStepProgression();
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
    if (newOpen) {
      setHasUnreadChanges(false);
    }
  };

  const resetCurrentStepState = () => {
    delete stepStateRef.current[activeStep];
    setMessages([]);
    setUserInput('');
    setQuestionIndex(0);
    setIsCurrentStepComplete(false);
    setIsTyping(true);
    setIsDrawerOpen(false);
    setHasUnreadChanges(false);
    setPendingIntro(currentStepConfig?.fields?.[0]?.question ?? null);
  };

  const handleResetChat = async () => {
    const stepFields = currentStepConfig?.fields ?? [];
    const { resetSections, resetFields, updates } = buildResetPlan<T>({
      fields: stepFields,
      fieldApiConfigs,
      resetSectionMap,
    });

    try {
      if (resetSections.length > 1) {
        await onResetChat?.({ sections: resetSections });
      } else {
        const [section] = resetSections;
        await onResetChat?.(section ? { section } : undefined);
      }
    } finally {
      if (stepFields.length) {
        stepFields.forEach(({ field }) => {
          sectionStateRef.current[field] = undefined;
          sectionFinalizePendingRef.current[field] = false;
        });
        setData((prev) => ({
          ...prev,
          ...updates,
        }));
        onFieldsReset?.(resetFields);
      }
      resetCurrentStepState();
    }
  };

  useImperativeHandle(ref, () => ({
    resetCurrentStep: () => {
      void handleResetChat();
    },
  }));

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', p: 0, position: 'relative' }}>
      <Box sx={mainContainerSx}>
        {onResetChat && !hideResetButton && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              pr: 1, 
            }}
          >
            <Button
              onClick={handleResetChat}
              startIcon={<RefreshRoundedIcon sx={{ fontSize: '1.1rem' }} />} 
              size="small"
              sx={{
                color: 'text.secondary', 
                fontSize: '0.8rem',
                fontWeight: 500,
                textTransform: 'none', 
                borderRadius: '20px',
                bgcolor: 'action.hover', 
                px: 2,
                py: 0.5,
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'action.selected',
                  color: 'error.main', 
                  borderColor: 'error.light',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                },
              }}
            >
              처음부터 다시 쓰기
            </Button>
          </Box>
        )}
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
});

export default AIChatView;
