import React, { useState } from "react";
import {
  FiShield,
  FiSliders,
  FiBell,
  FiMoon,
  FiSun,
  FiMonitor,
  FiSave,
  FiCheck,
} from "react-icons/fi";
import { useToast } from "../../components/ui/Toaster";

const Toggle = ({ checked, onChange, ariaLabel }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 ${
      checked ? "bg-purple-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? "translate-x-4" : "translate-x-0.5"
      }`}
    />
  </button>
);

const SectionCard = ({ icon: Icon, title, description, accent = "purple", children }) => {
  const accentMap = {
    purple: "bg-purple-50 text-purple-600",
    blue:   "bg-blue-50 text-blue-600",
    green:  "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-start gap-3">
        <div className={`p-2 rounded-lg ${accentMap[accent]} flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
};

const ROLES = [
  { id: "admin",    name: "Administrator", desc: "Full system access" },
  { id: "trainer",  name: "Trainer",       desc: "Manage batches, attendance, assessments" },
  { id: "director", name: "Director",      desc: "Read-only oversight, analytics" },
  { id: "student",  name: "Student",       desc: "Access own dashboard and assigned content" },
];

const PERMISSIONS = [
  { id: "users",      label: "Manage Users" },
  { id: "batches",    label: "Manage Batches" },
  { id: "courses",    label: "Manage Courses" },
  { id: "assess",     label: "Manage Assessments" },
  { id: "attendance", label: "Mark Attendance" },
  { id: "reports",    label: "View Reports" },
  { id: "settings",   label: "System Settings" },
];

const DEFAULT_PERMISSIONS = {
  admin:    { users: true,  batches: true,  courses: true,  assess: true,  attendance: true,  reports: true,  settings: true },
  trainer:  { users: false, batches: true,  courses: true,  assess: true,  attendance: true,  reports: true,  settings: false },
  director: { users: false, batches: false, courses: false, assess: false, attendance: false, reports: true,  settings: false },
  student:  { users: false, batches: false, courses: false, assess: false, attendance: false, reports: false, settings: false },
};

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 text-sm placeholder:text-gray-400 bg-white";

const ThemeOption = ({ id, icon: Icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
      active
        ? "border-purple-500 bg-purple-50 text-purple-700 shadow-sm"
        : "border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-purple-50/40"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-xs font-semibold">{label}</span>
    {active && <FiCheck className="w-3 h-3 absolute top-2 right-2 text-purple-600" />}
  </button>
);

const SettingsPage = () => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

  const [platform, setPlatform] = useState({
    name: "HireAssist",
    tagline: "Learning + Placement",
    supportEmail: "support@hireassist.com",
    timezone: "Asia/Kolkata",
  });

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    pushAlerts: true,
    inAppToasts: true,
    weeklyReport: false,
    marketingEmails: false,
  });

  const [theme, setTheme] = useState("light");

  const togglePermission = (roleId, permId) => {
    if (roleId === "admin") return; // admin always has all permissions
    setPermissions((prev) => ({
      ...prev,
      [roleId]: { ...prev[roleId], [permId]: !prev[roleId][permId] },
    }));
  };

  const handlePlatformChange = (e) => {
    setPlatform((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const toggleNotif = (key) => {
    setNotifications((n) => ({ ...n, [key]: !n[key] }));
  };

  const handleSave = (sectionLabel) => {
    toast({
      title: "Saved",
      message: `${sectionLabel} updated successfully.`,
      variant: "success",
    });
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-600 mt-1">
            Roles, platform configuration, notifications, and theme
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        {/* Roles & Permissions */}
        <SectionCard
          icon={FiShield}
          title="Roles & Permissions"
          description="Toggle what each role can do across the platform"
          accent="purple"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 pr-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  {PERMISSIONS.map((p) => (
                    <th key={p.id} className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {p.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ROLES.map((r) => (
                  <tr key={r.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                    </td>
                    {PERMISSIONS.map((p) => (
                      <td key={p.id} className="py-3 px-2 text-center">
                        <div className="inline-flex">
                          <Toggle
                            checked={permissions[r.id]?.[p.id]}
                            onChange={() => togglePermission(r.id, p.id)}
                            ariaLabel={`${r.name} — ${p.label}`}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Note:</span> the Administrator role always has all permissions.
            </p>
            <button
              type="button"
              onClick={() => handleSave("Roles & Permissions")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all"
            >
              <FiSave className="w-3.5 h-3.5" />
              Save changes
            </button>
          </div>
        </SectionCard>

        {/* Platform Config */}
        <SectionCard
          icon={FiSliders}
          title="Platform Configuration"
          description="Branding, contact, and operational defaults"
          accent="blue"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700" htmlFor="platform-name">Platform Name</label>
              <input id="platform-name" name="name" value={platform.name} onChange={handlePlatformChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700" htmlFor="platform-tagline">Tagline</label>
              <input id="platform-tagline" name="tagline" value={platform.tagline} onChange={handlePlatformChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700" htmlFor="platform-support">Support Email</label>
              <input id="platform-support" name="supportEmail" type="email" value={platform.supportEmail} onChange={handlePlatformChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700" htmlFor="platform-tz">Default Timezone</label>
              <select id="platform-tz" name="timezone" value={platform.timezone} onChange={handlePlatformChange} className={inputClass}>
                <option>Asia/Kolkata</option>
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
                <option>Asia/Singapore</option>
              </select>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => handleSave("Platform configuration")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all"
            >
              <FiSave className="w-3.5 h-3.5" />
              Save changes
            </button>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard
          icon={FiBell}
          title="Notifications"
          description="Choose how the platform reaches users"
          accent="orange"
        >
          <ul className="divide-y divide-gray-100">
            {[
              { key: "emailDigest",    title: "Email digest",      desc: "A daily summary of activity to all admins" },
              { key: "pushAlerts",     title: "Push alerts",       desc: "Real-time alerts for critical events" },
              { key: "inAppToasts",    title: "In-app toasts",     desc: "Show success / info toasts inside dashboards" },
              { key: "weeklyReport",   title: "Weekly report",     desc: "Send a Monday-morning health report" },
              { key: "marketingEmails",title: "Marketing emails",  desc: "Product updates and campaign notifications" },
            ].map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                <Toggle
                  checked={notifications[item.key]}
                  onChange={() => toggleNotif(item.key)}
                  ariaLabel={item.title}
                />
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => handleSave("Notification preferences")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all"
            >
              <FiSave className="w-3.5 h-3.5" />
              Save changes
            </button>
          </div>
        </SectionCard>

        {/* Theme */}
        <SectionCard
          icon={FiMonitor}
          title="Theme"
          description="Appearance preference for new users (UI preview only)"
          accent="green"
        >
          <div className="grid grid-cols-3 gap-3 max-w-md">
            <ThemeOption id="light"  icon={FiSun}     label="Light"  active={theme === "light"}  onClick={() => setTheme("light")} />
            <ThemeOption id="dark"   icon={FiMoon}    label="Dark"   active={theme === "dark"}   onClick={() => setTheme("dark")} />
            <ThemeOption id="system" icon={FiMonitor} label="System" active={theme === "system"} onClick={() => setTheme("system")} />
          </div>
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => handleSave("Theme preference")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.99] transition-all"
            >
              <FiSave className="w-3.5 h-3.5" />
              Save changes
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default SettingsPage;
