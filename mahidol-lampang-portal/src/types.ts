export type UserRole =
  | 'SUPER_ADMIN'
  | 'CONTENT_ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'FACILITY_ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  nameTh: string;
  nameEn: string;
  role: UserRole;
  faculty: string;
  campus: string;
  avatar: string;
  status: 'active' | 'inactive';
}

export type ActivityLifecycle =
  | 'draft'
  | 'scheduled'
  | 'ongoing'
  | 'completed'
  | 'cancelled'
  | 'archived'
  | 'retired';

export interface ActivityOccurrence {
  id: string;
  activityId: string;
  occurrenceNumber: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  learningCenterId?: string;
  learningCenterName?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  targetParticipants: number;
  actualParticipants?: number;
  surveyResponsesCount?: number;
}

export interface ActivityRelation {
  id: string;
  type: 'parent_project' | 'preceding' | 'subsequent' | 'partner_organization' | 'cluster';
  targetId: string;
  targetName: string;
  notes?: string;
}

export interface LearningCenter {
  id: string;
  nameTh: string;
  nameEn: string;
  faculty: string;
  campus: string;
  location: string;
  manager: string;
  description: string;
  imageUrl?: string;
  activitiesCount: number;
}

export interface StorageMediaItem {
  id: string;
  bucket: 'portal-media';
  storagePath: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  url: string;
  caption?: string;
  isCover: boolean;
  uploadedBy: string;
  uploadedAt: string;
  entityType: 'activity' | 'occurrence' | 'document' | 'report';
  entityId: string;
}

export interface AiGovernanceTool {
  id: string;
  name: string;
  category: 'document_analysis' | 'survey_generation' | 'report_drafting' | 'content_summarization';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  requiresApproval: boolean;
  description: string;
  allowedRoles: UserRole[];
}

export interface AiWorkQueueItem {
  id: string;
  toolId: string;
  toolName: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  requestedBy: string;
  requestedAt: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'executing' | 'completed';
  intentDescription: string;
  inputPayload: Record<string, any>;
  outputResult?: Record<string, any>;
  approvedBy?: string;
  approvedAt?: string;
}

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

export interface OfficialDocument {
  id: string;
  name: string;
  fileType: 'pdf' | 'docx' | 'image';
  fileSize: string;
  uploadDate: string;
  documentType: 'memorandum' | 'proposal' | 'schedule' | 'budget';
  documentTypeName: string;
  docNumber: string;
  verifiedByAi: boolean;
}

export interface AiExtractedEntity {
  id: string;
  category: 'objective' | 'target_group' | 'schedule' | 'location' | 'kpi' | 'speaker';
  categoryLabel: string;
  title: string;
  text: string;
  sourceDoc: string;
  page: string;
  confidence: number;
}

export interface SurveyQuestion {
  id: string;
  aspectIndex: number;
  title: string;
  questionType: 'likert5' | 'single_choice' | 'text';
  scaleLabel?: string;
  sourceCiting: string;
  sourceDocName: string;
}

export interface SurveySection {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
}

export interface AiGeneratedSurvey {
  id: string;
  activityId: string;
  surveyTitle: string;
  generatedDate: string;
  sections: SurveySection[];
  scaleType: string;
  aiConfidenceScore: number;
  status: 'ready_for_review' | 'confirmed_and_assigned';
}

export interface Project {
  id: string;
  code: string;
  name: string;
  fiscalYear: string;
  faculty: string;
  campus: string;
  budget: number;
  status: 'active' | 'in_progress' | 'completed';
  activitiesCount: number;
  description: string;
  startDate: string;
  endDate: string;
}

export type ActivityWorkflowStatus =
  | 'waiting_docs'
  | 'ai_analyzing'
  | 'ai_survey_generated'
  | 'waiting_admin_review'
  | 'survey_assigned'
  | 'completed'
  | 'drafting_report'
  | 'ready_to_publish'
  | 'published';

export interface ActivityPhoto {
  id: string;
  url: string;
  caption?: string;
  isCover?: boolean;
  uploadedAt: string;
  fileSize?: string;
  fileName?: string;
}

export interface ActivityReport {
  title: string;
  summary: string;
  content: string;
  performanceResults: string;
  outcomesAndImpact: string;
  coverImage?: string;
  galleryPhotos?: string[];
  publishedAt?: string;
  publishedUrl?: string;
  author: string;
  isAiAssisted?: boolean;
  aiAssistedDate?: string;
}

export interface AdminActivityItem {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  code: string;
  date: string;
  faculty: string;
  campus: string;
  location: string;
  targetCount: number;
  responsiblePerson: string;
  status: ActivityWorkflowStatus;
  statusLabel: string;
  currentStep: number;
  officialDocs: OfficialDocument[];
  aiExtractedEntities: AiExtractedEntity[];
  survey: AiGeneratedSurvey | null;
  // Lifecycle & Rich Domain Fields
  lifecycle?: ActivityLifecycle;
  organization?: string;
  learningCenterId?: string;
  learningCenterName?: string;
  occurrences?: ActivityOccurrence[];
  relations?: ActivityRelation[];
  objectives?: string[];
  summary?: string;
  mediaItems?: StorageMediaItem[];
  // Metrics & survey linkage
  responsesCount?: number;
  totalAnswers?: number;
  avgScore?: number;
  satisfactionRate?: number;
  questionsCount?: number;
  // Post-Project Workflow additions
  completedAt?: string;
  photos?: ActivityPhoto[];
  report?: ActivityReport;
  publishedAt?: string;
  hasNoPhotos?: boolean;
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
