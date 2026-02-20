import { ResumeCareerType } from './types';

type ResumeCareerTypeCopy = {
  coreStep: string;
  certStep: string;
  coreQuestion: string;
  certQuestion: string;
  coreStepTitle: string;
  coreStepSubtitle: string;
  coreSectionTitle: string;
  coreSectionHint: string;
  coreAssistantTitle: string;
  coreAssistantPrompt: string;
  corePlaceholder: string;
  certStepTitle: string;
  certStepSubtitle: string;
  certSectionTitle: string;
  certSectionHint: string;
  certAssistantTitle: string;
  certAssistantPrompt: string;
  certPlaceholder: string;
  reviewCoreTitle: string;
  reviewCertTitle: string;
  displayCoreTitle: string;
  displayCoreDetailTitle: string;
  displayCertTitle: string;
  displayCertDetailTitle: string;
  displayCertHeaderName: string;
};

const basicCopy: ResumeCareerTypeCopy = {
  coreStep: '주요활동',
  certStep: '자격증',
  coreQuestion: '참여했던 교육 프로그램, 대외 활동, 동아리 활동 등에 대해 자유롭게 이야기해주세요.',
  certQuestion: '자격증 또는 어학 성적이 있다면 알려주세요.',
  coreStepTitle: '주요활동',
  coreStepSubtitle: '교육 및 대외활동 등 주요 활동 정보를 입력해주세요.',
  coreSectionTitle: '교육사항 / 대외활동',
  coreSectionHint: '최신순 기재 권장 (활동명, 기간, 역할, 주요 성과 등)',
  coreAssistantTitle: '교육사항/대외활동 AI',
  coreAssistantPrompt: '참여했던 교육 프로그램, 대외 활동, 동아리 활동 등에 대해 자유롭게 이야기해주세요.',
  corePlaceholder:
    '예: 삼성 청년 SW 아카데미 (SSAFY) 10기 수료 (2023.07 ~ 2024.01)\nOOO 대외활동 (2022.01 ~ 2022.06) - 프로젝트 관리 및 기획 담당',
  certStepTitle: '자격증',
  certStepSubtitle: '자격증 및 어학 정보를 입력해주세요.',
  certSectionTitle: '자격증 및 어학',
  certSectionHint: '취득일 최신순 기재 권장 (자격증명/점수, 발급기관, 취득일)',
  certAssistantTitle: '자격증/어학 AI',
  certAssistantPrompt: '취득한 자격증, 면허, 어학 성적 등에 대해 자유롭게 이야기해주세요.',
  certPlaceholder: '예: 정보처리기사 (2023.05)\nTOEIC 900 (2023.08)',
  reviewCoreTitle: '주요 활동 및 역량',
  reviewCertTitle: '자격증 및 기타',
  displayCoreTitle: '교육사항 / 대외활동',
  displayCoreDetailTitle: '활동 상세',
  displayCertTitle: '자격증/어학성적',
  displayCertDetailTitle: '자격증 상세',
  displayCertHeaderName: '자격증/면허증/교육이수',
};

const seniorCopy: ResumeCareerTypeCopy = {
  coreStep: '직무 교육',
  certStep: '면허/기기',
  coreQuestion: '최근에 이수한 직무 교육이나 훈련 과정이 있다면 알려주세요. (과정명, 이수 시기, 기관)',
  certQuestion:
    '운전면허, 국가기술자격, 사용 가능한 디지털 기기/장비를 알려주세요. (예: 1종 보통, 지게차, 스마트폰 능숙, 엑셀 가능)',
  coreStepTitle: '직업 훈련 및 교육 이수',
  coreStepSubtitle: '실무 적응력을 보여줄 수 있는 최근 교육/훈련 이수 내용을 입력해주세요.',
  coreSectionTitle: '직업 훈련 및 교육 이수',
  coreSectionHint: '최신순 기재 권장 (과정명, 이수 년월, 기관, 실무 적용 내용)',
  coreAssistantTitle: '직업 훈련/교육 이수 AI',
  coreAssistantPrompt:
    '최근에 받으신 직무 교육이나 훈련 과정을 알려주세요. (예: 요양보호사 과정, 신임경비 교육, 안전보건 교육)',
  corePlaceholder:
    '예: 2023.05 | 신임경비 교육 이수 (한국경비협회)\n예: 2022.10 | 시니어 바리스타 양성 과정 수료 (00구청)',
  certStepTitle: '면허/자격증 및 사용 가능 기기',
  certStepSubtitle: '즉시 투입 가능성을 보여줄 면허·자격과 기기 활용 능력을 입력해주세요.',
  certSectionTitle: '면허/자격증 및 사용 가능 기기',
  certSectionHint: '운전면허/국가기술자격/디지털·장비 활용 능력을 함께 작성해주세요.',
  certAssistantTitle: '면허/자격/기기 활용 AI',
  certAssistantPrompt:
    '운전면허, 국가기술자격증 또는 다룰 수 있는 기계/디지털 도구를 알려주세요. (예: 1종 보통, 지게차 운전, 스마트폰 능숙, 엑셀 가능)',
  certPlaceholder:
    '예: 1종 보통 운전면허 (운전 가능)\n예: 지게차 운전기능사\n예: 스마트폰 활용 상, 엑셀/한글 문서 작성 가능',
  reviewCoreTitle: '직업 훈련 및 교육 이수',
  reviewCertTitle: '면허/자격증 및 사용 가능 기기',
  displayCoreTitle: '직업 훈련 및 교육 이수',
  displayCoreDetailTitle: '교육/훈련 상세',
  displayCertTitle: '면허/자격증 및 사용 가능 기기',
  displayCertDetailTitle: '면허/자격/기기 상세',
  displayCertHeaderName: '면허/자격증/사용 가능 기기',
};

export const getResumeCareerTypeCopy = (careerType: ResumeCareerType | null): ResumeCareerTypeCopy =>
  careerType === 'senior' ? seniorCopy : basicCopy;
