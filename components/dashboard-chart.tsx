"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const data = [{ name: "يناير", value: 340 }, { name: "فبراير", value: 520 }, { name: "مارس", value: 460 }, { name: "أبريل", value: 790 }, { name: "مايو", value: 650 }, { name: "يونيو", value: 980 }, { name: "يوليو", value: 1240 }];

export function DashboardChart() {
  return <div className="h-[270px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 15, right: 0, left: -25, bottom: 0 }}><defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f26a4f" stopOpacity={0.28} /><stop offset="100%" stopColor="#f26a4f" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} /><Tooltip contentStyle={{ border: "0", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,.12)", fontSize: "12px" }} formatter={(value) => [`${value} ج.م`, "الإيراد"]} /><Area type="monotone" dataKey="value" stroke="#f26a4f" strokeWidth={3} fill="url(#salesFill)" /></AreaChart></ResponsiveContainer></div>;
}
