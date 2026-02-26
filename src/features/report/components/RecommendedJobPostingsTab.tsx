'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import JobPostingList from './JobPostingList';
import { JobPosting } from '../types';
import { fetchMatchedRecruitments, mapMatchedRecruitmentsToJobPostings } from '../services/fetchMatchedRecruitments';

interface RecommendedJobPostingsTabProps {
  code?: string;
  initialJobPostings: JobPosting[];
  initialMeta?: {
    nextOffset: number;
    hasMore: boolean;
    prefetched: boolean;
  };
}

const PAGE_SIZE = 10;

const toDedupeKey = (item: JobPosting, index: number) =>
  item.wantedAuthNo?.trim() ||
  item.recrutPblntSn?.toString() ||
  `${item.title}-${item.company}-${item.closeDt}-${index}`;

const dedupeByWantedAuthNo = (prev: JobPosting[], next: JobPosting[]) => {
  const map = new Map<string, JobPosting>();
  prev.forEach((item, idx) => map.set(toDedupeKey(item, idx), item));
  next.forEach((item, idx) => {
    const key = toDedupeKey(item, idx);
    if (!map.has(key)) {
      map.set(key, item);
    }
  });
  return Array.from(map.values());
};

const RecommendedJobPostingsTab: React.FC<RecommendedJobPostingsTabProps> = ({
  code,
  initialJobPostings,
  initialMeta,
}) => {
  const [items, setItems] = useState<JobPosting[]>(initialJobPostings);
  const [nextOffset, setNextOffset] = useState(initialMeta?.nextOffset ?? initialJobPostings.length);
  const [hasMore, setHasMore] = useState(initialMeta?.hasMore ?? Boolean(code));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const initializedCodeRef = useRef<string | undefined>(undefined);

  const fetchRecommended = useCallback(
    async (offset: number, replace = false) => {
      if (!code || loadingRef.current) return;
      loadingRef.current = true;
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await fetchMatchedRecruitments(code, offset, PAGE_SIZE);
        const mapped = mapMatchedRecruitmentsToJobPostings(data.items);

        setItems((prev) =>
          replace ? mapped : dedupeByWantedAuthNo(prev, mapped)
        );
        setNextOffset(data.nextOffset);
        setHasMore(data.hasMore);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : '추천 채용 공고를 불러오지 못했습니다.'
        );
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
    [code]
  );

  useEffect(() => {
    if (!code) {
      setItems(initialJobPostings);
      setNextOffset(0);
      setHasMore(false);
      initializedCodeRef.current = undefined;
      return;
    }

    if (initializedCodeRef.current === code) return;
    initializedCodeRef.current = code;

    setItems(initialJobPostings);
    setNextOffset(initialMeta?.nextOffset ?? initialJobPostings.length);
    setHasMore(initialMeta?.hasMore ?? true);

    if (!initialMeta?.prefetched) {
      void fetchRecommended(0, initialJobPostings.length === 0);
    }
  }, [code, fetchRecommended, initialJobPostings, initialMeta]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore || !code) return;
    void fetchRecommended(nextOffset, false);
  }, [code, fetchRecommended, hasMore, isLoading, nextOffset]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || !code) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [code, hasMore, loadMore]);

  return (
    <Box>
      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={loadMore}>
              재시도
            </Button>
          }
        >
          {errorMessage}
        </Alert>
      )}

      <JobPostingList jobPostings={items} />

      <Stack alignItems="center" spacing={1.2} sx={{ py: 4 }}>
        {isLoading && (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={18} />
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              추천 공고를 불러오는 중...
            </Typography>
          </Stack>
        )}
        {!isLoading && !hasMore && (
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
            마지막 추천 공고입니다.
          </Typography>
        )}
        <Box ref={sentinelRef} sx={{ width: '100%', height: 1 }} />
      </Stack>
    </Box>
  );
};

export default RecommendedJobPostingsTab;
