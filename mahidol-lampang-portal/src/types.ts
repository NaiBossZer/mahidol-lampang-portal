export interface AspectScore {
  id: number;
  title: string;
  score: number;
  percentage: number;
}

export interface RespondentGroup {
  label: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface AwarenessChannel {
  name: string;
  code: string;
  iconType: 'facebook' | 'line' | 'website' | 'other';
  color: string;
  count: number;
  percentage: number;
}

export interface DemographicItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ScoreDistributionItem {
  score: number;
  count: number;
  percentage: number;
}

export interface CommentItem {
  id: string;
  text: string;
  date: string;
  author: string;
  sentiment?: 'positive' | 'neutral' | 'suggestion';
}

export interface Activity {
  id: string;
  name: string;
  shortName: string;
  code: string;
  codeColor: string;
  faculty: string;
  campus: string;
  date: string;
  surveyName: string;
  bannerImage: string;
  photos: string[];
  participants: number;
  respondents: number;
  unresponded: number;
  responseRate: number;
  avgScore: number;
  maxScore: number;
  scoreGrade: string;
  monthlyChanges: {
    participantsChange: number;
    respondentsChange: number;
    unrespondedChange: number;
    responseRateChange: number;
    scoreChange: number;
  };
  aspects: AspectScore[];
  respondentGroups: RespondentGroup[];
  awarenessChannels: AwarenessChannel[];
  ageDemographics: DemographicItem[];
  genderDemographics: DemographicItem[];
  statusDemographics: DemographicItem[];
  scoreDistribution: ScoreDistributionItem[];
  topAspect: {
    title: string;
    score: number;
    total: number;
    respondentsCount: number;
  };
  concernAspect: {
    title: string;
    score: number;
    total: number;
    respondentsCount: number;
  };
  comments: CommentItem[];
  status: string;
  mode: string;
  scale: string;
}
