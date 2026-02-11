'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { fetchRecruitments } from '../services/fetchRecruitments';
import JobPostingList from './JobPostingList';
import { useReportStore } from '../store';

const PAGE_SIZE = 10;

const AllRecruitmentsTab = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    recruitments,
    recruitmentsNextOffset,
    recruitmentsHasMore,
    recruitmentsLoaded,
    appendRecruitments,
  } = useReportStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !recruitmentsHasMore) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchRecruitments(recruitmentsNextOffset, PAGE_SIZE);
      appendRecruitments(data.items, data.nextOffset, data.hasMore);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '채용 공고를 불러오지 못했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [appendRecruitments, isLoading, recruitmentsHasMore, recruitmentsNextOffset]);

  useEffect(() => {
    if (recruitmentsLoaded) return;
    void loadMore();
  }, [loadMore, recruitmentsLoaded]);

  useEffect(() => {
    if (!sentinelRef.current || !recruitmentsHasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore, recruitmentsHasMore]);

  return (
    <Box sx={{ width: '100%', maxWidth: '860px', mx: 'auto' }}>
      <Box sx={{ mt: 2, mb: 5, textAlign: 'center' }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          fontWeight={900}
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #1e293b 30%, #2563EB 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px',
            wordBreak: 'keep-all',
          }}
        >
          전체 채용공고
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          전체 공공기관 채용 공고를 최신순으로 확인할 수 있습니다.
          <br />
          스크롤 하단으로 이동하면 다음 공고를 자동으로 불러옵니다.
        </Typography>
      </Box>

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => void loadMore()}>
              재시도
            </Button>
          }
        >
          {errorMessage}
        </Alert>
      )}

      <JobPostingList jobPostings={recruitments} />

      <Stack alignItems="center" spacing={1.2} sx={{ py: 4 }}>
        {isLoading && (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={18} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              불러오는 중...
            </Typography>
          </Stack>
        )}
        {!isLoading && !recruitmentsHasMore && (
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            마지막 공고입니다.
          </Typography>
        )}
        <Box ref={sentinelRef} sx={{ width: '100%', height: 1 }} />
      </Stack>
    </Box>
  );
};

export default AllRecruitmentsTab;
