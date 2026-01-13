export interface JobPosting {
  wantedAuthNo: string; // 구인인증번호
  company: string; // 회사명
  busino: string; // 사업자등록번호
  indTpNm: string; // 업종
  title: string; // 채용제목
  salTpNm: string; // 임금형태
  sal: string; // 급여
  minSal: string; // 최소임금액
  maxSal: string; // 최대임금액
  region: string; // 근무지역
  holidayTpNm: string; // 근무형태
  minEdubg: string; // 최소학력
  maxEdubg: string; // 최대학력
  career: string; // 경력
  regDt: string; // 등록일자
  closeDt: string; // 마감일자
  infoSvc: string; // 정보제공처
  wantedInfoUrl: string; // 워크넷 채용정보 URL
  wantedMobileInfoUrl: string; // 워크넷 모바일 채용정보 URL
  zipCd: string; // 근무지 우편주소
  strtnmCd: string; // 근무지 도로명주소
  basicAddr: string; // 근무지 기본주소
  detailAddr: string; // 근무지 상세주소
  empTpCd: number; // 고용형태코드 (10: 기간의 정함이 없는 근로계약, 11: 기간의 정함이 없는 근로계약 (시간(선택)제), 20: 기간의 정함이 있는 근로계약, 21: 기간의 정함이 있는 근로계약 (시간(선택)제)))
  jobsCd: number; // 직종코드
  smodifyDtm: number; // 최종수정일
}
