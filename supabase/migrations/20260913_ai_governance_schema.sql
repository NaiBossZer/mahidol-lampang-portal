-- AI Governance Schema for Mahidol Lampang Portal
-- This migration creates the database tables needed for the AI Workspace
-- including ai_tools, ai_executions, ai_approvals, audit_logs, and admin_notifications
-- with proper RLS policies and audit triggers

-- =====================================================
-- AI Tools Registry (Governed Tool Registry)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ai_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_key varchar(100) UNIQUE NOT NULL,
  name varchar(255) NOT NULL,
  description text,
  domain varchar(50) NOT NULL,
  endpoint varchar(255) NOT NULL,
  method varchar(10) NOT NULL DEFAULT 'POST' CHECK (method IN ('GET','POST','PATCH','DELETE')),
  risk_level varchar(20) NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low','medium','high','critical')),
  permission varchar(100),
  input_schema jsonb DEFAULT '{}'::jsonb,
  output_schema jsonb DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  execution_mode varchar(20) NOT NULL DEFAULT 'sync' CHECK (execution_mode IN ('sync','async')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for ai_tools
CREATE INDEX IF NOT EXISTS ai_tools_domain_idx ON public.ai_tools(domain);
CREATE INDEX IF NOT EXISTS ai_tools_enabled_idx ON public.ai_tools(enabled) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS ai_tools_risk_level_idx ON public.ai_tools(risk_level);

-- =====================================================
-- AI Executions (AI Execution Records)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ai_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  tool_id uuid REFERENCES public.ai_tools(id) ON DELETE SET NULL,
  intent text NOT NULL,
  status varchar(30) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','awaiting_approval','completed','failed','rejected')),
  risk_level varchar(20) NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low','medium','high','critical')),
  input jsonb DEFAULT '{}'::jsonb,
  output jsonb,
  error text,
  execution_plan jsonb,
  steps jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- Create indexes for ai_executions
CREATE INDEX IF NOT EXISTS ai_executions_actor_id_idx ON public.ai_executions(actor_id);
CREATE INDEX IF NOT EXISTS ai_executions_tool_id_idx ON public.ai_executions(tool_id);
CREATE INDEX IF NOT EXISTS ai_executions_status_idx ON public.ai_executions(status);
CREATE INDEX IF NOT EXISTS ai_executions_created_at_idx ON public.ai_executions(created_at DESC);
CREATE INDEX IF NOT EXISTS ai_executions_status_created_idx ON public.ai_executions(status, created_at DESC);

-- =====================================================
-- AI Approvals (Approval Records)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ai_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id uuid NOT NULL REFERENCES public.ai_executions(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  decision varchar(20) NOT NULL CHECK (decision IN ('approved','rejected')),
  reason text,
  decided_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for ai_approvals
CREATE INDEX IF NOT EXISTS ai_approvals_execution_id_idx ON public.ai_approvals(execution_id);
CREATE INDEX IF NOT EXISTS ai_approvals_reviewer_id_idx ON public.ai_approvals(reviewer_id);
CREATE INDEX IF NOT EXISTS ai_approvals_decided_at_idx ON public.ai_approvals(decided_at DESC);

-- =====================================================
-- Audit Logs (Comprehensive Audit Trail)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action varchar(50) NOT NULL,
  table_name varchar(100) NOT NULL,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  ip_hint varchar(50),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for audit_logs
CREATE INDEX IF NOT EXISTS audit_logs_actor_id_idx ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS audit_logs_table_name_idx ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_table_created_idx ON public.audit_logs(table_name, created_at DESC);

-- =====================================================
-- Admin Notifications (For approval requests and system alerts)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind varchar(50) NOT NULL,
  title varchar(255) NOT NULL,
  body text,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for admin_notifications
CREATE INDEX IF NOT EXISTS admin_notifications_recipient_idx ON public.admin_notifications(recipient_user_id);
CREATE INDEX IF NOT EXISTS admin_notifications_read_idx ON public.admin_notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS admin_notifications_created_at_idx ON public.admin_notifications(created_at DESC);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all AI tables
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- ai_tools: Admin-only access
CREATE POLICY "admins read ai_tools" ON public.ai_tools FOR SELECT TO authenticated 
USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

CREATE POLICY "super_admins manage ai_tools" ON public.ai_tools FOR ALL TO authenticated 
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'SUPER_ADMIN')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'SUPER_ADMIN');

-- ai_executions: Actor can read their own, admins can read all
CREATE POLICY "actors read own executions" ON public.ai_executions FOR SELECT TO authenticated 
USING (actor_id = auth.uid());

CREATE POLICY "admins read all executions" ON public.ai_executions FOR SELECT TO authenticated 
USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

CREATE POLICY "system can create executions" ON public.ai_executions FOR INSERT TO authenticated 
WITH CHECK (true);

CREATE POLICY "system can update executions" ON public.ai_executions FOR UPDATE TO authenticated 
WITH CHECK (true);

-- ai_approvals: Reviewer-based access
CREATE POLICY "admins read approvals" ON public.ai_approvals FOR SELECT TO authenticated 
USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

CREATE POLICY "admins create approvals" ON public.ai_approvals FOR INSERT TO authenticated 
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

-- audit_logs: Admin-only read, append-only
CREATE POLICY "admins read audit_logs" ON public.audit_logs FOR SELECT TO authenticated 
USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'));

CREATE POLICY "system can create audit_logs" ON public.audit_logs FOR INSERT TO authenticated 
WITH CHECK (true);

-- admin_notifications: Recipient can read their own
CREATE POLICY "recipients read own notifications" ON public.admin_notifications FOR SELECT TO authenticated
USING (recipient_user_id = auth.uid());

CREATE POLICY "recipients update own notifications" ON public.admin_notifications FOR UPDATE TO authenticated
USING (recipient_user_id = auth.uid())
WITH CHECK (recipient_user_id = auth.uid());

CREATE POLICY "system can create notifications" ON public.admin_notifications FOR INSERT TO authenticated 
WITH CHECK (true);

-- =====================================================
-- Audit Triggers
-- =====================================================

-- Audit trigger function for AI tables
CREATE OR REPLACE FUNCTION public.ai_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (actor_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.ai_audit_trigger() FROM PUBLIC, anon, authenticated;

-- Apply triggers to AI tables
DROP TRIGGER IF EXISTS ai_tools_audit ON public.ai_tools;
CREATE TRIGGER ai_tools_audit AFTER INSERT OR UPDATE OR DELETE ON public.ai_tools
FOR EACH ROW EXECUTE FUNCTION public.ai_audit_trigger();

DROP TRIGGER IF EXISTS ai_executions_audit ON public.ai_executions;
CREATE TRIGGER ai_executions_audit AFTER INSERT OR UPDATE OR DELETE ON public.ai_executions
FOR EACH ROW EXECUTE FUNCTION public.ai_audit_trigger();

DROP TRIGGER IF EXISTS ai_approvals_audit ON public.ai_approvals;
CREATE TRIGGER ai_approvals_audit AFTER INSERT OR UPDATE OR DELETE ON public.ai_approvals
FOR EACH ROW EXECUTE FUNCTION public.ai_audit_trigger();

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function to check if user is central admin
CREATE OR REPLACE FUNCTION public.is_central_admin()
RETURNS boolean 
LANGUAGE sql 
STABLE 
SECURITY DEFINER 
SET search_path = public
AS $$ 
SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') IN ('SUPER_ADMIN','CONTENT_ADMIN','OPERATIONS_ADMIN','FACILITY_ADMIN'), false) 
$$;

REVOKE ALL ON FUNCTION public.is_central_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_central_admin() TO authenticated;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger 
LANGUAGE plpgsql 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to ai_tools
DROP TRIGGER IF EXISTS ai_tools_update_updated_at ON public.ai_tools;
CREATE TRIGGER ai_tools_update_updated_at BEFORE UPDATE ON public.ai_tools
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON TABLE public.ai_tools IS 'Governed Tool Registry for AI Agent - defines available tools with permissions and risk levels';
COMMENT ON TABLE public.ai_executions IS 'AI Execution Records - tracks all AI agent executions with status and results';
COMMENT ON TABLE public.ai_approvals IS 'AI Approval Records - tracks approval decisions for high-risk AI operations';
COMMENT ON TABLE public.audit_logs IS 'Comprehensive Audit Trail - tracks all important changes across the system';
COMMENT ON TABLE public.admin_notifications IS 'Admin Notifications - system alerts and approval requests for administrators';