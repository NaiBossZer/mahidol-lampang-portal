import { useMemo, useState } from "react";

type Page = "activities" | "create" | "surveys" | "survey-detail";
type IconName =
  | "activity"
  | "plus"
  | "survey"
  | "search"
  | "filter"
  | "calendar"
  | "users"
  | "dots"
  | "chevron"
  | "bell"
  | "menu"
  | "close"
  | "edit"
  | "eye"
  | "layers"
  | "sparkles"
  | "upload"
  | "clock"
  | "location"
  | "check"
  | "arrow"
  | "link"
  | "qr"
  | "info"
  | "archive"
  | "building"
  | "grip";

const paths: Record<IconName, JSX.Element> = {
  activity: (
    <>
      <path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
      <path d="M2 19h20M8 7h8M8 11h8M8 15h3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  survey: (
    <>
      <path d="M9 5h10v16H5V5h4" />
      <path d="M9 3h6v4H9zM9 12h6M9 16h6M7 12h.01M7 16h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  filter: <path d="M4 5h16M7 12h10M10 19h4" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  dots: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3-1.4 3.6L7 8l3.6 1.4L12 13l1.4-3.6L17 8l-3.6-1.4L12 3ZM5 14l-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14ZM19 13l-.7 1.8-1.8.7 1.8.7L19 18l.7-1.8 1.8-.7-1.8-.7L19 13Z" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  location: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
      <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
    </>
  ),
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h3v3h-3zM18 18h3v3h-3zM18 14h3M14 18v3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  archive: (
    <>
      <path d="M4 7v13h16V7M3 3h18v4H3zM9 11h6" />
    </>
  ),
  building: (
    <>
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M10 21v-4h4v4" />
    </>
  ),
  grip: (
    <>
      <circle cx="9" cy="6" r=".8" />
      <circle cx="15" cy="6" r=".8" />
      <circle cx="9" cy="12" r=".8" />
      <circle cx="15" cy="12" r=".8" />
      <circle cx="9" cy="18" r=".8" />
      <circle cx="15" cy="18" r=".8" />
    </>
  ),
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const activities = [
  {
    id: "ACT-2568-024",
    name: "โครงการส่งเสริมสุขภาวะและการเรียนรู้ตลอดชีวิต",
    type: "พัฒนานักศึกษา",
    date: "18–19 มิ.ย. 2568",
    dept: "งานกิจการนักศึกษา",
    people: 120,
    rounds: 2,
    surveys: 1,
    status: "Scheduled",
  },
  {
    id: "ACT-2568-021",
    name: "อบรมการใช้ข้อมูลเพื่อพัฒนาชุมชนอย่างยั่งยืน",
    type: "บริการวิชาการ",
    date: "28 พ.ค. 2568",
    dept: "ศูนย์วิจัยและบริการวิชาการ",
    people: 64,
    rounds: 1,
    surveys: 1,
    status: "Ongoing",
  },
  {
    id: "ACT-2568-018",
    name: "มหิดลลำปางร่วมใจ ลดใช้พลังงาน",
    type: "สิ่งแวดล้อม",
    date: "5 เม.ย. 2568",
    dept: "งานบริหารทั่วไป",
    people: 86,
    rounds: 3,
    surveys: 2,
    status: "Completed",
  },
  {
    id: "ACT-2568-015",
    name: "เวทีแลกเปลี่ยนเรียนรู้เครือข่ายสุขภาพภาคเหนือ",
    type: "วิชาการ",
    date: "22–23 มี.ค. 2568",
    dept: "สำนักงานวิทยาเขต",
    people: 180,
    rounds: 2,
    surveys: 0,
    status: "Draft",
  },
  {
    id: "ACT-2568-009",
    name: "กิจกรรมปฐมนิเทศบุคลากรใหม่ ประจำปี 2568",
    type: "พัฒนาบุคลากร",
    date: "10 ก.พ. 2568",
    dept: "งานทรัพยากรบุคคล",
    people: 42,
    rounds: 1,
    surveys: 1,
    status: "Archived",
  },
];

const statusThai: Record<string, string> = {
  Draft: "ฉบับร่าง",
  Scheduled: "กำหนดการแล้ว",
  Ongoing: "กำลังดำเนินการ",
  Completed: "เสร็จสิ้น",
  Cancelled: "ยกเลิก",
  Archived: "เก็บในคลัง",
  Published: "เผยแพร่แล้ว",
  Closed: "ปิดรับคำตอบ",
};

function Badge({ status }: { status: string }) {
  return (
    <span className={`badge badge-${status.toLowerCase()}`}>
      <i />
      {statusThai[status] || status}
    </span>
  );
}

function App() {
  const [page, setPage] = useState<Page>("activities");
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ทั้งหมด");
  const [menu, setMenu] = useState<string | null>(null);
  const [modal, setModal] = useState<"publish" | "preview" | null>(null);
  const [toast, setToast] = useState("");
  const [step, setStep] = useState(1);

  const filtered = useMemo(
    () =>
      activities.filter(
        (a) =>
          (a.name.includes(search) || a.id.toLowerCase().includes(search.toLowerCase())) &&
          (status === "ทั้งหมด" || a.status === status),
      ),
    [search, status],
  );

  const navigate = (next: Page) => {
    setPage(next);
    setMobileNav(false);
    setMenu(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const activeModule =
    page === "create" ? "create" : page.includes("survey") ? "surveys" : "activities";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <strong>MAHIDOL</strong>
            <span>LAMPANG CAMPUS</span>
          </div>
          <button
            className="icon-btn close-nav"
            onClick={() => setMobileNav(false)}
            aria-label="ปิดเมนู"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="nav-label">ระบบบริหารจัดการ</div>
        <nav>
          <button
            className={activeModule === "activities" ? "active" : ""}
            onClick={() => navigate("activities")}
          >
            <Icon name="activity" />
            <span>รายการกิจกรรมโครงการ</span>
          </button>
          <button
            className={activeModule === "create" ? "active" : ""}
            onClick={() => navigate("create")}
          >
            <Icon name="plus" />
            <span>สร้างกิจกรรม & AI Survey</span>
          </button>
          <button
            className={activeModule === "surveys" ? "active" : ""}
            onClick={() => navigate("surveys")}
          >
            <Icon name="survey" />
            <span>แบบประเมิน</span>
          </button>
        </nav>
        <div className="sidebar-help">
          <span className="help-icon">
            <Icon name="info" size={16} />
          </span>
          <div>
            <strong>ศูนย์ช่วยเหลือ</strong>
            <p>คู่มือการใช้งานระบบ</p>
          </div>
          <Icon name="chevron" size={15} />
        </div>
        <div className="sidebar-profile">
          <div className="avatar">นศ</div>
          <div>
            <strong>นภา ศรีสวัสดิ์</strong>
            <span>ผู้ดูแลระบบ</span>
          </div>
          <Icon name="dots" />
        </div>
      </aside>
      {mobileNav && <div className="nav-scrim" onClick={() => setMobileNav(false)} />}

      <main className="main">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            onClick={() => setMobileNav(true)}
            aria-label="เปิดเมนู"
          >
            <Icon name="menu" />
          </button>
          <div className="topbar-title">ระบบบริหารกิจกรรมและแบบประเมิน</div>
          <div className="topbar-actions">
            <span className="demo-chip">ข้อมูลสาธิต</span>
            <button className="icon-btn notification" aria-label="การแจ้งเตือน">
              <Icon name="bell" />
              <i />
            </button>
            <div className="mini-avatar">นศ</div>
          </div>
        </header>

        <div className="content">
          {page === "activities" && (
            <ActivityList
              {...{ filtered, search, setSearch, status, setStatus, menu, setMenu, navigate }}
            />
          )}
          {page === "create" && <CreateActivity {...{ step, setStep, setModal, notify }} />}
          {page === "surveys" && <SurveyManagement navigate={navigate} />}
          {page === "survey-detail" && <SurveyDetail navigate={navigate} />}
        </div>
      </main>

      {modal && (
        <Modal
          type={modal}
          close={() => setModal(null)}
          confirm={() => {
            setModal(null);
            notify(modal === "publish" ? "เผยแพร่กิจกรรมเรียบร้อยแล้ว" : "บันทึกเป็นฉบับร่างแล้ว");
          }}
        />
      )}
      {toast && (
        <div className="toast">
          <span>
            <Icon name="check" size={16} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div className="breadcrumb">
      {items.map((item, i) => (
        <span key={item}>
          {i > 0 && <Icon name="chevron" size={13} />}
          {item}
        </span>
      ))}
    </div>
  );
}

function PageTitle({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

function ActivityList({
  filtered,
  search,
  setSearch,
  status,
  setStatus,
  menu,
  setMenu,
  navigate,
}: any) {
  const stats = [
    ["กิจกรรมทั้งหมด", "24", "activity", "navy", "+3 เดือนนี้"],
    ["กำลังดำเนินการ", "03", "clock", "blue", "12.5% ของทั้งหมด"],
    ["รอดำเนินการ", "08", "calendar", "gold", "รอบถัดไป 18 มิ.ย."],
    ["เสร็จสิ้นแล้ว", "11", "check", "green", "อัตราสำเร็จ 92%"],
  ];
  return (
    <>
      <Breadcrumb items={["กิจกรรมโครงการ", "รายการทั้งหมด"]} />
      <PageTitle
        title="รายการกิจกรรมโครงการ"
        description="ติดตามสถานะ จัดการรอบกิจกรรม และเชื่อมต่อแบบประเมินในที่เดียว"
        actions={
          <button className="btn primary" onClick={() => navigate("create")}>
            <Icon name="plus" />
            สร้างกิจกรรมใหม่
          </button>
        }
      />
      <div className="stat-grid">
        {stats.map(([label, value, icon, color, foot]) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${color}`}>
              <Icon name={icon as IconName} />
            </div>
            <div className="stat-body">
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{foot}</small>
            </div>
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="panel-toolbar">
          <div className="searchbox">
            <Icon name="search" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อกิจกรรม หรือรหัสโครงการ"
            />
          </div>
          <div className="filter-row">
            <Select label="ปีงบประมาณ" value="2568" />
            <Select label="ประเภทกิจกรรม" value="ทั้งหมด" />
            <Select label="หน่วยงาน" value="ทุกหน่วยงาน" />
            <label className="select-wrap compact">
              <span>สถานะ</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>ทั้งหมด</option>
                <option value="Draft">ฉบับร่าง</option>
                <option value="Scheduled">กำหนดการแล้ว</option>
                <option value="Ongoing">กำลังดำเนินการ</option>
                <option value="Completed">เสร็จสิ้น</option>
                <option value="Archived">เก็บในคลัง</option>
              </select>
            </label>
            <button className="btn filter-btn">
              <Icon name="filter" />
              ตัวกรอง
            </button>
          </div>
        </div>
        <div className="table-meta">
          <strong>กิจกรรมทั้งหมด</strong>
          <span>แสดง {filtered.length} จาก 24 รายการ</span>
        </div>
        {filtered.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>กิจกรรม</th>
                  <th>วันที่จัด</th>
                  <th>หน่วยงาน</th>
                  <th>ผู้เข้าร่วม</th>
                  <th>รอบ / แบบประเมิน</th>
                  <th>สถานะ</th>
                  <th aria-label="การจัดการ" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((a: any) => (
                  <tr key={a.id}>
                    <td>
                      <button className="activity-name" onClick={() => navigate("create")}>
                        {a.name}
                      </button>
                      <div className="cell-sub">
                        {a.id}
                        <i />
                        {a.type}
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        <Icon name="calendar" size={15} />
                        {a.date}
                      </div>
                    </td>
                    <td>{a.dept}</td>
                    <td>
                      <strong>{a.people}</strong> คน
                    </td>
                    <td>
                      <div className="relation">
                        <button onClick={() => navigate("create")}>
                          <Icon name="layers" size={14} />
                          {a.rounds} รอบ
                        </button>
                        <button onClick={() => navigate("surveys")}>
                          <Icon name="survey" size={14} />
                          {a.surveys} แบบ
                        </button>
                      </div>
                    </td>
                    <td>
                      <Badge status={a.status} />
                    </td>
                    <td className="actions-cell">
                      <button
                        className="icon-btn"
                        onClick={() => setMenu(menu === a.id ? null : a.id)}
                        aria-label="จัดการ"
                      >
                        <Icon name="dots" />
                      </button>
                      {menu === a.id && (
                        <div className="action-menu">
                          <button onClick={() => navigate("create")}>
                            <Icon name="eye" />
                            ดูรายละเอียด
                          </button>
                          <button onClick={() => navigate("create")}>
                            <Icon name="edit" />
                            แก้ไขกิจกรรม
                          </button>
                          <button onClick={() => navigate("create")}>
                            <Icon name="layers" />
                            จัดการรอบกิจกรรม
                          </button>
                          <button onClick={() => navigate("surveys")}>
                            <Icon name="survey" />
                            จัดการแบบประเมิน
                          </button>
                          <hr />
                          <button>
                            <Icon name="archive" />
                            เก็บเข้าคลัง
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <div>
              <Icon name="search" />
            </div>
            <h3>ไม่พบกิจกรรมที่ค้นหา</h3>
            <p>ลองเปลี่ยนคำค้นหาหรือตัวกรอง แล้วค้นหาอีกครั้ง</p>
            <button
              className="btn"
              onClick={() => {
                setSearch("");
                setStatus("ทั้งหมด");
              }}
            >
              ล้างตัวกรอง
            </button>
          </div>
        )}
        <div className="pagination">
          <span>
            รายการต่อหน้า{" "}
            <select>
              <option>10</option>
              <option>25</option>
            </select>
          </span>
          <span>1–5 จาก 24</span>
          <div>
            <button disabled>‹</button>
            <button className="current">1</button>
            <button>2</button>
            <button>3</button>
            <button>›</button>
          </div>
        </div>
      </section>
    </>
  );
}

function Select({ label, value }: { label: string; value: string }) {
  return (
    <label className="select-wrap">
      <span>{label}</span>
      <select defaultValue={value}>
        <option>{value}</option>
        <option>ตัวเลือกอื่น</option>
      </select>
    </label>
  );
}

function CreateActivity({ step, setStep, setModal, notify }: any) {
  const labels = ["ข้อมูลพื้นฐาน", "รอบกิจกรรม", "AI Survey", "ตรวจสอบและเผยแพร่"];
  return (
    <>
      <Breadcrumb items={["กิจกรรมโครงการ", "สร้างกิจกรรมใหม่"]} />
      <PageTitle
        eyebrow="ACTIVITY WORKSPACE"
        title="สร้างกิจกรรม & AI Survey"
        description="กรอกข้อมูลตามลำดับ ระบบจะบันทึกข้อมูลของคุณโดยอัตโนมัติ"
        actions={
          <>
            <span className="save-state">
              <i />
              <span>บันทึกล่าสุด 10:42 น.</span>
            </span>
            <button className="btn" onClick={() => notify("บันทึกเป็นฉบับร่างแล้ว")}>
              บันทึกฉบับร่าง
            </button>
          </>
        }
      />
      <div className="stepper">
        {labels.map((label, i) => (
          <button
            key={label}
            className={`${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}
            onClick={() => setStep(i + 1)}
          >
            <span>{step > i + 1 ? <Icon name="check" size={15} /> : i + 1}</span>
            <div>
              <small>ขั้นตอนที่ {i + 1}</small>
              <strong>{label}</strong>
            </div>
            {i < 3 && <i />}
          </button>
        ))}
      </div>
      {step === 1 && <BasicInfo next={() => setStep(2)} />}
      {step === 2 && <Occurrences next={() => setStep(3)} back={() => setStep(1)} />}
      {step === 3 && <AIAssistant next={() => setStep(4)} back={() => setStep(2)} />}
      {step === 4 && (
        <Review
          publish={() => setModal("publish")}
          preview={() => setModal("preview")}
          back={() => setStep(3)}
        />
      )}
    </>
  );
}

function SectionHeader({ number, title, desc }: { number?: string; title: string; desc: string }) {
  return (
    <div className="section-head">
      {number && <span>{number}</span>}
      <div>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function BasicInfo({ next }: { next: () => void }) {
  return (
    <div className="form-layout">
      <div className="form-main">
        <section className="panel form-panel">
          <SectionHeader
            number="A"
            title="ข้อมูลพื้นฐานกิจกรรม"
            desc="ข้อมูลส่วนนี้จะแสดงในหน้ารายละเอียดกิจกรรมและใช้เป็นบริบทสำหรับ AI"
          />
          <div className="form-grid">
            <label className="field full">
              <span>
                ชื่อกิจกรรม <b>*</b>
              </span>
              <input defaultValue="โครงการส่งเสริมสุขภาวะและการเรียนรู้ตลอดชีวิต" />
              <small>ระบุชื่อที่สื่อความหมายและค้นหาได้ง่าย</small>
            </label>
            <label className="field">
              <span>
                ประเภทกิจกรรม <b>*</b>
              </span>
              <select defaultValue="พัฒนานักศึกษา">
                <option>พัฒนานักศึกษา</option>
                <option>บริการวิชาการ</option>
              </select>
            </label>
            <label className="field">
              <span>
                หน่วยงานผู้รับผิดชอบ <b>*</b>
              </span>
              <select>
                <option>งานกิจการนักศึกษา</option>
              </select>
            </label>
            <label className="field">
              <span>
                ผู้ประสานงาน <b>*</b>
              </span>
              <input defaultValue="นางสาวนภา ศรีสวัสดิ์" />
            </label>
            <label className="field">
              <span>อีเมล / โทรศัพท์</span>
              <input defaultValue="napa.sri@mahidol.ac.th · 0 5422 6000" />
            </label>
            <label className="field full">
              <span>
                หลักการและเหตุผล <b>*</b>
              </span>
              <textarea
                rows={4}
                defaultValue="ส่งเสริมให้นักศึกษาและบุคลากรมีความรู้ความเข้าใจด้านสุขภาวะ สามารถประยุกต์ใช้ในชีวิตประจำวัน และถ่ายทอดสู่ชุมชนได้อย่างเหมาะสม"
              />
            </label>
            <label className="field full">
              <span>
                วัตถุประสงค์ <b>*</b>
              </span>
              <textarea
                rows={3}
                defaultValue={
                  "1. เพื่อเสริมสร้างความรู้ด้านสุขภาวะอย่างรอบด้าน\n2. เพื่อพัฒนาทักษะการเรียนรู้และการดูแลตนเอง"
                }
              />
            </label>
            <label className="field">
              <span>กลุ่มเป้าหมาย</span>
              <input defaultValue="นักศึกษาและบุคลากร วิทยาเขตลำปาง" />
            </label>
            <label className="field">
              <span>ผลลัพธ์และผลกระทบที่คาดหวัง</span>
              <input placeholder="ระบุผลลัพธ์ที่วัดผลได้" />
            </label>
          </div>
        </section>
        <section className="panel form-panel">
          <SectionHeader
            title="ภาพประกอบและเอกสาร"
            desc="รองรับ JPG, PNG และ PDF ขนาดไม่เกิน 10 MB ต่อไฟล์"
          />
          <div className="upload-zone">
            <span>
              <Icon name="upload" />
            </span>
            <strong>
              ลากไฟล์มาวาง หรือ <u>เลือกจากคอมพิวเตอร์</u>
            </strong>
            <small>ภาพปกแนะนำอัตราส่วน 16:9</small>
          </div>
        </section>
        <FormFooter next={next} nextText="ถัดไป: เพิ่มรอบกิจกรรม" />
      </div>
      <aside className="form-aside">
        <div className="tip-card">
          <Icon name="sparkles" />
          <h3>เตรียมข้อมูลสำหรับ AI</h3>
          <p>รายละเอียดวัตถุประสงค์และกลุ่มเป้าหมายที่ชัดเจน จะช่วยให้ AI แนะนำคำถามได้ตรงบริบทมากขึ้น</p>
          <ul>
            <li>ระบุผลลัพธ์ที่ต้องการวัด</li>
            <li>หลีกเลี่ยงข้อมูลส่วนบุคคล</li>
            <li>ตรวจทานความถูกต้องก่อนใช้</li>
          </ul>
        </div>
        <div className="progress-card">
          <span>ความครบถ้วนของข้อมูล</span>
          <strong>78%</strong>
          <div>
            <i style={{ width: "78%" }} />
          </div>
          <small>ยังขาดผลลัพธ์ที่คาดหวัง</small>
        </div>
      </aside>
    </div>
  );
}

function Occurrences({ next, back }: { next: () => void; back: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="form-layout">
      <div className="form-main">
        <section className="panel form-panel">
          <div className="section-with-action">
            <SectionHeader
              number="B"
              title="การจัดการรอบกิจกรรม"
              desc="หนึ่งกิจกรรมสามารถจัดได้หลายวันหรือหลายรอบ และกำหนดการรับแบบประเมินแยกกันได้"
            />
            <button className="btn">
              <Icon name="plus" />
              เพิ่มรอบ
            </button>
          </div>
          <div className="occurrence-card">
            <div className="occurrence-head">
              <span className="drag">
                <Icon name="grip" />
              </span>
              <div>
                <small>รอบที่ 1</small>
                <strong>รอบเช้า · วันที่ 18 มิถุนายน 2568</strong>
              </div>
              <Badge status="Scheduled" />
              <button className="icon-btn">
                <Icon name="dots" />
              </button>
            </div>
            <div className="form-grid compact-grid">
              <label className="field">
                <span>
                  วันและเวลาเริ่มต้น <b>*</b>
                </span>
                <div className="input-icon">
                  <Icon name="calendar" />
                  <input defaultValue="18 มิ.ย. 2568 · 09:00 น." />
                </div>
              </label>
              <label className="field">
                <span>
                  วันและเวลาสิ้นสุด <b>*</b>
                </span>
                <div className="input-icon">
                  <Icon name="clock" />
                  <input defaultValue="18 มิ.ย. 2568 · 12:00 น." />
                </div>
              </label>
              <label className="field">
                <span>
                  สถานที่จัดกิจกรรม <b>*</b>
                </span>
                <div className="input-icon">
                  <Icon name="location" />
                  <input defaultValue="ห้องประชุมใหญ่ อาคารเรียนรวม" />
                </div>
              </label>
              <label className="field">
                <span>จำนวนผู้เข้าร่วมเป้าหมาย</span>
                <div className="input-icon">
                  <Icon name="users" />
                  <input defaultValue="60 คน" />
                </div>
              </label>
            </div>
            <div className="switch-row">
              <div>
                <strong>เปิดรับแบบประเมินสำหรับรอบนี้</strong>
                <p>ผู้เข้าร่วมจะตอบแบบประเมินได้ตามช่วงเวลาที่กำหนด</p>
              </div>
              <button className={`switch ${open ? "on" : ""}`} onClick={() => setOpen(!open)}>
                <i />
              </button>
            </div>
          </div>
          <div className="occurrence-card collapsed">
            <div className="occurrence-head">
              <span className="drag">
                <Icon name="grip" />
              </span>
              <div>
                <small>รอบที่ 2</small>
                <strong>รอบบ่าย · วันที่ 19 มิถุนายน 2568</strong>
              </div>
              <Badge status="Draft" />
              <button className="icon-btn">
                <Icon name="chevron" />
              </button>
            </div>
          </div>
        </section>
        <FormFooter back={back} next={next} nextText="ถัดไป: สร้างแบบประเมินด้วย AI" />
      </div>
      <aside className="form-aside">
        <div className="tip-card neutral">
          <Icon name="layers" />
          <h3>2 รอบกิจกรรม</h3>
          <p>ผู้เข้าร่วมและผลแบบประเมินจะถูกแยกตามรอบ เพื่อให้วิเคราะห์เปรียบเทียบได้อย่างถูกต้อง</p>
        </div>
        <div className="mini-timeline">
          <strong>ภาพรวมกำหนดการ</strong>
          <div>
            <i />
            <span>18 มิ.ย. · 09:00–12:00</span>
          </div>
          <div>
            <i />
            <span>19 มิ.ย. · 13:00–16:00</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

function AIAssistant({ next, back }: { next: () => void; back: () => void }) {
  const [generated, setGenerated] = useState(false);
  return (
    <div className="ai-workspace">
      <section className="panel ai-prompt">
        <div className="ai-title">
          <span>
            <Icon name="sparkles" />
          </span>
          <div>
            <h2>AI Survey Assistant</h2>
            <p>ให้ AI ช่วยร่างคำถามจากข้อมูลกิจกรรม โดยคุณเป็นผู้ตรวจสอบและตัดสินใจ</p>
          </div>
          <span className="ai-label">AI ASSISTED</span>
        </div>
        <div className="source-context">
          <div>
            <Icon name="activity" />
            <span>
              <small>ข้อมูลต้นทาง</small>
              <strong>โครงการส่งเสริมสุขภาวะและการเรียนรู้ตลอดชีวิต</strong>
            </span>
          </div>
          <button>
            ดูข้อมูลที่ใช้ <Icon name="chevron" size={14} />
          </button>
        </div>
        <label className="field">
          <span>บอก AI ว่าคุณต้องการวัดผลอะไร</span>
          <textarea
            rows={4}
            defaultValue="สร้างแบบประเมินความพึงพอใจและผลลัพธ์การเรียนรู้ เน้นความรู้ที่นำไปใช้ได้จริง คุณภาพวิทยากร และข้อเสนอแนะเพื่อปรับปรุงกิจกรรมครั้งถัดไป"
          />
        </label>
        <div className="prompt-actions">
          <button className="btn">
            <Icon name="sparkles" />
            วิเคราะห์วัตถุประสงค์
          </button>
          <button className="btn primary ai-generate" onClick={() => setGenerated(true)}>
            <Icon name="sparkles" />
            สร้างคำถามแบบประเมิน
          </button>
        </div>
        <div className="ai-principle">
          <Icon name="info" size={16} />
          <span>
            <strong>AI เป็นผู้ช่วย ไม่ใช่ผู้ตัดสินใจ</strong> คำถามจะอ้างอิงเฉพาะข้อมูลกิจกรรมด้านบน
            คุณสามารถแก้ไขหรือลบได้ทั้งหมด และต้องยืนยันก่อนเผยแพร่
          </span>
        </div>
      </section>
      <section className="panel question-builder">
        <div className="builder-head">
          <div>
            <h2>คำถามแบบประเมิน</h2>
            <p>
              {generated
                ? "AI สร้างร่าง 4 คำถาม · โปรดตรวจสอบก่อนใช้งาน"
                : "เริ่มจากคำถามที่ระบบแนะนำ หรือเพิ่มคำถามด้วยตนเอง"}
            </p>
          </div>
          <button className="btn">
            <Icon name="plus" />
            เพิ่มคำถาม
          </button>
        </div>
        {generated ? (
          <div className="question-list">
            <Question
              n={1}
              type="Rating Scale"
              text="โดยรวม ท่านมีความพึงพอใจต่อกิจกรรมในระดับใด"
              required
            />
            <Question
              n={2}
              type="Rating Scale"
              text="กิจกรรมนี้ช่วยให้ท่านมีความรู้ด้านสุขภาวะเพิ่มขึ้นในระดับใด"
              required
            />
            <Question n={3} type="Multiple Choice" text="เนื้อหาส่วนใดที่ท่านสามารถนำไปประยุกต์ใช้ได้" />
            <Question n={4} type="ข้อความปลายเปิด" text="ข้อเสนอแนะเพื่อปรับปรุงกิจกรรมครั้งถัดไป" />
          </div>
        ) : (
          <div className="empty ai-empty">
            <div>
              <Icon name="sparkles" />
            </div>
            <h3>พร้อมช่วยสร้างคำถาม</h3>
            <p>ระบุความต้องการด้านซ้าย แล้วเลือก “สร้างคำถามแบบประเมิน”</p>
          </div>
        )}
      </section>
      <div className="ai-footer">
        <button className="btn" onClick={back}>
          ย้อนกลับ
        </button>
        <div>
          <button className="btn">
            <Icon name="eye" />
            Preview แบบประเมิน
          </button>
          <button className="btn primary" onClick={next} disabled={!generated}>
            ตรวจสอบและบันทึก <Icon name="arrow" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Question({
  n,
  type,
  text,
  required,
}: {
  n: number;
  type: string;
  text: string;
  required?: boolean;
}) {
  return (
    <div className="question">
      <span className="drag">
        <Icon name="grip" />
      </span>
      <span className="q-number">{n}</span>
      <div className="q-content">
        <div>
          <span>{type}</span>
          {required && <small>จำเป็น</small>}
        </div>
        <input defaultValue={text} />
      </div>
      <button className="icon-btn">
        <Icon name="edit" />
      </button>
      <button className="icon-btn danger">
        <Icon name="close" />
      </button>
    </div>
  );
}

function Review({
  publish,
  preview,
  back,
}: {
  publish: () => void;
  preview: () => void;
  back: () => void;
}) {
  return (
    <div className="review-grid">
      <section className="panel review-main">
        <SectionHeader
          number="D"
          title="ตรวจสอบและเผยแพร่"
          desc="ตรวจสอบข้อมูลสำคัญและคำเตือนก่อนเผยแพร่กิจกรรม"
        />
        <div className="readiness">
          <div className="readiness-score">
            <span>
              <Icon name="check" />
            </span>
            <div>
              <strong>พร้อมเผยแพร่</strong>
              <p>ข้อมูลที่จำเป็นครบถ้วนแล้ว</p>
            </div>
          </div>
          <strong>92%</strong>
        </div>
        <div className="checklist">
          {[
            ["ข้อมูลพื้นฐานกิจกรรม", "ครบถ้วน · 8 รายการ"],
            ["รอบกิจกรรม", "2 รอบ · กำหนดวันเวลาแล้ว"],
            ["แบบประเมิน", "4 คำถาม · ตรวจสอบแล้ว"],
            ["PDPA และความยินยอม", "เปิดใช้งานข้อความมาตรฐาน"],
          ].map(([a, b]) => (
            <div key={a}>
              <span>
                <Icon name="check" size={14} />
              </span>
              <strong>{a}</strong>
              <small>{b}</small>
              <button>
                <Icon name="chevron" />
              </button>
            </div>
          ))}
        </div>
        <div className="warning-box">
          <Icon name="info" />
          <div>
            <strong>โปรดตรวจสอบก่อนเผยแพร่</strong>
            <p>หลังเผยแพร่แล้ว การแก้ไขวันเวลาและคำถามอาจส่งผลต่อผู้ที่ได้รับลิงก์หรือเริ่มตอบแบบประเมินแล้ว</p>
          </div>
        </div>
        <div className="publish-actions">
          <button className="btn" onClick={back}>
            ย้อนกลับ
          </button>
          <div>
            <button className="btn" onClick={preview}>
              <Icon name="eye" />
              Preview
            </button>
            <button className="btn primary gold" onClick={publish}>
              เผยแพร่กิจกรรม <Icon name="arrow" />
            </button>
          </div>
        </div>
      </section>
      <aside className="panel publish-summary">
        <div className="cover-pattern">
          <span>M</span>
        </div>
        <span className="context-label">กิจกรรม</span>
        <h3>โครงการส่งเสริมสุขภาวะและการเรียนรู้ตลอดชีวิต</h3>
        <div>
          <Icon name="calendar" />
          <span>18–19 มิถุนายน 2568</span>
        </div>
        <div>
          <Icon name="location" />
          <span>อาคารเรียนรวม มหาวิทยาลัยมหิดล วิทยาเขตลำปาง</span>
        </div>
        <div>
          <Icon name="users" />
          <span>เป้าหมายรวม 120 คน</span>
        </div>
        <hr />
        <small>สถานะหลังเผยแพร่</small>
        <Badge status="Scheduled" />
      </aside>
    </div>
  );
}

function FormFooter({
  back,
  next,
  nextText,
}: {
  back?: () => void;
  next: () => void;
  nextText: string;
}) {
  return (
    <div className="form-footer">
      {back ? (
        <button className="btn" onClick={back}>
          ย้อนกลับ
        </button>
      ) : (
        <span />
      )}
      <button className="btn primary" onClick={next}>
        {nextText}
        <Icon name="arrow" />
      </button>
    </div>
  );
}

const surveys = [
  {
    name: "แบบประเมินความพึงพอใจและผลลัพธ์การเรียนรู้",
    activity: "โครงการส่งเสริมสุขภาวะและการเรียนรู้ตลอดชีวิต",
    round: "รอบเช้า · 18 มิ.ย. 68",
    questions: 8,
    responses: "—",
    period: "18–22 มิ.ย. 68",
    status: "Draft",
  },
  {
    name: "แบบประเมินการอบรมการใช้ข้อมูลเพื่อชุมชน",
    activity: "อบรมการใช้ข้อมูลเพื่อพัฒนาชุมชนอย่างยั่งยืน",
    round: "รอบที่ 1 · 28 พ.ค. 68",
    questions: 12,
    responses: "กำลังเก็บ",
    period: "28 พ.ค.–2 มิ.ย. 68",
    status: "Published",
  },
  {
    name: "แบบติดตามผลการลดใช้พลังงาน",
    activity: "มหิดลลำปางร่วมใจ ลดใช้พลังงาน",
    round: "รวม 3 รอบ",
    questions: 10,
    responses: "ปิดรับแล้ว",
    period: "5–12 เม.ย. 68",
    status: "Closed",
  },
];

function SurveyManagement({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <Breadcrumb items={["แบบประเมิน", "รายการทั้งหมด"]} />
      <PageTitle
        title="จัดการแบบประเมิน"
        description="สร้าง เชื่อมโยง และติดตามผลแบบประเมินจากทุกกิจกรรม"
        actions={
          <button className="btn primary" onClick={() => navigate("create")}>
            <Icon name="plus" />
            สร้างแบบประเมิน
          </button>
        }
      />
      <section className="panel">
        <div className="panel-toolbar">
          <div className="searchbox">
            <Icon name="search" />
            <input placeholder="ค้นหาชื่อแบบประเมินหรือกิจกรรม" />
          </div>
          <div className="filter-row">
            <Select label="กิจกรรม" value="ทุกกิจกรรม" />
            <Select label="สถานะ" value="ทุกสถานะ" />
            <button className="btn filter-btn">
              <Icon name="filter" />
              ตัวกรอง
            </button>
          </div>
        </div>
        <div className="table-meta">
          <strong>แบบประเมินทั้งหมด</strong>
          <span>8 รายการ</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>แบบประเมิน / กิจกรรม</th>
                <th>รอบกิจกรรม</th>
                <th>คำถาม</th>
                <th>ผู้ตอบ</th>
                <th>ช่วงเวลารับคำตอบ</th>
                <th>สถานะ</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {surveys.map((s) => (
                <tr key={s.name}>
                  <td>
                    <button className="activity-name" onClick={() => navigate("survey-detail")}>
                      {s.name}
                    </button>
                    <div className="cell-sub">{s.activity}</div>
                  </td>
                  <td>{s.round}</td>
                  <td>
                    <strong>{s.questions}</strong> ข้อ
                  </td>
                  <td>{s.responses}</td>
                  <td>{s.period}</td>
                  <td>
                    <Badge status={s.status} />
                  </td>
                  <td className="actions-cell">
                    <button className="icon-btn" onClick={() => navigate("survey-detail")}>
                      <Icon name="chevron" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>
            รายการต่อหน้า{" "}
            <select>
              <option>10</option>
            </select>
          </span>
          <span>1–3 จาก 8</span>
          <div>
            <button disabled>‹</button>
            <button className="current">1</button>
            <button>2</button>
            <button>›</button>
          </div>
        </div>
      </section>
    </>
  );
}

function SurveyDetail({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <>
      <Breadcrumb items={["กิจกรรมโครงการ", "โครงการส่งเสริมสุขภาวะฯ", "แบบประเมิน"]} />
      <div className="context-bar">
        <div>
          <span className="context-label">กิจกรรมที่เชื่อมโยง</span>
          <strong>โครงการส่งเสริมสุขภาวะและการเรียนรู้ตลอดชีวิต</strong>
        </div>
        <button className="btn" onClick={() => navigate("create")}>
          ดูข้อมูลกิจกรรม <Icon name="chevron" />
        </button>
      </div>
      <PageTitle
        title="แบบประเมินความพึงพอใจและผลลัพธ์การเรียนรู้"
        description="รอบเช้า · 18 มิถุนายน 2568 · สร้างเมื่อ 12 พฤษภาคม 2568"
        actions={
          <>
            <button className="btn">
              <Icon name="eye" />
              Preview
            </button>
            <button className="btn primary">
              <Icon name="edit" />
              แก้ไขแบบประเมิน
            </button>
          </>
        }
      />
      <div className="detail-grid">
        <div>
          <section className="panel detail-section">
            <SectionHeader title="คำถามแบบประเมิน" desc="8 คำถาม · ใช้เวลาตอบประมาณ 4 นาที" />
            <div className="survey-questions">
              {[
                "ความพึงพอใจโดยรวมต่อกิจกรรม",
                "ความรู้ที่ได้รับสามารถนำไปประยุกต์ใช้ได้",
                "คุณภาพและความเหมาะสมของวิทยากร",
                "ข้อเสนอแนะเพื่อปรับปรุงกิจกรรมครั้งถัดไป",
              ].map((q, i) => (
                <div key={q}>
                  <span>{i + 1}</span>
                  <div>
                    <strong>{q}</strong>
                    <small>
                      {i === 3 ? "ข้อความปลายเปิด" : "Rating Scale · 5 ระดับ"} {i < 3 && "· จำเป็น"}
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-btn">
              ดูคำถามทั้งหมด <Icon name="arrow" size={15} />
            </button>
          </section>
          <section className="panel detail-section">
            <SectionHeader title="PDPA และความยินยอม" desc="การตั้งค่าการเก็บและใช้ข้อมูลส่วนบุคคล" />
            <div className="consent-box">
              <span>
                <Icon name="check" />
              </span>
              <div>
                <strong>เปิดใช้ข้อความขอความยินยอม</strong>
                <p>แจ้งวัตถุประสงค์การเก็บข้อมูล ระยะเวลาจัดเก็บ และสิทธิ์ของผู้ตอบก่อนเริ่มแบบประเมิน</p>
              </div>
              <button className="text-btn">ดูข้อความ</button>
            </div>
          </section>
        </div>
        <aside>
          <section className="panel side-section">
            <h3>สถานะแบบประเมิน</h3>
            <Badge status="Draft" />
            <div className="schedule-info">
              <span>
                <Icon name="calendar" />
              </span>
              <div>
                <small>เปิดรับคำตอบ</small>
                <strong>18 มิ.ย. 2568 · 12:00 น.</strong>
              </div>
            </div>
            <div className="schedule-info">
              <span>
                <Icon name="clock" />
              </span>
              <div>
                <small>ปิดรับคำตอบ</small>
                <strong>22 มิ.ย. 2568 · 23:59 น.</strong>
              </div>
            </div>
            <button className="btn primary full">เผยแพร่แบบประเมิน</button>
          </section>
          <section className="panel side-section">
            <h3>แชร์แบบประเมิน</h3>
            <p>ลิงก์และ QR Code จะพร้อมใช้งานหลังเผยแพร่</p>
            <div className="share-actions">
              <button disabled>
                <Icon name="link" />
                คัดลอกลิงก์
              </button>
              <button disabled>
                <Icon name="qr" />
                QR Code
              </button>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

function Modal({
  type,
  close,
  confirm,
}: {
  type: "publish" | "preview";
  close: () => void;
  confirm: () => void;
}) {
  if (type === "preview")
    return (
      <div className="modal-backdrop">
        <div className="modal preview-modal">
          <div className="modal-head">
            <div>
              <small>PREVIEW</small>
              <h2>ตัวอย่างหน้ากิจกรรม</h2>
            </div>
            <button className="icon-btn" onClick={close}>
              <Icon name="close" />
            </button>
          </div>
          <div className="preview-body">
            <div className="preview-cover">
              <span>M</span>
            </div>
            <Badge status="Scheduled" />
            <h2>โครงการส่งเสริมสุขภาวะและการเรียนรู้ตลอดชีวิต</h2>
            <p>ส่งเสริมให้นักศึกษาและบุคลากรมีความรู้ความเข้าใจด้านสุขภาวะ และนำไปใช้ในชีวิตประจำวัน</p>
            <div className="preview-info">
              <span>
                <Icon name="calendar" />
                18–19 มิถุนายน 2568
              </span>
              <span>
                <Icon name="location" />
                อาคารเรียนรวม วิทยาเขตลำปาง
              </span>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn primary" onClick={close}>
              ปิด Preview
            </button>
          </div>
        </div>
      </div>
    );
  return (
    <div className="modal-backdrop">
      <div className="modal confirm-modal">
        <span className="modal-symbol">
          <Icon name="upload" />
        </span>
        <h2>ยืนยันการเผยแพร่กิจกรรม?</h2>
        <p>ระบบจะแสดงกิจกรรมตามกำหนดการ และเตรียมลิงก์แบบประเมินสำหรับแต่ละรอบ โปรดตรวจสอบข้อมูลให้ถูกต้อง</p>
        <div className="confirm-list">
          <span>
            <Icon name="check" />
            ข้อมูลพื้นฐานครบถ้วน
          </span>
          <span>
            <Icon name="check" />2 รอบกิจกรรม
          </span>
          <span>
            <Icon name="check" />4 คำถามผ่านการตรวจสอบ
          </span>
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={close}>
            ยกเลิก
          </button>
          <button className="btn primary gold" onClick={confirm}>
            ยืนยันและเผยแพร่
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
