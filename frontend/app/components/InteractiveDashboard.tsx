"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Settings,
  ChevronRight,
  Sparkles
} from "lucide-react";

type Industry = "sports" | "clinics" | "restaurants" | "gyms";

interface DashboardData {
  industryTitle: string;
  sidebarItems: string[];
  stats: {
    label: string;
    value: string;
    trend: string;
    trendUp: boolean;
    subtext: string;
  }[];
  scheduleHeaders: string[];
  scheduleEvents: {
    column: number; // 1-indexed (e.g. Column 1 to 4)
    time: string;
    title: string;
    subtitle?: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    gridRowStart: string; // Tailwind grid row grid positioning
    gridRowEnd: string;
  }[];
}

const DASHBOARDS: Record<Industry, DashboardData> = {
  sports: {
    industryTitle: "Sports Facility Management",
    sidebarItems: [
      "Overview",
      "Bookings",
      "Courts",
      "Customers",
      "Memberships",
      "Payments",
      "Tournaments",
      "Reports",
      "Settings"
    ],
    stats: [
      { label: "Total Revenue", value: "₱24,580", trend: "+12.5%", trendUp: true, subtext: "vs yesterday" },
      { label: "Bookings", value: "32", trend: "+8.2%", trendUp: true, subtext: "vs yesterday" },
      { label: "Courts Occupied", value: "7 / 10", trend: "70%", trendUp: true, subtext: "occupancy rate" },
      { label: "Active Members", value: "156", trend: "+15", trendUp: true, subtext: "vs last month" }
    ],
    scheduleHeaders: ["Court 1", "Court 2", "Court 3", "Court 4"],
    scheduleEvents: [
      {
        column: 1,
        time: "9:00 - 10:30 AM",
        title: "Open Play",
        subtitle: "18 / 24 players",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-3"
      },
      {
        column: 2,
        time: "9:00 - 10:00 AM",
        title: "Private Booking",
        subtitle: "Alex R.",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        textColor: "text-slate-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-2"
      },
      {
        column: 3,
        time: "10:00 - 12:00 PM",
        title: "Tournament Practice",
        subtitle: "Club League",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        gridRowStart: "row-start-2",
        gridRowEnd: "row-end-4"
      },
      {
        column: 2,
        time: "11:00 - 12:00 PM",
        title: "Coaching Session",
        subtitle: "Coach Marie",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        gridRowStart: "row-start-3",
        gridRowEnd: "row-end-4"
      },
      {
        column: 4,
        time: "11:00 - 12:00 PM",
        title: "League Match",
        subtitle: "Devs vs Admins",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        textColor: "text-rose-700",
        gridRowStart: "row-start-3",
        gridRowEnd: "row-end-4"
      }
    ]
  },
  clinics: {
    industryTitle: "Clinic Appointment Portal",
    sidebarItems: [
      "Overview",
      "Appointments",
      "Patients",
      "Doctors",
      "Prescriptions",
      "Billing",
      "Rooms & Equipment",
      "Reports",
      "Settings"
    ],
    stats: [
      { label: "Total Consults", value: "48 Patients", trend: "+15.3%", trendUp: true, subtext: "vs yesterday" },
      { label: "Avg Wait Time", value: "12 mins", trend: "-18.5%", trendUp: false, subtext: "improvement" },
      { label: "Rooms Occupied", value: "6 / 8", trend: "75%", trendUp: true, subtext: "usage rate" },
      { label: "Active Records", value: "1,240", trend: "+38", trendUp: true, subtext: "new patients" }
    ],
    scheduleHeaders: ["Room A", "Room B", "Room C", "Room D"],
    scheduleEvents: [
      {
        column: 1,
        time: "9:00 - 10:00 AM",
        title: "Dr. Santos",
        subtitle: "General Checkup",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-2"
      },
      {
        column: 2,
        time: "9:00 - 10:30 AM",
        title: "Dr. Reyes",
        subtitle: "Pediatric Consul.",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-3"
      },
      {
        column: 3,
        time: "10:00 - 11:30 AM",
        title: "Dr. Gomez",
        subtitle: "Dental Cleaning",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        gridRowStart: "row-start-2",
        gridRowEnd: "row-end-4"
      },
      {
        column: 4,
        time: "9:30 - 11:00 AM",
        title: "Therapy Lab",
        subtitle: "Physiotherapy",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-3"
      },
      {
        column: 1,
        time: "11:00 - 12:00 PM",
        title: "Dr. Lim",
        subtitle: "Cardiology Review",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        textColor: "text-rose-700",
        gridRowStart: "row-start-3",
        gridRowEnd: "row-end-4"
      }
    ]
  },
  restaurants: {
    industryTitle: "Restaurant Reservation & Orders",
    sidebarItems: [
      "Dashboard",
      "Floor Map",
      "Active Orders",
      "Menu Manager",
      "Reservations",
      "Inventory Status",
      "Staff Roster",
      "Analytics",
      "Settings"
    ],
    stats: [
      { label: "Today's Revenue", value: "₱68,430", trend: "+24.1%", trendUp: true, subtext: "vs last week" },
      { label: "Covers (Guests)", value: "142", trend: "+12.2%", trendUp: true, subtext: "vs yesterday" },
      { label: "Tables Occupied", value: "16 / 20", trend: "80%", trendUp: true, subtext: "capacity occupied" },
      { label: "Active Orders", value: "18 Tables", trend: "Kitchen Hot", trendUp: true, subtext: "status check" }
    ],
    scheduleHeaders: ["Main Hall", "Patio", "VIP Room 1", "VIP Room 2"],
    scheduleEvents: [
      {
        column: 1,
        time: "9:00 - 11:00 AM",
        title: "Table 4 - Reserved",
        subtitle: "Del Rosario Party",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        textColor: "text-slate-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-3"
      },
      {
        column: 2,
        time: "9:30 - 10:30 AM",
        title: "Patio 2 - Walk-in",
        subtitle: "3 Covers",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-2"
      },
      {
        column: 3,
        time: "10:00 - 12:00 PM",
        title: "VIP 1 - Birthday",
        subtitle: "12 Covers (Set Menu)",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        gridRowStart: "row-start-2",
        gridRowEnd: "row-end-4"
      },
      {
        column: 2,
        time: "11:00 - 12:00 PM",
        title: "Patio 1 - Corporate",
        subtitle: "6 Covers",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        gridRowStart: "row-start-3",
        gridRowEnd: "row-end-4"
      },
      {
        column: 4,
        time: "11:00 - 12:00 PM",
        title: "VIP 2 - Business",
        subtitle: "4 Covers (Wine List)",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        textColor: "text-rose-700",
        gridRowStart: "row-start-3",
        gridRowEnd: "row-end-4"
      }
    ]
  },
  gyms: {
    industryTitle: "Gym & Wellness Center Management",
    sidebarItems: [
      "Overview",
      "Class Booking",
      "Personal Trainers",
      "Members List",
      "Attendance QR",
      "Payments & Retail",
      "Equipment Maintenance",
      "Performance",
      "Settings"
    ],
    stats: [
      { label: "Check-ins Today", value: "208 members", trend: "+18.2%", trendUp: true, subtext: "vs last week" },
      { label: "Trainer Sessions", value: "24 Private", trend: "+9.5%", trendUp: true, subtext: "vs yesterday" },
      { label: "Capacity Level", value: "42 / 60", trend: "70%", trendUp: true, subtext: "live load status" },
      { label: "Monthly Recurring", value: "₱142,500", trend: "+6.8%", trendUp: true, subtext: "growth projection" }
    ],
    scheduleHeaders: ["Studio 1", "Studio 2", "Cardio Zone", "CrossFit Area"],
    scheduleEvents: [
      {
        column: 1,
        time: "9:00 - 10:00 AM",
        title: "Spinning Class",
        subtitle: "Coach Chris - Full",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        textColor: "text-rose-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-2"
      },
      {
        column: 2,
        time: "9:00 - 10:30 AM",
        title: "Vinyasa Yoga",
        subtitle: "Instructor Lisa",
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
        textColor: "text-indigo-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-3"
      },
      {
        column: 4,
        time: "9:30 - 11:30 AM",
        title: "CrossFit WOD",
        subtitle: "Group Alpha",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-3"
      },
      {
        column: 3,
        time: "10:30 - 12:00 PM",
        title: "HIIT Circuit",
        subtitle: "Coach Mark - 15 Pax",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        gridRowStart: "row-start-3",
        gridRowEnd: "row-end-4"
      },
      {
        column: 1,
        time: "11:00 - 12:00 PM",
        title: "Pilates Reformer",
        subtitle: "Coach Anna",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        gridRowStart: "row-start-3",
        gridRowEnd: "row-end-4"
      }
    ]
  }
};

export default function InteractiveDashboard() {
  const [activeTab, setActiveTab] = useState<Industry>("sports");
  const data = DASHBOARDS[activeTab];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.parentElement?.clientWidth || 0;
        const designWidth = 760;
        if (parentWidth < designWidth && parentWidth > 0) {
          setScale(parentWidth / designWidth);
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    const timer = setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Determine sample app branding based on active tab
  const getMockupLogo = (tab: Industry) => {
    switch (tab) {
      case "sports":
        return {
          name: "PaddleYard",
          icon: (
            <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-500/10">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="10" r="5" />
                <path d="M12 15v6M9 21h6" />
              </svg>
            </div>
          )
        };
      case "clinics":
        return {
          name: "CareClinic",
          icon: (
            <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/10">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
          )
        };
      case "restaurants":
        return {
          name: "BistroFlow",
          icon: (
            <div className="w-5 h-5 rounded bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-rose-500/10">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          )
        };
      case "gyms":
        return {
          name: "FitPulse",
          icon: (
            <div className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-500/10">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
          )
        };
    }
  };

  const mockupLogo = getMockupLogo(activeTab);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Industry Tabs Bar */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {(Object.keys(DASHBOARDS) as Industry[]).map((tab) => {
          const isActive = activeTab === tab;
          const label =
            tab === "sports"
              ? "Sports Facilities"
              : tab === "clinics"
              ? "Clinics & Medical"
              : tab === "restaurants"
              ? "Restaurants"
              : "Gyms & Wellness";

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 active:scale-95 cursor-pointer ${
                isActive
                  ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white border-slate-200 hover:border-slate-350 text-slate-650 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-slate-900 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {label}
            </button>
          );
        })}
      </div>

      {/* Main Dashboard Window Wrapper */}
      <div 
        ref={containerRef}
        className="w-full rounded-3xl border border-slate-200/85 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.04)] relative overflow-hidden"
        style={{ height: 520 * scale }}
      >
        <div 
          className="w-[760px] h-[520px] flex select-none text-slate-800 text-left font-sans shrink-0 origin-top-left absolute top-0 left-0"
          style={{
            transform: `scale(${scale})`
          }}
        >
          {/* Sidebar */}
          <aside className="w-44 bg-slate-50 border-r border-slate-100 flex flex-col p-4 shrink-0 justify-between overflow-hidden">
            <div className="flex flex-col gap-5">
              {/* Sidebar Logo */}
              <div className="flex items-center gap-2 px-1 pt-0.5">
                {mockupLogo.icon}
                <span className="font-bold text-[10px] tracking-wider text-slate-950 uppercase">
                  {mockupLogo.name}
                </span>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="flex flex-col gap-0.5">
                {data.sidebarItems.map((item, idx) => {
                  const isFirst = idx === 0;
                  const isSettings = item === "Settings";
                  if (isSettings) return null; // Put Settings at bottom

                  return (
                    <div
                      key={item}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                        isFirst
                          ? "bg-slate-200/50 text-slate-950 font-semibold"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      <div
                        className={`w-1 h-1 rounded-full ${
                          isFirst ? "bg-emerald-500" : "bg-transparent"
                        }`}
                      />
                      {item}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Bottom Settings */}
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                Settings
              </div>
            </div>
          </aside>

          {/* Main Dashboard Area */}
          <main className="flex-1 flex flex-col p-5 overflow-hidden">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between border-b border-slate-150/40 pb-3 mb-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Overview</h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  {data.industryTitle} Platform
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-600">
                <Calendar className="w-3 h-3 text-slate-400" />
                Today, May 22
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3.5 mb-4.5 shrink-0">
              <AnimatePresence mode="wait">
                {data.stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="bg-white border border-slate-150 rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between"
                  >
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase leading-none">
                      {stat.label}
                    </span>
                    <div className="mt-2 flex flex-col">
                      <span className="text-base font-extrabold text-slate-950 tracking-tight leading-tight">
                        {stat.value}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] font-semibold mt-0.5 leading-none">
                        <span
                          className={`flex items-center gap-0.5 ${
                            stat.trendUp ? "text-emerald-600" : "text-rose-500"
                          }`}
                        >
                          {stat.trend.startsWith("-") || !stat.trendUp ? "▼" : "▲"} {stat.trend}
                        </span>
                        <span className="text-slate-400 font-normal text-[8px]">
                          {stat.subtext}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Daily Schedule Section */}
            <div className="flex-1 flex flex-col bg-slate-50/50 border border-slate-150 rounded-xl p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h4 className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">
                  Daily Schedule
                </h4>
                <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Clock className="w-2.5 h-2.5" /> Live Scheduler
                </div>
              </div>

              {/* Schedule Table */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Column Headers */}
                <div className="grid grid-cols-[50px_repeat(4,1fr)] border-b border-slate-150 pb-1.5 mb-1.5 text-center text-[9px] font-bold text-slate-400 tracking-wider uppercase shrink-0">
                  <div className="text-left pl-1">Time</div>
                  {data.scheduleHeaders.map((header) => (
                    <div key={header}>{header}</div>
                  ))}
                </div>

                {/* Scheduler Grid Wrapper */}
                <div className="flex-1 grid grid-cols-[50px_repeat(4,1fr)] grid-rows-[repeat(3,58px)] relative text-left overflow-hidden">
                  {/* Time Grid Lines (Rows) */}
                  <div className="row-start-1 row-end-2 border-b border-dashed border-slate-200/60 text-[10px] font-medium text-slate-400 pt-0.5">
                    9:00 AM
                  </div>
                  <div className="row-start-2 row-end-3 border-b border-dashed border-slate-200/60 text-[10px] font-medium text-slate-400 pt-0.5">
                    10:00 AM
                  </div>
                  <div className="row-start-3 row-end-4 text-[10px] font-medium text-slate-400 pt-0.5">
                    11:00 AM
                  </div>

                  {/* Vertical Column Divider Lines */}
                  <div className="col-start-2 col-end-3 row-start-1 row-end-4 border-r border-slate-150/40" />
                  <div className="col-start-3 col-end-4 row-start-1 row-end-4 border-r border-slate-150/40" />
                  <div className="col-start-4 col-end-5 row-start-1 row-end-4 border-r border-slate-150/40" />
                  <div className="col-start-5 col-end-6 row-start-1 row-end-4" />

                  {/* Booking Event Badges */}
                  <AnimatePresence mode="popLayout">
                    {data.scheduleEvents.map((evt) => (
                      <motion.div
                        key={`${evt.title}-${evt.column}`}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute inset-x-1 top-1 bottom-1 border rounded-lg p-2 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col justify-between overflow-hidden ${
                          evt.bgColor
                        } ${evt.borderColor} ${evt.textColor}`}
                        style={{
                          gridColumnStart: evt.column + 1,
                          gridColumnEnd: evt.column + 2,
                          gridRowStart: evt.gridRowStart.split("-")[2],
                          gridRowEnd: evt.gridRowEnd.split("-")[2],
                        }}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-bold tracking-tight leading-tight">
                            {evt.title}
                          </span>
                          {evt.subtitle && (
                            <span className="text-[8px] opacity-80 font-medium leading-none">
                              {evt.subtitle}
                            </span>
                          )}
                        </div>
                        <span className="text-[8px] font-semibold opacity-75 tracking-wide">
                          {evt.time}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Explanatory subtitle */}
      <div className="flex items-center justify-between text-xs text-slate-500 bg-emerald-50/40 border border-emerald-100 rounded-xl px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>
            <strong>Interactive Preview:</strong> Use the tabs above to toggle between template industries.
          </span>
        </div>
        <a href="#capabilities" className="hidden sm:flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 font-bold">
          Explore solutions <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
