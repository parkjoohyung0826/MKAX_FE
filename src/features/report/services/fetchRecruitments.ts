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

const extractEnvelope = (raw: RecruitmentsApiResponse) => {
  if (raw?.result && typeof raw.result === 'object') return raw.result;
  return raw;
};

export async function fetchRecruitments(
  offset = 0,
  limit = 10
): Promise<RecruitmentsResponse> {
  const res = await fetch(`/api/report/recruitments?offset=${offset}&limit=${limit}`, {
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
