'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  useMediaQuery,
} from '@mui/material';
import { AutoAwesome, HelpOutline } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import CustomModal from '@/shared/components/CustomModal';
import ConversationalAssistant from '@/shared/components/ConversationalAssistant';
import WritingGuide from '../cover-letter/WritingGuide';
import { CoverLetterData } from '../../types';
import { useCoverLetterStore } from '../../store';
import { coverLetterSectionOrder, getCoverLetterCareerTypeCopy } from '../../careerTypeCopy';
import { coverLetterDraftApi, toCareerMode } from '@/shared/constants/careerModeApi';

/* ================= 스타일 ================= */

const glassSectionSx = {
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: '24px',
  p: 4,
  pb: 2,
  mb: 3,
  border: '1px solid rgba(255, 255, 255, 0.6)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
  },
};

const glassInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    padding: '16px',
    transition: 'all 0.3s ease',
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': { borderColor: 'rgba(37, 99, 235, 0.3)' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 8px 20px rgba(37, 99, 235, 0.1)',
      '& fieldset': { borderColor: '#2563EB', borderWidth: '1px' },
    },
  },
  '& .MuiInputBase-input': {
    lineHeight: 1.6,
    color: '#334155',
  },
};

const actionButtonSx = {
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 700,
  px: 2,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
};

/* ================= 문항 정의 ================= */

/* ================= section → backend enum ================= */

const SECTION_TO_BACKEND: Record<string, string> = {
  growthProcess: 'GROWTH_PROCESS',
  strengthsAndWeaknesses: 'PERSONALITY',
  keyExperience: 'CAREER_STRENGTH',
  motivation: 'MOTIVATION_ASPIRATION',
};

/* ================= Props ================= */

interface Props {
  activeStep: number;
  isGenerating: boolean;
}

/* ================= Component ================= */

const CoverLetterDirectInputStep = ({ activeStep }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { coverLetterData, setCoverLetterData, selectedCareerType } = useCoverLetterStore();
  const [isGuideModalOpen, setGuideModalOpen] = useState(false);
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const mode = toCareerMode(selectedCareerType);
  const copy = getCoverLetterCareerTypeCopy(selectedCareerType);
  const coverLetterSections = coverLetterSectionOrder.map((sectionId) => ({
    id: sectionId,
    label: copy.sections[sectionId].directLabel,
    rows: 8,
    desc: copy.sections[sectionId].directDescription,
  }));

  const section = coverLetterSections[activeStep];
  if (!section) return null;
  const selectedSectionInfo = coverLetterSections.find((item) => item.id === selectedSection);
  const getSectionCharCount = (sectionId: string) => {
    const value = coverLetterData[sectionId as keyof CoverLetterData];
    return value ? value.length : 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCoverLetterData({ [name]: value });
  };

  /* ---------- 가이드 ---------- */
  const handleGuideClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    setGuideModalOpen(true);
  };

  /* ---------- AI 초안 ---------- */
  const handleAIWriteClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    setAIModalOpen(true);
  };

  const handleAIGenerate = async (
    prompt: string
  ): Promise<{ missingInfo?: string; isComplete?: boolean }> => {
    try {
      const backendSection = SECTION_TO_BACKEND[selectedSection];
      if (!backendSection) {
        throw new Error('유효하지 않은 자기소개서 문항입니다.');
      }

      setIsGenerating(true);

      const res = await fetch(coverLetterDraftApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: backendSection,
          userInput: prompt,
          mode,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message ?? 'AI 초안 생성에 실패했습니다.');
      }

      const missingInfo = String(data?.missingInfo ?? '');
      const isComplete =
        typeof data?.isComplete === 'boolean'
          ? data.isComplete
          : missingInfo.trim().length === 0;
      const fullDescription = String(data?.fullDescription ?? '');

      if (isComplete && fullDescription.trim().length > 0) {
        setCoverLetterData({
          [selectedSection]: fullDescription,
        });
        setAIModalOpen(false);
        setToastMessage('AI 작성이 완료되었습니다.');
        setToastSeverity('success');
        setToastOpen(true);
      }

      return { missingInfo, isComplete };
    } catch (e: any) {
      console.error(e);
      setToastMessage('AI 작성에 실패했습니다.');
      setToastSeverity('error');
      setToastOpen(true);
      throw e;
    } finally {
      setIsGenerating(false);
    }
  };

  /* ================= Render ================= */

  return (
    <Box sx={{ py: 2, mb: -5 }}>
      <Box sx={glassSectionSx}>
        {/* 헤더 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'flex-start',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1.25 : 0,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: '#334155', mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              {section.label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              {section.desc}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} justifyContent={isMobile ? 'flex-start' : 'flex-end'} flexWrap="wrap" useFlexGap>
            <Tooltip title="작성 가이드 보기">
              <IconButton
                onClick={() => handleGuideClick(section.id)}
                sx={{
                  color: '#94a3b8',
                  width: { xs: 34, sm: 40 },
                  height: { xs: 34, sm: 40 },
                  '&:hover': {
                    color: '#2563EB',
                    bgcolor: 'rgba(37,99,235,0.05)',
                  },
                }}
              >
                <HelpOutline />
              </IconButton>
            </Tooltip>

            <Button
              size="small"
              variant="outlined"
              startIcon={<AutoAwesome />}
              onClick={() => handleAIWriteClick(section.id)}
              disabled={isGenerating}
              sx={{
                ...actionButtonSx,
                borderRadius: isMobile ? '10px' : '12px',
                px: isMobile ? 1.2 : 2,
                py: isMobile ? 0.35 : undefined,
                minHeight: isMobile ? 34 : undefined,
                fontSize: isMobile ? '0.78rem' : '0.875rem',
                whiteSpace: 'nowrap',
                '& .MuiButton-startIcon': {
                  mr: isMobile ? 0.5 : undefined,
                  '& svg': { fontSize: isMobile ? '1rem' : '1.1rem' },
                },
                borderColor: 'rgba(37, 99, 235, 0.3)',
                color: '#2563EB',
                bgcolor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: '#2563EB',
                  bgcolor: 'rgba(37, 99, 235, 0.05)',
                },
              }}
            >
              {isMobile ? 'AI 초안' : 'AI 초안 작성'}
            </Button>
          </Stack>
        </Box>

        {/* 입력 */}
        <TextField
          fullWidth
          multiline
          minRows={section.rows}
          name={section.id}
          value={coverLetterData[section.id as keyof CoverLetterData]}
          onChange={handleChange}
          placeholder={`${section.label} 내용을 입력하세요.`}
          disabled={isGenerating}
          sx={glassInputSx}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            {getSectionCharCount(section.id)}자
          </Typography>
        </Box>
      </Box>

      {/* 작성 가이드 모달 */}
  <CustomModal
        open={isGuideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        title="작성 가이드"
      >
        <WritingGuide section={selectedSection} />
      </CustomModal>

      <ConversationalAssistant
        open={isAIModalOpen}
        onClose={() => setAIModalOpen(false)}
        onSubmit={handleAIGenerate}
        title={selectedSectionInfo ? `${selectedSectionInfo.label} AI 초안 작성` : 'AI 초안 작성'}
        prompt={
          selectedSectionInfo
            ? `${selectedSectionInfo.label} 항목에 대해 강조하고 싶은 경험이나 성과를 입력해주세요.`
            : 'AI에게 도움받고 싶은 내용을 입력해주세요.'
        }
      />

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
    </Box>
  );
};

export default CoverLetterDirectInputStep;
