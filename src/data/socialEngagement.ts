export type SocialActivity = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  activityDate: string;
  location: string;
  participantCount?: number;
  featuredImage: string;
  system: "smart-farm" | "clean-energy" | "shellac" | "social";
  centerName?: string;
  projectTitle?: string;
  objective?: string;
  process?: string;
  outcome?: string;
  impact?: string;
  photos?: { imageUrl: string; caption?: string }[];
  partners?: string[];
};

export const SYSTEMS = [
  {
    slug: "smart-farm",
    title: "Smart Farm",
    subtitle: "เกษตรอัจฉริยะและข้อมูลจากพื้นที่จริง",
    image: "/Smart Farm.jpg",
    href: "/smart-farm",
  },
  {
    slug: "clean-energy",
    title: "Clean Energy",
    subtitle: "พลังงานสะอาดและการใช้พลังงานอย่างมีประสิทธิภาพ",
    image: "/EVCharger.jpg",
    href: "/clean-energy",
  },
  {
    slug: "shellac",
    title: "Shellac Learning Center",
    subtitle: "ศูนย์เรียนรู้ครั่งครบวงจร",
    image: "/Shellac banner.jpg",
    href: "https://mahidol-shellac.vercel.app/",
  },
];

export const FALLBACK_ACTIVITIES: SocialActivity[] = [
  {
    id: "shellac-learning-2569",
    slug: "shellac-learning-center-2569",
    title: "ห้องการเรียนรู้ครั่งครบวงจร",
    summary:
      "เปิดพื้นที่เรียนรู้เรื่องครั่ง ตั้งแต่วงจรชีวิต การเลี้ยงครั่ง การแปรรูป ไปจนถึงการสร้างมูลค่าในชุมชน",
    activityDate: "2026-08-21",
    location: "ศูนย์ลำปาง อำเภอสบปราบ จังหวัดลำปาง",
    featuredImage: "/Shellac banner.jpg",
    system: "shellac",
    centerName: "Shellac Learning Center",
    objective: "สร้างพื้นที่เรียนรู้ครั่งครบวงจรสำหรับนักเรียน นักศึกษา ชุมชน และผู้สนใจ",
    outcome: "เชื่อมองค์ความรู้จากงานวิจัยกับการเรียนรู้และการใช้ประโยชน์ในพื้นที่",
    impact: "เพิ่มโอกาสในการเรียนรู้และต่อยอดทรัพยากรท้องถิ่นสู่การสร้างคุณค่า",
  },
  {
    id: "school-shellac-2569",
    slug: "shellac-school-community-baan-fon-2569",
    title: "ขับเคลื่อนพื้นที่การเรียนรู้ ‘ครั่ง’ อย่างครบวงจร",
    summary:
      "สร้างความร่วมมือกับสถานศึกษาเพื่อพัฒนาพื้นที่เรียนรู้ครั่งและเชื่อมโยงองค์ความรู้สู่การปฏิบัติ",
    activityDate: "2026-06-12",
    location: "โรงเรียนชุมชนบ้านฟ่อนวิทยา จังหวัดลำปาง",
    featuredImage: "/Shellac banner.jpg",
    system: "shellac",
    centerName: "Shellac Learning Center",
    objective: "พัฒนาพื้นที่เรียนรู้ร่วมกับโรงเรียนและชุมชน",
    process: "ลงพื้นที่ แลกเปลี่ยนองค์ความรู้ และออกแบบกิจกรรมการเรียนรู้จากบริบทจริง",
    outcome: "เกิดความร่วมมือระหว่างมหาวิทยาลัย สถานศึกษา และชุมชน",
  },
  {
    id: "smart-farm-2569",
    slug: "smart-farm-learning-2569",
    title: "ยกระดับการเรียนรู้เกษตรอัจฉริยะจากข้อมูลพื้นที่จริง",
    summary:
      "ใช้ข้อมูลอุณหภูมิ ความชื้น และสภาพแวดล้อมเพื่อสนับสนุนการเรียนรู้และการวางแผนเพาะปลูก",
    activityDate: "2026-06-09",
    location: "พื้นที่ปฏิบัติการสบปราบ จังหวัดลำปาง",
    featuredImage: "/Smart Farm.jpg",
    system: "smart-farm",
    centerName: "Smart Farm Station",
    objective: "ทำให้ข้อมูลจากระบบ IoT เป็นเครื่องมือสำหรับการเรียนรู้และการตัดสินใจ",
    outcome: "ผู้เรียนเห็นความสัมพันธ์ระหว่างข้อมูลสิ่งแวดล้อมกับการจัดการแปลง",
  },
];
