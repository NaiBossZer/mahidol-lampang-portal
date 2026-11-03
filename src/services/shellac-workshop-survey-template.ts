import type { SurveyQuestion } from "@/services/admin-surveys";

export type SurveyTemplateQuestion = Omit<SurveyQuestion, "id" | "survey_id" | "active">;

const rating = (section_key: string, question_text: string, order_index: number, required = true): SurveyTemplateQuestion => ({
  section_key,
  question_text,
  question_type: "rating",
  required,
  order_index,
  options: [],
  scale_min: 1,
  scale_max: 5,
});

const choice = (
  section_key: string,
  question_text: string,
  question_type: "single_choice" | "multi_choice",
  options: string[],
  order_index: number,
  required = true,
): SurveyTemplateQuestion => ({
  section_key,
  question_text,
  question_type,
  required,
  order_index,
  options,
  scale_min: 1,
  scale_max: 5,
});

const text = (section_key: string, question_text: string, order_index: number, required = false): SurveyTemplateQuestion => ({
  section_key,
  question_text,
  question_type: "text",
  required,
  order_index,
  options: [],
  scale_min: 1,
  scale_max: 5,
});

/**
 * Questionnaire for the Shellac workshop on 18 Dec 2026.
 * Keep demographic questions non-identifying and optional where practical.
 */
export const shellacWorkshopSurveyTemplate: SurveyTemplateQuestion[] = [
  choice("profile", "ช่วงอายุของท่าน", "single_choice", ["ต่ำกว่า 20 ปี", "20–30 ปี", "31–40 ปี", "41–50 ปี", "51–60 ปี", "มากกว่า 60 ปี", "ไม่ประสงค์ระบุ"], 1, false),
  choice("profile", "อาชีพหลักของท่าน", "single_choice", ["เกษตรกร", "ผู้ประกอบการ/ค้าขาย", "รับจ้าง", "ข้าราชการ/พนักงานหน่วยงานรัฐ", "นักเรียน/นักศึกษา", "อื่น ๆ"], 2, false),
  choice("profile", "ท่านมีประสบการณ์เกี่ยวกับการเลี้ยงครั่งหรือไม่", "single_choice", ["ไม่เคย", "เคยศึกษา/ทดลองเลี้ยง", "เคยเลี้ยงเป็นอาชีพหรือมีผลผลิต"], 3),
  choice("profile", "ท่านมีพื้นที่หรือต้นไม้ที่อาจใช้เป็นพืชอาศัยครั่งหรือไม่", "single_choice", ["มี", "ไม่มี", "ไม่แน่ใจ"], 4, false),

  rating("organization", "ความเหมาะสมของการลงทะเบียนและการต้อนรับ", 5),
  rating("organization", "ความเหมาะสมของสถานที่และสิ่งอำนวยความสะดวก", 6),
  rating("organization", "ความเหมาะสมของระยะเวลาและลำดับกิจกรรม", 7),
  rating("organization", "ความเหมาะสมของอาหารว่างและอาหารกลางวัน", 8),

  rating("learning", "ความชัดเจนของเนื้อหาความรู้พื้นฐานและวงจรชีวิตครั่ง", 9),
  rating("learning", "ความเข้าใจเรื่องการคัดเลือกพืชอาศัยที่เหมาะสม", 10),
  rating("learning", "ความเข้าใจเทคนิคการปล่อยเลี้ยงและการดูแลรักษาครั่ง", 11),
  rating("learning", "ความเข้าใจการเฝ้าระวังศัตรูครั่งและการจัดการแปลงในสภาพอากาศแปรปรวน", 12),
  rating("learning", "ความเข้าใจการเก็บเกี่ยว การคัดคุณภาพ และการเตรียมครั่งเพื่อจำหน่าย", 13),
  rating("learning", "ความเข้าใจภาพรวมตลาด ราคา และโอกาสสร้างมูลค่าเพิ่มจากครั่ง", 14),

  rating("practice", "ความชัดเจนของการสาธิตเลือกกิ่งเชื้อครั่งและข้อควรระวัง", 15),
  rating("practice", "โอกาสได้ลงมือฝึกปล่อยเลี้ยงครั่งในแปลงสาธิต", 16),
  rating("practice", "คำแนะนำจากวิทยากรระหว่างการฝึกปฏิบัติ", 17),
  rating("practice", "ความเข้าใจการติดตามการเจริญเติบโต ตรวจสภาพกิ่ง และบันทึกข้อมูล", 18),

  rating("outcomes", "หลังอบรม ท่านมีความรู้เรื่องการเลี้ยงครั่งเพิ่มขึ้นเพียงใด", 19),
  rating("outcomes", "ท่านมั่นใจว่าจะสามารถนำความรู้ไปทดลองใช้ในพื้นที่ได้เพียงใด", 20),
  choice("outcomes", "ท่านมีแผนจะนำความรู้ไปใช้เมื่อใด", "single_choice", ["ภายใน 1 เดือน", "ภายใน 3 เดือน", "ภายใน 6 เดือน", "ยังไม่มีแผน แต่สนใจเรียนรู้ต่อ", "ยังไม่แน่ใจ"], 21),
  choice("outcomes", "อุปสรรคที่อาจพบในการนำความรู้ไปใช้ (เลือกได้มากกว่า 1 ข้อ)", "multi_choice", ["ขาดกิ่งเชื้อครั่ง/พันธุ์ครั่ง", "ขาดพืชอาศัยหรือพื้นที่เหมาะสม", "ขาดความรู้และประสบการณ์", "เงินทุนและอุปกรณ์", "สภาพอากาศและภัยแล้ง", "ตลาดและราคาผลผลิต", "แรงงาน/เวลา", "อื่น ๆ", "ยังไม่พบอุปสรรค"], 22, false),
  choice("outcomes", "การสนับสนุนที่ท่านต้องการเพิ่มเติม (เลือกได้มากกว่า 1 ข้อ)", "multi_choice", ["สนับสนุนกิ่งเชื้อครั่ง", "ให้คำปรึกษาในแปลง", "อบรมภาคปฏิบัติเพิ่มเติม", "สนับสนุนพืชอาศัย/กล้าไม้", "เชื่อมโยงตลาดและผู้รับซื้อ", "ข้อมูลต้นทุนและรายได้", "กลุ่มเครือข่ายผู้เลี้ยงครั่ง", "อื่น ๆ"], 23, false),

  rating("overall", "โดยภาพรวม ท่านพึงพอใจต่อโครงการอบรมครั้งนี้เพียงใด", 24),
  text("feedback", "สิ่งที่ท่านได้รับประโยชน์มากที่สุดจากการอบรม", 25),
  text("feedback", "ข้อเสนอแนะหรือหัวข้อที่ต้องการให้จัดอบรมเพิ่มเติม", 26),
];
