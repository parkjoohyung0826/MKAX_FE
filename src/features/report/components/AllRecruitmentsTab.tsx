'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { RecruitmentFilters, fetchRecruitments } from '../services/fetchRecruitments';
import JobPostingList from './JobPostingList';
import { useReportStore } from '../store';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const splitCsv = (value?: string | null) =>
  (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeValues = (values: readonly string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

const AllRecruitmentsTab = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    recruitments,
    recruitmentsNextOffset,
    recruitmentsHasMore,
    recruitmentsLoaded,
    appendRecruitments,
    resetRecruitments,
  } = useReportStore();

  const [qInput, setQInput] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [regions, setRegions] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [careerTypes, setCareerTypes] = useState<string[]>([]);
  const [educationLevels, setEducationLevels] = useState<string[]>([]);
  const [hireTypes, setHireTypes] = useState<string[]>([]);
  const [includeClosed, setIncludeClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const didMountRef = useRef(false);
  const requestIdRef = useRef(0);
  const filtersRef = useRef<RecruitmentFilters>({
    q: '',
    regions: [],
    fields: [],
    careerTypes: [],
    educationLevels: [],
    hireTypes: [],
    includeClosed: false,
  });
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const nextOffsetRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(qInput.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [qInput]);

  const filters: RecruitmentFilters = useMemo(
    () => ({
      q: debouncedQ,
      regions,
      fields,
      careerTypes,
      educationLevels,
      hireTypes,
      includeClosed,
    }),
    [careerTypes, debouncedQ, educationLevels, fields, hireTypes, includeClosed, regions]
  );

  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    hasMoreRef.current = recruitmentsHasMore;
  }, [recruitmentsHasMore]);

  useEffect(() => {
    nextOffsetRef.current = recruitmentsNextOffset;
  }, [recruitmentsNextOffset]);

  const regionOptions = useMemo(() => {
    const options = recruitments.flatMap((item) => {
      if (Array.isArray(item.workRgnNmList) && item.workRgnNmList.length > 0) {
        return item.workRgnNmList;
      }
      return splitCsv(item.workRgnNmLst ?? item.region);
    });
    return normalizeValues(options);
  }, [recruitments]);

  const fieldOptions = useMemo(() => {
    const options = recruitments.flatMap((item) => {
      if (Array.isArray(item.ncsCdNmList) && item.ncsCdNmList.length > 0) {
        return item.ncsCdNmList;
      }
      return splitCsv(item.ncsCdNmLst ?? item.indTpNm);
    });
    return normalizeValues(options);
  }, [recruitments]);

  const careerTypeOptions = useMemo(() => {
    const options = recruitments
      .map((item) => item.recrutSeNm ?? item.career)
      .filter(Boolean) as string[];
    return normalizeValues(options);
  }, [recruitments]);

  const educationOptions = useMemo(() => {
    const options = recruitments.flatMap((item) => {
      if (Array.isArray(item.acbgCondNmList) && item.acbgCondNmList.length > 0) {
        return item.acbgCondNmList;
      }
      return splitCsv(item.acbgCondNmLst ?? item.minEdubg);
    });
    return normalizeValues(options);
  }, [recruitments]);

  const hireTypeOptions = useMemo(() => {
    const options = recruitments.flatMap((item) => {
      if (Array.isArray(item.hireTypeNmList) && item.hireTypeNmList.length > 0) {
        return item.hireTypeNmList;
      }
      return splitCsv(item.hireTypeNmLst ?? item.holidayTpNm);
    });
    return normalizeValues(options);
  }, [recruitments]);

  const hasAppliedFilters =
    Boolean(debouncedQ) ||
    regions.length > 0 ||
    fields.length > 0 ||
    careerTypes.length > 0 ||
    educationLevels.length > 0 ||
    hireTypes.length > 0 ||
    includeClosed;

  const loadMore = useCallback(
    async (options?: { forceOffset?: number; resetBeforeLoad?: boolean }) => {
      const forceOffset = options?.forceOffset;
      if (forceOffset === undefined && (isLoadingRef.current || !hasMoreRef.current)) return;

      const requestId = ++requestIdRef.current;

      if (options?.resetBeforeLoad) {
        resetRecruitments();
      }

      setIsLoading(true);
      setErrorMessage(null);
      try {
        const offset = typeof forceOffset === 'number' ? forceOffset : nextOffsetRef.current;
        const data = await fetchRecruitments(offset, PAGE_SIZE, filtersRef.current);
        if (requestId !== requestIdRef.current) return;
        appendRecruitments(data.items, data.nextOffset, data.hasMore);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        setErrorMessage(
          error instanceof Error ? error.message : '채용 공고를 불러오지 못했습니다.'
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [appendRecruitments, resetRecruitments]
  );

  useEffect(() => {
    if (recruitmentsLoaded) return;
    void loadMore({ forceOffset: 0 });
  }, [loadMore, recruitmentsLoaded]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    void loadMore({ forceOffset: 0, resetBeforeLoad: true });
  }, [filterKey, loadMore]);

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

  const clearAllFilters = () => {
    setQInput('');
    setRegions([]);
    setFields([]);
    setCareerTypes([]);
    setEducationLevels([]);
    setHireTypes([]);
    setIncludeClosed(false);
  };

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

      <Stack
        spacing={2}
        sx={{
          mb: 3,
          p: { xs: 2, sm: 2.5 },
          border: '1px solid #e2e8f0',
          borderRadius: 3,
          backgroundColor: '#f8fafc',
        }}
      >
        <TextField
          fullWidth
          label="검색어"
          placeholder="공고명, 기관명 등으로 검색"
          value={qInput}
          onChange={(event) => setQInput(event.target.value)}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1.5,
          }}
        >
          <Autocomplete
            multiple
            freeSolo
            options={regionOptions}
            value={regions}
            onChange={(_, value) => setRegions(normalizeValues(value))}
            renderInput={(params) => <TextField {...params} label="지역" placeholder="예: 서울" />}
          />
          <Autocomplete
            multiple
            freeSolo
            options={fieldOptions}
            value={fields}
            onChange={(_, value) => setFields(normalizeValues(value))}
            renderInput={(params) => <TextField {...params} label="분야(NCS)" placeholder="예: IT" />}
          />
          <Autocomplete
            multiple
            freeSolo
            options={careerTypeOptions}
            value={careerTypes}
            onChange={(_, value) => setCareerTypes(normalizeValues(value))}
            renderInput={(params) => (
              <TextField {...params} label="신입/경력" placeholder="예: 신입, 경력" />
            )}
          />
          <Autocomplete
            multiple
            freeSolo
            options={educationOptions}
            value={educationLevels}
            onChange={(_, value) => setEducationLevels(normalizeValues(value))}
            renderInput={(params) => (
              <TextField {...params} label="학력 조건" placeholder="예: 대졸 이상" />
            )}
          />
          <Autocomplete
            multiple
            freeSolo
            options={hireTypeOptions}
            value={hireTypes}
            onChange={(_, value) => setHireTypes(normalizeValues(value))}
            renderInput={(params) => (
              <TextField {...params} label="채용 형태" placeholder="예: 정규직, 계약직" />
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={includeClosed}
                  onChange={(_, checked) => setIncludeClosed(checked)}
                />
              }
              label="마감 공고 포함"
            />
          </Box>
        </Box>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" onClick={clearAllFilters} disabled={!hasAppliedFilters}>
            전체 해제
          </Button>
        </Stack>

        {hasAppliedFilters && (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {debouncedQ && (
              <Chip label={`검색: ${debouncedQ}`} onDelete={() => setQInput('')} />
            )}
            {regions.map((value) => (
              <Chip
                key={`region-${value}`}
                label={`지역: ${value}`}
                onDelete={() => setRegions(regions.filter((item) => item !== value))}
              />
            ))}
            {fields.map((value) => (
              <Chip
                key={`field-${value}`}
                label={`분야: ${value}`}
                onDelete={() => setFields(fields.filter((item) => item !== value))}
              />
            ))}
            {careerTypes.map((value) => (
              <Chip
                key={`career-${value}`}
                label={`경력: ${value}`}
                onDelete={() =>
                  setCareerTypes(careerTypes.filter((item) => item !== value))
                }
              />
            ))}
            {educationLevels.map((value) => (
              <Chip
                key={`education-${value}`}
                label={`학력: ${value}`}
                onDelete={() =>
                  setEducationLevels(educationLevels.filter((item) => item !== value))
                }
              />
            ))}
            {hireTypes.map((value) => (
              <Chip
                key={`hire-${value}`}
                label={`채용 형태: ${value}`}
                onDelete={() => setHireTypes(hireTypes.filter((item) => item !== value))}
              />
            ))}
            {includeClosed && (
              <Chip label="마감 공고 포함" onDelete={() => setIncludeClosed(false)} />
            )}
          </Stack>
        )}
      </Stack>

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

      {isLoading && recruitments.length === 0 ? (
        <Stack spacing={1.2}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={88} />
          ))}
        </Stack>
      ) : (
        <JobPostingList jobPostings={recruitments} />
      )}

      {!isLoading && recruitments.length === 0 && !errorMessage && (
        <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
          {hasAppliedFilters
            ? '조건에 맞는 채용 공고가 없습니다. 필터를 조정해 보세요.'
            : '불러올 채용 공고가 없습니다.'}
        </Alert>
      )}

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
