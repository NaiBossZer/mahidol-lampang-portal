-- AI Feedback Loop and Predictive Analytics Schema
-- This migration creates tables for Priority 3-4 implementation:
-- - ai_performance_feedback: Stores actual vs predicted performance comparison
-- - ai_model_versions: Tracks AI model version iterations and improvements

-- =====================================================
-- AI Performance Feedback Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ai_performance_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid REFERENCES public.occurrence_surveys(id) ON DELETE SET NULL,
  execution_id uuid REFERENCES public.ai_executions(id) ON DELETE SET NULL,
  activity_id uuid REFERENCES public.activities(id) ON DELETE SET NULL,
  predicted_score DECIMAL(3,2),
  actual_score DECIMAL(3,2),
  predicted_response_rate DECIMAL(5,2),
  actual_response_rate DECIMAL(5,2),
  performance_gap DECIMAL(3,2),
  feedback_notes TEXT,
  improvement_suggestions JSONB DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  ai_model_version VARCHAR(50) DEFAULT '1.0.0',
  feedback_source VARCHAR(50) DEFAULT 'manual' CHECK (feedback_source IN ('manual', 'automated', 'system'))
);

-- Create indexes for ai_performance_feedback
CREATE INDEX IF NOT EXISTS ai_performance_feedback_survey_id_idx ON public.ai_performance_feedback(survey_id);
CREATE INDEX IF NOT EXISTS ai_performance_feedback_execution_id_idx ON public.ai_performance_feedback(execution_id);
CREATE INDEX IF NOT EXISTS ai_performance_feedback_activity_id_idx ON public.ai_performance_feedback(activity_id);
CREATE INDEX IF NOT EXISTS ai_performance_feedback_created_at_idx ON public.ai_performance_feedback(created_at DESC);

-- =====================================================
-- AI Model Versions Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ai_model_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name VARCHAR(100) NOT NULL,
  version VARCHAR(50) NOT NULL,
  parameters JSONB DEFAULT '{}'::jsonb,
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  deployment_date timestamptz,
  is_active BOOLEAN DEFAULT FALSE,
  created_by TEXT,
  created_at timestamptz NOT NULL DEFAULT now(),
  notes TEXT
);

-- Create indexes for ai_model_versions
CREATE INDEX IF NOT EXISTS ai_model_versions_model_name_idx ON public.ai_model_versions(model_name);
CREATE INDEX IF NOT EXISTS ai_model_versions_version_idx ON public.ai_model_versions(version);
CREATE INDEX IF NOT EXISTS ai_model_versions_is_active_idx ON public.ai_model_versions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS ai_model_versions_deployment_date_idx ON public.ai_model_versions(deployment_date DESC);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE public.ai_performance_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_model_versions ENABLE ROW LEVEL SECURITY;

-- ai_performance_feedback: Admin-only access
CREATE POLICY "admins read ai_performance_feedback" ON public.ai_performance_feedback FOR SELECT TO authenticated 
USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

CREATE POLICY "admins create ai_performance_feedback" ON public.ai_performance_feedback FOR INSERT TO authenticated 
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

CREATE POLICY "admins update ai_performance_feedback" ON public.ai_performance_feedback FOR UPDATE TO authenticated 
USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'))
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

-- ai_model_versions: Admin-only access
CREATE POLICY "admins read ai_model_versions" ON public.ai_model_versions FOR SELECT TO authenticated 
USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

CREATE POLICY "super_admins manage ai_model_versions" ON public.ai_model_versions FOR ALL TO authenticated 
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'SUPER_ADMIN')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'SUPER_ADMIN');

-- =====================================================
-- Audit Triggers
-- =====================================================

-- Apply audit triggers to new tables
DROP TRIGGER IF EXISTS ai_performance_feedback_audit ON public.ai_performance_feedback;
CREATE TRIGGER ai_performance_feedback_audit AFTER INSERT OR UPDATE OR DELETE ON public.ai_performance_feedback
FOR EACH ROW EXECUTE FUNCTION public.ai_audit_trigger();

DROP TRIGGER IF EXISTS ai_model_versions_audit ON public.ai_model_versions;
CREATE TRIGGER ai_model_versions_audit AFTER INSERT OR UPDATE OR DELETE ON public.ai_model_versions
FOR EACH ROW EXECUTE FUNCTION public.ai_audit_trigger();

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON TABLE public.ai_performance_feedback IS 'AI Performance Feedback - stores actual vs predicted performance comparison for AI-generated surveys';
COMMENT ON TABLE public.ai_model_versions IS 'AI Model Versions - tracks AI model version iterations, parameters, and deployment history';

COMMENT ON COLUMN public.ai_performance_feedback.predicted_score IS 'AI-predicted satisfaction score (1-5)';
COMMENT ON COLUMN public.ai_performance_feedback.actual_score IS 'Actual average satisfaction score from survey responses';
COMMENT ON COLUMN public.ai_performance_feedback.performance_gap IS 'Difference between predicted and actual scores';
COMMENT ON COLUMN public.ai_performance_feedback.improvement_suggestions IS 'AI-generated suggestions for model improvement';
COMMENT ON COLUMN public.ai_model_versions.parameters IS 'Model hyperparameters and configuration';
COMMENT ON COLUMN public.ai_model_versions.performance_metrics IS 'Key performance indicators for this model version';
