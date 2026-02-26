import React, { useState } from 'react';
import { JobPosting } from '../types';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AccessTimeOutlined,
  ArrowForward,
  BusinessOutlined,
  DescriptionOutlined,
  EventAvailable,
  LocationOnOutlined,
  SchoolOutlined,
  WorkOutline,
} from '@mui/icons-material';
import JobPostingDetailModal from './JobPostingDetailModal';

interface JobPostingListProps {
  jobPostings: JobPosting[];
  loading?: boolean;
}

const JobPostingList: React.FC<JobPostingListProps> = ({
  jobPostings,
  loading = false,
}) => {
  const theme = useTheme();
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

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
              borderRadius: { xs: '16px', sm: '20px' },
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: { xs: 'none', sm: 'translateY(-4px)' },
                borderColor: alpha(COLORS.primary, 0.4),
                boxShadow: `0 12px 24px -6px ${alpha(COLORS.primary, 0.12)}`,
                '& .hover-arrow': { transform: 'translateX(0)', opacity: 1 },
              },
            }}
          >
            <Box
              sx={{
                p: { xs: 2, sm: 3.5 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 2, sm: 3 },
              }}
            >
              <Box sx={{ display: 'flex', gap: { xs: 1.2, sm: 2.5 }, flex: 1, minWidth: 0 }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: { xs: 40, sm: 52 },
                    height: { xs: 40, sm: 52 },
                    borderRadius: { xs: '10px', sm: '14px' },
                    bgcolor: '#fff',
                    color: COLORS.primary,
                    fontWeight: 800,
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    border: `1px solid ${alpha('#cbd5e1', 0.5)}`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                    flexShrink: 0,
                  }}
                >
                  {job.company?.charAt(0)}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: COLORS.textBody, fontSize: { xs: '0.78rem', sm: '0.85rem' } }}
                    >
                      {job.company}
                    </Typography>
                    <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#cbd5e1', display: { xs: 'none', sm: 'block' } }} />
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <EventAvailable sx={{ fontSize: 14, color: '#EF4444' }} />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: '#EF4444', letterSpacing: '-0.2px', fontSize: { xs: '0.68rem', sm: '0.75rem' } }}
                      >
                        {job.closeDt}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      mb: { xs: 1.2, sm: 2 },
                      fontSize: { xs: '0.95rem', sm: '1.15rem' },
                      color: COLORS.textTitle,
                      cursor: 'pointer',
                      lineHeight: 1.4,
                      transition: 'color 0.2s',
                      '&:hover': { color: COLORS.primary },
                      display: '-webkit-box',
                      WebkitLineClamp: { xs: 2, sm: 1 },
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {job.title}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0}
                    sx={{ mb: { xs: 1.2, sm: 2 }, flexWrap: 'wrap', gap: { xs: 0.8, sm: 1.5 } }}
                  >
                    <MetaText icon={<LocationOnOutlined />} text={job.basicAddr || job.region} />
                    <MetaDivider />
                    <MetaText icon={<WorkOutline />} text={job.career} />
                    <MetaDivider />
                    <MetaText icon={<BusinessOutlined />} text={job.indTpNm} />
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
                    <InfoBadge icon={<SchoolOutlined />} label={job.minEdubg} />
                    <InfoBadge icon={<AccessTimeOutlined />} label={job.holidayTpNm} />
                  </Stack>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  gap: 1.2,
                  flexShrink: 0,
                  minWidth: { md: '140px' },
                  justifyContent: { xs: 'flex-start', md: 'center' },
                  width: { xs: '100%', md: 'auto' },
                  '& > *': { flex: { xs: 1, md: 'initial' } },
                  borderLeft: { md: `1px dashed ${theme.palette.divider}` },
                  pl: { md: 3 },
                  ml: { md: 'auto' },
                }}
              >
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
                    py: { xs: 0.9, md: 1.1 },
                    fontSize: { xs: '0.82rem', sm: '0.9rem' },
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

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<DescriptionOutlined />}
                  onClick={() => setSelectedJob(job)}
                  sx={{
                    borderRadius: 2.5,
                    borderColor: 'divider',
                    color: 'text.secondary',
                    fontWeight: 600,
                    py: { xs: 0.9, md: 1.1 },
                    fontSize: { xs: '0.82rem', sm: '0.9rem' },
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

      <JobPostingDetailModal
        open={Boolean(selectedJob)}
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      {loading && (
        <Typography sx={{ mt: 3, textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
          채용 공고를 불러오는 중입니다...
        </Typography>
      )}
    </Box>
  );
};

const MetaText = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <Stack direction="row" alignItems="center" spacing={0.6}>
    <Box sx={{ color: '#94a3b8', display: 'flex', '& svg': { fontSize: 17 } }}>
      {icon}
    </Box>
    <Typography
      variant="body2"
      sx={{ color: '#475569', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.3px' }}
    >
      {text}
    </Typography>
  </Stack>
);

const MetaDivider = () => (
  <Divider
    orientation="vertical"
    flexItem
    sx={{ height: 12, alignSelf: 'center', mx: 1.5, borderColor: '#cbd5e1' }}
  />
);

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
      '&:hover': { bgcolor: '#F1F5F9', borderColor: '#CBD5E1' },
    }}
  >
    <Box sx={{ display: 'flex', color: '#64748B', '& svg': { fontSize: 15 } }}>{icon}</Box>
    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, lineHeight: 1 }}>
      {label}
    </Typography>
  </Box>
);

export default JobPostingList;
