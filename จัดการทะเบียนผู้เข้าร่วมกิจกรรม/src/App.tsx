import { useMemo, useState } from "react";

type IconName =
  | "activity"
  | "bell"
  | "calendar"
  | "check"
  | "chevronDown"
  | "chevronLeft"
  | "chevronRight"
  | "clipboard"
  | "close"
  | "download"
  | "eye"
  | "grid"
  | "menu"
  | "people"
  | "refresh"
  | "search"
  | "settings"
  | "sliders"
  | "survey"
  | "user"
  | "userCheck";

function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const paths: Record<IconName, React.ReactNode> = {
    activity: (
      <>
        <path d="M4 13h4l2-7 4 12 2-5h4" />
        <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V2h6v2M9 10h6M9 14h6" />
      </>
    ),
    close: <path d="M18 6 6 18M6 6l12 12" />,
    download: (
      <>
        <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
        <path d="M5 19h14" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    people: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 7v5h-5" />
        <path d="M4 17v-5h5" />
        <path d="M6.1 8A7 7 0 0 1 18.3 6L20 8M4 16l1.7 2A7 7 0 0 0 18 16" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.82 2.82-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.56V21h-4v-.08a1.7 1.7 0 0 0-1-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.82-2.82.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.52-1H3v-4h.08A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06L7.02 4.2l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.52V3h4v.08A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.82 2.82-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.52 1H21v4h-.08a1.7 1.7 0 0 0-1.52 1Z" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h7M15 18h5" />
        <circle cx="16" cy="6" r="2" />
        <circle cx="8" cy="12" r="2" />
        <circle cx="13" cy="18" r="2" />
      </>
    ),
    survey: (
      <>
        <path d="M9 5h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9" />
        <path d="M3 4h8v5H3zM9 14h8M9 17h6" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    userCheck: (
      <>
        <path d="M15 20v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8" cy="6" r="4" />
        <path d="m17 11 2 2 4-5" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

type Participant = {
  id: number;
  code: string;
  name: string;
  initials: string;
  organization: string;
  role: string;
  type: "บุคลากร" | "นักศึกษา" | "บุคคลทั่วไป";
  phone: string;
  email: string;
  registeredAt: string;
  status: "ลงทะเบียนสำเร็จ" | "รอตรวจสอบ";
  checkedIn: boolean;
  checkedInAt?: string;
  pdpa: boolean;
  avatarTone: string;
};

const seedParticipants: Participant[] = [
  {
    id: 1,
    code: "MA-670128",
    name: "ดร. พิมพ์ชนก วัฒนกุล",
    initials: "พว",
    organization: "มหาวิทยาลัยมหิดล วิทยาเขตลำปาง",
    role: "อาจารย์",
    type: "บุคลากร",
    phone: "081-234-5678",
    email: "pimchanok.w@mahidol.ac.th",
    registeredAt: "18 มิ.ย. 2567, 09:42",
    status: "ลงทะเบียนสำเร็จ",
    checkedIn: true,
    checkedInAt: "22 มิ.ย. 2567, 08:41 น.",
    pdpa: true,
    avatarTone: "blue",
  },
  {
    id: 2,
    code: "MA-670127",
    name: "นายธนวัฒน์ ใจดี",
    initials: "ธจ",
    organization: "คณะเทคโนโลยีสารสนเทศฯ",
    role: "นักศึกษาชั้นปีที่ 3",
    type: "นักศึกษา",
    phone: "092-365-8821",
    email: "thanawat.j@student.mahidol.ac.th",
    registeredAt: "18 มิ.ย. 2567, 09:18",
    status: "ลงทะเบียนสำเร็จ",
    checkedIn: false,
    pdpa: true,
    avatarTone: "violet",
  },
  {
    id: 3,
    code: "MA-670126",
    name: "นางสาวกัญญารัตน์ ศรีคำ",
    initials: "กศ",
    organization: "โรงพยาบาลลำปาง",
    role: "นักวิชาการสาธารณสุข",
    type: "บุคคลทั่วไป",
    phone: "089-567-1240",
    email: "kanyarat.s@email.com",
    registeredAt: "17 มิ.ย. 2567, 16:05",
    status: "ลงทะเบียนสำเร็จ",
    checkedIn: true,
    checkedInAt: "22 มิ.ย. 2567, 08:53 น.",
    pdpa: true,
    avatarTone: "green",
  },
  {
    id: 4,
    code: "MA-670125",
    name: "นายณัฐพงษ์ มั่นคง",
    initials: "ณม",
    organization: "มหาวิทยาลัยเชียงใหม่",
    role: "เจ้าหน้าที่บริหารงานทั่วไป",
    type: "บุคคลทั่วไป",
    phone: "086-903-4427",
    email: "nattapong.m@email.com",
    registeredAt: "17 มิ.ย. 2567, 14:30",
    status: "รอตรวจสอบ",
    checkedIn: false,
    pdpa: true,
    avatarTone: "amber",
  },
  {
    id: 5,
    code: "MA-670124",
    name: "รศ. ดร. ชลธิชา พูนผล",
    initials: "ชพ",
    organization: "คณะสาธารณสุขศาสตร์",
    role: "รองศาสตราจารย์",
    type: "บุคลากร",
    phone: "095-442-7810",
    email: "chonticha.p@mahidol.ac.th",
    registeredAt: "17 มิ.ย. 2567, 11:12",
    status: "ลงทะเบียนสำเร็จ",
    checkedIn: false,
    pdpa: true,
    avatarTone: "rose",
  },
  {
    id: 6,
    code: "MA-670123",
    name: "นางสาวอารยา ชัยมงคล",
    initials: "อช",
    organization: "วิทยาลัยนานาชาติ",
    role: "นักศึกษาชั้นปีที่ 4",
    type: "นักศึกษา",
    phone: "064-724-9915",
    email: "araya.c@student.mahidol.ac.th",
    registeredAt: "16 มิ.ย. 2567, 17:48",
    status: "ลงทะเบียนสำเร็จ",
    checkedIn: true,
    checkedInAt: "22 มิ.ย. 2567, 09:02 น.",
    pdpa: true,
    avatarTone: "cyan",
  },
];

const navItems: { label: string; icon: IconName; active?: boolean; child?: boolean }[] = [
  { label: "ภาพรวม", icon: "grid" },
  { label: "จัดการกิจกรรม", icon: "calendar" },
  { label: "กิจกรรมทั้งหมด", icon: "activity", child: true },
  { label: "ลงทะเบียนผู้เข้าร่วม", icon: "people", active: true, child: true },
  { label: "แบบสำรวจ", icon: "survey" },
  { label: "รายงานและสถิติ", icon: "clipboard" },
  { label: "ตั้งค่าระบบ", icon: "settings" },
];

function MahidolMark() {
  return (
    <div className="brand-mark" aria-label="Mahidol University">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M24 3 37 8v12c0 11-5 19-13 24C16 39 11 31 11 20V8l13-5Z"
          fill="currentColor"
          opacity=".16"
        />
        <path
          d="M24 8v29M16.5 14h15M17 19l3 4 4-4 4 4 3-4M18 28h12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
      </svg>
    </div>
  );
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <button
        className={`sidebar-scrim ${open ? "show" : ""}`}
        onClick={onClose}
        aria-label="ปิดเมนู"
      />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <MahidolMark />
          <div>
            <strong>MAHIDOL</strong>
            <span>ACTIVITY &amp; SURVEY</span>
          </div>
        </div>
        <nav className="side-nav" aria-label="เมนูหลัก">
          <p className="nav-section">เมนูหลัก</p>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${item.active ? "active" : ""} ${item.child ? "child" : ""}`}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.label === "จัดการกิจกรรม" && <Icon name="chevronDown" size={15} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="mini-avatar">สอ</div>
          <div>
            <strong>สมชาย อนันต์</strong>
            <span>ผู้ดูแลระบบ</span>
          </div>
          <Icon name="chevronRight" size={16} />
        </div>
      </aside>
    </>
  );
}

function SummaryCard({
  label,
  value,
  note,
  icon,
  tone,
}: {
  label: string;
  value: number;
  note: string;
  icon: IconName;
  tone: string;
}) {
  return (
    <article className="summary-card">
      <div className={`summary-icon ${tone}`}>
        <Icon name={icon} size={22} />
      </div>
      <div className="summary-copy">
        <span>{label}</span>
        <strong>{value.toLocaleString("th-TH")}</strong>
        <small>{note}</small>
      </div>
    </article>
  );
}

function StatusBadge({
  kind,
  children,
}: {
  kind: "success" | "warning" | "neutral" | "checked";
  children: React.ReactNode;
}) {
  return (
    <span className={`status-badge ${kind}`}>
      <i />
      {children}
    </span>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <div className="select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <Icon name="chevronDown" size={16} />
      </div>
    </label>
  );
}

function RegistrationTable({
  participants,
  onSelect,
  onCheckIn,
}: {
  participants: Participant[];
  onSelect: (participant: Participant) => void;
  onCheckIn: (id: number) => void;
}) {
  return (
    <div className="desktop-table-wrap">
      <table className="registration-table">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>รหัสลงทะเบียน</th>
            <th>ชื่อ-นามสกุล</th>
            <th>หน่วยงาน</th>
            <th>ประเภท</th>
            <th>เบอร์โทรศัพท์</th>
            <th>วันที่ลงทะเบียน</th>
            <th>สถานะ</th>
            <th>Check-in</th>
            <th>
              <span className="sr-only">จัดการ</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant, index) => (
            <tr key={participant.id}>
              <td className="row-num">{index + 1}</td>
              <td>
                <span className="code">{participant.code}</span>
              </td>
              <td>
                <button className="person-cell" onClick={() => onSelect(participant)}>
                  <span className={`person-avatar ${participant.avatarTone}`}>
                    {participant.initials}
                  </span>
                  <span>
                    <strong>{participant.name}</strong>
                    <small>{participant.email}</small>
                  </span>
                </button>
              </td>
              <td className="org-cell">{participant.organization}</td>
              <td>
                <span
                  className={`type-chip ${participant.type === "นักศึกษา" ? "student" : participant.type === "บุคลากร" ? "staff" : ""}`}
                >
                  {participant.type}
                </span>
              </td>
              <td className="nowrap">{participant.phone}</td>
              <td className="date-cell">{participant.registeredAt}</td>
              <td>
                <StatusBadge kind={participant.status === "ลงทะเบียนสำเร็จ" ? "success" : "warning"}>
                  {participant.status}
                </StatusBadge>
              </td>
              <td>
                {participant.checkedIn ? (
                  <StatusBadge kind="checked">เช็กอินแล้ว</StatusBadge>
                ) : (
                  <button className="checkin-inline" onClick={() => onCheckIn(participant.id)}>
                    <Icon name="userCheck" size={16} /> เช็กอิน
                  </button>
                )}
              </td>
              <td>
                <button
                  className="icon-button subtle"
                  aria-label={`ดูรายละเอียด ${participant.name}`}
                  onClick={() => onSelect(participant)}
                >
                  <Icon name="eye" size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards({
  participants,
  onSelect,
  onCheckIn,
}: {
  participants: Participant[];
  onSelect: (participant: Participant) => void;
  onCheckIn: (id: number) => void;
}) {
  return (
    <div className="mobile-cards">
      {participants.map((participant) => (
        <article className="participant-card" key={participant.id}>
          <button className="mobile-person" onClick={() => onSelect(participant)}>
            <span className={`person-avatar ${participant.avatarTone}`}>
              {participant.initials}
            </span>
            <span>
              <strong>{participant.name}</strong>
              <small>{participant.code}</small>
            </span>
            <Icon name="chevronRight" size={19} />
          </button>
          <dl>
            <div>
              <dt>ประเภท</dt>
              <dd>{participant.type}</dd>
            </div>
            <div>
              <dt>หน่วยงาน</dt>
              <dd>{participant.organization}</dd>
            </div>
            <div>
              <dt>เบอร์โทรศัพท์</dt>
              <dd>{participant.phone}</dd>
            </div>
            <div>
              <dt>สถานะ</dt>
              <dd>
                <StatusBadge kind={participant.status === "ลงทะเบียนสำเร็จ" ? "success" : "warning"}>
                  {participant.status}
                </StatusBadge>
              </dd>
            </div>
          </dl>
          {participant.checkedIn ? (
            <button className="mobile-checked" onClick={() => onSelect(participant)}>
              <span>
                <Icon name="check" size={17} />
              </span>{" "}
              เช็กอินแล้ว <small>{participant.checkedInAt?.split(", ")[1]}</small>
            </button>
          ) : (
            <button className="primary-button full" onClick={() => onCheckIn(participant.id)}>
              <Icon name="userCheck" size={18} /> เช็กอินผู้เข้าร่วม
            </button>
          )}
        </article>
      ))}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="empty-state">
      <div>
        <Icon name="search" size={30} />
      </div>
      <h3>ไม่พบรายชื่อผู้ลงทะเบียน</h3>
      <p>ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูผลลัพธ์อื่น</p>
      <button className="secondary-button" onClick={onReset}>
        ล้างตัวกรองทั้งหมด
      </button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="loading-state" aria-label="กำลังโหลดข้อมูล">
      {[1, 2, 3, 4, 5].map((row) => (
        <div className="skeleton-row" key={row}>
          <i />
          <i />
          <i />
          <i />
        </div>
      ))}
    </div>
  );
}

function ParticipantDetail({
  participant,
  onClose,
  onCheckIn,
  onUndo,
}: {
  participant: Participant;
  onClose: () => void;
  onCheckIn: () => void;
  onUndo: () => void;
}) {
  const details = [
    ["เบอร์โทรศัพท์", participant.phone],
    ["อีเมล", participant.email],
    ["หน่วยงาน", participant.organization],
    ["ตำแหน่ง", participant.role],
    ["ประเภทผู้เข้าร่วม", participant.type],
    ["วันที่ลงทะเบียน", participant.registeredAt],
  ];
  return (
    <div className="panel-layer" role="dialog" aria-modal="true" aria-label="รายละเอียดผู้ลงทะเบียน">
      <button className="panel-scrim" onClick={onClose} aria-label="ปิดรายละเอียด" />
      <aside className="detail-panel">
        <header>
          <div>
            <span>ข้อมูลผู้ลงทะเบียน</span>
            <h2>รายละเอียดผู้เข้าร่วม</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="ปิด">
            <Icon name="close" />
          </button>
        </header>
        <div className="detail-scroll">
          <section className="profile-block">
            <span className={`large-avatar ${participant.avatarTone}`}>{participant.initials}</span>
            <h3>{participant.name}</h3>
            <span className="detail-code">{participant.code}</span>
          </section>
          <section className={`attendance-card ${participant.checkedIn ? "is-checked" : ""}`}>
            <div className="attendance-icon">
              <Icon name={participant.checkedIn ? "check" : "userCheck"} size={22} />
            </div>
            <div>
              <small>สถานะการเข้าร่วม</small>
              <strong>{participant.checkedIn ? "เช็กอินเรียบร้อยแล้ว" : "ยังไม่ได้เช็กอิน"}</strong>
              <span>{participant.checkedIn ? participant.checkedInAt : "รอการยืนยันจากเจ้าหน้าที่"}</span>
            </div>
          </section>
          <section className="detail-section">
            <h4>ข้อมูลส่วนตัว</h4>
            <dl className="detail-list">
              {details.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="detail-section">
            <h4>สถานะการลงทะเบียน</h4>
            <div className="status-line">
              <span>การลงทะเบียน</span>
              <StatusBadge kind={participant.status === "ลงทะเบียนสำเร็จ" ? "success" : "warning"}>
                {participant.status}
              </StatusBadge>
            </div>
            <div className="status-line">
              <span>การยินยอม PDPA</span>
              <StatusBadge kind={participant.pdpa ? "success" : "neutral"}>
                {participant.pdpa ? "ยินยอมแล้ว" : "ยังไม่ยินยอม"}
              </StatusBadge>
            </div>
          </section>
        </div>
        <footer>
          <button className="secondary-button" onClick={onClose}>
            ปิด
          </button>
          {participant.checkedIn ? (
            <button className="danger-button" onClick={onUndo}>
              ยกเลิก Check-in
            </button>
          ) : (
            <button className="primary-button" onClick={onCheckIn}>
              <Icon name="userCheck" size={18} /> เช็กอินผู้เข้าร่วม
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}

export default function App() {
  const [participants, setParticipants] = useState(seedParticipants);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ทุกประเภท");
  const [statusFilter, setStatusFilter] = useState("ทุกสถานะ");
  const [checkinFilter, setCheckinFilter] = useState("ทั้งหมด");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [confirmUndo, setConfirmUndo] = useState(false);

  const selected = participants.find((item) => item.id === selectedId) ?? null;
  const filtered = useMemo(
    () =>
      participants.filter((participant) => {
        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          [participant.name, participant.phone, participant.code, participant.organization].some(
            (value) => value.toLowerCase().includes(term),
          );
        const matchesType = typeFilter === "ทุกประเภท" || participant.type === typeFilter;
        const matchesStatus = statusFilter === "ทุกสถานะ" || participant.status === statusFilter;
        const matchesCheckin =
          checkinFilter === "ทั้งหมด" ||
          (checkinFilter === "เช็กอินแล้ว" ? participant.checkedIn : !participant.checkedIn);
        return matchesSearch && matchesType && matchesStatus && matchesCheckin;
      }),
    [participants, search, typeFilter, statusFilter, checkinFilter],
  );

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("ทุกประเภท");
    setStatusFilter("ทุกสถานะ");
    setCheckinFilter("ทั้งหมด");
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const checkIn = (id: number) => {
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === id
          ? { ...participant, checkedIn: true, checkedInAt: "22 มิ.ย. 2567, 09:18 น." }
          : participant,
      ),
    );
    showToast("เช็กอินผู้เข้าร่วมเรียบร้อยแล้ว");
  };

  const undoCheckIn = () => {
    if (!selectedId) return;
    setParticipants((current) =>
      current.map((participant) =>
        participant.id === selectedId
          ? { ...participant, checkedIn: false, checkedInAt: undefined }
          : participant,
      ),
    );
    setConfirmUndo(false);
    showToast("ยกเลิกการเช็กอินเรียบร้อยแล้ว");
  };

  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      showToast("อัปเดตข้อมูลล่าสุดแล้ว");
    }, 800);
  };

  const exportCsv = () => {
    const rows = [
      ["รหัสลงทะเบียน", "ชื่อ-นามสกุล", "หน่วยงาน", "ประเภท", "เบอร์โทรศัพท์", "สถานะ", "Check-in"],
      ...filtered.map((p) => [
        p.code,
        p.name,
        p.organization,
        p.type,
        p.phone,
        p.status,
        p.checkedIn ? "เช็กอินแล้ว" : "ยังไม่เช็กอิน",
      ]),
    ];
    const csv =
      "\uFEFF" +
      rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "activity-registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
    showToast("ส่งออกไฟล์ CSV แล้ว");
  };

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="เปิดเมนู">
            <Icon name="menu" />
          </button>
          <div className="mobile-brand">
            <MahidolMark />
            <strong>MAHIDOL</strong>
          </div>
          <div className="topbar-actions">
            <button className="icon-button notification" aria-label="การแจ้งเตือน">
              <Icon name="bell" size={20} />
              <i />
            </button>
            <span className="topbar-divider" />
            <div className="topbar-profile">
              <span className="mini-avatar">สอ</span>
              <div>
                <strong>สมชาย อนันต์</strong>
                <small>ผู้ดูแลระบบ</small>
              </div>
              <Icon name="chevronDown" size={15} />
            </div>
          </div>
        </header>

        <div className="page">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <span>หน้าหลัก</span>
            <Icon name="chevronRight" size={14} />
            <span>จัดการกิจกรรม</span>
            <Icon name="chevronRight" size={14} />
            <strong>ลงทะเบียนผู้เข้าร่วม</strong>
          </nav>
          <section className="page-heading">
            <div>
              <p className="eyebrow">REGISTRATION MANAGEMENT</p>
              <h1>ลงทะเบียนผู้เข้าร่วม</h1>
              <p>จัดการรายชื่อ ตรวจสอบข้อมูล และติดตามสถานะผู้ลงทะเบียนเข้าร่วมกิจกรรม</p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button" onClick={refresh}>
                <Icon name="refresh" size={17} /> <span>รีเฟรช</span>
              </button>
              <button className="primary-button" onClick={exportCsv}>
                <Icon name="download" size={17} /> Export CSV
              </button>
            </div>
          </section>

          <section className="summary-grid" aria-label="ภาพรวมการลงทะเบียน">
            <SummaryCard
              label="ผู้ลงทะเบียนทั้งหมด"
              value={248}
              note="ผู้เข้าร่วมทุกประเภท"
              icon="people"
              tone="blue-tone"
            />
            <SummaryCard
              label="ลงทะเบียนสำเร็จ"
              value={236}
              note="คิดเป็น 95.2% ของทั้งหมด"
              icon="clipboard"
              tone="green-tone"
            />
            <SummaryCard
              label="เช็กอินแล้ว"
              value={184}
              note="78% ของผู้ลงทะเบียนสำเร็จ"
              icon="userCheck"
              tone="violet-tone"
            />
            <SummaryCard
              label="ยังไม่เช็กอิน"
              value={52}
              note="รอเข้าร่วมกิจกรรม"
              icon="calendar"
              tone="amber-tone"
            />
          </section>

          <section className="activity-card">
            <div className="activity-selector">
              <div className="activity-icon">
                <Icon name="calendar" size={22} />
              </div>
              <div>
                <span>กิจกรรมที่กำลังจัดการ</span>
                <strong>โครงการอบรมทักษะดิจิทัลเพื่อการทำงานยุคใหม่</strong>
                <small>22 มิถุนายน 2567 · ห้องประชุมอาคารเรียนรวม มหาวิทยาลัยมหิดล วิทยาเขตลำปาง</small>
              </div>
              <button>
                เปลี่ยนกิจกรรม <Icon name="chevronDown" size={16} />
              </button>
            </div>
          </section>

          <section className="data-card">
            <div className="data-card-header">
              <div>
                <h2>รายชื่อผู้ลงทะเบียน</h2>
                <p>ข้อมูลล่าสุด 22 มิ.ย. 2567 เวลา 09:15 น.</p>
              </div>
              <span className="result-count">{filtered.length} รายการ</span>
            </div>
            <div className="search-filter-row">
              <label className="search-box">
                <Icon name="search" size={19} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="ค้นหาชื่อ เบอร์โทรศัพท์ หรือรหัสลงทะเบียน"
                />
                <span className="search-shortcut">⌘ K</span>
              </label>
              <button
                className={`mobile-filter-button ${filtersOpen ? "active" : ""}`}
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Icon name="sliders" size={18} /> ตัวกรอง{" "}
                {(typeFilter !== "ทุกประเภท" ||
                  statusFilter !== "ทุกสถานะ" ||
                  checkinFilter !== "ทั้งหมด") && <i />}
              </button>
              <div className={`filters ${filtersOpen ? "open" : ""}`}>
                <FilterSelect
                  label="ประเภทผู้เข้าร่วม"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  options={["ทุกประเภท", "บุคลากร", "นักศึกษา", "บุคคลทั่วไป"]}
                />
                <FilterSelect
                  label="สถานะลงทะเบียน"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={["ทุกสถานะ", "ลงทะเบียนสำเร็จ", "รอตรวจสอบ"]}
                />
                <FilterSelect
                  label="สถานะ Check-in"
                  value={checkinFilter}
                  onChange={setCheckinFilter}
                  options={["ทั้งหมด", "เช็กอินแล้ว", "ยังไม่เช็กอิน"]}
                />
                <button className="reset-button" onClick={resetFilters}>
                  ล้างตัวกรอง
                </button>
              </div>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : filtered.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <>
                <RegistrationTable
                  participants={filtered}
                  onSelect={(p) => setSelectedId(p.id)}
                  onCheckIn={checkIn}
                />
                <MobileCards
                  participants={filtered}
                  onSelect={(p) => setSelectedId(p.id)}
                  onCheckIn={checkIn}
                />
                <footer className="pagination-bar">
                  <span>แสดง 1–{filtered.length} จาก 248 รายการ</span>
                  <div>
                    <button className="page-button" disabled>
                      <Icon name="chevronLeft" size={16} />
                    </button>
                    <button className="page-button current">1</button>
                    <button className="page-button">2</button>
                    <button className="page-button">3</button>
                    <span>…</span>
                    <button className="page-button">25</button>
                    <button className="page-button">
                      <Icon name="chevronRight" size={16} />
                    </button>
                  </div>
                </footer>
              </>
            )}
          </section>
          <p className="page-footnote">Mahidol Activity &amp; Survey Portal · วิทยาเขตลำปาง</p>
        </div>
      </main>

      {selected && (
        <ParticipantDetail
          participant={selected}
          onClose={() => setSelectedId(null)}
          onCheckIn={() => checkIn(selected.id)}
          onUndo={() => setConfirmUndo(true)}
        />
      )}
      {confirmUndo && selected && (
        <div className="confirm-layer" role="alertdialog" aria-modal="true">
          <button className="panel-scrim" onClick={() => setConfirmUndo(false)} aria-label="ปิด" />
          <div className="confirm-dialog">
            <div className="confirm-icon">
              <Icon name="refresh" size={23} />
            </div>
            <h3>ยกเลิกการเช็กอิน?</h3>
            <p>
              คุณกำลังจะยกเลิกการเช็กอินของ <strong>{selected.name}</strong> โปรดยืนยันเพื่อดำเนินการต่อ
            </p>
            <div>
              <button className="secondary-button" onClick={() => setConfirmUndo(false)}>
                ไม่ยกเลิก
              </button>
              <button className="danger-button filled" onClick={undoCheckIn}>
                ยืนยันการยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={`toast ${toast ? "show" : ""}`} role="status">
        <span>
          <Icon name="check" size={16} />
        </span>
        {toast}
      </div>
    </div>
  );
}
