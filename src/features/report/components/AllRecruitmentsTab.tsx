'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  FormControlLabel,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
  Popper,
} from '@mui/material';
import {
  SearchRounded,
  TuneRounded,
  RestartAltRounded,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  FilterListRounded,
  PlaceRounded,       // 지역
  CategoryRounded,    // 분야
  BadgeRounded,       // 경력
  SchoolRounded,      // 학력
  AccessTimeRounded,  // 고용형태
  CheckRounded,
} from '@mui/icons-material';
import { RecruitmentFilters, fetchRecruitments } from '../services/fetchRecruitments';
import JobPostingList from './JobPostingList';
import { useReportStore } from '../store';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

// --- Utility Functions ---
const splitCsv = (value?: string | null) =>
  (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeValues = (values: readonly string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

// --- Styles ---
const ANTIGRAVITY_SHADOW = '0 20px 40px -4px rgba(145, 158, 171, 0.16), 0 4px 8px -2px rgba(145, 158, 171, 0.08)';

// 슬림해진 입력 필드 스타일
const filterInputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px', // 조금 더 둥글게 (12px)
    backgroundColor: '#F9FAFB',
    transition: 'all 0.2s',
    paddingLeft: '10px', // 아이콘 공간 확보
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': { borderColor: '#DFE3E8' },
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      '& fieldset': { borderColor: '#3182F6' },
    },
    // 높이 축소 (Small size overrides)
    '& .MuiInputBase-input': {
      paddingTop: '8.5px',
      paddingBottom: '8.5px',
      fontSize: '0.9rem',
      fontWeight: 500,
    },
  },
  '& .MuiInputLabel-root': { display: 'none' }, // 라벨 숨김 (Placeholder 사용)
};

// 커스텀 드롭다운(Popper) 스타일
const CustomPopper = (props: any) => {
  return (
    <Popper 
      {...props} 
      placement="bottom-start" 
      sx={{ 
        zIndex: 1300,
        width: props.anchorEl?.clientWidth, // 입력창 너비와 동일하게
      }} 
    />
  );
};

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

  // --- Filter States ---
  const [qInput, setQInput] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [regions, setRegions] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [careerTypes, setCareerTypes] = useState<string[]>([]);
  const [educationLevels, setEducationLevels] = useState<string[]>([]);
  const [hireTypes, setHireTypes] = useState<string[]>([]);
  const [includeClosed, setIncludeClosed] = useState(false);
  
  // UI States
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- Refs & Infinite Scroll ---
  const didMountRef = useRef(false);
  const requestIdRef = useRef(0);
  const filtersRef = useRef<RecruitmentFilters>({ q: '', regions: [], fields: [], careerTypes: [], educationLevels: [], hireTypes: [], includeClosed: false });
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const nextOffsetRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(qInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [qInput]);

  const filters: RecruitmentFilters = useMemo(() => ({ q: debouncedQ, regions, fields, careerTypes, educationLevels, hireTypes, includeClosed }), [careerTypes, debouncedQ, educationLevels, fields, hireTypes, includeClosed, regions]);
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => { filtersRef.current = filters; }, [filters]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => { hasMoreRef.current = recruitmentsHasMore; }, [recruitmentsHasMore]);
  useEffect(() => { nextOffsetRef.current = recruitmentsNextOffset; }, [recruitmentsNextOffset]);

  const regionOptions = useMemo(() => normalizeValues(recruitments.flatMap(i => Array.isArray(i.workRgnNmList) && i.workRgnNmList.length ? i.workRgnNmList : splitCsv(i.workRgnNmLst ?? i.region))), [recruitments]);
  const fieldOptions = useMemo(() => normalizeValues(recruitments.flatMap(i => Array.isArray(i.ncsCdNmList) && i.ncsCdNmList.length ? i.ncsCdNmList : splitCsv(i.ncsCdNmLst ?? i.indTpNm))), [recruitments]);
  const careerTypeOptions = useMemo(() => normalizeValues(recruitments.map(i => i.recrutSeNm ?? i.career).filter(Boolean) as string[]), [recruitments]);
  const educationOptions = useMemo(() => normalizeValues(recruitments.flatMap(i => Array.isArray(i.acbgCondNmList) && i.acbgCondNmList.length ? i.acbgCondNmList : splitCsv(i.acbgCondNmLst ?? i.minEdubg))), [recruitments]);
  const hireTypeOptions = useMemo(() => normalizeValues(recruitments.flatMap(i => Array.isArray(i.hireTypeNmList) && i.hireTypeNmList.length ? i.hireTypeNmList : splitCsv(i.hireTypeNmLst ?? i.holidayTpNm))), [recruitments]);

  const hasAppliedFilters = Boolean(debouncedQ) || regions.length > 0 || fields.length > 0 || careerTypes.length > 0 || educationLevels.length > 0 || hireTypes.length > 0 || includeClosed;

  const loadMore = useCallback(async (options?: { forceOffset?: number; resetBeforeLoad?: boolean }) => {
    const forceOffset = options?.forceOffset;
    if (forceOffset === undefined && (isLoadingRef.current || !hasMoreRef.current)) return;

    const requestId = ++requestIdRef.current;
    if (options?.resetBeforeLoad) resetRecruitments();

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const offset = typeof forceOffset === 'number' ? forceOffset : nextOffsetRef.current;
      const data = await fetchRecruitments(offset, PAGE_SIZE, filtersRef.current);
      if (requestId !== requestIdRef.current) return;
      appendRecruitments(data.items, data.nextOffset, data.hasMore);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setErrorMessage(error instanceof Error ? error.message : '채용 공고를 불러오지 못했습니다.');
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [appendRecruitments, resetRecruitments]);

  useEffect(() => { if (!recruitmentsLoaded) void loadMore({ forceOffset: 0 }); }, [loadMore, recruitmentsLoaded]);
  useEffect(() => { if (!didMountRef.current) { didMountRef.current = true; return; } void loadMore({ forceOffset: 0, resetBeforeLoad: true }); }, [filterKey, loadMore]);
  
  useEffect(() => {
    if (!sentinelRef.current || !recruitmentsHasMore) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) void loadMore(); }, { rootMargin: '200px' });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore, recruitmentsHasMore]);

  const clearAllFilters = () => {
    setQInput(''); setRegions([]); setFields([]); setCareerTypes([]); setEducationLevels([]); setHireTypes([]); setIncludeClosed(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '900px', mx: 'auto', px: 2 }}>
      
      {/* 1. Header Area */}
      <Box sx={{ mt: 3, mb: 5, textAlign: 'center' }}>
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
        <Typography variant="body1" sx={{ color: '#637381', mt: 1, fontSize: '0.95rem' }}>
          원하는 조건으로 공공기관 공고를 검색해보세요.
        </Typography>
      </Box>

      {/* 2. Slim Antigravity Filter Box */}
      <Paper
        elevation={0}
        sx={{
          mb: 5,
          borderRadius: '24px',
          bgcolor: '#FFFFFF',
          boxShadow: ANTIGRAVITY_SHADOW,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ p: 2 }}> {/* 패딩 축소 (2.5 -> 2) */}
          
          {/* Top Row: Search + Filter Toggle */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Search Input */}
            <TextField
              fullWidth
              placeholder="기관명, 공고명 검색"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#F4F6F8',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  height: '42px', // 높이 축소 (48 -> 42)
                  '& fieldset': { border: 'none' },
                  '&:hover': { backgroundColor: '#EDEFF1' },
                  '&.Mui-focused': { 
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 0 0 2px #3182F6',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ color: '#919EAB', fontSize: 20, ml: 0.5 }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Filter Toggle Button */}
            <Button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              variant="outlined"
              startIcon={<TuneRounded sx={{ fontSize: '18px !important' }} />}
              endIcon={isFilterExpanded ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
              sx={{
                minWidth: 'fit-content',
                height: '42px', // 검색창 높이와 일치
                borderColor: isFilterExpanded ? '#3182F6' : 'transparent',
                color: isFilterExpanded ? '#3182F6' : '#637381',
                bgcolor: isFilterExpanded ? alpha('#3182F6', 0.08) : '#F4F6F8',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'none',
                borderRadius: '12px',
                px: 2,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                '&:hover': { 
                  bgcolor: isFilterExpanded ? alpha('#3182F6', 0.12) : '#EDEFF1',
                  borderColor: isFilterExpanded ? '#3182F6' : 'transparent',
                }
              }}
            >
              상세 필터
            </Button>
          </Stack>

          {/* Collapsible Detailed Filters */}
          <Collapse in={isFilterExpanded}>
            <Box sx={{ pt: 2 }}>
              <Divider sx={{ mb: 2, borderStyle: 'dashed', borderColor: '#E5E8EB' }} />
              
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                  gap: 1.5 // 간격 축소 (2.5 -> 1.5)
                }}
              >
                {[
                  { label: '근무 지역', icon: <PlaceRounded />, value: regions, setter: setRegions, options: regionOptions },
                  { label: '채용 분야 (NCS)', icon: <CategoryRounded />, value: fields, setter: setFields, options: fieldOptions },
                  { label: '신입/경력', icon: <BadgeRounded />, value: careerTypes, setter: setCareerTypes, options: careerTypeOptions },
                  { label: '학력 조건', icon: <SchoolRounded />, value: educationLevels, setter: setEducationLevels, options: educationOptions },
                  { label: '고용 형태', icon: <AccessTimeRounded />, value: hireTypes, setter: setHireTypes, options: hireTypeOptions },
                ].map((filter, idx) => (
                  <Autocomplete
                    key={idx}
                    multiple
                    disableCloseOnSelect
                    PopperComponent={CustomPopper} // 커스텀 드롭다운 적용
                    options={filter.options}
                    value={filter.value}
                    onChange={(_, v) => filter.setter(normalizeValues(v))}
                    // 커스텀 드롭다운 옵션 렌더링
                    renderOption={(props, option, { selected }) => (
                      <li {...props} style={{ padding: '8px 12px', fontSize: '0.9rem', borderRadius: '8px', marginBottom: '2px', transition: 'background 0.2s' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <span style={{ fontWeight: selected ? 600 : 400, color: selected ? '#3182F6' : 'inherit' }}>{option}</span>
                          {selected && <CheckRounded sx={{ color: '#3182F6', fontSize: 18 }} />}
                        </Box>
                      </li>
                    )}
                    // 드롭다운 Paper 스타일
                    componentsProps={{
                      paper: {
                        sx: {
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
                          border: '1px solid #F2F4F6',
                          mt: 1,
                          '& .MuiAutocomplete-listbox': { p: 1 }
                        }
                      }
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        placeholder={filter.value.length > 0 ? '' : filter.label} 
                        size="small"
                        sx={filterInputSx} 
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start" sx={{ mr: 0.5 }}>
                                {React.cloneElement(filter.icon as React.ReactElement, { sx: { color: '#919EAB', fontSize: 18 } })}
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          )
                        }}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={index}
                          label={option}
                          size="small"
                          sx={{ 
                            height: '22px',
                            fontWeight: 600, 
                            bgcolor: alpha('#3182F6', 0.1), 
                            color: '#3182F6',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            border: 'none',
                            '& .MuiChip-deleteIcon': { color: '#3182F6', opacity: 0.6, fontSize: '14px', '&:hover': { opacity: 1 } }
                          }}
                        />
                      ))
                    }
                  />
                ))}
                
                {/* Switch & Reset Row */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      height: '42px', // 높이 일치
                      borderRadius: '12px',
                      border: '1px solid transparent',
                      backgroundColor: '#F9FAFB',
                      transition: 'all 0.2s',
                      '&:hover': { backgroundColor: '#F4F6F8' },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={includeClosed}
                          onChange={(_, c) => setIncludeClosed(c)}
                          sx={{
                            mr: 1,
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#3182F6' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#3182F6', opacity: 0.5 },
                          }}
                        />
                      }
                      label={<Typography sx={{ fontWeight: 600, color: '#454F5B', fontSize: '0.85rem' }}>마감 포함</Typography>}
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Box>
                  
                  {hasAppliedFilters && (
                    <Button
                      onClick={clearAllFilters}
                      startIcon={<RestartAltRounded sx={{ fontSize: 16 }} />}
                      sx={{ 
                        height: '42px',
                        minWidth: 'fit-content',
                        color: '#FF5630', 
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        borderRadius: '12px',
                        px: 1.5,
                        bgcolor: alpha('#FF5630', 0.08),
                        '&:hover': { bgcolor: alpha('#FF5630', 0.12) }
                      }}
                    >
                      초기화
                    </Button>
                  )}
                </Stack>
              </Box>
            </Box>
          </Collapse>

          {/* Applied Filter Chips (Summary) */}
          {!isFilterExpanded && hasAppliedFilters && (
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, overflowX: 'auto', pb: 0.5, scrollbarWidth: 'none' }}>
              {regions.map(v => <AppliedFilterChip key={v} label={v} onDelete={() => setRegions(regions.filter(i => i !== v))} />)}
              {fields.map(v => <AppliedFilterChip key={v} label={v} onDelete={() => setFields(fields.filter(i => i !== v))} />)}
              {careerTypes.map(v => <AppliedFilterChip key={v} label={v} onDelete={() => setCareerTypes(careerTypes.filter(i => i !== v))} />)}
              {educationLevels.map(v => <AppliedFilterChip key={v} label={v} onDelete={() => setEducationLevels(educationLevels.filter(i => i !== v))} />)}
              {hireTypes.map(v => <AppliedFilterChip key={v} label={v} onDelete={() => setHireTypes(hireTypes.filter(i => i !== v))} />)}
              {includeClosed && <AppliedFilterChip label="마감 포함" onDelete={() => setIncludeClosed(false)} />}
            </Stack>
          )}
        </Box>
      </Paper>

      {/* 3. Error Message */}
      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: '16px', boxShadow: '0 8px 16px rgba(255, 86, 48, 0.16)' }}
          action={<Button color="inherit" size="small" onClick={() => void loadMore()}>재시도</Button>}
        >
          {errorMessage}
        </Alert>
      )}

      {/* 4. Content List */}
      {isLoading && recruitments.length === 0 ? (
        <Stack spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: '20px' }} />
          ))}
        </Stack>
      ) : (
        <JobPostingList jobPostings={recruitments} />
      )}

      {/* 5. Empty State */}
      {!isLoading && recruitments.length === 0 && !errorMessage && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FilterListRounded sx={{ fontSize: 60, color: '#DFE3E8', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#637381', fontWeight: 600 }}>
            {hasAppliedFilters ? '조건에 맞는 공고가 없습니다.' : '등록된 채용 공고가 없습니다.'}
          </Typography>
          {hasAppliedFilters && (
             <Button 
              variant="outlined" 
              onClick={clearAllFilters} 
              sx={{ mt: 2, borderRadius: '20px', textTransform: 'none' }}
            >
               필터 초기화하기
             </Button>
          )}
        </Box>
      )}

      {/* 6. Loading Indicator */}
      <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
        {isLoading && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CircularProgress size={20} thickness={4} sx={{ color: '#3182F6' }} />
            <Typography variant="body2" sx={{ color: '#637381', fontWeight: 600 }}>
              공고를 불러오는 중입니다...
            </Typography>
          </Stack>
        )}
        <Box ref={sentinelRef} sx={{ width: '100%', height: 1 }} />
      </Stack>
    </Box>
  );
};

// --- Helper Component ---
const AppliedFilterChip = ({ label, onDelete }: { label: string; onDelete: () => void }) => (
  <Chip
    label={label}
    onDelete={onDelete}
    size="small"
    sx={{
      height: '26px',
      fontWeight: 600,
      bgcolor: '#FFFFFF',
      color: '#454F5B',
      borderRadius: '8px',
      border: '1px solid #DFE3E8',
      fontSize: '0.8rem',
      '& .MuiChip-deleteIcon': { color: '#919EAB', '&:hover': { color: '#637381' } }
    }}
  />
);

export default AllRecruitmentsTab;