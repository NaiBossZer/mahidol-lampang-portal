-- Create/publish the verified Ban Thung activity and its survey definition.
-- Source article: https://en.mahidol.ac.th/about/activities/2569/09/3392-envi-mahidol-2
-- Built against the repository's canonical activity / occurrence / survey schema.
-- Respondent-level Excel data is intentionally kept out of this public migration.

DO $$
DECLARE
  v_activity_id uuid;
  v_occurrence_id uuid;
  v_survey_id uuid;
BEGIN
  -- The production database does not reliably expose a unique constraint on slug,
  -- so do not use ON CONFLICT (slug). Find the canonical activity first, then
  -- update it or create it.
  SELECT id
    INTO v_activity_id
  FROM public.activities
  WHERE slug = 'envi-mahidol-ban-thung-2569-09-15'
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_activity_id IS NULL THEN
    INSERT INTO public.activities (
      title,
      slug,
      summary,
      content,
      activity_date,
      location,
      participant_count,
      participants,
      objective,
      key_activities,
      outcomes,
      impact,
      status,
      survey_enabled,
      survey_welcome_text
    )
    VALUES (
      'ENVI Mahidol ต้อนรับนักเรียนโรงเรียนชุมชนบ้านทุ่ง ศึกษาแหล่งเรียนรู้นอกห้องเรียนด้านสิ่งแวดล้อม',
      'envi-mahidol-ban-thung-2569-09-15',
      'ต้อนรับคณะครูและนักเรียนจากโรงเรียนชุมชนบ้านทุ่ง อำเภอสบปราบ จังหวัดลำปาง จำนวน 54 นักเรียน และครูผู้ควบคุมดูแล 6 คน เพื่อศึกษาดูงานแหล่งเรียนรู้นอกห้องเรียนและห้องเรียนรู้ครั่งครบวงจร',
      'วันที่ 15 กันยายน 2569 คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล ให้การต้อนรับคณะครูและนักเรียนจากโรงเรียนชุมชนบ้านทุ่ง อำเภอสบปราบ จังหวัดลำปาง ณ ศูนย์วิจัยและบริการวิชาการสิ่งแวดล้อม มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง พร้อมศึกษาดูงาน ณ ห้องเรียนรู้ครั่งครบวงจร ซึ่งถ่ายทอดองค์ความรู้เกี่ยวกับครั่งตั้งแต่ต้นน้ำ กลางน้ำ และปลายน้ำ ผ่านประสบการณ์ตรงและการเรียนรู้จากพื้นที่จริง',
      DATE '2026-09-15',
      'ศูนย์วิจัยและบริการวิชาการสิ่งแวดล้อม มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง',
      60,
      '60',
      'ส่งเสริมการเรียนรู้ด้านสิ่งแวดล้อมจากแหล่งเรียนรู้จริงนอกห้องเรียน เชื่อมโยงองค์ความรู้กับวิถีชีวิตและชุมชน และนำความรู้ไปประยุกต์ใช้และต่อยอด',
      to_jsonb(ARRAY[
        'ต้อนรับคณะครูและนักเรียนโรงเรียนชุมชนบ้านทุ่ง',
        'ศึกษาดูงานแหล่งเรียนรู้นอกห้องเรียน',
        'ศึกษาห้องเรียนรู้ครั่งครบวงจร',
        'เรียนรู้ครั่งตั้งแต่ต้นน้ำ กลางน้ำ และปลายน้ำ'
      ]::text[]),
      'ผู้เข้าร่วมได้รับความรู้และประสบการณ์จากพื้นที่จริง และสามารถเชื่อมโยงความรู้ด้านสิ่งแวดล้อมกับวิถีชีวิตและชุมชน',
      'สนับสนุนบทบาทของมหาวิทยาลัยในการส่งเสริมการเรียนรู้ตลอดชีวิตและถ่ายทอดองค์ความรู้ด้านสิ่งแวดล้อมสู่เยาวชนและชุมชน',
      'published',
      true,
      'แบบประเมินความพึงพอใจกิจกรรมโรงเรียนชุมชนบ้านทุ่งและห้องเรียนรู้ครั่งครบวงจร'
    )
    RETURNING id INTO v_activity_id;
  ELSE
    UPDATE public.activities
    SET
      title = 'ENVI Mahidol ต้อนรับนักเรียนโรงเรียนชุมชนบ้านทุ่ง ศึกษาแหล่งเรียนรู้นอกห้องเรียนด้านสิ่งแวดล้อม',
      summary = 'ต้อนรับคณะครูและนักเรียนจากโรงเรียนชุมชนบ้านทุ่ง อำเภอสบปราบ จังหวัดลำปาง จำนวน 54 นักเรียน และครูผู้ควบคุมดูแล 6 คน เพื่อศึกษาดูงานแหล่งเรียนรู้นอกห้องเรียนและห้องเรียนรู้ครั่งครบวงจร',
      content = 'วันที่ 15 กันยายน 2569 คณะสิ่งแวดล้อมและทรัพยากรศาสตร์ มหาวิทยาลัยมหิดล ให้การต้อนรับคณะครูและนักเรียนจากโรงเรียนชุมชนบ้านทุ่ง อำเภอสบปราบ จังหวัดลำปาง ณ ศูนย์วิจัยและบริการวิชาการสิ่งแวดล้อม มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง พร้อมศึกษาดูงาน ณ ห้องเรียนรู้ครั่งครบวงจร ซึ่งถ่ายทอดองค์ความรู้เกี่ยวกับครั่งตั้งแต่ต้นน้ำ กลางน้ำ และปลายน้ำ ผ่านประสบการณ์ตรงและการเรียนรู้จากพื้นที่จริง',
      activity_date = DATE '2026-09-15',
      location = 'ศูนย์วิจัยและบริการวิชาการสิ่งแวดล้อม มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง',
      participant_count = 60,
      participants = '60',
      objective = 'ส่งเสริมการเรียนรู้ด้านสิ่งแวดล้อมจากแหล่งเรียนรู้จริงนอกห้องเรียน เชื่อมโยงองค์ความรู้กับวิถีชีวิตและชุมชน และนำความรู้ไปประยุกต์ใช้และต่อยอด',
      key_activities = to_jsonb(ARRAY[
        'ต้อนรับคณะครูและนักเรียนโรงเรียนชุมชนบ้านทุ่ง',
        'ศึกษาดูงานแหล่งเรียนรู้นอกห้องเรียน',
        'ศึกษาห้องเรียนรู้ครั่งครบวงจร',
        'เรียนรู้ครั่งตั้งแต่ต้นน้ำ กลางน้ำ และปลายน้ำ'
      ]::text[]),
      outcomes = 'ผู้เข้าร่วมได้รับความรู้และประสบการณ์จากพื้นที่จริง และสามารถเชื่อมโยงความรู้ด้านสิ่งแวดล้อมกับวิถีชีวิตและชุมชน',
      impact = 'สนับสนุนบทบาทของมหาวิทยาลัยในการส่งเสริมการเรียนรู้ตลอดชีวิตและถ่ายทอดองค์ความรู้ด้านสิ่งแวดล้อมสู่เยาวชนและชุมชน',
      status = 'published',
      survey_enabled = true,
      survey_welcome_text = 'แบบประเมินความพึงพอใจกิจกรรมโรงเรียนชุมชนบ้านทุ่งและห้องเรียนรู้ครั่งครบวงจร',
      updated_at = now()
    WHERE id = v_activity_id;
  END IF;

  -- Canonical occurrence: one completed occurrence for this activity.
  SELECT id
    INTO v_occurrence_id
  FROM public.activity_occurrences
  WHERE activity_id = v_activity_id
    AND occurrence_no = 1
  LIMIT 1;

  IF v_occurrence_id IS NULL THEN
    INSERT INTO public.activity_occurrences (
      activity_id,
      occurrence_no,
      start_at,
      status,
      participant_count,
      location_type,
      location_detail
    )
    VALUES (
      v_activity_id,
      1,
      '2026-09-15 09:00:00+07',
      'completed',
      60,
      'center',
      'ศูนย์วิจัยและบริการวิชาการสิ่งแวดล้อม มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง'
    )
    RETURNING id INTO v_occurrence_id;
  ELSE
    UPDATE public.activity_occurrences
    SET
      start_at = '2026-09-15 09:00:00+07',
      status = 'completed',
      participant_count = 60,
      location_type = 'center',
      location_detail = 'ศูนย์วิจัยและบริการวิชาการสิ่งแวดล้อม มหาวิทยาลัยมหิดล อำเภอสบปราบ จังหวัดลำปาง',
      updated_at = now()
    WHERE id = v_occurrence_id;
  END IF;

  -- occurrence_surveys.occurrence_id is UNIQUE in the canonical schema.
  SELECT id
    INTO v_survey_id
  FROM public.occurrence_surveys
  WHERE occurrence_id = v_occurrence_id
  LIMIT 1;

  IF v_survey_id IS NULL THEN
    INSERT INTO public.occurrence_surveys (
      occurrence_id,
      enabled,
      anonymous,
      open_at,
      welcome_text
    )
    VALUES (
      v_occurrence_id,
      true,
      true,
      '2026-09-15 00:00:00+07',
      'แบบประเมินความพึงพอใจกิจกรรมโรงเรียนชุมชนบ้านทุ่งและห้องเรียนรู้ครั่งครบวงจร'
    )
    RETURNING id INTO v_survey_id;
  ELSE
    UPDATE public.occurrence_surveys
    SET
      enabled = true,
      anonymous = true,
      open_at = '2026-09-15 00:00:00+07',
      welcome_text = 'แบบประเมินความพึงพอใจกิจกรรมโรงเรียนชุมชนบ้านทุ่งและห้องเรียนรู้ครั่งครบวงจร',
      updated_at = now()
    WHERE id = v_survey_id;
  END IF;

  -- Survey question order is used as the stable import mapping for the Excel
  -- responses. Existing rows with the same survey/order are left untouched.
  INSERT INTO public.survey_questions (
    survey_id,
    section_key,
    question_text,
    question_type,
    required,
    order_index,
    scale_min,
    scale_max,
    active
  )
  SELECT
    v_survey_id,
    q.section_key,
    q.question_text,
    'rating',
    false,
    q.order_index,
    1,
    5,
    true
  FROM (VALUES
    ('opening','ความเหมาะสมของสถานที่จัดงาน',1),
    ('opening','ความเหมาะสมของกำหนดการและระยะเวลาการจัดงาน',2),
    ('opening','ความพร้อมและความเป็นระเบียบของสถานที่',3),
    ('opening','การต้อนรับและการอำนวยความสะดวกของเจ้าหน้าที่',4),
    ('opening','ความพึงพอใจต่อการจัดพิธีเปิดโดยรวม',5),
    ('learning_room','ความน่าสนใจของห้องการเรียนรู้และนิทรรศการ',6),
    ('learning_room','ความเหมาะสมและความครบถ้วนของเนื้อหา',7),
    ('learning_room','ความชัดเจนและเข้าใจง่ายของสื่อการเรียนรู้',8),
    ('learning_room','ประโยชน์ขององค์ความรู้ที่ได้รับ',9),
    ('learning_room','ความสามารถในการนำความรู้ไปใช้หรือต่อยอด',10),
    ('outcomes','ท่านได้รับความรู้และความเข้าใจเกี่ยวกับครั่งเพิ่มขึ้น',11),
    ('outcomes','กิจกรรมสามารถสร้างแรงบันดาลใจในการอนุรักษ์และพัฒนาครั่ง',12),
    ('outcomes','ห้องการเรียนรู้สามารถใช้เป็นแหล่งเรียนรู้สำหรับชุมชนและผู้สนใจได้',13),
    ('outcomes','ท่านมีความสนใจเข้าร่วมกิจกรรมหรือกลับมาใช้ห้องการเรียนรู้อีกในอนาคต',14)
  ) AS q(section_key, question_text, order_index)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.survey_questions existing
    WHERE existing.survey_id = v_survey_id
      AND existing.order_index = q.order_index
  );
END $$;
