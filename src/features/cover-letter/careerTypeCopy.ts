import { CoverLetterCareerType } from './types';

export type CoverLetterSectionId =
  | 'growthProcess'
  | 'strengthsAndWeaknesses'
  | 'keyExperience'
  | 'motivation';

type CoverLetterSectionCopy = {
  stepLabel: string;
  panelTitle: string;
  chatQuestion: string;
  directLabel: string;
  directDescription: string;
  classicDisplayLabel: string;
  modernDisplayLabel: string;
  finalReviewLabel: string;
};

type CoverLetterCareerTypeCopy = {
  sections: Record<CoverLetterSectionId, CoverLetterSectionCopy>;
};

export const coverLetterSectionOrder: CoverLetterSectionId[] = [
  'growthProcess',
  'strengthsAndWeaknesses',
  'keyExperience',
  'motivation',
];

const basicCopy: CoverLetterCareerTypeCopy = {
  sections: {
    growthProcess: {
      stepLabel: '성장과정',
      panelTitle: '성장과정',
      chatQuestion:
        '훌륭해요! 자기소개서 작성을 시작해볼까요?\n첫 번째로, 당신의 성장과정에 대해 알려주세요. 어떤 경험이 지금의 당신을 만들었나요?',
      directLabel: '성장과정',
      directDescription: '직무에 관심을 갖게 된 계기나 가치관 형성 과정',
      classicDisplayLabel: '성장과정',
      modernDisplayLabel: '성장과정',
      finalReviewLabel: '성장과정',
    },
    strengthsAndWeaknesses: {
      stepLabel: '성격의 장단점',
      panelTitle: '성격의 장단점',
      chatQuestion: '좋습니다. 다음으로 당신의 성격적인 장점과 단점에 대해 솔직하게 이야기해주세요.',
      directLabel: '성격의 장단점',
      directDescription: '직무 수행에 도움이 되는 장점과 개선 노력',
      classicDisplayLabel: '성격의 장, 단점',
      modernDisplayLabel: '성격의 장, 단점',
      finalReviewLabel: '성격의 장단점',
    },
    keyExperience: {
      stepLabel: '주요 경력 및 업무 강점',
      panelTitle: '주요 경력 및 업무 강점',
      chatQuestion:
        '이제 당신의 핵심 역량을 보여줄 차례입니다.\n가장 자신있는 주요 경력이나 업무 강점에 대해 구체적인 경험을 바탕으로 설명해주세요.',
      directLabel: '주요 경력 및 업무 강점',
      directDescription: '관련 경험에서의 구체적인 역할과 성과',
      classicDisplayLabel: '주요 경력\n및\n업무 강점',
      modernDisplayLabel: '주요 경력 및 업무 강점',
      finalReviewLabel: '주요 경력 및 업무 강점',
    },
    motivation: {
      stepLabel: '지원 동기 및 포부',
      panelTitle: '지원 동기 및 포부',
      chatQuestion:
        '거의 다 왔어요! 마지막으로 이 회사, 그리고 이 직무에 지원하는 동기는 무엇인가요?\n입사 후 어떤 목표를 이루고 싶으신가요?',
      directLabel: '지원 동기 및 포부',
      directDescription: '회사 지원 이유와 입사 후 구체적 목표',
      classicDisplayLabel: '지원 동기\n및\n입사 포부',
      modernDisplayLabel: '지원 동기 및 입사 포부',
      finalReviewLabel: '지원 동기 및 포부',
    },
  },
};

const seniorCopy: CoverLetterCareerTypeCopy = {
  sections: {
    growthProcess: {
      stepLabel: '경력 요약 및 인생관',
      panelTitle: '경력 요약 및 인생관',
      chatQuestion:
        '좋습니다. 먼저 경력 요약과 인생관부터 정리해볼게요.\n과거에 어떤 직무에서 가장 오래 근무하셨는지, 그리고 일하시면서 가장 중요하게 지켜온 원칙(예: 시간 엄수, 정직, 안전)이 무엇이었는지 알려주세요.',
      directLabel: '경력 요약 및 인생관',
      directDescription: '오랜 근무 경험과 일할 때 지켜온 원칙(성실성, 책임감, 안전의식 등)',
      classicDisplayLabel: '경력 요약\n및\n인생관',
      modernDisplayLabel: '경력 요약 및 인생관',
      finalReviewLabel: '경력 요약 및 인생관',
    },
    strengthsAndWeaknesses: {
      stepLabel: '조직 융화력 및 소통 태도',
      panelTitle: '조직 융화력 및 소통 태도',
      chatQuestion:
        '다음은 조직에서의 협업 태도입니다.\n젊은 동료나 상사와 일할 때 어떻게 소통하실지, 그리고 동료를 배려하거나 경청하기 위해 실천하는 방법이 있다면 말씀해주세요.',
      directLabel: '조직 융화력 및 소통 태도',
      directDescription: '세대가 다른 동료와의 소통 방식, 경청/배려 중심의 협업 태도',
      classicDisplayLabel: '조직 융화력\n및\n소통 태도',
      modernDisplayLabel: '조직 융화력 및 소통 태도',
      finalReviewLabel: '조직 융화력 및 소통 태도',
    },
    keyExperience: {
      stepLabel: '핵심 역량 및 보유 기술',
      panelTitle: '핵심 역량 및 보유 기술',
      chatQuestion:
        '이제 지원 직무에 바로 활용 가능한 역량을 정리해보겠습니다.\n지원하시는 업무와 관련 있는 자격증이나 기술이 있는지, 그리고 과거 경험 중 이 일을 하는 데 도움이 될 습관이나 노하우가 무엇인지 알려주세요.',
      directLabel: '핵심 역량 및 보유 기술',
      directDescription: '지원 직무에 바로 활용 가능한 자격/기술과 전이 가능한 경험',
      classicDisplayLabel: '핵심 역량\n및\n보유 기술',
      modernDisplayLabel: '핵심 역량 및 보유 기술',
      finalReviewLabel: '핵심 역량 및 보유 기술',
    },
    motivation: {
      stepLabel: '지원 동기 및 근무 각오',
      panelTitle: '지원 동기 및 근무 각오 (건강/성실)',
      chatQuestion:
        '마지막으로 지원 동기와 근무 각오를 정리해볼게요.\n평소 건강 관리를 어떻게 하고 계신지, 그리고 새로운 업무 방식이나 기계를 배워야 할 때 거부감 없이 배우실 수 있는지도 함께 알려주세요.',
      directLabel: '지원 동기 및 근무 각오',
      directDescription: '지원 이유와 함께 건강관리, 성실한 근태, 디지털/기기 적응 의지 강조',
      classicDisplayLabel: '지원 동기 및\n근무 각오\n(건강/성실)',
      modernDisplayLabel: '지원 동기 및 근무 각오 (건강/성실)',
      finalReviewLabel: '지원 동기 및 근무 각오 (건강/성실)',
    },
  },
};

export const getCoverLetterCareerTypeCopy = (
  careerType: CoverLetterCareerType | null,
): CoverLetterCareerTypeCopy => (careerType === 'senior' ? seniorCopy : basicCopy);

