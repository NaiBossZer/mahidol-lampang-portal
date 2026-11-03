import { useMemo, useState } from 'react'

type IconName =
  | 'home'
  | 'calendar'
  | 'users'
  | 'survey'
  | 'chart'
  | 'settings'
  | 'search'
  | 'plus'
  | 'eye'
  | 'edit'
  | 'trash'
  | 'grip'
  | 'check'
  | 'chevron'
  | 'bell'
  | 'menu'
  | 'close'
  | 'save'
  | 'send'
  | 'refresh'
  | 'file'
  | 'alert'
  | 'logout'

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    survey: <><path d="M9 4h6l1 2h3v15H5V6h3l1-2Z" /><path d="M9 12h6M9 16h6M9 8h6" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.09A1.7 1.7 0 0 0 8.54 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.17 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.4V9.6h.09A1.7 1.7 0 0 0 4 8.54a1.7 1.7 0 0 0-.34-1.88L3.6 6.6l2.83-2.83.06.06A1.7 1.7 0 0 0 8.4 4.17a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2.4h4v.09A1.7 1.7 0 0 0 15 4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8.4a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.1v4h-.09A1.7 1.7 0 0 0 19.4 15Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    edit: <><path d="m14 5 5 5M4 20l3.5-.7L20 6.8 16.2 3 3.7 15.5 3 20h1Z" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
    grip: <><circle cx="9" cy="6" r=".8" fill="currentColor" /><circle cx="15" cy="6" r=".8" fill="currentColor" /><circle cx="9" cy="12" r=".8" fill="currentColor" /><circle cx="15" cy="12" r=".8" fill="currentColor" /><circle cx="9" cy="18" r=".8" fill="currentColor" /><circle cx="15" cy="18" r=".8" fill="currentColor" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    save: <><path d="M5 3h12l3 3v15H4V3h1Z" /><path d="M8 3v6h8V3M8 21v-7h8v7" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></>,
    refresh: <><path d="M20 7h-5V2" /><path d="M20 7a9 9 0 1 0 1 8" /></>,
    file: <><path d="M6 2h8l4 4v16H6V2Z" /><path d="M14 2v5h5M9 13h6M9 17h6" /></>,
    alert: <><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 9v5M12 17.5v.1" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3M15 4h5v16h-5" /></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Button({ children, variant = 'primary', icon, onClick, disabled, type = 'button', className = '' }: {
  children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: IconName; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit'; className?: string
}) {
  return <button type={type} className={`button button--${variant} ${className}`} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} size={18} />}<span>{children}</span></button>
}

function Field({ label, children, hint, error }: { label: string; children: React.ReactNode; hint?: string; error?: string }) {
  return <label className="field"><span className="field__label">{label}</span>{children}{error && <span className="field__error"><Icon name="alert" size={14} />{error}</span>}{hint && !error && <span className="field__hint">{hint}</span>}</label>
}

type Question = { id: number; text: string; type: string; required: boolean; category: string; options?: string[] }
type Survey = { id: number; title: string; activity: string; created: string; status: 'เผยแพร่' | 'ฉบับร่าง'; questions: number; questionsData?: Question[] }

const initialSurveys: Survey[] = [
  { id: 1, title: 'แบบประเมินความพึงพอใจโครงการปฐมนิเทศ', activity: 'ปฐมนิเทศนักศึกษาใหม่ ปี 2568', created: '12 มิ.ย. 2568', status: 'เผยแพร่', questions: 12 },
  { id: 2, title: 'แบบประเมินกิจกรรมจิตอาสาพัฒนาชุมชน', activity: 'จิตอาสาเพื่อชุมชน', created: '8 มิ.ย. 2568', status: 'ฉบับร่าง', questions: 8 },
  { id: 3, title: 'แบบประเมินการอบรมทักษะดิจิทัล', activity: 'อบรมทักษะดิจิทัลสำหรับนักศึกษา', created: '3 มิ.ย. 2568', status: 'เผยแพร่', questions: 15 },
  { id: 4, title: 'แบบประเมินความพร้อมก่อนฝึกงาน', activity: 'เตรียมความพร้อมสู่สถานประกอบการ', created: '28 พ.ค. 2568', status: 'ฉบับร่าง', questions: 6 },
]

const initialQuestions: Question[] = [
  { id: 1, text: 'ท่านมีความพึงพอใจต่อภาพรวมของกิจกรรมในระดับใด', type: 'ระดับคะแนน', required: true, category: 'ความพึงพอใจโดยรวม' },
  { id: 2, text: 'เนื้อหาของกิจกรรมมีความเหมาะสมและเป็นประโยชน์เพียงใด', type: 'คะแนนแบบ Rating', required: true, category: 'เนื้อหาและรูปแบบกิจกรรม' },
  { id: 3, text: 'ส่วนใดของกิจกรรมที่ท่านประทับใจมากที่สุด', type: 'ข้อความยาว', required: false, category: 'ความคิดเห็นเพิ่มเติม' },
]

const typeOptions = ['ข้อความสั้น', 'ข้อความยาว', 'ตัวเลือกเดียว', 'หลายตัวเลือก', 'ระดับคะแนน', 'คะแนนแบบ Rating', 'วันที่']

function App() {
  const [tab, setTab] = useState<'list' | 'builder'>('list')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ทั้งหมด')
  const [activity, setActivity] = useState('ทุกกิจกรรม')
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys)
  const [loadState, setLoadState] = useState<'ready' | 'loading' | 'error'>('ready')
  const [selected, setSelected] = useState<Survey>(initialSurveys[1])
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [questionModal, setQuestionModal] = useState<{ open: boolean; item?: Question }>({ open: false })
  const [deleteItem, setDeleteItem] = useState<Question | null>(null)
  const [preview, setPreview] = useState(false)
  const [toast, setToast] = useState<{ text: string; kind: 'success' | 'error' } | null>(null)
  const [dirty, setDirty] = useState(false)
  const [form, setForm] = useState({ title: selected.title, description: 'แบบประเมินเพื่อรับฟังความคิดเห็นและนำไปพัฒนาการจัดกิจกรรมให้มีประสิทธิภาพยิ่งขึ้น', activity: selected.activity, status: selected.status })
  const [questionForm, setQuestionForm] = useState({ text: '', type: 'ตัวเลือกเดียว', category: 'ความพึงพอใจโดยรวม', required: true, options: 'ดีมาก\nดี\nปานกลาง\nควรปรับปรุง' })
  const [questionError, setQuestionError] = useState('')

  const filtered = useMemo(() => surveys.filter((item) => {
    const matchedSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchedStatus = status === 'ทั้งหมด' || item.status === status
    const matchedActivity = activity === 'ทุกกิจกรรม' || item.activity.includes(activity)
    return matchedSearch && matchedStatus && matchedActivity
  }), [surveys, search, status, activity])

  const publishedCount = surveys.filter((item) => item.status === 'เผยแพร่').length
  const draftCount = surveys.filter((item) => item.status === 'ฉบับร่าง').length

  const notify = (text: string, kind: 'success' | 'error' = 'success') => {
    setToast({ text, kind })
    window.setTimeout(() => setToast(null), 3000)
  }

  const openBuilder = (survey?: Survey) => {
    const target = survey ?? { id: Date.now(), title: '', activity: '', created: 'วันนี้', status: 'ฉบับร่าง' as const, questions: 0, questionsData: [] }
    setSelected(target)
    setForm({ title: target.title, description: survey ? 'แบบประเมินเพื่อรับฟังความคิดเห็นและนำไปพัฒนาการจัดกิจกรรมให้มีประสิทธิภาพยิ่งขึ้น' : '', activity: target.activity, status: target.status })
    setQuestions(survey?.questionsData ?? (survey ? initialQuestions : []))
    setDirty(false)
    setTab('builder')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const changeForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const openQuestion = (item?: Question) => {
    setQuestionModal({ open: true, item })
    setQuestionError('')
    setQuestionForm(item ? {
      text: item.text, type: item.type, category: item.category, required: item.required, options: item.options?.join('\n') ?? 'ดีมาก\nดี\nปานกลาง\nควรปรับปรุง',
    } : { text: '', type: 'ตัวเลือกเดียว', category: 'ความพึงพอใจโดยรวม', required: true, options: 'ดีมาก\nดี\nปานกลาง\nควรปรับปรุง' })
  }

  const saveQuestion = () => {
    if (!questionForm.text.trim()) {
      setQuestionError('กรุณาระบุคำถามก่อนบันทึก')
      return
    }
    const item: Question = {
      id: questionModal.item?.id ?? Date.now(),
      text: questionForm.text.trim(),
      type: questionForm.type,
      category: questionForm.category,
      required: questionForm.required,
      options: ['ตัวเลือกเดียว', 'หลายตัวเลือก'].includes(questionForm.type) ? questionForm.options.split('\n').filter(Boolean) : undefined,
    }
    setQuestions((prev) => questionModal.item ? prev.map((q) => q.id === item.id ? item : q) : [...prev, item])
    setQuestionModal({ open: false })
    setDirty(true)
    notify(questionModal.item ? 'แก้ไขคำถามเรียบร้อยแล้ว' : 'เพิ่มคำถามใหม่เรียบร้อยแล้ว')
  }

  const persistSurvey = (nextStatus: Survey['status']) => {
    if (!form.title.trim()) {
      notify('กรุณาระบุชื่อแบบสอบถามก่อนบันทึก', 'error')
      return false
    }
    const updated: Survey = {
      ...selected,
      title: form.title.trim(),
      activity: form.activity || 'ยังไม่ระบุกิจกรรม',
      status: nextStatus,
      questions: questions.length,
      questionsData: questions,
    }
    setSurveys((current) => current.some((item) => item.id === updated.id)
      ? current.map((item) => item.id === updated.id ? updated : item)
      : [updated, ...current])
    setSelected(updated)
    setForm((current) => ({ ...current, status: nextStatus }))
    setDirty(false)
    return true
  }

  const saveDraft = () => {
    if (persistSurvey('ฉบับร่าง')) notify('บันทึกฉบับร่างเรียบร้อยแล้ว')
  }

  const publishSurvey = () => {
    if (persistSurvey('เผยแพร่')) notify('เผยแพร่แบบประเมินเรียบร้อยแล้ว')
  }

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
      <div className="brand">
        <div className="brand__mark">MU</div>
        <div><strong>MAHIDOL</strong><span>UNIVERSITY · LAMPANG</span></div>
        <button className="icon-button sidebar__close" aria-label="ปิดเมนู" onClick={() => setSidebarOpen(false)}><Icon name="close" /></button>
      </div>
      <div className="sidebar__section-label">เมนูหลัก</div>
      <nav className="nav-list" aria-label="เมนูหลัก">
        <button><Icon name="home" /><span>ภาพรวมระบบ</span></button>
        <button><Icon name="calendar" /><span>จัดการกิจกรรม</span></button>
        <button><Icon name="users" /><span>จัดการผู้เข้าร่วม</span></button>
        <button className="active"><Icon name="survey" /><span>จัดการแบบประเมิน</span></button>
        <button><Icon name="chart" /><span>รายงานและสถิติ</span></button>
      </nav>
      <div className="sidebar__bottom">
        <nav className="nav-list">
          <button><Icon name="settings" /><span>ตั้งค่าระบบ</span></button>
          <button><Icon name="logout" /><span>ออกจากระบบ</span></button>
        </nav>
        <div className="profile">
          <div className="avatar">สว</div>
          <div><strong>สุพัตรา วัฒนกิจ</strong><span>ผู้ดูแลระบบ</span></div>
        </div>
      </div>
    </aside>

    {sidebarOpen && <button className="sidebar-overlay" aria-label="ปิดเมนู" onClick={() => setSidebarOpen(false)} />}

    <div className="workspace">
      <header className="topbar">
        <button className="icon-button mobile-menu" aria-label="เปิดเมนู" onClick={() => setSidebarOpen(true)}><Icon name="menu" /></button>
        <div className="breadcrumb"><span>ระบบจัดการกิจกรรม</span><Icon name="chevron" size={15} /><strong>จัดการแบบประเมิน</strong></div>
        <div className="topbar__actions">
          <button className="icon-button notification" aria-label="การแจ้งเตือน"><Icon name="bell" /><span /></button>
          <div className="top-profile"><div className="avatar avatar--small">สว</div><div><strong>สุพัตรา วัฒนกิจ</strong><span>ผู้ดูแลระบบ</span></div></div>
        </div>
      </header>

      <main>
        <section className="page-heading">
          <div>
            <p className="eyebrow">การจัดการแบบประเมิน</p>
            <h1>จัดการแบบประเมิน</h1>
            <p>จัดการรายการแบบประเมิน และสร้าง แก้ไขและปรับปรุงแบบสอบถาม</p>
          </div>
          {tab === 'list' && <Button icon="plus" onClick={() => openBuilder()}>สร้างแบบประเมินใหม่</Button>}
        </section>

        <div className="tabs" role="tablist" aria-label="ส่วนจัดการแบบประเมิน">
          <button role="tab" aria-selected={tab === 'list'} className={tab === 'list' ? 'active' : ''} onClick={() => setTab('list')}>
            <Icon name="file" size={18} />รายการแบบประเมิน
          </button>
          <button role="tab" aria-selected={tab === 'builder'} className={tab === 'builder' ? 'active' : ''} onClick={() => setTab('builder')}>
            <Icon name="edit" size={18} />สร้าง แก้ไขและปรับปรุงแบบสอบถาม
            {dirty && <span className="unsaved-dot" aria-label="มีการแก้ไขที่ยังไม่ได้บันทึก" />}
          </button>
        </div>

        {tab === 'list' ? <>
          <section className="overview-grid" aria-label="สรุปแบบประเมิน">
            <article className="overview-card overview-card--total"><div className="overview-card__icon"><Icon name="survey" size={20} /></div><div><span>แบบประเมินทั้งหมด</span><strong>{surveys.length}</strong><small>รายการในระบบ</small></div></article>
            <article className="overview-card overview-card--published"><div className="overview-card__icon"><Icon name="check" size={20} /></div><div><span>เผยแพร่แล้ว</span><strong>{publishedCount}</strong><small>พร้อมรับคำตอบ</small></div></article>
            <article className="overview-card overview-card--draft"><div className="overview-card__icon"><Icon name="edit" size={20} /></div><div><span>ฉบับร่าง</span><strong>{draftCount}</strong><small>รอการตรวจสอบ</small></div></article>
          </section>
          <section className="content-card list-panel">
          <div className="card-heading">
            <div><h2>รายการแบบประเมิน</h2><p>ค้นหา ตรวจสอบ และจัดการแบบประเมินทั้งหมดในระบบ</p></div>
            <button className="icon-button" aria-label="โหลดข้อมูลใหม่" onClick={() => {
              setLoadState('loading')
              window.setTimeout(() => setLoadState(navigator.onLine ? 'ready' : 'error'), 850)
            }}><Icon name="refresh" /></button>
          </div>
          <div className="filters">
            <label className="search-box"><span className="sr-only">ค้นหาชื่อแบบประเมิน</span><Icon name="search" size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาชื่อแบบประเมิน..." /></label>
            <Field label="สถานะ"><select value={status} onChange={(e) => setStatus(e.target.value)}><option>ทั้งหมด</option><option>ฉบับร่าง</option><option>เผยแพร่</option></select></Field>
            <Field label="ประเภท / กิจกรรม"><select value={activity} onChange={(e) => setActivity(e.target.value)}><option>ทุกกิจกรรม</option><option>ปฐมนิเทศ</option><option>จิตอาสา</option><option>อบรมทักษะดิจิทัล</option></select></Field>
          </div>
          {loadState === 'loading' ? <LoadingState /> : loadState === 'error' ? <ErrorState onRetry={() => {
            setLoadState('loading')
            window.setTimeout(() => setLoadState(navigator.onLine ? 'ready' : 'error'), 850)
          }} /> : filtered.length === 0 ? <EmptyState onClear={() => { setSearch(''); setStatus('ทั้งหมด'); setActivity('ทุกกิจกรรม') }} /> : <>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ชื่อแบบประเมิน</th><th>กิจกรรมที่เกี่ยวข้อง</th><th>วันที่สร้าง</th><th>สถานะ</th><th>คำถาม</th><th><span className="sr-only">การจัดการ</span></th></tr></thead>
                <tbody>{filtered.map((item) => <tr key={item.id}>
                  <td><strong>{item.title}</strong><span className="mobile-meta">{item.created} · {item.questions} คำถาม</span></td>
                  <td>{item.activity}</td><td>{item.created}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>{item.questions} ข้อ</td>
                  <td><div className="row-actions"><button aria-label={`ดูรายละเอียด ${item.title}`} title="ดูรายละเอียด" onClick={() => openBuilder(item)}><Icon name="eye" size={18} /></button><button aria-label={`แก้ไข ${item.title}`} title="แก้ไข" onClick={() => openBuilder(item)}><Icon name="edit" size={18} /></button></div></td>
                </tr>)}</tbody>
              </table>
            </div>
            <div className="table-footer"><span>แสดง {filtered.length} จาก {surveys.length} รายการ</span><div className="pagination"><button disabled>ก่อนหน้า</button><button className="active">1</button><button disabled>ถัดไป</button></div></div>
          </>}
          </section>
        </> : <Builder
          form={form}
          questions={questions}
          dirty={dirty}
          changeForm={changeForm}
          openQuestion={openQuestion}
          setDeleteItem={setDeleteItem}
          setPreview={setPreview}
          saveDraft={saveDraft}
          publish={publishSurvey}
          toggleRequired={(id) => { setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, required: !q.required } : q)); setDirty(true) }}
          reorderQuestions={(from, to) => {
            if (from === to) return
            setQuestions((prev) => {
              const next = [...prev]
              const [moved] = next.splice(from, 1)
              next.splice(to, 0, moved)
              return next
            })
            setDirty(true)
          }}
        />}
      </main>
    </div>

    {questionModal.open && <Modal title={questionModal.item ? 'แก้ไขคำถาม' : 'เพิ่มคำถามใหม่'} subtitle="กำหนดรายละเอียดและรูปแบบคำถาม" onClose={() => setQuestionModal({ open: false })}>
      <div className="modal-form">
        <Field label="คำถาม" error={questionError}><textarea rows={3} value={questionForm.text} onChange={(e) => { setQuestionForm({ ...questionForm, text: e.target.value }); setQuestionError('') }} placeholder="ระบุคำถามที่ต้องการ..." /></Field>
        <div className="form-grid">
          <Field label="ประเภทคำถาม"><select value={questionForm.type} onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value })}>{typeOptions.map((type) => <option key={type}>{type}</option>)}</select></Field>
          <Field label="หมวดหมู่"><select value={questionForm.category} onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}><option>ความพึงพอใจโดยรวม</option><option>เนื้อหาและรูปแบบกิจกรรม</option><option>ความคิดเห็นเพิ่มเติม</option></select></Field>
        </div>
        {['ตัวเลือกเดียว', 'หลายตัวเลือก'].includes(questionForm.type) && <Field label="ตัวเลือก" hint="พิมพ์หนึ่งตัวเลือกต่อหนึ่งบรรทัด"><textarea rows={4} value={questionForm.options} onChange={(e) => setQuestionForm({ ...questionForm, options: e.target.value })} /></Field>}
        <label className="toggle-row"><span><strong>คำถามจำเป็น</strong><small>ผู้ตอบต้องตอบคำถามนี้จึงจะส่งแบบสอบถามได้</small></span><input type="checkbox" checked={questionForm.required} onChange={(e) => setQuestionForm({ ...questionForm, required: e.target.checked })} /><i /></label>
      </div>
      <div className="modal-footer"><Button variant="secondary" onClick={() => setQuestionModal({ open: false })}>ยกเลิก</Button><Button icon="save" onClick={saveQuestion}>บันทึกคำถาม</Button></div>
    </Modal>}

    {deleteItem && <Modal title="ยืนยันการลบคำถาม" subtitle="การดำเนินการนี้ไม่สามารถย้อนกลับได้" onClose={() => setDeleteItem(null)} compact>
      <div className="confirm-content"><div className="danger-icon"><Icon name="trash" /></div><p>คุณต้องการลบคำถาม <strong>“{deleteItem.text}”</strong> ใช่หรือไม่?</p></div>
      <div className="modal-footer"><Button variant="secondary" onClick={() => setDeleteItem(null)}>ยกเลิก</Button><Button variant="danger" icon="trash" onClick={() => { setQuestions((prev) => prev.filter((q) => q.id !== deleteItem.id)); setDeleteItem(null); setDirty(true); notify('ลบคำถามเรียบร้อยแล้ว') }}>ลบคำถาม</Button></div>
    </Modal>}

    {preview && <Modal title="ตัวอย่างแบบสอบถาม" subtitle="มุมมองสำหรับผู้ตอบแบบสอบถาม" onClose={() => setPreview(false)} wide>
      <div className="preview-banner"><Icon name="eye" size={18} /><span>นี่เป็นเพียงตัวอย่าง คำตอบจะไม่ถูกบันทึก</span></div>
      <div className="survey-preview">
        <p className="eyebrow">แบบประเมินกิจกรรม</p><h2>{form.title || 'แบบสอบถามที่ยังไม่มีชื่อ'}</h2><p>{form.description || 'ไม่มีคำอธิบาย'}</p>
        <div className="preview-meta"><span>{form.activity || 'ยังไม่ได้เลือกกิจกรรม'}</span><span>{questions.length} คำถาม</span></div>
        {questions.map((q, index) => <PreviewQuestion key={q.id} item={q} index={index} />)}
      </div>
      <div className="modal-footer"><Button variant="secondary" onClick={() => setPreview(false)}>ปิดหน้าตัวอย่าง</Button></div>
    </Modal>}

    {toast && <div className={`toast toast--${toast.kind}`} role="status"><span><Icon name={toast.kind === 'success' ? 'check' : 'alert'} size={18} /></span><div><strong>{toast.kind === 'success' ? 'ดำเนินการสำเร็จ' : 'ไม่สามารถดำเนินการได้'}</strong><p>{toast.text}</p></div><button aria-label="ปิดการแจ้งเตือน" onClick={() => setToast(null)}><Icon name="close" size={17} /></button></div>}
  </div>
}

function StatusBadge({ status }: { status: Survey['status'] }) {
  return <span className={`status status--${status === 'เผยแพร่' ? 'published' : 'draft'}`}><i />{status}</span>
}

function LoadingState() {
  return <div className="loading-state" aria-label="กำลังโหลดข้อมูล"><div className="skeleton skeleton--title" /><div className="skeleton-row" /><div className="skeleton-row" /><div className="skeleton-row" /><p>กำลังโหลดรายการแบบประเมิน...</p></div>
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return <div className="empty-state"><div><Icon name="search" size={30} /></div><h3>ไม่พบแบบประเมินที่ค้นหา</h3><p>ลองเปลี่ยนคำค้นหาหรือตัวกรอง เพื่อดูรายการแบบประเมินอื่น</p><Button variant="secondary" onClick={onClear}>ล้างตัวกรองทั้งหมด</Button></div>
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <div className="empty-state error-state"><div><Icon name="alert" size={30} /></div><h3>ไม่สามารถโหลดข้อมูลได้</h3><p>โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองโหลดรายการแบบประเมินอีกครั้ง</p><Button variant="secondary" icon="refresh" onClick={onRetry}>ลองอีกครั้ง</Button></div>
}

function Builder({ form, questions, dirty, changeForm, openQuestion, setDeleteItem, setPreview, saveDraft, publish, toggleRequired, reorderQuestions }: {
  form: { title: string; description: string; activity: string; status: string }; questions: Question[]; dirty: boolean
  changeForm: (key: 'title' | 'description' | 'activity' | 'status', value: string) => void; openQuestion: (item?: Question) => void
  setDeleteItem: (item: Question) => void; setPreview: (value: boolean) => void; saveDraft: () => void; publish: () => void; toggleRequired: (id: number) => void
  reorderQuestions: (from: number, to: number) => void
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  return <div className="builder-layout">
    {dirty && <div className="unsaved-alert"><Icon name="alert" size={18} /><span><strong>มีการแก้ไขที่ยังไม่ได้บันทึก</strong> กรุณาบันทึกก่อนออกจากหน้านี้</span></div>}
    <section className="content-card">
      <div className="card-heading"><div><h2>ข้อมูลแบบสอบถาม</h2><p>ระบุรายละเอียดพื้นฐานของแบบสอบถาม</p></div><StatusBadge status={form.status as Survey['status']} /></div>
      <div className="form-stack">
        <Field label="ชื่อแบบสอบถาม"><input value={form.title} onChange={(e) => changeForm('title', e.target.value)} placeholder="ระบุชื่อแบบสอบถาม" /></Field>
        <Field label="คำอธิบาย" hint="อธิบายวัตถุประสงค์หรือคำแนะนำสำหรับผู้ตอบ"><textarea rows={3} value={form.description} onChange={(e) => changeForm('description', e.target.value)} placeholder="ระบุคำอธิบายแบบสอบถาม" /></Field>
        <div className="form-grid">
          <Field label="กิจกรรมที่เชื่อมโยง"><select value={form.activity} onChange={(e) => changeForm('activity', e.target.value)}><option value="">เลือกกิจกรรม</option><option>ปฐมนิเทศนักศึกษาใหม่ ปี 2568</option><option>จิตอาสาเพื่อชุมชน</option><option>อบรมทักษะดิจิทัลสำหรับนักศึกษา</option><option>เตรียมความพร้อมสู่สถานประกอบการ</option></select></Field>
          <Field label="สถานะแบบสอบถาม"><select value={form.status} onChange={(e) => changeForm('status', e.target.value)}><option>ฉบับร่าง</option><option>เผยแพร่</option></select></Field>
        </div>
      </div>
    </section>

    <section className="content-card question-section">
      <div className="card-heading">
        <div><div className="heading-with-count"><h2>คำถามแบบประเมิน</h2><span>{questions.length}</span></div><p>ลากเพื่อจัดลำดับ และจัดหมวดหมู่คำถามให้เหมาะสม</p></div>
        <Button icon="plus" onClick={() => openQuestion()}>เพิ่มคำถาม</Button>
      </div>
      {questions.length === 0 ? <div className="empty-state empty-state--compact"><div><Icon name="file" size={28} /></div><h3>ยังไม่มีคำถามในแบบประเมิน</h3><p>เริ่มต้นสร้างแบบประเมินโดยเพิ่มคำถามแรก</p><Button icon="plus" onClick={() => openQuestion()}>เพิ่มคำถามแรก</Button></div> :
        <div className="question-list">{questions.map((item, index) => <article
          className={`question-card ${draggedIndex === index ? 'question-card--dragging' : ''}`}
          key={item.id}
          draggable
          onDragStart={() => setDraggedIndex(index)}
          onDragEnd={() => setDraggedIndex(null)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (draggedIndex !== null) reorderQuestions(draggedIndex, index)
            setDraggedIndex(null)
          }}
        >
          <button className="drag-handle" aria-label={`ลากเพื่อจัดลำดับคำถามที่ ${index + 1}`}><Icon name="grip" /></button>
          <div className="question-number">{index + 1}</div>
          <div className="question-content">
            <div className="question-tags"><span>{item.category}</span><span>{item.type}</span></div>
            <h3>{item.text}</h3>
            <label className="required-check"><input type="checkbox" checked={item.required} onChange={() => toggleRequired(item.id)} /><span><Icon name="check" size={13} /></span>จำเป็นต้องตอบ</label>
          </div>
          <div className="question-actions"><button aria-label="แก้ไขคำถาม" onClick={() => openQuestion(item)}><Icon name="edit" size={18} /></button><button className="danger" aria-label="ลบคำถาม" onClick={() => setDeleteItem(item)}><Icon name="trash" size={18} /></button></div>
        </article>)}</div>}
    </section>

    <div className="builder-actions">
      <span>{dirty ? 'ยังไม่ได้บันทึกการเปลี่ยนแปลงล่าสุด' : 'บันทึกการเปลี่ยนแปลงล่าสุดแล้ว'}</span>
      <div><Button variant="secondary" icon="save" onClick={saveDraft}>บันทึกฉบับร่าง</Button><Button variant="secondary" icon="eye" onClick={() => setPreview(true)}>ดูตัวอย่าง</Button><Button icon="send" onClick={publish}>เผยแพร่</Button></div>
    </div>
  </div>
}

function PreviewQuestion({ item, index }: { item: Question; index: number }) {
  return <div className="preview-question"><label>{index + 1}. {item.text}{item.required && <b>*</b>}</label>
    {item.type === 'ข้อความยาว' ? <textarea rows={3} placeholder="พิมพ์คำตอบของคุณ..." /> :
      item.type === 'ข้อความสั้น' || item.type === 'วันที่' ? <input type={item.type === 'วันที่' ? 'date' : 'text'} placeholder={item.type === 'วันที่' ? '' : 'พิมพ์คำตอบของคุณ...'} /> :
      ['ตัวเลือกเดียว', 'หลายตัวเลือก'].includes(item.type) ? <div className="preview-options">{(item.options ?? ['ตัวเลือกที่ 1', 'ตัวเลือกที่ 2']).map((option) => <label key={option}><input type={item.type === 'ตัวเลือกเดียว' ? 'radio' : 'checkbox'} name={`question-${item.id}`} />{option}</label>)}</div> :
      <div className="rating">{[1, 2, 3, 4, 5].map((num) => <button key={num}>{num}</button>)}</div>}
  </div>
}

function Modal({ title, subtitle, onClose, children, compact, wide }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode; compact?: boolean; wide?: boolean }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
    <section className={`modal ${compact ? 'modal--compact' : ''} ${wide ? 'modal--wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-header"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="icon-button" aria-label="ปิดหน้าต่าง" onClick={onClose}><Icon name="close" /></button></div>
      {children}
    </section>
  </div>
}

export default App
