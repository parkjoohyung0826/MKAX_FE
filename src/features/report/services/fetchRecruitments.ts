import { JobPosting } from '../types';
import { mapMatchedRecruitmentsToJobPostings } from './fetchMatchedRecruitments';
import { requestJson } from './http';

type RecruitmentsApiResponse = {
  items?: any[];
  total?: number;
  nextOffset?: number;
  hasMore?: boolean;
  result?: {
    items?: any[];
    total?: number;
    nextOffset?: number;
    hasMore?: boolean;
  };
};

export type RecruitmentsResponse = {
  items: JobPosting[];
  total: number;
  nextOffset: number;
  hasMore: boolean;
};

export type RecruitmentFilters = {
  q?: string;
  regions?: string[];
  fields?: string[];
  careerTypes?: string[];
  educationLevels?: string[];
  hireTypes?: string[];
  includeClosed?: boolean;
};

export type RecruitmentFilterOptions = {
  regions: string[];
  fields: string[];
  careerTypes: string[];
  educationLevels: string[];
  hireTypes: string[];
};

const extractEnvelope = (raw: RecruitmentsApiResponse) => {
  if (raw?.result && typeof raw.result === 'object') return raw.result;
  return raw;
};

export async function fetchRecruitments(
  offset = 0,
  limit = 10,
  filters: RecruitmentFilters = {}
): Promise<RecruitmentsResponse> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  });

  if (filters.q?.trim()) params.set('q', filters.q.trim());
  if (filters.regions?.length) params.set('regions', filters.regions.join(','));
  if (filters.fields?.length) params.set('fields', filters.fields.join(','));
  if (filters.careerTypes?.length) params.set('careerTypes', filters.careerTypes.join(','));
  if (filters.educationLevels?.length) {
    params.set('educationLevels', filters.educationLevels.join(','));
  }
  if (filters.hireTypes?.length) params.set('hireTypes', filters.hireTypes.join(','));
  if (typeof filters.includeClosed === 'boolean') {
    params.set('includeClosed', String(filters.includeClosed));
  }

  const res = await fetch(`/api/report/recruitments?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });

  const raw = await requestJson<RecruitmentsApiResponse>(res, {
    fallbackMessage: '전체 채용 공고 조회 실패',
  });
  const envelope = extractEnvelope(raw);
  const rawItems = Array.isArray(envelope.items) ? envelope.items : [];

  return {
    items: mapMatchedRecruitmentsToJobPostings(rawItems),
    total: typeof envelope.total === 'number' ? envelope.total : rawItems.length,
    nextOffset: typeof envelope.nextOffset === 'number' ? envelope.nextOffset : offset + rawItems.length,
    hasMore: typeof envelope.hasMore === 'boolean' ? envelope.hasMore : rawItems.length >= limit,
  };
}

export async function fetchRecruitmentFilterOptions(
  includeClosed?: boolean
): Promise<RecruitmentFilterOptions> {
  const params = new URLSearchParams();
  if (typeof includeClosed === 'boolean') {
    params.set('includeClosed', String(includeClosed));
  }

  const query = params.toString();
  const url = query
    ? `/api/report/recruitments/filters?${query}`
    : '/api/report/recruitments/filters';

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const raw = await requestJson<Partial<RecruitmentFilterOptions>>(res, {
    fallbackMessage: '필터 옵션 조회 실패',
  });
  return {
    regions: Array.isArray(raw.regions) ? raw.regions : [],
    fields: Array.isArray(raw.fields) ? raw.fields : [],
    careerTypes: Array.isArray(raw.careerTypes) ? raw.careerTypes : [],
    educationLevels: Array.isArray(raw.educationLevels) ? raw.educationLevels : [],
    hireTypes: Array.isArray(raw.hireTypes) ? raw.hireTypes : [],
  };
}
