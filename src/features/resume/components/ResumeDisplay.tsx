/** @jsxImportSource @emotion/react */
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { css } from '@emotion/react';
import { useResumeStore } from '../store';

const borderColor = '#000';
const headerBg = '#e9ecef';

const tableContainerStyle = css`
  border: 2px solid ${borderColor};
  margin-bottom: 24px;
  background-color: #fff;
  box-sizing: border-box;
`;

const rowStyle = css`
  display: flex;
  width: 100%;
  border-bottom: 1px solid ${borderColor};
  &:last-child {
    border-bottom: none;
  }
`;

const cellStyle = css`
  display: flex;
  align-items: center;
  border-right: 1px solid ${borderColor};
  padding: 8px;
  min-height: 45px;
  font-size: 0.95rem;
  box-sizing: border-box;
  color: #000;
  
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
    word-break: break-all;
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

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 6, height: 6, bgcolor: 'black', transform: 'rotate(45deg)', mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">{children}</Typography>
    </Box>
);

interface Props {}

const ResumeDisplay = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { resumeData } = useResumeStore();
    
    // 빈 줄 렌더링을 위한 헬퍼 함수
    const renderEmptyRows = (count: number, cells: { width: string, isLast?: boolean }[]) => {
        return [...Array(Math.max(0, count))].map((_, i) => (
            <div css={rowStyle} key={`empty-${i}`}>
                {cells.map((cell, j) => (
                    <div css={cellStyle} className={`data ${cell.isLast ? 'no-border-right' : ''}`} style={{ width: cell.width }} key={j}></div>
                ))}
            </div>
        ));
    };
    
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
            }}
        >
            {/* 1. 상단 정보 (사진 + 인적사항) */}
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={css`
                        width: 140px;
                        border-right: 1px solid ${borderColor};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        background-color: #f8f9fa;
                    `}>
                        {resumeData.photo ? (
                          <img src={resumeData.photo} alt="증명사진" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Typography variant="body2" color="text.secondary">사진</Typography>
                        )}
                    </div>

                    <div css={css`width: 100%;`}>
                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '20%' }}>이 름</div>
                            <div css={cellStyle} className="data" style={{ width: '30%' }}>{resumeData.name}</div>
                            <div css={cellStyle} className="header" style={{ width: '20%' }}>영 문</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '30%' }}>{resumeData.englishName}</div>
                        </div>

                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '20%' }}>생년월일</div>
                            <div css={cellStyle} className="data" style={{ width: '30%' }}>{resumeData.dateOfBirth}</div>
                            <div css={cellStyle} className="header" style={{ width: '20%' }}>이메일</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '30%' }}>{resumeData.email}</div>
                        </div>

                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '20%' }}>연락처</div>
                            <div css={cellStyle} className="data" style={{ width: '30%' }}>{resumeData.phoneNumber}</div>
                            <div css={cellStyle} className="header" style={{ width: '20%' }}>비상연락처</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '30%' }}>{resumeData.emergencyContact}</div>
                        </div>

                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '20%' }}>주 소</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '80%' }}>{resumeData.address}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 학력사항 */}
            <SectionTitle>학력사항</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '100%' }}>학력 상세</div>
                </div>
                <div css={rowStyle}>
                    <div css={cellStyle} className="data no-border-right" style={{ width: '100%' }}>
                        {resumeData.education}
                    </div>
                </div>
            </div>

            {/* 3. 경력사항 */}
            <SectionTitle>경력사항</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '100%' }}>경력 상세</div>
                </div>
                <div css={rowStyle}>
                    <div css={cellStyle} className="data no-border-right" style={{ width: '100%' }}>
                        {resumeData.workExperience}
                    </div>
                </div>
            </div>
            
            {/* 4. 교육사항 / 대외활동 */}
            <SectionTitle>교육사항 / 대외활동</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '100%' }}>활동 상세</div>
                </div>
                <div css={rowStyle}>
                    <div css={cellStyle} className="data no-border-right" style={{ width: '100%' }}>
                        {resumeData.coreCompetencies}
                    </div>
                </div>
            </div>

            {/* 5. 자격증 */}
            <SectionTitle>자격증</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '100%' }}>자격증 상세</div>
                </div>
                <div css={rowStyle}>
                    <div css={cellStyle} className="data no-border-right" style={{ width: '100%' }}>
                        {resumeData.certifications}
                    </div>
                </div>
            </div>

            {/* 6. 기타사항 */}
            <SectionTitle>기타사항(외국어, OA활용능력 등)</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header" style={{ width: '15%' }}>구분</div>
                    <div css={cellStyle} className="header" style={{ width: '35%' }}>활용능력</div>
                    <div css={cellStyle} className="header" style={{ width: '15%' }}>구분</div>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '35%' }}>활용능력</div>
                </div>
                {renderEmptyRows(2, [
                    { width: '15%' }, { width: '35%' }, { width: '15%' }, { width: '35%', isLast: true }
                ])}
            </div>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body1" fontWeight={600}>위 기재사항은 사실과 다름이 없습니다.</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>2026년  01월  12일</Typography>
                <Typography variant="h6" fontWeight={700} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', pr: 4 }}>
                    지원자 : {resumeData.name} (인)
                </Typography>
            </Box>
        </Paper>
    );
});

ResumeDisplay.displayName = 'ResumeDisplay';

export default ResumeDisplay;
