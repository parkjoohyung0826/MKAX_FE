import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ResumeData } from '../ConversationalForm';

interface WritingGuideProps {
  section: string;
  resumeData: ResumeData;
}

const getGuidance = (section: string, resumeData: ResumeData): { title: string; content: React.ReactNode[] } => {
  const { name, desiredJob, workExperience, coreCompetencies } = resumeData;

  switch (section) {
    case 'growthProcess':
      return {
        title: '성장과정 작성 가이드',
        content: [
          <Typography key="1" paragraph>
            <strong>{name}</strong>님의 성장 과정을 통해 <strong>{desiredJob}</strong> 직무에 대한 관심과 열정이 어떻게 시작되었는지 보여주세요.
          </Typography>,
          <Typography key="2" paragraph>
            어린 시절의 경험, 특정 사건, 또는 영향을 받은 인물 등을 통해 직무와 관련된 가치관이 형성된 과정을 구체적으로 서술하는 것이 좋습니다.
          </Typography>,
        ],
      };
    case 'strengthsAndWeaknesses':
      return {
        title: '성격의 장단점 작성 가이드',
        content: [
          <Typography key="1" paragraph>
            <strong>{desiredJob}</strong> 직무 수행에 있어 긍정적인 영향을 줄 수 있는 장점을 강조하세요. <strong>({coreCompetencies})</strong> 역량과 연결하면 더욱 좋습니다.
          </Typography>,
          <Typography key="2" paragraph>
            단점은 솔직하게 인정하되, 이를 개선하기 위해 어떤 노력을 하고 있는지 구체적으로 작성하여 긍정적인 인상을 심어주세요.
          </Typography>,
        ],
      };
    case 'keyExperience':
      return {
        title: '주요 경력 및 업무 강점 작성 가이드',
        content: [
          <Typography key="1" paragraph>
            <strong>{workExperience}</strong> 경험을 바탕으로, <strong>{desiredJob}</strong> 직무와 가장 관련성이 높은 핵심 역량과 성과를 중심으로 작성하세요.
          </Typography>,
          <Typography key="2" paragraph>
            정량적인 성과(예: 매출 20% 상승, 비용 10% 절감)를 제시하면 신뢰도를 높일 수 있습니다.
          </Typography>,
        ],
      };
    case 'motivation':
      return {
        title: '지원 동기 및 입사 후 포부 작성 가이드',
        content: [
          <Typography key="1" paragraph>
            왜 이 회사, 그리고 <strong>{desiredJob}</strong> 직무에 지원했는지 명확하게 밝혀주세요. 회사의 비전과 자신의 가치관을 연결하는 것이 좋습니다.
          </Typography>,
          <Typography key="2" paragraph>
            입사 후 구체적인 목표와 실행 계획을 제시하여 회사에 기여하고 함께 성장하고 싶다는 의지를 보여주세요.
          </Typography>,
        ],
      };
    default:
      return { title: '작성 가이드', content: [<Typography key="1">항목을 선택해주세요.</Typography>] };
  }
};

const WritingGuide = ({ section, resumeData }: WritingGuideProps) => {
  const guidance = getGuidance(section, resumeData);

  return (
    <Box>
      {guidance.content.map((item, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
          {item}
        </Paper>
      ))}
    </Box>
  );
};

export default WritingGuide;