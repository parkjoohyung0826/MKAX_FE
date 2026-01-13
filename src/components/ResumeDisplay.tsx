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
    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 8, height: 8, bgcolor: 'black', transform: 'rotate(45deg)', mr: 1.5 }} />
        <Typography variant="h6" fontWeight={800} color="black">{children}</Typography>
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
                <div css={rowStyle} style={{ borderBottom: 'none' }}>
                    {/* 사진 영역 */}
                    <div css={css`
                width: 140px;
                border-right: 1px solid ${borderColor};
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                background-color: #f8f9fa;
              `}>
                        <Typography variant="body2" color="text.secondary">사진 부착</Typography>
                    </div>

                    {/* 인적사항 데이터 영역 */}
                    <div css={css`flex-grow: 1; display: flex; flex-direction: column;`}>

                        {/* Row 1: 성 명 / 영 문 */}
                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '15%' }}>성 명</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '35%' }}>
                                {resumeData.name}
                            </div>
                            <div css={cellStyle} className="header" style={{ width: '15%', borderLeft: `1px solid ${borderColor}` }}>영 문</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '35%' }}>
                                HONG GILDONG
                            </div>
                        </div>

                        {/* Row 2: 생년월일 / 이메일 */}
                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '15%' }}>생년월일</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '35%' }}>
                                1990.01.01
                            </div>
                            <div css={cellStyle} className="header" style={{ width: '15%', borderLeft: `1px solid ${borderColor}` }}>이메일</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '35%' }}>
                                gildong@example.com
                            </div>
                        </div>

                        {/* Row 3: 연락처 / 비상연락처 */}
                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '15%' }}>연락처</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '35%' }}>
                                {resumeData.desiredJob}
                            </div>
                            <div css={cellStyle} className="header" style={{ width: '15%', borderLeft: `1px solid ${borderColor}` }}>비상연락처</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '35%' }}>
                                010-1234-5678
                            </div>
                        </div>

                        {/* Row 4: 주 소 */}
                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '80px', borderBottom: 'none' }}>주 소</div>
                            <div css={cellStyle} className="data no-border-right" style={{ flexGrow: 1, borderBottom: 'none' }}>
                                서울시 강남구 테헤란로 123
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* 2. 학력사항 */}
            <SectionTitle>학력사항</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header" style={{ width: '25%' }}>기 간</div>
                    <div css={cellStyle} className="header" style={{ width: '35%' }}>학 교 명</div>
                    <div css={cellStyle} className="header" style={{ width: '25%' }}>전 공</div>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '15%' }}>졸업여부</div>
                </div>
                {/* 입력된 데이터를 줄바꿈 기준으로 나눠서 표시 */}
                {resumeData.education.split('\n').map((line, index) => (
                    <div css={rowStyle} key={index}>
                        <div css={cellStyle} className="data center" style={{ width: '25%' }}>-</div>
                        <div css={cellStyle} className="data" style={{ width: '35%' }}>{line}</div>
                        <div css={cellStyle} className="data center" style={{ width: '25%' }}>-</div>
                        <div css={cellStyle} className="data center no-border-right" style={{ width: '15%' }}>졸업</div>
                    </div>
                ))}
                {/* 빈 줄 추가 (양식 유지를 위해) */}
                {[...Array(Math.max(0, 3 - resumeData.education.split('\n').length))].map((_, i) => (
                    <div css={rowStyle} key={`empty-${i}`}>
                        <div css={cellStyle} className="data" style={{ width: '25%' }}></div>
                        <div css={cellStyle} className="data" style={{ width: '35%' }}></div>
                        <div css={cellStyle} className="data" style={{ width: '25%' }}></div>
                        <div css={cellStyle} className="data no-border-right" style={{ width: '15%' }}></div>
                    </div>
                ))}
            </div>


            {/* 3. 경력사항 */}
            <SectionTitle>경력사항</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header" style={{ width: '20%' }}>근무기간</div>
                    <div css={cellStyle} className="header" style={{ width: '35%' }}>직장명 / 부서</div>
                    <div css={cellStyle} className="header" style={{ width: '30%' }}>담당업무</div>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '15%' }}>퇴사사유</div>
                </div>
                {resumeData.workExperience.split('\n').map((line, index) => (
                    <div css={rowStyle} key={index}>
                        <div css={cellStyle} className="data center" style={{ width: '20%' }}>-</div>
                        <div css={cellStyle} className="data" style={{ width: '35%' }}>{line}</div>
                        <div css={cellStyle} className="data" style={{ width: '30%' }}></div>
                        <div css={cellStyle} className="data center no-border-right" style={{ width: '15%' }}></div>
                    </div>
                ))}
                {[...Array(Math.max(0, 4 - resumeData.workExperience.split('\n').length))].map((_, i) => (
                    <div css={rowStyle} key={`empty-${i}`}>
                        <div css={cellStyle} className="data" style={{ width: '20%' }}></div>
                        <div css={cellStyle} className="data" style={{ width: '35%' }}></div>
                        <div css={cellStyle} className="data" style={{ width: '30%' }}></div>
                        <div css={cellStyle} className="data no-border-right" style={{ width: '15%' }}></div>
                    </div>
                ))}
            </div>


            {/* 4. 자격증 및 기타 */}
            <SectionTitle>자격증 및 보유기술</SectionTitle>
            <div css={tableContainerStyle}>
                <div css={rowStyle}>
                    <div css={cellStyle} className="header" style={{ width: '25%' }}>취득일</div>
                    <div css={cellStyle} className="header" style={{ width: '45%' }}>자격증/면허증/보유기술</div>
                    <div css={cellStyle} className="header no-border-right" style={{ width: '30%' }}>발행처/수준</div>
                </div>
                {/* 자격증 정보 표시 */}
                {resumeData.certifications.split('\n').map((line, index) => (
                    <div css={rowStyle} key={`cert-${index}`}>
                        <div css={cellStyle} className="data center" style={{ width: '25%' }}>-</div>
                        <div css={cellStyle} className="data" style={{ width: '45%' }}>{line}</div>
                        <div css={cellStyle} className="data center no-border-right" style={{ width: '30%' }}></div>
                    </div>
                ))}
                {/* 핵심 역량 정보 표시 */}
                {resumeData.coreCompetencies.split('\n').map((line, index) => (
                    <div css={rowStyle} key={`core-${index}`}>
                        <div css={cellStyle} className="data center" style={{ width: '25%' }}>-</div>
                        <div css={cellStyle} className="data" style={{ width: '45%' }}>{line}</div>
                        <div css={cellStyle} className="data center no-border-right" style={{ width: '30%' }}></div>
                    </div>
                ))}
                {/* 빈 줄 추가 */}
                {[...Array(Math.max(0, 4 - (resumeData.certifications.split('\n').length + resumeData.coreCompetencies.split('\n').length)))].map((_, i) => (
                    <div css={rowStyle} key={`empty-${i}`}>
                        <div css={cellStyle} className="data" style={{ width: '25%' }}></div>
                        <div css={cellStyle} className="data" style={{ width: '45%' }}></div>
                        <div css={cellStyle} className="data no-border-right" style={{ width: '30%' }}></div>
                    </div>
                ))}
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
