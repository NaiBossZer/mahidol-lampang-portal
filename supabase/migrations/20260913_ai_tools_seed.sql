-- AI Tools Registry Seed Data
-- This migration populates the ai_tools table with initial tools
-- for the AI Agent to use across different domains

-- =====================================================
-- Activity Domain Tools
-- =====================================================

INSERT INTO public.ai_tools (tool_key, name, description, domain, endpoint, method, risk_level, permission, execution_mode, input_schema, output_schema) VALUES
('activity.list', 'List Activities', 'ดึงรายการกิจกรรมทั้งหมดพร้อมสถานะและข้อมูลพื้นฐาน', 'activities', '/api/admin/activities', 'GET', 'low', 'activities.read', 'sync', 
 '{"type":"object","properties":{"status":{"type":"string","enum":["draft","published","archived"]},"limit":{"type":"number","default":50}}}', 
 '{"type":"object","properties":{"activities":{"type":"array"},"total":{"type":"number"}}}'),

('activity.get', 'Get Activity Details', 'ดึงรายละเอียดกิจกรรมเฉพาะจาก ID หรือ slug', 'activities', '/api/admin/activities/:id', 'GET', 'low', 'activities.read', 'sync',
 '{"type":"object","properties":{"id":{"type":"string"},"slug":{"type":"string"}}}',
 '{"type":"object","properties":{"activity":{"type":"object"},"occurrences":{"type":"array"},"photos":{"type":"array"}}}'),

('activity.create', 'Create Activity', 'สร้างกิจกรรมใหม่พร้อมข้อมูลพื้นฐาน', 'activities', '/api/admin/activities', 'POST', 'medium', 'activities.create', 'sync',
 '{"type":"object","required":["title","activity_date"],"properties":{"title":{"type":"string"},"summary":{"type":"string"},"activity_date":{"type":"string","format":"date-time"},"location":{"type":"string"}}}',
 '{"type":"object","properties":{"activity":{"type":"object"},"id":{"type":"string"}}}'),

('activity.update', 'Update Activity', 'แก้ไขข้อมูลกิจกรรมที่มีอยู่', 'activities', '/api/admin/activities/:id', 'PATCH', 'medium', 'activities.update', 'sync',
 '{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"summary":{"type":"string"},"content":{"type":"string"}}}',
 '{"type":"object","properties":{"activity":{"type":"object"}}}'),

('activity.publish', 'Publish Activity', 'เผยแพร่กิจกรรมให้แสดงสู่สาธารณะ', 'activities', '/api/admin/activities/:id/publish', 'POST', 'high', 'activities.publish', 'sync',
 '{"type":"object","required":["id"],"properties":{"id":{"type":"string"}}}',
 '{"type":"object","properties":{"activity":{"type":"object"},"published_at":{"type":"string"}}}'),

('activity.archive', 'Archive Activity', 'จัดเก็บกิจกรรมที่ไม่ใช้งานแล้ว', 'activities', '/api/admin/activities/:id/archive', 'POST', 'medium', 'activities.archive', 'sync',
 '{"type":"object","required":["id"],"properties":{"id":{"type":"string"}}}',
 '{"type":"object","properties":{"activity":{"type":"object"},"archived_at":{"type":"string"}}}');

-- =====================================================
-- Survey Domain Tools
-- =====================================================

INSERT INTO public.ai_tools (tool_key, name, description, domain, endpoint, method, risk_level, permission, execution_mode, input_schema, output_schema) VALUES
('survey.analytics', 'Survey Analytics', 'วิเคราะห์ข้อมูลแบบสอบถามและคำนวณค่าสถิติ', 'survey', '/api/admin/surveys/analytics', 'GET', 'low', 'survey.audit.read', 'async',
 '{"type":"object","properties":{"survey_id":{"type":"string"},"occurrence_id":{"type":"string"},"date_range":{"type":"object"}}}',
 '{"type":"object","properties":{"summary":{"type":"object"},"responses":{"type":"number"},"satisfaction_score":{"type":"number"}}}'),

('survey.export', 'Export Survey Data', 'ส่งออกข้อมูลแบบสอบถามเป็นไฟล์ CSV', 'survey', '/api/admin/surveys/export', 'POST', 'medium', 'survey.audit.read', 'async',
 '{"type":"object","properties":{"survey_id":{"type":"string"},"occurrence_id":{"type":"string"},"format":{"type":"string","enum":["csv","xlsx"]}}}',
 '{"type":"object","properties":{"download_url":{"type":"string"},"record_count":{"type":"number"}}}'),

('survey.create', 'Create Survey', 'สร้างแบบสอบถามใหม่พร้อมคำถาม', 'survey', '/api/admin/surveys', 'POST', 'medium', 'survey.create', 'sync',
 '{"type":"object","required":["occurrence_id"],"properties":{"occurrence_id":{"type":"string"},"welcome_text":{"type":"string"},"questions":{"type":"array"}}}',
 '{"type":"object","properties":{"survey":{"type":"object"},"id":{"type":"string"}}}'),

('survey.update', 'Update Survey', 'แก้ไขแบบสอบถามที่มีอยู่', 'survey', '/api/admin/surveys/:id', 'PATCH', 'medium', 'survey.update', 'sync',
 '{"type":"object","properties":{"id":{"type":"string"},"welcome_text":{"type":"string"},"questions":{"type":"array"}}}',
 '{"type":"object","properties":{"survey":{"type":"object"}}}');

-- =====================================================
-- Analytics Domain Tools
-- =====================================================

INSERT INTO public.ai_tools (tool_key, name, description, domain, endpoint, method, risk_level, permission, execution_mode, input_schema, output_schema) VALUES
('analytics.summary', 'Analytics Summary', 'สรุปข้อมูลวิเคราะห์ทั่วทั้งระบบ', 'analytics', '/api/admin/analytics/summary', 'GET', 'low', 'overview.read', 'async',
 '{"type":"object","properties":{"date_range":{"type":"object"},"domain":{"type":"string"}}}',
 '{"type":"object","properties":{"total_activities":{"type":"number"},"total_participants":{"type":"number"},"satisfaction_average":{"type":"number"}}}'),

('analytics.engagement', 'Engagement Summary', 'สรุปข้อมูลการมีส่วนร่วมและการโต้ตอบ', 'analytics', '/api/admin/analytics/engagement', 'GET', 'low', 'overview.read', 'async',
 '{"type":"object","properties":{"date_range":{"type":"object"},"learning_center_id":{"type":"string"}}}',
 '{"type":"object","properties":{"engagement_metrics":{"type":"object"},"trending_activities":{"type":"array"}}}'),

('analytics.occurrence', 'Occurrence Summary', 'สรุปข้อมูลการจัดกิจกรรมตามรอบจัดงาน', 'analytics', '/api/admin/analytics/occurrence', 'GET', 'low', 'overview.read', 'async',
 '{"type":"object","properties":{"activity_id":{"type":"string"},"date_range":{"type":"object"}}}',
 '{"type":"object","properties":{"occurrences":{"type":"array"},"total_occurrences":{"type":"number"},"completion_rate":{"type":"number"}}}');

-- =====================================================
-- Learning Center Domain Tools
-- =====================================================

INSERT INTO public.ai_tools (tool_key, name, description, domain, endpoint, method, risk_level, permission, execution_mode, input_schema, output_schema) VALUES
('learning_center.list', 'List Learning Centers', 'ดึงรายการศูนย์การเรียนรู้ทั้งหมด', 'learning_centers', '/api/admin/learning-centers', 'GET', 'low', 'learning_centers.read', 'sync',
 '{"type":"object","properties":{"type":{"type":"string"},"status":{"type":"string"}}}',
 '{"type":"object","properties":{"centers":{"type":"array"},"total":{"type":"number"}}}'),

('learning_center.get', 'Get Learning Center Details', 'ดึงรายละเอียดศูนย์การเรียนรู้เฉพาะ', 'learning_centers', '/api/admin/learning-centers/:id', 'GET', 'low', 'learning_centers.read', 'sync',
 '{"type":"object","required":["id"],"properties":{"id":{"type":"string"}}}',
 '{"type":"object","properties":{"center":{"type":"object"},"activities":{"type":"array"}}}'),

('learning_center.create', 'Create Learning Center', 'สร้างศูนย์การเรียนรู้ใหม่', 'learning_centers', '/api/admin/learning-centers', 'POST', 'medium', 'learning_centers.create', 'sync',
 '{"type":"object","required":["name","slug","type"],"properties":{"name":{"type":"string"},"slug":{"type":"string"},"type":{"type":"string"},"description":{"type":"string"}}}',
 '{"type":"object","properties":{"center":{"type":"object"},"id":{"type":"string"}}}'),

('learning_center.update', 'Update Learning Center', 'แก้ไขข้อมูลศูนย์การเรียนรู้', 'learning_centers', '/api/admin/learning-centers/:id', 'PATCH', 'medium', 'learning_centers.update', 'sync',
 '{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"description":{"type":"string"}}}',
 '{"type":"object","properties":{"center":{"type":"object"}}}');

-- =====================================================
-- Content/CMS Domain Tools
-- =====================================================

INSERT INTO public.ai_tools (tool_key, name, description, domain, endpoint, method, risk_level, permission, execution_mode, input_schema, output_schema) VALUES
('content.list', 'List Content', 'ดึงรายการเนื้อหา CMS ทั้งหมด', 'cms', '/api/admin/cms', 'GET', 'low', 'cms.read', 'sync',
 '{"type":"object","properties":{"type":{"type":"string"},"status":{"type":"string"}}}',
 '{"type":"object","properties":{"content":{"type":"array"},"total":{"type":"number"}}}'),

('content.create', 'Create Content', 'สร้างเนื้อหา CMS ใหม่', 'cms', '/api/admin/cms', 'POST', 'medium', 'cms.create', 'sync',
 '{"type":"object","required":["title","type"],"properties":{"title":{"type":"string"},"type":{"type":"string"},"content":{"type":"string"}}}',
 '{"type":"object","properties":{"content":{"type":"object"},"id":{"type":"string"}}}'),

('content.update', 'Update Content', 'แก้ไขเนื้อหา CMS', 'cms', '/api/admin/cms/:id', 'PATCH', 'medium', 'cms.update', 'sync',
 '{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"content":{"type":"string"}}}',
 '{"type":"object","properties":{"content":{"type":"object"}}}'),

('content.publish', 'Publish Content', 'เผยแพร่เนื้อหา CMS', 'cms', '/api/admin/cms/:id/publish', 'POST', 'high', 'cms.publish', 'sync',
 '{"type":"object","required":["id"],"properties":{"id":{"type":"string"}}}',
 '{"type":"object","properties":{"content":{"type":"object"},"published_at":{"type":"string"}}}');

-- =====================================================
-- Organization Domain Tools
-- =====================================================

INSERT INTO public.ai_tools (tool_key, name, description, domain, endpoint, method, risk_level, permission, execution_mode, input_schema, output_schema) VALUES
('organization.list', 'List Organizations', 'ดึงรายการองค์กรทั้งหมด', 'organizations', '/api/admin/organizations', 'GET', 'low', 'overview.read', 'sync',
 '{"type":"object","properties":{"type":{"type":"string"},"status":{"type":"string"}}}',
 '{"type":"object","properties":{"organizations":{"type":"array"},"total":{"type":"number"}}}'),

('organization.create', 'Create Organization', 'สร้างองค์กรใหม่', 'organizations', '/api/admin/organizations', 'POST', 'medium', 'overview.read', 'sync',
 '{"type":"object","required":["name","organization_type"],"properties":{"name":{"type":"string"},"organization_type":{"type":"string"},"parent_organization_id":{"type":"string"}}}',
 '{"type":"object","properties":{"organization":{"type":"object"},"id":{"type":"string"}}}'),

('organization.update', 'Update Organization', 'แก้ไขข้อมูลองค์กร', 'organizations', '/api/admin/organizations/:id', 'PATCH', 'medium', 'overview.read', 'sync',
 '{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"status":{"type":"string"}}}',
 '{"type":"object","properties":{"organization":{"type":"object"}}}');

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON TABLE public.ai_tools IS 'Populated with initial tools for activities, surveys, analytics, learning centers, content, and organizations domains';
COMMENT ON COLUMN public.ai_tools.tool_key IS 'Unique identifier for the tool (e.g., activity.list, survey.analytics)';
COMMENT ON COLUMN public.ai_tools.risk_level IS 'Risk classification: low (auto-approve), medium (policy check), high (requires approval), critical (SUPER_ADMIN only)';
COMMENT ON COLUMN public.ai_tools.execution_mode IS 'Execution mode: sync (immediate), async (background processing)';