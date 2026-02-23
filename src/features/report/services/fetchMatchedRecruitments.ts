import { JobPosting } from '../types';
import { requestJson } from './http';

type MatchedRecruitmentItem = {
  recrutPblntSn?: number;
  pblntInstCd?: string;
  pbadmsStdInstCd?: string;
  instNm?: string;
  ncsCdLst?: string;
  ncsCdNmLst?: string;
  ncsCdNmList?: string[] | string;
  hireTypeLst?: string;
  hireTypeNmLst?: string;
  hireTypeNmList?: string[] | string;
  workRgnLst?: string;
  workRgnNmLst?: string;
  workRgnNmList?: string[] | string;
  recrutSe?: string;
  recrutSeNm?: string;
  prefCondCn?: string | null;
  recrutNope?: number | null;
  pbancBgngYmd?: string;
  pbancEndYmd?: string;
  recrutPbancTtl?: string;
  srcUrl?: string;
  replmprYn?: string | null;
  aplyQlfcCn?: string | null;
  disqlfcRsn?: string | null;
  scrnprcdrMthdExpln?: string | null;
  prefCn?: string | null;
  acbgCondLst?: string | null;
  acbgCondNmLst?: string;
  acbgCondNmList?: string[] | string;
  nonatchRsn?: string | null;
  ongoingYn?: string | null;
  decimalDay?: number | null;
  files?: Array<{
    recrutAtchFileNo?: number;
    sortNo?: number;
    atchFileNm?: string;
    atchFileType?: string;
    url?: string;
  }>;
  steps?: Array<{
    recrutStepSn?: number;
    recrutPblntSn?: number;
    recrutPbancTtl?: string;
    recrutNope?: number | null;
    aplyNope?: number | null;
    cmpttRt?: number | null;
    rsnOcrnYmd?: string | null;
    sortNo?: number;
    minStepSn?: number;
    maxStepSn?: number;
  }>;
  matchScore?: number;
  matchReason?: string | null;
};

type MatchedRecruitmentResponse = {
  items: MatchedRecruitmentItem[];
  total: number;
  nextOffset: number;
  hasMore: boolean;
};

const isRecruitmentItem = (value: unknown): value is MatchedRecruitmentItem => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return 'recrutPblntSn' in item || 'recrutPbancTtl' in item || 'srcUrl' in item;
};

const extractMatchedItems = (raw: unknown): MatchedRecruitmentItem[] => {
  if (!raw || typeof raw !== 'object') return [];
  const data = raw as Record<string, any>;

  const candidates: unknown[] = [
    data.items,
    data.result?.items,
    data.result?.result?.items,
    data.result,
    data.result?.result,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as MatchedRecruitmentItem[];
    if (isRecruitmentItem(candidate)) return [candidate];
  }
  return [];
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

  const raw = await requestJson<unknown>(res, {
    fallbackMessage: '채용 공고 조회 실패',
  });
  const items = extractMatchedItems(raw);
  const top = raw && typeof raw === 'object' ? (raw as Record<string, any>) : {};
  const envelope =
    top.result && typeof top.result === 'object'
      ? (top.result as Record<string, any>)
      : top;
  const total =
    typeof envelope.total === 'number'
      ? envelope.total
      : typeof top.total === 'number'
        ? top.total
      : items.length;
  const nextOffset =
    typeof envelope.nextOffset === 'number'
      ? envelope.nextOffset
      : typeof top.nextOffset === 'number'
        ? top.nextOffset
        : typeof envelope.next_offset === 'number'
          ? envelope.next_offset
          : typeof top.next_offset === 'number'
            ? top.next_offset
            : offset + items.length;
  const hasMore =
    typeof envelope.hasMore === 'boolean'
      ? envelope.hasMore
      : typeof top.hasMore === 'boolean'
        ? top.hasMore
        : typeof envelope.has_more === 'boolean'
          ? envelope.has_more
          : typeof top.has_more === 'boolean'
            ? top.has_more
            : typeof limit === 'number'
              ? items.length >= limit
              : false;

  const data: MatchedRecruitmentResponse = { items, total, nextOffset, hasMore };
  const count = data.items.length;
  console.log(
    `[report] 채용 공고 정보 ${count > 0 ? '있음' : '없음'} (items: ${count}, total: ${data.total ?? 0})`
  );

  return data;
}

const formatYmd = (value?: string) => {
  if (!value || value.length !== 8) return value ?? '';
  return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`;
};

const normalizeStringList = (
  list?: string[] | string | null,
  fallbackCsv?: string | null
): string[] => {
  if (Array.isArray(list)) return list.filter(Boolean);
  if (typeof list === 'string' && list.trim()) {
    return list
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof fallbackCsv === 'string' && fallbackCsv.trim()) {
    return fallbackCsv
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export const mapMatchedRecruitmentsToJobPostings = (
  items: MatchedRecruitmentItem[]
): JobPosting[] =>
  items.map((item) => ({
    wantedAuthNo: String(item.recrutPblntSn ?? ''),
    company: item.instNm ?? '',
    busino: '',
    indTpNm: normalizeStringList(item.ncsCdNmList, item.ncsCdNmLst).join(', '),
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
    recrutPblntSn: item.recrutPblntSn,
    pblntInstCd: item.pblntInstCd ?? '',
    pbadmsStdInstCd: item.pbadmsStdInstCd ?? '',
    instNm: item.instNm ?? '',
    ncsCdLst: item.ncsCdLst ?? '',
    ncsCdNmLst: item.ncsCdNmLst ?? '',
    ncsCdNmList: normalizeStringList(item.ncsCdNmList, item.ncsCdNmLst),
    hireTypeLst: item.hireTypeLst ?? '',
    hireTypeNmLst: item.hireTypeNmLst ?? '',
    hireTypeNmList: normalizeStringList(item.hireTypeNmList, item.hireTypeNmLst),
    workRgnLst: item.workRgnLst ?? '',
    workRgnNmLst: item.workRgnNmLst ?? '',
    workRgnNmList: normalizeStringList(item.workRgnNmList, item.workRgnNmLst),
    recrutSe: item.recrutSe ?? '',
    recrutSeNm: item.recrutSeNm ?? '',
    prefCondCn: item.prefCondCn ?? '',
    recrutNope: item.recrutNope ?? null,
    pbancBgngYmd: item.pbancBgngYmd ?? '',
    pbancEndYmd: item.pbancEndYmd ?? '',
    recrutPbancTtl: item.recrutPbancTtl ?? '',
    srcUrl: item.srcUrl ?? '',
    replmprYn: item.replmprYn ?? null,
    aplyQlfcCn: item.aplyQlfcCn ?? '',
    disqlfcRsn: item.disqlfcRsn ?? '',
    scrnprcdrMthdExpln: item.scrnprcdrMthdExpln ?? '',
    prefCn: item.prefCn ?? '',
    acbgCondLst: item.acbgCondLst ?? '',
    acbgCondNmLst: item.acbgCondNmLst ?? '',
    acbgCondNmList: normalizeStringList(item.acbgCondNmList, item.acbgCondNmLst),
    nonatchRsn: item.nonatchRsn ?? null,
    ongoingYn: item.ongoingYn ?? null,
    decimalDay: item.decimalDay ?? null,
    files: Array.isArray(item.files) ? item.files : [],
    steps: Array.isArray(item.steps) ? item.steps : [],
    matchScore: item.matchScore ?? null,
    matchReason: item.matchReason ?? '',
  }));
