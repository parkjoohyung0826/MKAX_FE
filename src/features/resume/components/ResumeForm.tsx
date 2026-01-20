/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { Box, Typography, InputBase, useTheme } from '@mui/material';
import { css } from '@emotion/react';

// --- 스타일 정의 (GenerationResult.tsx와 포맷 통일) ---
const borderColor = '#000'; // 선명한 검은색 테두리
const headerBg = '#e9ecef'; // 헤더 배경색

// 테이블 컨테이너 스타일
const tableContainerStyle = css`
  border: 2px solid ${borderColor}; // 외곽선은 조금 더 두껍게
  margin-bottom: 24px;
  background-color: #fff;
  box-sizing: border-box;
`;

// 행(Row) 스타일
const rowStyle = css`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${borderColor};
  &:last-child {
    border-bottom: none;
  }
`;

// 셀(Cell) 스타일
const cellStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${borderColor};
  padding: 8px;
  min-height: 45px;
  font-size: 0.95rem;
  box-sizing: border-box;
  color: #000; // 글자색 검정
  
  &.header {
    background-color: ${headerBg};
    font-weight: 700;
    justify-content: center;
    text-align: center;
    word-break: keep-all;
  }

  &.data {
    background-color: #fff;
    justify-content: flex-start;
    padding-left: 12px;
    font-weight: 500;
  }

  &.no-border-right {
    border-right: none;
  }

  &.center {
    justify-content: center;
    text-align: center;
    padding-left: 8px;
  }
`;

// 4. 사진 영역 스타일 (인라인에서 분리함)
const photoAreaStyle = css`
  width: 140px;
  border-right: 1px solid ${borderColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

// 5. 인적사항 영역 스타일 (인라인에서 분리함)
const infoAreaStyle = css`
  flex-grow: 1;
`;

// 6. 연락처 레이아웃 트릭 스타일 (인라인에서 분리함)
const contactLayoutStyle = css`
  display: flex;
  width: 100%;
`;

const inputBaseStyle = {
  width: '100%',
  fontSize: '0.9rem',
  padding: 0,
  '& input': { padding: 0, textAlign: 'center' },
};

const leftAlignInput = {
  ...inputBaseStyle,
  '& input': { textAlign: 'left' }
};

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ResumeForm = ({ formData, handleChange }: Props) => {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: '210mm', margin: '0 auto', bgcolor: 'white', p: 4, minHeight: '1000px', boxShadow: 2 }}>
      
      {/* 1. 상단 정보 (사진 + 인적사항) */}
      <div css={tableContainerStyle}>
        <div css={rowStyle}>
          {/* 사진 영역 */}
          <div css={photoAreaStyle}>
            <Typography variant="body2" color="text.secondary">사진</Typography>
          </div>

          {/* 인적사항 입력 영역 */}
          <div css={infoAreaStyle}>

            {/* Row 1: 이 름 / 영 문 */}
            <div css={rowStyle}>
              <div css={cellStyle} className="header" style={{ width: '80px' }}>이 름</div>
              <div css={cellStyle} className="input no-border-right" style={{ flexGrow: 1 }}>
                <InputBase 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  sx={inputBaseStyle} 
                  placeholder="홍길동" 
                />
              </div>
              <div css={cellStyle} className="header" style={{ width: '80px', borderLeft: `1px solid ${borderColor}` }}>영 문</div>
              <div css={cellStyle} className="input no-border-right" style={{ flexGrow: 1 }}>
                 <InputBase 
                   name="nameEng" 
                   placeholder="Hong Gil Dong" 
                   sx={inputBaseStyle} 
                 />
              </div>
            </div>

             {/* Row 2: 생년월일 / 이메일 */}
             <div css={rowStyle}>
              <div css={cellStyle} className="header" style={{ width: '80px' }}>생년월일</div>
              <div css={cellStyle} className="input no-border-right" style={{ flexGrow: 1 }}>
                <InputBase 
                  placeholder="1980.01.01" 
                  sx={inputBaseStyle} 
                />
              </div>
              <div css={cellStyle} className="header" style={{ width: '80px', borderLeft: `1px solid ${borderColor}` }}>이메일</div>
              <div css={cellStyle} className="input no-border-right" style={{ flexGrow: 1 }}>
                  <InputBase 
                    placeholder="hgd030101@naver.com" 
                    sx={inputBaseStyle} 
                  />
              </div>
            </div>

            {/* Row 3: 연락처 / 비상연락처 */}
            <div css={rowStyle}>
              <div css={cellStyle} className="header" style={{ width: '80px' }}>연락처</div>
              <div css={cellStyle} className="input no-border-right" style={{ flexGrow: 1 }}>
                <InputBase 
                  name="desiredJob" 
                  value={formData.desiredJob} 
                  onChange={handleChange} 
                  sx={leftAlignInput} 
                  placeholder="예: 010-0000-0000"
                />
              </div>
              <div css={cellStyle} className="header" style={{ width: '80px', borderLeft: `1px solid ${borderColor}` }}>비상연락처</div>
              <div css={cellStyle} className="input no-border-right" style={{ flexGrow: 1 }}>
                <InputBase 
                  sx={leftAlignInput} 
                  placeholder="예: 010-0000-0000"
                />
              </div>
            </div>

            {/* Row 4: 주 소 */}
            <div css={rowStyle}>
              <div css={cellStyle} className="header" style={{ width: '80px' }}>주 소</div>
              <div css={cellStyle} className="input no-border-right" style={{ flexGrow: 1 }}>
                <InputBase placeholder="서울시 ..." sx={leftAlignInput} />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 2. 학력사항 */}
      <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 6, height: 6, bgcolor: 'black', transform: 'rotate(45deg)', mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">학력사항</Typography>
      </Box>
      <div css={tableContainerStyle}>
        <div css={rowStyle}>
          <div css={cellStyle} className="header" style={{ width: '25%' }}>기간</div>
          <div css={cellStyle} className="header" style={{ width: '35%' }}>학교명</div>
          <div css={cellStyle} className="header" style={{ width: '25%' }}>전공</div>
          <div css={cellStyle} className="header no-border-right" style={{ width: '15%' }}>졸업여부</div>
        </div>
        {[1, 2, 3].map((i) => (
          <div css={rowStyle} key={i}>
            <div css={cellStyle} className="input" style={{ width: '25%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input" style={{ width: '35%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input" style={{ width: '25%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input no-border-right" style={{ width: '15%' }}><InputBase sx={inputBaseStyle} /></div>
          </div>
        ))}
      </div>


      {/* 3. 경력사항 */}
      <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 6, height: 6, bgcolor: 'black', transform: 'rotate(45deg)', mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">경력사항</Typography>
      </Box>
      <div css={tableContainerStyle}>
        <div css={rowStyle}>
          <div css={cellStyle} className="header" style={{ width: '20%' }}>근무날짜</div>
          <div css={cellStyle} className="header" style={{ width: '30%' }}>직장명 / 부서</div>
          <div css={cellStyle} className="header" style={{ width: '30%' }}>담당업무</div>
          <div css={cellStyle} className="header no-border-right" style={{ width: '20%' }}>퇴사사유</div>
        </div>
        {[1, 2, 3].map((i) => (
          <div css={rowStyle} key={i}>
             <div css={cellStyle} className="input" style={{ width: '20%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input" style={{ width: '30%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input" style={{ width: '30%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input no-border-right" style={{ width: '20%' }}><InputBase sx={inputBaseStyle} /></div>
          </div>
        ))}
      </div>


      {/* 4. 교육사항 / 대외활동 */}
      <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 6, height: 6, bgcolor: 'black', transform: 'rotate(45deg)', mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">교육사항 / 대외활동</Typography>
      </Box>
      <div css={tableContainerStyle}>
        <div css={rowStyle}>
          <div css={cellStyle} className="header" style={{ width: '25%' }}>활동/근무기간</div>
          <div css={cellStyle} className="header" style={{ width: '45%' }}>교육 과정</div>
          <div css={cellStyle} className="header no-border-right" style={{ width: '30%' }}>교육 기관</div>
        </div>
         {[1, 2].map((i) => (
          <div css={rowStyle} key={i}>
            <div css={cellStyle} className="input" style={{ width: '25%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input" style={{ width: '45%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input no-border-right" style={{ width: '30%' }}><InputBase sx={inputBaseStyle} /></div>
          </div>
        ))}
      </div>


      {/* 5. 자격증 */}
      <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 6, height: 6, bgcolor: 'black', transform: 'rotate(45deg)', mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">자격증</Typography>
      </Box>
      <div css={tableContainerStyle}>
        <div css={rowStyle}>
          <div css={cellStyle} className="header" style={{ width: '25%' }}>취득일(년월)</div>
          <div css={cellStyle} className="header" style={{ width: '50%' }}>자격증/면허증/교육이수</div>
          <div css={cellStyle} className="header no-border-right" style={{ width: '25%' }}>발급 기관</div>
        </div>
         {[1, 2].map((i) => (
          <div css={rowStyle} key={i}>
            <div css={cellStyle} className="input" style={{ width: '25%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input" style={{ width: '50%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input no-border-right" style={{ width: '25%' }}><InputBase sx={inputBaseStyle} /></div>
          </div>
        ))}
      </div>


      {/* 6. 기타사항 */}
      <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 6, height: 6, bgcolor: 'black', transform: 'rotate(45deg)', mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">기타사항(외국어, OA활용능력 등)</Typography>
      </Box>
      <div css={tableContainerStyle}>
        <div css={rowStyle}>
          <div css={cellStyle} className="header" style={{ width: '15%' }}>구분</div>
          <div css={cellStyle} className="header" style={{ width: '35%' }}>활용능력</div>
          <div css={cellStyle} className="header" style={{ width: '15%' }}>구분</div>
          <div css={cellStyle} className="header no-border-right" style={{ width: '35%' }}>활용능력</div>
        </div>
         {[1, 2].map((i) => (
          <div css={rowStyle} key={i}>
            <div css={cellStyle} className="input" style={{ width: '15%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input" style={{ width: '35%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input" style={{ width: '15%' }}><InputBase sx={inputBaseStyle} /></div>
            <div css={cellStyle} className="input no-border-right" style={{ width: '35%' }}><InputBase sx={inputBaseStyle} /></div>
          </div>
        ))}
      </div>

    </Box>
  );
};

export default ResumeForm;