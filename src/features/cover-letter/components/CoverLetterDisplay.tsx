/** @jsxImportSource @emotion/react */
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { css } from '@emotion/react';
import { useCoverLetterStore } from '../store';
import { CoverLetterData } from '../types'; 
import { getCoverLetterCareerTypeCopy } from '../careerTypeCopy';

// --- 스타일 정의 ---
const tableContainerStyle = css`
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  width: 100%;
  box-sizing: border-box;
`;

const rowStyle = css`
  display: flex;
  width: 100%;
  border-bottom: 1px solid black;
  &:last-child {
    border-bottom: none;
  }
  /* A4 용지 높이(약 297mm)를 고려하여 각 행의 최소 높이 설정 */
  min-height: 200px; 
`;

const labelCellStyle = css`
  width: 130px; /* 라벨 영역 너비 고정 */
  background-color: #f3f4f6; /* 연한 회색 배경 */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  padding: 10px;
  border-right: 1px dotted #b0b0b0; /* 사진과 동일한 점선 구분선 */
  flex-shrink: 0;
  white-space: pre-line; /* 줄바꿈 허용 */
  line-height: 1.4;
`;

const contentCellStyle = css`
  flex-grow: 1;
  padding: 16px;
  font-size: 0.95rem;
  line-height: 1.8;
  white-space: pre-wrap; /* 줄바꿈 및 공백 유지 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 텍스트 상단 정렬 */
`;

interface Props {
  resumeName: string;
  data?: CoverLetterData;
}

const CoverLetterDisplay = React.forwardRef<HTMLDivElement, Props>(({ resumeName, data }, ref) => {
  const { coverLetterData, selectedCareerType } = useCoverLetterStore();
  const displayData = data ?? coverLetterData;
  const copy = getCoverLetterCareerTypeCopy(selectedCareerType);

  const normalizeContent = (value: unknown) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (value && typeof value === 'object') {
      const maybe = value as { finalDraft?: string; summary?: string };
      if (typeof maybe.finalDraft === 'string') return maybe.finalDraft;
      if (typeof maybe.summary === 'string') return maybe.summary;
    }
    return '';
  };

  const sections = [
    { label: copy.sections.growthProcess.classicDisplayLabel, key: 'growthProcess' as keyof CoverLetterData },
    { label: copy.sections.strengthsAndWeaknesses.classicDisplayLabel, key: 'strengthsAndWeaknesses' as keyof CoverLetterData },
    { label: copy.sections.keyExperience.classicDisplayLabel, key: 'keyExperience' as keyof CoverLetterData },
    { label: copy.sections.motivation.classicDisplayLabel, key: 'motivation' as keyof CoverLetterData },
  ];

  return (
    <Paper
      ref={ref}
      elevation={3}
      sx={{
        width: '210mm',
        minHeight: '297mm',
        p: '15mm',
        bgcolor: 'white',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
      <Box>
        {/* 헤더 영역 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {/* 다이아몬드 불릿 아이콘 */}
            <Box sx={{ 
                width: 8, 
                height: 8, 
                bgcolor: 'black', 
                transform: 'rotate(45deg)', 
                mr: 1.5,
                mb: 0.5 
            }} />
            <Typography variant="h5" fontWeight={800} color="black">
            자기 소개서
            </Typography>
        </Box>

        {/* 테이블 영역 */}
        <div css={tableContainerStyle}>
          {sections.map((section, index) => (
            <div css={rowStyle} key={index}>
              {/* 왼쪽 라벨 */}
              <div css={labelCellStyle}>
                {section.label}
              </div>
              {/* 오른쪽 내용 */}
              <div css={contentCellStyle}>
                
                {normalizeContent(displayData[section.key])}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 서명 영역 (필요한 경우 표시, 사진에는 없었으나 이전 코드 유지) */}
        {/* 사진과 똑같이 하기 위해 내용이 없으면 이 부분은 주석 처리하거나 제거해도 됩니다. */}
        {/* <Box sx={{ mt: 8, textAlign: 'right' }}>
            <Typography variant="body1" sx={{ mt: 2 }}>2026년  01월  12일</Typography>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>
              지원자 : {resumeName} (인)
            </Typography>
        </Box> 
        */}
      </Box>
    </Paper>
  );
});

CoverLetterDisplay.displayName = 'CoverLetterDisplay';

export default CoverLetterDisplay;
