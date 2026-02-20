/** @jsxImportSource @emotion/react */
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { css } from '@emotion/react';
import { useResumeStore } from '../store';
import { getResumeCareerTypeCopy } from '../careerTypeCopy';
import { ResumeData, ResumeFormatResult } from '../types';

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

interface Props {
  data?: ResumeData | ResumeFormatResult;
  formattedData?: ResumeFormatResult | null;
}

const ResumeDisplay = React.forwardRef<HTMLDivElement, Props>(({ data, formattedData }, ref) => {
    const { resumeData, formattedResume, selectedCareerType } = useResumeStore();
    const copy = getResumeCareerTypeCopy(selectedCareerType);
    const isSeniorMode = selectedCareerType === 'senior';
    const corePeriodHeader = isSeniorMode ? '이수 년월' : '활동/근무기간';
    const coreCourseHeader = isSeniorMode ? '교육/훈련 과정' : '교육 과정';
    const coreInstitutionHeader = isSeniorMode ? '교육 기관' : '교육 기관';
    const displayData = formattedData ?? data ?? formattedResume ?? resumeData;
    const photoSrc =
      String((displayData as any)?.photo ?? '').trim() ||
      String((formattedData as any)?.photo ?? '').trim() ||
      String((data as any)?.photo ?? '').trim() ||
      String((formattedResume as any)?.photo ?? '').trim() ||
      String(resumeData?.photo ?? '').trim();
    
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
                        {photoSrc ? (
                          <img src={photoSrc} alt="증명사진" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Typography variant="body2" color="text.secondary">사진</Typography>
                        )}
                    </div>

                    <div css={css`width: 100%;`}>
                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '17%' }}>이 름</div>
                            <div css={cellStyle} className="data" style={{ width: '33%' }}>{displayData.name}</div>
                            <div css={cellStyle} className="header" style={{ width: '17%' }}>영 문</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '33%' }}>{displayData.englishName}</div>
                        </div>

                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '17%' }}>생년월일</div>
                            <div css={cellStyle} className="data" style={{ width: '33%' }}>{displayData.dateOfBirth}</div>
                            <div css={cellStyle} className="header" style={{ width: '17%' }}>이메일</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '33%' }}>{displayData.email}</div>
                        </div>

                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '17%' }}>연락처</div>
                            <div css={cellStyle} className="data" style={{ width: '33%' }}>{displayData.phoneNumber}</div>
                            <div css={cellStyle} className="header" style={{ width: '17%' }}>비상연락처</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '33%' }}>{displayData.emergencyContact}</div>
                        </div>

                        <div css={rowStyle}>
                            <div css={cellStyle} className="header" style={{ width: '17%' }}>주 소</div>
                            <div css={cellStyle} className="data no-border-right" style={{ width: '83%' }}>{displayData.address}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. 학력사항 */}
            <SectionTitle>학력사항</SectionTitle>
            {Array.isArray((displayData as any).education) ? (
              <div css={tableContainerStyle}>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="header" style={{ width: '25%' }}>기간</div>
                      <div css={cellStyle} className="header" style={{ width: '30%' }}>학교명</div>
                      <div css={cellStyle} className="header" style={{ width: '30%' }}>전공</div>
                      <div css={cellStyle} className="header no-border-right" style={{ width: '15%' }}>졸업여부</div>
                  </div>
                  {(displayData as any).education.map((edu: any, index: number) => (
                      <div css={rowStyle} key={index}>
                          <div css={cellStyle} className="data center" style={{ width: '25%' }}>{edu.period}</div>
                          <div css={cellStyle} className="data" style={{ width: '30%' }}>{edu.schoolName}</div>
                          <div css={cellStyle} className="data center" style={{ width: '30%' }}>{edu.major}</div>
                          <div css={cellStyle} className="data center no-border-right" style={{ width: '15%' }}>{edu.graduationStatus}</div>
                      </div>
                  ))}
                  {renderEmptyRows(3 - (displayData as any).education.length, [
                      { width: '25%' }, { width: '30%' }, { width: '30%' }, { width: '15%', isLast: true }
                  ])}
              </div>
            ) : (
              <div css={tableContainerStyle}>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="header no-border-right" style={{ width: '100%' }}>학력 상세</div>
                  </div>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="data no-border-right" style={{ width: '100%' }}>
                          {(displayData as any).education}
                      </div>
                  </div>
              </div>
            )}

            {/* 3. 경력사항 */}
            <SectionTitle>경력사항</SectionTitle>
            {Array.isArray((displayData as any).workExperience) ? (
              <div css={tableContainerStyle}>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="header" style={{ width: '25%' }}>근무기간</div>
                      <div css={cellStyle} className="header" style={{ width: '25%' }}>직장명 / 부서</div>
                      <div css={cellStyle} className="header no-border-right" style={{ width: '50%' }}>담당업무</div>
                  </div>
                   {(displayData as any).workExperience.map((exp: any, index: number) => (
                      <div css={rowStyle} key={index}>
                          <div css={cellStyle} className="data center" style={{ width: '25%' }}>{exp.period}</div>
                          <div css={cellStyle} className="data" style={{ width: '25%' }}>{exp.companyName}</div>
                          <div css={cellStyle} className="data no-border-right" style={{ width: '50%' }}>{exp.mainTask}</div>
                      </div>
                  ))}
                  {renderEmptyRows(3 - (displayData as any).workExperience.length, [
                      { width: '25%' }, { width: '25%' }, { width: '50%', isLast: true }
                  ])}
              </div>
            ) : (
              <div css={tableContainerStyle}>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="header no-border-right" style={{ width: '100%' }}>경력 상세</div>
                  </div>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="data no-border-right" style={{ width: '100%' }}>
                          {(displayData as any).workExperience}
                      </div>
                  </div>
              </div>
            )}
            
            {/* 4. 교육사항 / 대외활동 */}
            <SectionTitle>{copy.displayCoreTitle}</SectionTitle>
            {Array.isArray((displayData as any).coreCompetencies) ? (
              <div css={tableContainerStyle}>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="header" style={{ width: '25%' }}>{corePeriodHeader}</div>
                      <div css={cellStyle} className="header" style={{ width: '50%' }}>{coreCourseHeader}</div>
                      <div css={cellStyle} className="header no-border-right" style={{ width: '25%' }}>{coreInstitutionHeader}</div>
                  </div>
                  {(displayData as any).coreCompetencies.map((item: any, index: number) => (
                      <div css={rowStyle} key={index}>
                          <div css={cellStyle} className="data center" style={{ width: '25%' }}>{item.period}</div>
                          <div css={cellStyle} className="data" style={{ width: '50%' }}>{item.courseName}</div>
                          <div css={cellStyle} className="data center no-border-right" style={{ width: '25%' }}>{item.institution}</div>
                      </div>
                  ))}
                  {renderEmptyRows(2 - (displayData as any).coreCompetencies.length, [
                      { width: '25%' }, { width: '50%' }, { width: '25%', isLast: true }
                  ])}
              </div>
            ) : (
              <div css={tableContainerStyle}>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="header no-border-right" style={{ width: '100%' }}>{copy.displayCoreDetailTitle}</div>
                  </div>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="data no-border-right" style={{ width: '100%' }}>
                          {(displayData as any).coreCompetencies}
                      </div>
                  </div>
              </div>
            )}

            {/* 5. 자격증 */}
            <SectionTitle>{copy.displayCertTitle}</SectionTitle>
            {Array.isArray((displayData as any).certifications) ? (
              <div css={tableContainerStyle}>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="header" style={{ width: '25%' }}>취득일(년월)</div>
                      <div css={cellStyle} className="header" style={{ width: '50%' }}>{copy.displayCertHeaderName}</div>
                      <div css={cellStyle} className="header no-border-right" style={{ width: '25%' }}>발급 기관</div>
                  </div>
                   {(displayData as any).certifications.map((cert: any, index: number) => (
                      <div css={rowStyle} key={index}>
                          <div css={cellStyle} className="data center" style={{ width: '25%' }}>{cert.period}</div>
                          <div css={cellStyle} className="data" style={{ width: '50%' }}>{cert.certificationName}</div>
                          <div css={cellStyle} className="data center no-border-right" style={{ width: '25%' }}>{cert.institution}</div>
                      </div>
                  ))}
                  {renderEmptyRows(2 - (displayData as any).certifications.length, [
                      { width: '25%' }, { width: '50%' }, { width: '25%', isLast: true }
                  ])}
              </div>
            ) : (
              <div css={tableContainerStyle}>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="header no-border-right" style={{ width: '100%' }}>{copy.displayCertDetailTitle}</div>
                  </div>
                  <div css={rowStyle}>
                      <div css={cellStyle} className="data no-border-right" style={{ width: '100%' }}>
                          {(displayData as any).certifications}
                      </div>
                  </div>
              </div>
            )}

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body1" fontWeight={600}>위 기재사항은 사실과 다름이 없습니다.</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>2026년  01월  12일</Typography>
                <Typography variant="h6" fontWeight={700} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', pr: 4 }}>
                    지원자 : {displayData.name} (인)
                </Typography>
            </Box>
        </Paper>
    );
});

ResumeDisplay.displayName = 'ResumeDisplay';

export default ResumeDisplay;
