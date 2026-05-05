import React from "react";
import { FiBriefcase, FiDollarSign, FiHome } from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import GradientCard from "../../components/ui/GradientCard";

const PLACEMENT_TREND = [
  { month: "Aug", placed: 12 },
  { month: "Sep", placed: 22 },
  { month: "Oct", placed: 38 },
  { month: "Nov", placed: 55 },
  { month: "Dec", placed: 71 },
  { month: "Jan", placed: 84 },
];

const ROLE_DISTRIBUTION = [
  { name: "Software Engineer",   value: 64, color: "#7c3aed" },
  { name: "Data / ML Engineer",  value: 28, color: "#3b82f6" },
  { name: "Frontend / UI",       value: 22, color: "#10b981" },
  { name: "DevOps / SRE",        value: 14, color: "#f59e0b" },
  { name: "QA / SDET",           value: 10, color: "#ef4444" },
  { name: "Product / Analyst",   value: 8,  color: "#ec4899" },
];

const COMPANIES = [
  { name: "Infosys",     hires: 18, type: "Service"  },
  { name: "TCS",         hires: 16, type: "Service"  },
  { name: "Wipro",       hires: 12, type: "Service"  },
  { name: "Accenture",   hires: 10, type: "Service"  },
  { name: "Capgemini",   hires: 9,  type: "Service"  },
  { name: "Walmart Labs",hires: 6,  type: "Product"  },
  { name: "Razorpay",    hires: 4,  type: "Product"  },
  { name: "Zoho",        hires: 4,  type: "Product"  },
  { name: "Other",       hires: 5,  type: "—"        },
];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
};

const PlacementAnalyticsPage = () => {
  const totalPlaced = COMPANIES.reduce((acc, c) => acc + c.hires, 0);

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Placement Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Hiring trends, role mix, and company-wise placements</p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GradientCard icon={FiBriefcase}  label="Placement Rate"  value="84%" progress={84} color="green" trend="+6%" />
          <GradientCard icon={FiDollarSign} label="Average Package" value="₹6.8 LPA" sublabel="across all offers" color="purple" />
          <GradientCard icon={FiHome}       label="Companies"        value={COMPANIES.length} sublabel={`${totalPlaced} hires`} color="orange" />
        </section>

        {/* Charts row */}
        <section className="grid grid-cols-12 gap-6">
          {/* Placement trend line */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Placement Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">Monthly placements over the current cycle</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PLACEMENT_TREND} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#e9d5ff", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="placed" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Role distribution pie */}
          <div className="col-span-12 lg:col-span-5 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Role Distribution</h3>
              <p className="text-xs text-gray-500 mt-0.5">Offers by job family</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ROLE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={88} paddingAngle={2} dataKey="value">
                    {ROLE_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Top hiring companies */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Top Hiring Companies</h3>
            <p className="text-xs text-gray-500 mt-0.5">Hires count per company across all batches</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[300px]">Hires</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMPANIES.map((c) => {
                  const pct = Math.round((c.hires / totalPlaced) * 100);
                  return (
                    <tr key={c.name} className="hover:bg-purple-50/40 transition-colors">
                      <td className="px-6 py-3">
                        <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          c.type === "Product" ? "text-purple-700 bg-purple-50 border-purple-100" :
                          c.type === "Service" ? "text-blue-700 bg-blue-50 border-blue-100" :
                          "text-gray-700 bg-gray-100 border-gray-200"
                        }`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-700 min-w-[28px] text-right">{c.hires}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm font-semibold text-gray-700">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlacementAnalyticsPage;
