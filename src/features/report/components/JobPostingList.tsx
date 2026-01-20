import React from 'react';
import { JobPosting } from '../types';
import {
  Box,
  Card,
  Typography,
  Chip,
  Stack,
  Button,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  LocationOnOutlined,
  WorkOutline,
  EventAvailable,
  ArrowForward,
  BookmarkBorder,
} from '@mui/icons-material';

interface JobPostingListProps {
  jobPostings: JobPosting[];
}

const JobPostingList: React.FC<JobPostingListProps> = ({ jobPostings }) => {
  const theme = useTheme();
  const mainBlue = '#2563EB';

  return (
    <Box sx={{ mt: 4 }}>
      <Stack spacing={2.5}>
        {jobPostings.map((job) => (
          <Card
            key={job.wantedAuthNo}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-3px)',
                borderColor: alpha(mainBlue, 0.5),
                boxShadow: `0 12px 30px ${alpha(mainBlue, 0.08)}`,
                '& .hover-action': { opacity: 1, transform: 'translateX(0)' },
              },
            }}
          >
            {/* Flexbox 컨테이너: space-between 적용 */}
            <Box
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' }, // 모바일: 세로, PC: 가로
                justifyContent: 'space-between', // ★ 핵심: 양쪽 끝으로 밀어내기
                alignItems: { xs: 'stretch', sm: 'center' }, // PC에서는 수직 중앙 정렬
                gap: 3, // 왼쪽과 오른쪽 사이 최소 간격
              }}
            >
              {/* 1. 왼쪽: 로고 + 주요 정보 */}
              <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2.5,
                    bgcolor: alpha(mainBlue, 0.06),
                    color: mainBlue,
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    border: `1px solid ${alpha(mainBlue, 0.1)}`,
                    flexShrink: 0, // 로고 크기 고정
                  }}
                >
                  {job.company?.charAt(0)}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Chip
                      icon={<EventAvailable sx={{ fontSize: '0.9rem !important' }} />}
                      label={job.closeDt}
                      size="small"
                      sx={{
                        height: 24,
                        bgcolor: alpha('#0288d1', 0.08),
                        color: '#0288d1',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        border: `1px solid ${alpha('#0288d1', 0.1)}`,
                        '.MuiChip-icon': { color: '#0288d1' },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}
                    >
                      {job.company}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      mb: 1.5,
                      lineHeight: 1.3,
                      fontSize: '1.1rem',
                      color: 'text.primary',
                      cursor: 'pointer',
                      '&:hover': { color: mainBlue },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {job.title}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={2}
                    flexWrap="wrap"
                    sx={{ mb: 2, rowGap: 1 }}
                  >
                    <MetaItem icon={<LocationOnOutlined />} text={job.basicAddr} />
                    <MetaItem icon={<WorkOutline />} text={job.career} />
                  </Stack>

                  <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                    <SoftChip label={job.minEdubg} color={mainBlue} />
                    <SoftChip label={job.holidayTpNm} color={mainBlue} />
                    <SoftChip label={job.indTpNm} variant="outlined" color={mainBlue} />
                  </Stack>
                </Box>
              </Box>

              {/* 2. 오른쪽: 액션 버튼 그룹 */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', sm: 'column' },
                  gap: 1.2,
                  flexShrink: 0, // 버튼 영역이 줄어들지 않도록 고정
                  minWidth: { sm: '140px' },
                  // 데스크탑에서만 구분선 표시
                  borderLeft: { sm: `1px dashed ${theme.palette.divider}` },
                  pl: { sm: 3 },
                  // space-between이 적용되어 있지만, 왼쪽 마진을 auto로 주면 더 확실하게 밀립니다.
                  ml: { sm: 'auto' },
                }}
              >
                <Button
                  variant="contained"
                  fullWidth // 모바일에서는 가로 꽉 참, PC에서는 부모 width 따름
                  href={job.wantedInfoUrl}
                  target="_blank"
                  endIcon={<ArrowForward className="hover-action" sx={{ transition: '0.2s', opacity: 0.7, transform: 'translateX(-4px)' }} />}
                  sx={{
                    bgcolor: mainBlue,
                    borderRadius: 2.5,
                    boxShadow: `0 4px 12px ${alpha(mainBlue, 0.25)}`,
                    fontWeight: 700,
                    py: 1.1,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      bgcolor: alpha(mainBlue, 0.9),
                      boxShadow: `0 6px 16px ${alpha(mainBlue, 0.35)}`,
                    },
                  }}
                >
                  지원하기
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<BookmarkBorder />}
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
                  관심
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

// --- Sub Components ---

function MetaItem({ icon, text, highlight = false }: { icon: React.ReactNode; text: string, highlight?: boolean }) {
  return (
    <Stack direction="row" spacing={0.6} alignItems="center">
      <Box sx={{ display: 'flex', color: highlight ? 'text.primary' : 'text.disabled', '& svg': { fontSize: 17 } }}>
        {icon}
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: highlight ? 'text.primary' : 'text.secondary',
          fontWeight: highlight ? 600 : 500,
          fontSize: '0.85rem',
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
}

function SoftChip({
  label,
  variant = 'filled',
  color,
}: {
  label: string;
  variant?: 'filled' | 'outlined';
  color: string;
}) {
  const isOutlined = variant === 'outlined';
  return (
    <Chip
      label={label}
      size="small"
      variant={isOutlined ? 'outlined' : 'filled'}
      sx={{
        height: 24,
        borderRadius: 1.5,
        fontWeight: 600,
        fontSize: '0.75rem',
        border: isOutlined ? `1px solid ${alpha(color, 0.2)}` : 'none',
        bgcolor: isOutlined ? 'transparent' : alpha(color, 0.08),
        color: isOutlined ? 'text.secondary' : color,
        '&:hover': {
          bgcolor: isOutlined ? alpha(color, 0.04) : alpha(color, 0.12),
        }
      }}
    />
  );
}

export default JobPostingList;
