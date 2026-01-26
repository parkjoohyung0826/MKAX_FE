'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import ConversationalAssistant from '@/shared/components/ConversationalAssistant';

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
      boxShadow: '0 8px 20px rgba(37, 99, 235, 0.15)',
      '& fieldset': { borderColor: '#2563EB', borderWidth: '1px' }
    }
  },
  '& .MuiInputLabel-root': { color: '#64748b' }
};

const aiButtonSx = {
  color: '#2563EB',
  fontWeight: 700,
  textTransform: 'none',
  bgcolor: 'rgba(37, 99, 235, 0.1)',
  borderRadius: '20px',
  px: 2,
  py: 0.5,
  fontSize: '0.85rem',
  '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.2)' }
};

type ResumeAssistantTextSectionProps = {
  sectionTitle: string;
  sectionHint?: string;
  icon: React.ReactNode;
  assistantTitle: string;
  assistantPrompt: string;
  onAssistantSubmit: (text: string) => Promise<void>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  rows: number;
  name: string;
  placeholder: string;
  buttonLabel?: string;
};

const ResumeAssistantTextSection = ({
  sectionTitle,
  sectionHint,
  icon,
  assistantTitle,
  assistantPrompt,
  onAssistantSubmit,
  value,
  onChange,
  rows,
  name,
  placeholder,
  buttonLabel = 'AI 작성 도우미',
}: ResumeAssistantTextSectionProps) => {
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  const handleOpenAssistant = () => setAssistantOpen(true);
  const handleCloseAssistant = () => setAssistantOpen(false);

  const handleAssistantSubmit = async (text: string): Promise<void> => {
    await onAssistantSubmit(text);
    handleCloseAssistant();
  };

  return (
    <Box>
      <ConversationalAssistant
        open={isAssistantOpen}
        onClose={handleCloseAssistant}
        onSubmit={handleAssistantSubmit}
        title={assistantTitle}
        prompt={assistantPrompt}
      />

      <Box display="flex" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1.5, px: 1 }}>
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={sectionHint ? 0.5 : 0}>
            {icon}
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
              {sectionTitle}
            </Typography>
          </Box>
          {sectionHint ? (
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', ml: 3.5 }}>
              {sectionHint}
            </Typography>
          ) : null}
        </Box>
        <Button size="small" onClick={handleOpenAssistant} startIcon={<AutoAwesome />} sx={aiButtonSx}>
          {buttonLabel}
        </Button>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={rows}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        variant="outlined"
        sx={glassInputSx}
      />
    </Box>
  );
};

export default ResumeAssistantTextSection;
