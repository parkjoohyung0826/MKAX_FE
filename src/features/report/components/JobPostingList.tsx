import React from 'react';
import { JobPosting } from '../types';
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Avatar,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  LocationOnOutlined,
  WorkOutline,
  EventAvailable,
  ArrowForward,
  DescriptionOutlined,
  BusinessOutlined,
  SchoolOutlined,
  AccessTimeOutlined,
} from '@mui/icons-material';

interface JobPostingListProps {
  jobPostings: JobPosting[];
}

const JobPostingList: React.FC<JobPostingListProps> = ({ jobPostings }) => {
  const theme = useTheme();
  
  // 디자인 토큰
  const mainBlue = '#2563EB';
  const COLORS = {
    primary: mainBlue,
    textTitle: '#1e293b',
    textBody: '#64748b',
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Stack spacing={2.5}>
        {jobPostings.map((job) => (
          <Card
            key={job.wantedAuthNo}
            elevation={0}
            sx={{
              borderRadius: '20px',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: alpha(COLORS.primary, 0.4),
                boxShadow: `0 12px 24px -6px ${alpha(COLORS.primary, 0.12)}`,
                '& .hover-arrow': { transform: 'translateX(0)', opacity: 1 }
              },
            }}
          >
            <Box
              sx={{
                p: { xs: 3, sm: 3.5 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
              }}
            >
              {/* 1. 왼쪽: 모던한 정보 디자인 (아이콘 기반 메타 정보 + 뱃지) */}
              <Box sx={{ display: 'flex', gap: 2.5, flex: 1, minWidth: 0 }}>
                {/* 로고 */}
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    bgcolor: '#fff',
                    color: COLORS.primary,
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    border: `1px solid ${alpha('#cbd5e1', 0.5)}`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                    flexShrink: 0,
                  }}
                >
                  {job.company?.charAt(0)}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* 회사명 & 마감일 */}
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: COLORS.textBody, fontSize: '0.85rem' }}
                    >
                      {job.company}
                    </Typography>
                    <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#cbd5e1' }} />
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <EventAvailable sx={{ fontSize: 14, color: '#EF4444' }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#EF4444', letterSpacing: '-0.2px' }}>
                        {job.closeDt}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* 공고 제목 */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      fontSize: '1.15rem',
                      color: COLORS.textTitle,
                      cursor: 'pointer',
                      lineHeight: 1.4,
                      transition: 'color 0.2s',
                      '&:hover': { color: COLORS.primary },
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {job.title}
                  </Typography>

                  {/* 메타 정보 (지역 | 경력 | 분야) */}
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={0}
                    sx={{ mb: 2, flexWrap: 'wrap', gap: 1.5 }}
                  >
                    <MetaText icon={<LocationOnOutlined />} text={job.basicAddr || job.region} />
                    <MetaDivider />
                    <MetaText icon={<WorkOutline />} text={job.career} />
                    <MetaDivider />
                    <MetaText icon={<BusinessOutlined />} text={job.indTpNm} />
                  </Stack>

                  {/* 태그 뱃지 */}
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
                    <InfoBadge icon={<SchoolOutlined />} label={job.minEdubg} />
                    <InfoBadge icon={<AccessTimeOutlined />} label={job.holidayTpNm} />
                  </Stack>
                </Box>
              </Box>

              {/* 2. 오른쪽: 버튼 영역 (원래 스타일 + 자세히 보기 변경) */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  gap: 1.2,
                  flexShrink: 0,
                  minWidth: { md: '140px' },
                  justifyContent: { xs: 'flex-start', md: 'center' },
                  borderLeft: { md: `1px dashed ${theme.palette.divider}` },
                  pl: { md: 3 },
                  ml: { md: 'auto' },
                }}
              >
                {/* 지원하기 버튼 */}
                <Button
                  variant="contained"
                  fullWidth
                  href={job.wantedInfoUrl}
                  target="_blank"
                  endIcon={
                    <ArrowForward 
                      className="hover-arrow" 
                      sx={{ transition: '0.2s', opacity: 0.7, transform: 'translateX(-4px)' }} 
                    />
                  }
                  sx={{
                    bgcolor: alpha(mainBlue, 0.85),
                    borderRadius: 2.5,
                    boxShadow: `0 4px 12px ${alpha(mainBlue, 0.18)}`,
                    fontWeight: 700,
                    py: 1.1,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      bgcolor: alpha(mainBlue, 0.95),
                      boxShadow: `0 6px 16px ${alpha(mainBlue, 0.28)}`,
                    },
                  }}
                >
                  지원하기
                </Button>

                {/* 자세히 보기 버튼 (관심 -> 자세히 보기) */}
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<DescriptionOutlined />}
                  sx={{
                    borderRadius: 2.5,
                    borderColor: 'divider',
                    color: 'text.secondary',
                    fontWeight: 600,
                    py: 1.1,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      borderColor: mainBlue,
                      color: mainBlue,
                      bgcolor: alpha(mainBlue, 0.04),
                    },
                  }}
                >
                  자세히 보기
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

// --- Helper Components ---

// 메타 텍스트 (아이콘 + 텍스트)
const MetaText = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <Stack direction="row" alignItems="center" spacing={0.6}>
    <Box sx={{ color: '#94a3b8', display: 'flex', '& svg': { fontSize: 17 } }}>
      {icon}
    </Box>
    <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.3px' }}>
      {text}
    </Typography>
  </Stack>
);

// 수직 구분선
const MetaDivider = () => (
  <Divider orientation="vertical" flexItem sx={{ height: 12, alignSelf: 'center', mx: 1.5, borderColor: '#cbd5e1' }} />
);

// 정보 뱃지
const InfoBadge = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <Box 
    sx={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: 0.6, 
      px: 1.2, 
      py: 0.6, 
      borderRadius: '8px', 
      bgcolor: '#F8FAFC', 
      border: '1px solid #E2E8F0', 
      color: '#475569', 
      transition: 'all 0.2s', 
      '&:hover': { bgcolor: '#F1F5F9', borderColor: '#CBD5E1' } 
    }}
  >
    <Box sx={{ display: 'flex', color: '#64748B', '& svg': { fontSize: 15 } }}>{icon}</Box>
    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1 }}>{label}</Typography>
  </Box>
);

export default JobPostingList;
