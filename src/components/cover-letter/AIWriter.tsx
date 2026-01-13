// src/components/cover-letter/AIWriter.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';

interface AIWriterProps {
  section: string;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const AIWriter = ({ section, onGenerate, isGenerating }: AIWriterProps) => {
  const [prompt, setPrompt] = useState('');

  const handleGenerateClick = () => {
    onGenerate(prompt);
  };

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        label="AI에게 요청할 내용을 입력하세요"
        placeholder={`예: ${section}에 들어갈 내용을 100자 내외로 작성해줘.`}
        sx={{ mb: 2 }}
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleGenerateClick}
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating ? <CircularProgress size={24} /> : '생성하기'}
      </Button>
    </Box>
  );
};

export default AIWriter;
