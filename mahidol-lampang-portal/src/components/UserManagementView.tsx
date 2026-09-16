import React, { useState } from 'react';

interface UserItem {
  id: string;
  nameTh: string;
  nameEn: string;
  email: string;
  role: 'Super Admin' | 'Project Lead' | 'Activity Coordinator' | 'Auditor';
  faculty: string;
  campus: string;
  status: 'active' | 'inactive';
  lastActive: string;
  avatar: string;
}

export const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: 'u-01',
      nameTh: 'ดร. เกียรติศักดิ์ รัตนวิเชียร',
      nameEn: 'Dr. Kiatisak Rattanawichian',
      email: 'kiatisak.rat@mahidol.ac.th',
      role: 'Super Admin',
      faculty: 'คณะสิ่งแวดล้อมและทรัพยากรศาสตร์',
      campus: 'วิทยาเขตลำปาง',
      status: 'active',
      lastActive: 'กำลังใช้งาน',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAkn91IOeKpnt7UxpHp0D4DdJE-kkXjqQHojzwrX--ThpK0nRci525m-dXSrNn1T9_CGCYCLEJoyL0mq7piLu8gJCt3_NPRWLbpjrtIhsPvnIQcyJxh0ZGaq624INnojOfuI0oM59e4b_ilYR-XEpv1D-MvSfIG_kZiNHDeTFwp2mN2IerndLVBs8saaTn31XrN8ngaQ5YKxCCYoeLJqPztYxv9_WThKGHrqEBJ7tOZN_PSmhinM0m',
    },
    {
      id: 'u-02',
      nameTh: 'อภิวัฒน์ สุวรรณโชติ',
      nameEn: 'Apiwat Suwanchot',
      email: 'apiwat.suw@mahidol.ac.th',
      role: 'Super Admin',
      faculty: 'สำนักงานวิทยาเขตลำปาง',
      campus: 'วิทยาเขตลำปาง',
      status: 'active',
      lastActive: '5 นาทีที่แล้ว',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'u-03',
      nameTh: 'ผศ.ดร. นภาพร วงศ์ษา',
      nameEn: 'Asst. Prof. Dr. Napaporn Wongsa',
      email: 'napaporn.won@mahidol.ac.th',
      role: 'Project Lead',
      faculty: 'คณะสิ่งแวดล้อมและทรัพยากรศาสตร์',
      campus: 'วิทยาเขตลำปาง',
      status: 'active',
      lastActive: '2 ชั่วโมงที่แล้ว',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'u-04',
      nameTh: 'อ. สุรชัย ชัยชนะ',
      nameEn: 'Ajarn Surachai Chaichana',
      email: 'surachai.cha@mahidol.ac.th',
      role: 'Activity Coordinator',
      faculty: 'คณะสิ่งแวดล้อมและทรัพยากรศาสตร์',
      campus: 'วิทยาเขตลำปาง',
      status: 'active',
      lastActive: 'เมื่อวาน 16:30 น.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'u-05',
      nameTh: 'นางสาว พัชรี บัวงาม',
      nameEn: 'Miss Patcharee Buangam',
      email: 'patcharee.bua@mahidol.ac.th',
      role: 'Activity Coordinator',
      faculty: 'สำนักงานวิทยาเขตลำปาง',
      campus: 'วิทยาเขตลำปาง',
      status: 'active',
      lastActive: '3 วันที่แล้ว',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'u-06',
      nameTh: 'รศ.ดร. ธนวัฒน์ ปรีชา',
      nameEn: 'Assoc. Prof. Dr. Thanawat Preecha',
      email: 'thanawat.pre@mahidol.ac.th',
      role: 'Auditor',
      faculty: 'กองแผนงาน มหาวิทยาลัยมหิดล',
      campus: 'ศาลายา',
      status: 'active',
      lastActive: '1 สัปดาห์ที่แล้ว',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserItem['role']>('Activity Coordinator');
  const [newUserFaculty, setNewUserFaculty] = useState('คณะสิ่งแวดล้อมและทรัพยากรศาสตร์');
  const [showRoleMatrix, setShowRoleMatrix] = useState(false);

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.nameTh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: UserItem = {
      id: `u-${Date.now()}`,
      nameTh: newUserName,
      nameEn: 'New Mahidol Staff',
      email: newUserEmail.includes('@') ? newUserEmail : `${newUserEmail}@mahidol.ac.th`,
      role: newUserRole,
      faculty: newUserFaculty,
      campus: 'วิทยาเขตลำปาง',
      status: 'active',
      lastActive: 'เพิ่งเพิ่มผู้ใช้งาน',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    };

    setUsers([newUser, ...users]);
    setNewUserName('');
    setNewUserEmail('');
    setIsAddUserModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#0c2340] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </span>
            <h1 className="text-[17px] font-bold text-slate-900">
              ผู้ใช้งาน & สิทธิ์การเข้าถึง (User Management & RBAC)
            </h1>
          </div>
          <p className="text-[12px] text-slate-500 mt-1">
            กำหนดบทบาทหน้าที่ สิทธิ์การเข้าถึงข้อมูลโครงการ เอกสารราชการ และการอนุมัติเผยแพร่เว็บไซต์
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRoleMatrix(!showRoleMatrix)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">shield</span>
            <span>ตารางสิทธิ์ (Permission Matrix)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#0c2340] hover:bg-[#163a66] text-white font-bold rounded-lg text-[12px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>+ เพิ่มผู้ใช้งานใหม่</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">ผู้ใช้งานทั้งหมด</span>
          <div className="text-[20px] font-bold text-slate-900">{users.length} คน</div>
          <span className="text-[10px] text-emerald-600 font-semibold">เปิดใช้งานทุกคน</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-purple-600">Super Admin</span>
          <div className="text-[20px] font-bold text-purple-900">
            {users.filter((u) => u.role === 'Super Admin').length} คน
          </div>
          <span className="text-[10px] text-slate-400">สิทธิ์สูงสุดทุกระบบ</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-sky-600">Project Leads</span>
          <div className="text-[20px] font-bold text-sky-900">
            {users.filter((u) => u.role === 'Project Lead').length} คน
          </div>
          <span className="text-[10px] text-slate-400">ประธาน & หัวหน้าโครงการ</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-emerald-600">Coordinators & Staff</span>
          <div className="text-[20px] font-bold text-emerald-900">
            {users.filter((u) => u.role === 'Activity Coordinator').length} คน
          </div>
          <span className="text-[10px] text-slate-400">ผู้ประสานงานกิจกรรม</span>
        </div>
      </div>

      {/* Role Permission Matrix Card (Expandable) */}
      {showRoleMatrix && (
        <div className="bg-white rounded-xl border border-purple-200 shadow-xs p-4 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
            <h3 className="text-[13px] font-bold text-purple-950 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-purple-700 text-[18px]">
                policy
              </span>
              <span>ตารางสิทธิ์การใช้งานจำแนกตามบทบาท (Permission Matrix)</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowRoleMatrix(false)}
              className="text-slate-400 hover:text-slate-600 text-[11px]"
            >
              ปิดตาราง
            </button>
          </div>

          <div className="overflow-x-auto text-[11px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-purple-50/60 text-purple-950 font-bold border-b border-purple-200">
                  <th className="p-2">ฟังก์ชันงานในระบบ</th>
                  <th className="p-2 text-center">Super Admin</th>
                  <th className="p-2 text-center">Project Lead</th>
                  <th className="p-2 text-center">Coordinator</th>
                  <th className="p-2 text-center">Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-2 font-medium">1. สร้างโครงการ / กิจกรรมใหม่</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">2. อัปโหลด &amp; สกัดเอกสารราชการด้วย AI</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">3. ตรวจทาน &amp; ยืนยันแบบสอบถาม (Survey Approval)</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-slate-300">-</td>
                  <td className="p-2 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">4. กดยืนยัน "เสร็จสิ้นโครงการ" &amp; ทำข่าว AI</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">5. อนุมัติและกด "เผยแพร่เว็บไซต์" (Web Publishing)</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-slate-300">-</td>
                  <td className="p-2 text-center text-slate-300">-</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">6. เข้าถึง Executive Analytics &amp; ส่งออกรายงาน</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="p-2 text-center text-emerald-600 font-bold">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Table & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อ หรืออีเมล..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-[12px] focus:outline-hidden focus:border-sky-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 text-[12px] font-medium focus:outline-hidden"
            >
              <option value="all">บทบาททั้งหมด (All Roles)</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Project Lead">Project Lead</option>
              <option value="Activity Coordinator">Activity Coordinator</option>
              <option value="Auditor">Auditor</option>
            </select>
          </div>

          <span className="text-[11px] text-slate-500">
            พบผู้ใช้งาน {filteredUsers.length} รายการ
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2.5 px-4">ผู้ใช้งาน</th>
                <th className="py-2.5 px-3">บทบาท (Role)</th>
                <th className="py-2.5 px-3">คณะ / หน่วยงาน</th>
                <th className="py-2.5 px-3">สถานะ</th>
                <th className="py-2.5 px-3">เข้าใช้งานล่าสุด</th>
                <th className="py-2.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatar}
                        alt={user.nameTh}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 leading-tight">
                          {user.nameTh}
                        </div>
                        <div className="text-[10.5px] text-slate-400 truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.role === 'Super Admin'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : user.role === 'Project Lead'
                          ? 'bg-sky-100 text-sky-800 border border-sky-200'
                          : user.role === 'Activity Coordinator'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-700">
                    <div className="font-medium text-[11.5px]">{user.faculty}</div>
                    <div className="text-[10px] text-slate-400">{user.campus}</div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        user.status === 'active' ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                      {user.status === 'active' ? 'เปิดใช้งาน' : 'ระงับชั่วคราว'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-[11px]">
                    {user.lastActive}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user.id)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        {user.status === 'active' ? 'พักสิทธิ์' : 'เปิดสิทธิ์'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#0c2340] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                <h3 className="text-[14px] font-bold">เพิ่มผู้ใช้งานใหม่เข้าสู่ระบบ</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-5 space-y-3.5 text-[12px]">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ชื่อ-สกุล (ภาษาไทย) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="เช่น ผศ.ดร. สมชาย ใจดี"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-[12px] focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  อีเมลมหาวิทยาลัย (@mahidol.ac.th) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="somchai.jai@mahidol.ac.th"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-[12px] focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">บทบาทหน้าที่ (Role)</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-[12px] focus:outline-hidden"
                >
                  <option value="Activity Coordinator">Activity Coordinator (ผู้ประสานงานกิจกรรม)</option>
                  <option value="Project Lead">Project Lead (ประธานโครงการ/หัวหน้า)</option>
                  <option value="Auditor">Auditor (ผู้ตรวจสอบ/ติดตามผล)</option>
                  <option value="Super Admin">Super Admin (ผู้ดูแลระบบสูงสุด)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">คณะ / ส่วนงาน</label>
                <input
                  type="text"
                  value={newUserFaculty}
                  onChange={(e) => setNewUserFaculty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-[12px] focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-sky-50 rounded-lg text-sky-900 text-[11px]">
                ℹ️ ระบบจะส่งอีเมลแจ้งข้อมูลเข้าสู่ระบบไปยังบัญชีผู้ใช้งานอัตโนมัติผ่านระบบ Single Sign-On (Mahidol SSO)
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-[12px] font-medium"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0c2340] hover:bg-[#163a66] text-white rounded-lg text-[12px] font-bold shadow-xs cursor-pointer"
                >
                  บันทึกผู้ใช้งาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
