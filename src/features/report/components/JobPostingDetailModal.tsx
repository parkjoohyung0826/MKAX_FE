import React, { useEffect, useMemo } from 'react';
import { JobPosting } from '../types';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LaunchOutlined,
  CloseRounded,
  CalendarTodayRounded,
  LocationOnRounded,
  SchoolRounded,
  WorkOutlineRounded,
  DescriptionOutlined,
  DownloadRounded,
  AutoAwesome,
  BusinessRounded,
  PeopleAltRounded,
} from '@mui/icons-material';

interface JobPostingDetailModalProps {
  job: JobPosting | null;
  open: boolean;
  onClose: () => void;
}

// --- 유틸리티 함수 ---
const toDisplay = (value?: string | number | null) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'number') return String(value);
  return value.trim() ? value : '-';
};

const toMultilineDisplay = (value?: string | null) => {
  if (!value) return '-';
  return value.replace(/\r\n/g, '\n').trim();
};

const formatDate = (value?: string) => {
  if (!value) return '';
  if (/^\d{8}$/.test(value)) return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`;
  return value;
};

const JobPostingDetailModal: React.FC<JobPostingDetailModalProps> = ({ job, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!open || !job) return;
  }, [open, job]);

  const selectedTags = useMemo(() => {
    if (!job) return [];
    return [
      ...(job.ncsCdNmList ?? []),
      ...(job.hireTypeNmList ?? []),
      ...(job.workRgnNmList ?? []),
      ...(job.acbgCondNmList ?? []),
    ].filter(Boolean);
  }, [job]);

  if (!job) return null;

  const hasMatchScore =
    typeof job.matchScore === 'number' &&
    Number.isFinite(job.matchScore) &&
    job.matchScore > 0;
  const hasMatchReason =
    typeof job.matchReason === 'string' && job.matchReason.trim().length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          maxHeight: '90vh',
          bgcolor: '#FFFFFF',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        },
      }}
    >
      {/* 헤더 영역 */}
      <DialogTitle sx={{ p: { xs: 2.5, md: 4 }, pb: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={job.instNm || job.company}
                size="small"
                sx={{ fontWeight: 700, bgcolor: alpha('#2563EB', 0.08), color: '#2563EB', borderRadius: '8px', height: '28px' }}
              />
              {job.ongoingYn && (
                <Chip
                  label={job.ongoingYn === 'Y' ? '모집중' : '마감'}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    bgcolor: job.ongoingYn === 'Y' ? alpha('#16a34a', 0.1) : '#f1f5f9',
                    color: job.ongoingYn === 'Y' ? '#16a34a' : '#64748b',
                    borderRadius: '8px',
                    height: '28px',
                  }}
                />
              )}
            </Stack>
            <IconButton onClick={onClose} sx={{ color: '#94a3b8', p: 0.5 }}><CloseRounded /></IconButton>
          </Stack>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.3, wordBreak: 'keep-all' }}>
            {job.recrutPbancTtl || job.title}
          </Typography>
        </Stack>
      </DialogTitle>

      <Divider sx={{ borderColor: '#f1f5f9' }} />

      <DialogContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack spacing={5}>
          
          {/* 1. AI 매칭 분석 */}
          {(hasMatchScore || hasMatchReason) && (
            <Box>
              {/* <SectionHeader icon={<AutoAwesome sx={{ color: '#2563EB' }} />} title="AI 매칭 분석" /> */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: alpha('#2563EB', 0.04),
                  // border: `1px solid ${alpha('#2563EB', 0.1)}`,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: { xs: 2, md: 4 }
                }}
              >
                {hasMatchScore && (
                  <Box sx={{ minWidth: { md: '120px' }, textAlign: 'center', borderRight: { md: `1px solid ${alpha('#2563EB', 0.15)}` }, pr: { md: 4 } }}>
                    <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 800, display: 'block', mb: 0.5, letterSpacing: '0.05em' }}>매칭 점수</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#2563EB', lineHeight: 1 }}>
                      {job.matchScore}<Typography component="span" variant="h6" sx={{ fontWeight: 700, ml: 0.2 }}>점</Typography>
                    </Typography>
                  </Box>
                )}
                {hasMatchReason && (
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#334155', lineHeight: 1.7, fontWeight: 500, fontSize: '0.95rem' }}>
                      {toMultilineDisplay(job.matchReason)}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}

          {/* 2. 핵심 정보 (Stack 기반 3열 레이아웃) */}
          <Box>
            <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2}>
              <InfoCard icon={<BusinessRounded />} label="채용 구분" value={job.recrutSeNm || job.career} />
              <InfoCard icon={<LocationOnRounded />} label="근무 지역" value={job.workRgnNmLst || job.region} />
              <InfoCard icon={<PeopleAltRounded />} label="모집 인원" value={job.recrutNope ? `${job.recrutNope}명` : '-'} />
              <InfoCard icon={<SchoolRounded />} label="학력 조건" value={job.acbgCondNmLst || job.minEdubg} />
              <InfoCard icon={<WorkOutlineRounded />} label="고용 형태" value={job.hireTypeNmLst || job.holidayTpNm} />
              <InfoCard 
                icon={<CalendarTodayRounded />} 
                label="공고 기간" 
                value={`${formatDate(job.pbancBgngYmd) || job.regDt} ~ ${formatDate(job.pbancEndYmd) || job.closeDt}`} 
                fullWidth={isMobile}
              />
            </Stack>
          </Box>

          {/* 3. 요약 태그 */}
          {selectedTags.length > 0 && (
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#94a3b8', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Keywords</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {selectedTags.map((tag, idx) => (
                  <Chip key={`${tag}-${idx}`} label={tag} sx={{ borderRadius: '8px', fontWeight: 600, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569' }} />
                ))}
              </Stack>
            </Box>
          )}

          {/* 4. 상세 내용 */}
          <Stack spacing={4}>
            <DetailSection title="지원 자격" content={job.aplyQlfcCn} />
            <DetailSection title="결격 사유" content={job.disqlfcRsn} />
            <DetailSection title="우대 조건" content={job.prefCn || job.prefCondCn} />
            <DetailSection title="전형 절차" content={job.scrnprcdrMthdExpln} />
          </Stack>

          {/* 5. 채용 단계 */}
          {Array.isArray(job.steps) && job.steps.length > 0 && (
            <Box>
              <SectionHeader title="채용 단계별 경쟁률" />
              <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2}>
                {job.steps.map((step, index) => (
                  <Paper
                    key={step.recrutStepSn || index}
                    elevation={0}
                    sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(33.33% - 16px)' } }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', mb: 0.5 }}>STEP {index + 1}</Typography>
                    <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 1.5 }}>{step.recrutPbancTtl || '단계명 없음'}</Typography>
                    <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />
                    <Stack direction="row" justifyContent="space-between">
                      <Box><Typography variant="caption" display="block" color="#94a3b8">지원자</Typography><Typography fontWeight={600} color="#334155">{toDisplay(step.aplyNope)}명</Typography></Box>
                      <Box textAlign="right"><Typography variant="caption" display="block" color="#94a3b8">경쟁률</Typography><Typography fontWeight={700} color="#2563EB">{toDisplay(step.cmpttRt)}:1</Typography></Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}

          {/* 6. 첨부 파일 */}
          {Array.isArray(job.files) && job.files.length > 0 && (
            <Box>
              <SectionHeader icon={<DescriptionOutlined />} title="첨부 파일" />
              <Stack spacing={1.5}>
                {job.files.map((file, idx) => (
                  <Button
                    key={idx}
                    component="a"
                    href={file.url || '#'}
                    target="_blank"
                    variant="outlined"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', p: 2, borderRadius: '12px', borderColor: '#e2e8f0', color: '#334155', textTransform: 'none' }}
                  >
                    <DownloadRounded sx={{ mr: 2, color: '#94a3b8' }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{file.atchFileNm || '첨부 파일'}</Typography>
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <Divider sx={{ borderColor: '#f1f5f9' }} />

      {/* 하단 버튼 */}
      <Stack direction="row" spacing={2} sx={{ p: 3, bgcolor: '#ffffff' }} justifyContent="flex-end">
        <Button variant="text" onClick={onClose} sx={{ color: '#64748b', fontWeight: 600, px: 3 }}>닫기</Button>
        <Button
          variant="contained"
          href={job.srcUrl || job.wantedInfoUrl}
          target="_blank"
          endIcon={<LaunchOutlined />}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, bgcolor: alpha('#2563EB', 0.85), px: 4, py: 1.2, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)', '&:hover': { bgcolor: alpha('#2563EB', 0.95) } }}
        >
          공고 원문 보기
        </Button>
      </Stack>
    </Dialog>
  );
};

const InfoCard = ({ icon, label, value, fullWidth = false }: { icon: React.ReactNode; label: string; value: string; fullWidth?: boolean }) => (
  <Box
    sx={{
      flex: fullWidth ? '1 1 100%' : { xs: '1 1 calc(50% - 16px)', md: '1 1 calc(33.33% - 16px)' },
      p: 2,
      borderRadius: '12px',
      bgcolor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #f1f5f9',
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
      <Box sx={{ display: 'flex', alignItems: 'center', color: '#94a3b8', '& svg': { fontSize: 18 } }}>{icon}</Box>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', lineHeight: 1 }}>{label}</Typography>
    </Stack>
    <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', wordBreak: 'break-word' }}>{toDisplay(value)}</Typography>
  </Box>
);

const SectionHeader = ({ icon, title }: { icon?: React.ReactNode; title: string }) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
    {icon && <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b', '& svg': { fontSize: 20 } }}>{icon}</Box>}
    <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{title}</Typography>
  </Stack>
);

const DetailSection = ({ title, content }: { title: string; content?: string | null }) => {
  if (!content) return null;
  return (
    <Box>
      <SectionHeader title={title} />
      <Box sx={{ pl: 3, py: 1, borderLeft: '3px solid #e2e8f0' }}>
        <Typography sx={{ color: '#475569', whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: '0.95rem' }}>{toMultilineDisplay(content)}</Typography>
      </Box>
    </Box>
  );
};

export default JobPostingDetailModal;
