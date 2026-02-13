import { JobPosting } from '../types';
import { mapMatchedRecruitmentsToJobPostings } from './fetchMatchedRecruitments';

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
  refresh?: boolean;
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
  if (typeof filters.refresh === 'boolean') params.set('refresh', String(filters.refresh));

  const res = await fetch(`/api/report/recruitments?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? '전체 채용 공고 조회 실패');
  }

  const raw: RecruitmentsApiResponse = await res.json();
  const envelope = extractEnvelope(raw);
  const rawItems = Array.isArray(envelope.items) ? envelope.items : [];

  return {
    items: mapMatchedRecruitmentsToJobPostings(rawItems),
    total: typeof envelope.total === 'number' ? envelope.total : rawItems.length,
    nextOffset: typeof envelope.nextOffset === 'number' ? envelope.nextOffset : offset + rawItems.length,
    hasMore: typeof envelope.hasMore === 'boolean' ? envelope.hasMore : rawItems.length >= limit,
  };
}
