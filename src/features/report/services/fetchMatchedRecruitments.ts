import { JobPosting } from '../types';

type MatchedRecruitmentItem = {
  recrutPblntSn?: number;
  recrutPbancTtl?: string;
  pbancBgngYmd?: string;
  pbancEndYmd?: string;
  instNm?: string;
  acbgCondNmLst?: string;
  recrutNope?: number;
  hireTypeNmLst?: string;
  ncsCdNmList?: string[] | string;
  srcUrl?: string;
  recrutSeNm?: string;
  matchScore?: number;
  matchReason?: string;
  workRgnLst?: string;
  workRgnNmLst?: string;
};

type MatchedRecruitmentResponse = {
  items: MatchedRecruitmentItem[];
  total: number;
  nextOffset: number;
  hasMore: boolean;
};

export async function fetchMatchedRecruitments(
  code: string,
  offset = 0,
  limit?: number
): Promise<MatchedRecruitmentResponse> {
  const res = await fetch('/api/report/recruitments/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ code, offset, limit }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? '채용 공고 조회 실패');
  }

  return res.json();
}

const formatYmd = (value?: string) => {
  if (!value || value.length !== 8) return value ?? '';
  return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`;
};

export const mapMatchedRecruitmentsToJobPostings = (
  items: MatchedRecruitmentItem[]
): JobPosting[] =>
  items.map((item) => ({
    wantedAuthNo: String(item.recrutPblntSn ?? ''),
    company: item.instNm ?? '',
    busino: '',
    indTpNm: Array.isArray(item.ncsCdNmList)
      ? item.ncsCdNmList.join(', ')
      : item.ncsCdNmList ?? '',
    title: item.recrutPbancTtl ?? '',
    salTpNm: '',
    sal: '',
    minSal: '',
    maxSal: '',
    region: item.workRgnNmLst ?? '',
    holidayTpNm: item.hireTypeNmLst ?? '',
    minEdubg: item.acbgCondNmLst ?? '',
    maxEdubg: '',
    career: item.recrutSeNm ?? '',
    regDt: formatYmd(item.pbancBgngYmd),
    closeDt: formatYmd(item.pbancEndYmd),
    infoSvc: '',
    wantedInfoUrl: item.srcUrl ?? '',
    wantedMobileInfoUrl: '',
    zipCd: '',
    strtnmCd: '',
    basicAddr: item.workRgnNmLst ?? '',
    detailAddr: '',
    empTpCd: 0,
    jobsCd: 0,
    smodifyDtm: 0,
  }));
