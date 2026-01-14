/** @jsxImportSource @emotion/react */
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { css } from '@emotion/react';

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
  justify-content: center;
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

interface ResumeData {
    name: string;
    desiredJob: string;
    education: string;
    workExperience: string;
    coreCompetencies: string;
    certifications: string;
}

interface Props {
    data: ResumeData;
}

const ResumeDisplay = React.forwardRef<HTMLDivElement, Props>(({ data: resumeData }, ref) => {
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
                        <Typography variant="body2" color="text.secondary">사진</Typography>
                    </div>

                    <div css={css`flex-grow: 1;`}>
                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '80px' }}>이 름</div>
                            <div css={cellStyle} className="data" style={{ flexGrow: 1 }}>{resumeData.name}</div>
                            <div css={cellStyle} className="header" style={{ width: '80px', borderLeft: `1px solid ${borderColor}` }}>영 문</div>
                            <div css={cellStyle} className="data no-border-right" style={{ flexGrow: 1 }}></div>
                        </div>

                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '80px' }}>생년월일</div>
                            <div css={cellStyle} className="data" style={{ flexGrow: 1 }}></div>
                            <div css={cellStyle} className="header" style={{ width: '80px', borderLeft: `1px solid ${borderColor}` }}>이메일</div>
                            <div css={cellStyle} className="data no-border-right" style={{ flexGrow: 1 }}></div>
                        </div>

                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '80px' }}>연락처</div>
                            <div css={cellStyle} className="data" style={{ flexGrow: 1 }}>{resumeData.desiredJob}</div>
                            <div css={cellStyle} className="header" style={{ width: '80px', borderLeft: `1px solid ${borderColor}` }}>비상연락처</div>
                            <div css={cellStyle} className="data no-border-right" style={{ flexGrow: 1 }}></div>
                        </div>

                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '80px' }}>주 소</div>
                            <div css={cellStyle} className="data no-border-right" style={{ flexGrow: 1 }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 학력사항 */}
            <SectionTitle>학력사항</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header" style={{ width: '25%' }}>기간</div>
                    <div css={cellStyle} className="header" style={{ width: '35%' }}>학교명</div>
                    <div css={cellStyle} className="header" style={{ width: '25%' }}>전공</div>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '15%' }}>졸업여부</div>
                </div>
                {resumeData.education.split('\n').filter(line => line.trim()).map((line, index) => (
                    <div css={rowStyle} key={index}>
                        <div css={cellStyle} className="data center" style={{ width: '25%' }}></div>
                        <div css={cellStyle} className="data" style={{ width: '35%' }}>{line}</div>
                        <div css={cellStyle} className="data center" style={{ width: '25%' }}></div>
                        <div css={cellStyle} className="data center no-border-right" style={{ width: '15%' }}></div>
                    </div>
                ))}
                {renderEmptyRows(3 - resumeData.education.split('\n').filter(line => line.trim()).length, [
                    { width: '25%' }, { width: '35%' }, { width: '25%' }, { width: '15%', isLast: true }
                ])}
            </div>

            {/* 3. 경력사항 */}
            <SectionTitle>경력사항</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header" style={{ width: '20%' }}>근무날짜</div>
                    <div css={cellStyle} className="header" style={{ width: '30%' }}>직장명 / 부서</div>
                    <div css={cellStyle} className="header" style={{ width: '30%' }}>담당업무</div>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '20%' }}>퇴사사유</div>
                </div>
                 {resumeData.workExperience.split('\n').filter(line => line.trim()).map((line, index) => (
                    <div css={rowStyle} key={index}>
                        <div css={cellStyle} className="data center" style={{ width: '20%' }}></div>
                        <div css={cellStyle} className="data" style={{ width: '30%' }}>{line}</div>
                        <div css={cellStyle} className="data" style={{ width: '30%' }}></div>
                        <div css={cellStyle} className="data center no-border-right" style={{ width: '20%' }}></div>
                    </div>
                ))}
                {renderEmptyRows(3 - resumeData.workExperience.split('\n').filter(line => line.trim()).length, [
                    { width: '20%' }, { width: '30%' }, { width: '30%' }, { width: '20%', isLast: true }
                ])}
            </div>
            
            {/* 4. 교육사항 / 대외활동 */}
            <SectionTitle>교육사항 / 대외활동</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header" style={{ width: '25%' }}>활동/근무기간</div>
                    <div css={cellStyle} className="header" style={{ width: '45%' }}>교육 과정</div>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '30%' }}>교육 기관</div>
                </div>
                {renderEmptyRows(2, [
                    { width: '25%' }, { width: '45%' }, { width: '30%', isLast: true }
                ])}
            </div>

            {/* 5. 자격증 */}
            <SectionTitle>자격증</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header" style={{ width: '25%' }}>취득일(년월)</div>
                    <div css={cellStyle} className="header" style={{ width: '50%' }}>자격증/면허증/교육이수</div>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '25%' }}>발급 기관</div>
                </div>
                 {resumeData.certifications.split('\n').filter(line => line.trim()).map((line, index) => (
                    <div css={rowStyle} key={index}>
                        <div css={cellStyle} className="data center" style={{ width: '25%' }}></div>
                        <div css={cellStyle} className="data" style={{ width: '50%' }}>{line}</div>
                        <div css={cellStyle} className="data center no-border-right" style={{ width: '25%' }}></div>
                    </div>
                ))}
                {renderEmptyRows(2 - resumeData.certifications.split('\n').filter(line => line.trim()).length, [
                    { width: '25%' }, { width: '50%' }, { width: '25%', isLast: true }
                ])}
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
                 {resumeData.coreCompetencies.split('\n').filter(line => line.trim()).map((line, index) => (
                     <div css={rowStyle} key={index}>
                        <div css={cellStyle} className="data" style={{ width: '15%' }}></div>
                        <div css={cellStyle} className="data" style={{ width: '35%' }}>{line}</div>
                        <div css={cellStyle} className="data" style={{ width: '15%' }}></div>
                        <div css={cellStyle} className="data no-border-right" style={{ width: '35%' }}></div>
                    </div>
                 ))}
                {renderEmptyRows(2 - resumeData.coreCompetencies.split('\n').filter(line => line.trim()).length, [
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
