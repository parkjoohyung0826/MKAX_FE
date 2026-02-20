import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useResumeStore } from '../store';
import { getResumeCareerTypeCopy } from '../careerTypeCopy';
import { ResumeData, ResumeFormatResult } from '../types';

interface Props {
  data?: ResumeData | ResumeFormatResult;
  formattedData?: ResumeFormatResult | null;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
    <Box sx={{ width: 10, height: 10, bgcolor: '#2563eb', borderRadius: '4px' }} />
    <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
      {children}
    </Typography>
  </Box>
);

const ModernTemplate = React.forwardRef<HTMLDivElement, Props>(({ data, formattedData }, ref) => {
  const { resumeData, formattedResume, selectedCareerType } = useResumeStore();
  const copy = getResumeCareerTypeCopy(selectedCareerType);
  const displayData = formattedData ?? data ?? formattedResume ?? resumeData;

  const renderTextBlock = (text: unknown, fallback = '내용이 없습니다.') => (
    <Typography variant="body2" color="#334155" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
      {String(text ?? '').trim().length > 0 ? String(text) : fallback}
    </Typography>
  );

  const renderArrayList = (items: any[], renderItem: (item: any, index: number) => React.ReactNode) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
      {items.map(renderItem)}
    </Box>
  );

  const isArray = (value: unknown) => Array.isArray(value);

  const renderHighlights = (lines: string[]) => (
    <Box component="ul" sx={{ m: 0, pl: 2, color: '#475569', fontSize: '0.85rem', lineHeight: 1.5 }}>
      {lines.map((line, index) => (
        <Box component="li" key={`${line}-${index}`} sx={{ mb: 0.4 }}>
          {line}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      ref={ref}
      sx={{
        width: '210mm',
        minHeight: '297mm',
        p: '16mm',
        bgcolor: '#ffffff',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: '18px',
          color: 'white',
          background: 'linear-gradient(120deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)',
        }}
      >
        <Typography variant="h4" fontWeight={800}>
          {displayData.name || '이름'}
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
          {displayData.desiredJob || '희망 직무'}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2">Email: {displayData.email || '-'}</Typography>
          <Typography variant="body2">Phone: {displayData.phoneNumber || '-'}</Typography>
          <Typography variant="body2">Address: {displayData.address || '-'}</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <SectionTitle>학력 사항</SectionTitle>
            {isArray((displayData as any).education)
              ? renderArrayList((displayData as any).education, (edu, index) => (
                  <Box key={`edu-${index}`} sx={{ p: 2, borderRadius: '12px', bgcolor: '#f8fafc' }}>
                    <Typography variant="body1" fontWeight={600} color="#0f172a">
                      {edu.schoolName || '학교명'}
                    </Typography>
                    <Typography variant="body2" color="#475569">
                      {edu.major || '전공'} · {edu.graduationStatus || '졸업'}
                    </Typography>
                    <Typography variant="caption" color="#64748b">
                      {edu.period || ''}
                    </Typography>
                    {edu.details && (
                      <Box sx={{ mt: 1 }}>
                        {renderTextBlock(edu.details)}
                      </Box>
                    )}
                    {!edu.details && (
                      <Box sx={{ mt: 1 }}>
                        {renderHighlights(['전공 심화 프로젝트 수행', '캡스톤 프로젝트 우수상 수상'])}
                      </Box>
                    )}
                  </Box>
                ))
              : renderTextBlock((displayData as any).education)}
          </Box>

          <Box>
            <SectionTitle>경력 사항</SectionTitle>
            {isArray((displayData as any).workExperience)
              ? renderArrayList((displayData as any).workExperience, (exp, index) => (
                  <Box key={`exp-${index}`} sx={{ p: 2, borderRadius: '12px', bgcolor: '#f8fafc' }}>
                    <Typography variant="body1" fontWeight={600} color="#0f172a">
                      {exp.companyName || '회사명'}
                    </Typography>
                    <Typography variant="body2" color="#475569">
                      {exp.mainTask || '담당 업무'}
                    </Typography>
                    <Typography variant="caption" color="#64748b">
                      {exp.period || ''}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {renderHighlights([
                        '핵심 지표 개선을 위한 UX 개선안 도출',
                        '팀 협업을 위한 컴포넌트 표준화 진행',
                      ])}
                    </Box>
                  </Box>
                ))
              : renderTextBlock((displayData as any).workExperience)}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#eff6ff', border: '1px solid #dbeafe' }}>
            <Typography variant="subtitle2" fontWeight={700} color="#1e3a8a">
              기본 정보
            </Typography>
            <Divider sx={{ my: 1.5, borderColor: 'rgba(30, 58, 138, 0.2)' }} />
            <Typography variant="body2" color="#1f2937">영문명: {displayData.englishName || '-'}</Typography>
            <Typography variant="body2" color="#1f2937">생년월일: {displayData.dateOfBirth || '-'}</Typography>
            <Typography variant="body2" color="#1f2937">비상연락처: {displayData.emergencyContact || '-'}</Typography>
            <Typography variant="body2" color="#1f2937">주소: {displayData.address || '-'}</Typography>
            <Typography variant="body2" color="#1f2937">이메일: {displayData.email || '-'}</Typography>
          </Box>

          <Box>
            <SectionTitle>{copy.reviewCoreTitle}</SectionTitle>
            {isArray((displayData as any).coreCompetencies)
              ? renderArrayList((displayData as any).coreCompetencies, (item, index) => (
                  <Box key={`activity-${index}`} sx={{ p: 2, borderRadius: '12px', bgcolor: '#f1f5f9' }}>
                    <Typography variant="body2" fontWeight={600} color="#0f172a">
                      {item.courseName || '교육 과정'}
                    </Typography>
                    <Typography variant="caption" color="#64748b">
                      {item.institution || ''} · {item.period || ''}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {renderHighlights([
                        '프로젝트 성과 공유 및 발표',
                        '문제 해결 프로세스 문서화',
                      ])}
                    </Box>
                  </Box>
                ))
              : renderTextBlock((displayData as any).coreCompetencies)}
          </Box>

          <Box>
            <SectionTitle>{copy.reviewCertTitle}</SectionTitle>
            {isArray((displayData as any).certifications)
              ? renderArrayList((displayData as any).certifications, (cert, index) => (
                  <Box key={`cert-${index}`} sx={{ p: 2, borderRadius: '12px', bgcolor: '#f1f5f9' }}>
                    <Typography variant="body2" fontWeight={600} color="#0f172a">
                      {cert.certificationName || '자격증'}
                    </Typography>
                    <Typography variant="caption" color="#64748b">
                      {cert.institution || ''} · {cert.period || ''}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {renderHighlights(['실무 활용 사례 정리', '유효기간/갱신 계획 보유'])}
                    </Box>
                  </Box>
                ))
              : renderTextBlock((displayData as any).certifications)}
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="body2" fontWeight={600}>
          위 기재사항은 사실과 다름이 없습니다.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          2026년 01월 12일
        </Typography>
        <Typography variant="body1" fontWeight={700} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', pr: 2 }}>
          지원자: {displayData.name || '이름'} (인)
        </Typography>
      </Box>
    </Box>
  );
});

ModernTemplate.displayName = 'ModernTemplate';

export default ModernTemplate;
