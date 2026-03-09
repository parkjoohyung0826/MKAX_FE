import { CompanyQuestionAssistantId } from './types';

export type CompanyQuestionAssistant = {
  id: CompanyQuestionAssistantId;
  label: string;
  description: string;
  promptStyle: string;
};

export const companyQuestionAssistants: CompanyQuestionAssistant[] = [
  {
    id: 'balanced',
    label: '균형형',
    description: '의도 파악과 설득력을 균형 있게 구성합니다.',
    promptStyle: '문항 의도에 맞춰 배경-행동-결과를 균형 있게 정리하고, 핵심 메시지가 한눈에 보이도록 작성하세요.',
  },
  {
    id: 'story',
    label: '스토리형',
    description: '경험 흐름을 자연스럽게 이어서 전달합니다.',
    promptStyle: '시간 흐름이 보이는 스토리 구조로 작성하고, 전환 계기와 배운 점을 분명히 드러내세요.',
  },
  {
    id: 'impact',
    label: '성과형',
    description: '성과와 기여를 수치 중심으로 강조합니다.',
    promptStyle: '역할, 실행, 성과를 분리해 제시하고 가능한 경우 수치/지표를 넣어 임팩트를 강조하세요.',
  },
  {
    id: 'concise',
    label: '간결형',
    description: '핵심만 압축해 명확하게 전달합니다.',
    promptStyle: '불필요한 배경은 줄이고 핵심 근거와 결론 중심으로 간결하게 작성하세요.',
  },
];

export const getCompanyQuestionAssistant = (id: CompanyQuestionAssistantId) =>
  companyQuestionAssistants.find((assistant) => assistant.id === id) ?? companyQuestionAssistants[0];
