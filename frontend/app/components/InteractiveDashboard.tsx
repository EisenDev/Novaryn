"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Settings,
  ChevronRight,
  Sparkles,
  Activity,
  Heart,
  Utensils,
  Bed,
  Box,
  TrendingUp,
  Clock3,
  Layers
} from "lucide-react";

type Industry = "sports" | "clinics" | "restaurants" | "hotels" | "warehouse";

interface DashboardData {
  brandName: string;
  sidebarLogoLetter: string;
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
    gridRowStart: string;
    gridRowEnd: string;
  }[];
}

const DASHBOARDS: Record<Industry, DashboardData> = {
  sports: {
    brandName: "PICKLEYARD",
    sidebarLogoLetter: "P",
    industryTitle: "Sports Facility Management Platform",
    sidebarItems: [
      "Overview",
      "Bookings",
      "Courts",
      "Customers",
      "Memberships",
      "Payments",
      "Tournaments",
      "Reports"
    ],
    stats: [
      { label: "TOTAL REVENUE", value: "₱24,580", trend: "+ 12% vs yesterday", trendUp: true, subtext: "" },
      { label: "BOOKINGS", value: "32", trend: "+ 8.2% vs yesterday", trendUp: true, subtext: "" },
      { label: "COURTS OCCUPIED", value: "7 / 10", trend: "70% occupancy rate", trendUp: true, subtext: "" },
      { label: "ACTIVE MEMBERS", value: "156", trend: "+ 15% vs last month", trendUp: true, subtext: "" }
    ],
    scheduleHeaders: ["COURT 1", "COURT 2", "COURT 3", "COURT 4"],
    scheduleEvents: [
      {
        column: 1,
        time: "8:00 - 10:00 AM",
        title: "Open Play",
        subtitle: "8:00 - 10:00 AM",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-3"
      },
      {
        column: 2,
        time: "9:00 - 11:00 AM",
        title: "Private Booking",
        subtitle: "9:00 - 11:00 AM",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-250/70",
        textColor: "text-blue-700",
        gridRowStart: "row-start-2",
        gridRowEnd: "row-end-4"
      },
      {
        column: 3,
        time: "1:00 - 3:00 PM",
        title: "Tournament Practice",
        subtitle: "1:00 - 3:00 PM",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-250/70",
        textColor: "text-amber-700",
        gridRowStart: "row-start-4",
        gridRowEnd: "row-end-6"
      },
      {
        column: 1,
        time: "4:00 - 6:00 PM",
        title: "Advanced Training",
        subtitle: "4:00 - 6:00 PM",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        gridRowStart: "row-start-5",
        gridRowEnd: "row-end-7"
      },
      {
        column: 2,
        time: "6:00 - 8:00 PM",
        title: "Coaching Session",
        subtitle: "6:00 - 8:00 PM",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-250/70",
        textColor: "text-blue-700",
        gridRowStart: "row-start-6",
        gridRowEnd: "row-end-8"
      },
      {
        column: 4,
        time: "6:00 - 8:00 PM",
        title: "League Match",
        subtitle: "6:00 - 8:00 PM",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        textColor: "text-rose-700",
        gridRowStart: "row-start-6",
        gridRowEnd: "row-end-8"
      }
    ]
  },
  clinics: {
    brandName: "ACTIVECARE",
    sidebarLogoLetter: "A",
    industryTitle: "Clinic Appointment & Patient Portal",
    sidebarItems: [
      "Overview",
      "Appointments",
      "Patients",
      "Doctors",
      "Queue Status",
      "Billing List",
      "Prescriptions",
      "Reports"
    ],
    stats: [
      { label: "TOTAL CONSULTS", value: "48 Patients", trend: "+ 15.3% vs yesterday", trendUp: true, subtext: "" },
      { label: "AVG WAIT TIME", value: "12 mins", trend: "- 18% waiting reduction", trendUp: true, subtext: "" },
      { label: "ROOMS OCCUPIED", value: "6 / 8", trend: "75% utilization rate", trendUp: true, subtext: "" },
      { label: "ACTIVE DOCTORS", value: "8 / 12", trend: "On-duty roster", trendUp: true, subtext: "" }
    ],
    scheduleHeaders: ["ROOM 101", "ROOM 102", "ROOM 103", "LAB A"],
    scheduleEvents: [
      {
        column: 1,
        time: "8:00 - 10:00 AM",
        title: "General Checkup",
        subtitle: "8:00 - 10:00 AM",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-255",
        textColor: "text-blue-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-3"
      },
      {
        column: 2,
        time: "9:00 - 11:00 AM",
        title: "Pediatric Consul.",
        subtitle: "9:00 - 11:00 AM",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        gridRowStart: "row-start-2",
        gridRowEnd: "row-end-4"
      },
      {
        column: 4,
        time: "10:00 - 12:00 PM",
        title: "Blood Testing",
        subtitle: "10:00 - 12:00 PM",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        gridRowStart: "row-start-3",
        gridRowEnd: "row-end-5"
      },
      {
        column: 3,
        time: "1:00 - 3:00 PM",
        title: "Dental Cleaning",
        subtitle: "1:00 - 3:00 PM",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        gridRowStart: "row-start-4",
        gridRowEnd: "row-end-6"
      },
      {
        column: 1,
        time: "4:00 - 6:00 PM",
        title: "Therapy Session",
        subtitle: "4:00 - 6:00 PM",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-255",
        textColor: "text-blue-700",
        gridRowStart: "row-start-5",
        gridRowEnd: "row-end-7"
      },
      {
        column: 2,
        time: "6:00 - 8:00 PM",
        title: "Emergency Care",
        subtitle: "6:00 - 8:00 PM",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        textColor: "text-rose-700",
        gridRowStart: "row-start-6",
        gridRowEnd: "row-end-8"
      }
    ]
  },
  restaurants: {
    brandName: "GRILLHOUSE",
    sidebarLogoLetter: "G",
    industryTitle: "Restaurant Floor & POS Platform",
    sidebarItems: [
      "Dashboard",
      "Floor Map",
      "Active Orders",
      "Menu Manager",
      "Reservations",
      "Inventory Status",
      "Staff Roster",
      "Analytics"
    ],
    stats: [
      { label: "GUESTS COVERS", value: "142 Guests", trend: "+ 12% vs yesterday", trendUp: true, subtext: "" },
      { label: "ACTIVE ORDERS", value: "18 Tables", trend: "Kitchen Hot Status", trendUp: true, subtext: "" },
      { label: "TABLES OCCUPIED", value: "16 / 20", trend: "80% capacity load", trendUp: true, subtext: "" },
      { label: "DAILY REVENUE", value: "₱68,430", trend: "+ 24.1% vs last week", trendUp: true, subtext: "" }
    ],
    scheduleHeaders: ["MAIN HALL", "PATIO", "VIP ROOM A", "VIP ROOM B"],
    scheduleEvents: [
      {
        column: 1,
        time: "8:00 - 10:00 AM",
        title: "Breakfast Buffet",
        subtitle: "8:00 - 10:00 AM",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-3"
      },
      {
        column: 2,
        time: "9:00 - 11:00 AM",
        title: "Brunch Booking",
        subtitle: "9:00 - 11:00 AM",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        gridRowStart: "row-start-2",
        gridRowEnd: "row-end-4"
      },
      {
        column: 3,
        time: "12:00 - 2:00 PM",
        title: "Corporate Lunch",
        subtitle: "12:00 - 2:00 PM",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        gridRowStart: "row-start-3",
        gridRowEnd: "row-end-5"
      },
      {
        column: 1,
        time: "3:00 - 5:00 PM",
        title: "Prep & Clean Time",
        subtitle: "3:00 - 5:00 PM",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        textColor: "text-slate-700",
        gridRowStart: "row-start-4",
        gridRowEnd: "row-end-6"
      },
      {
        column: 4,
        time: "5:00 - 7:00 PM",
        title: "Private Dinner",
        subtitle: "5:00 - 7:00 PM",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        gridRowStart: "row-start-5",
        gridRowEnd: "row-end-7"
      },
      {
        column: 2,
        time: "6:00 - 8:00 PM",
        title: "Live Band Night",
        subtitle: "6:00 - 8:00 PM",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        gridRowStart: "row-start-6",
        gridRowEnd: "row-end-8"
      }
    ]
  },
  hotels: {
    brandName: "STORVYN HOTEL",
    sidebarLogoLetter: "H",
    industryTitle: "Property Management & Booking Platform",
    sidebarItems: [
      "Overview",
      "Rooms List",
      "Bookings",
      "Check-in / out",
      "Housekeeping",
      "Invoices List",
      "Guests List",
      "Reports"
    ],
    stats: [
      { label: "OCCUPANCY RATE", value: "85%", trend: "Optimal load level", trendUp: true, subtext: "" },
      { label: "CHECK-INS TODAY", value: "14 Rooms", trend: "+ 10% vs yesterday", trendUp: true, subtext: "" },
      { label: "HOUSEKEEPING ALERTS", value: "2 Rooms", trend: "Clean scheduled", trendUp: false, subtext: "" },
      { label: "NET INCOME", value: "₱115,200", trend: "+ 18% vs last week", trendUp: true, subtext: "" }
    ],
    scheduleHeaders: ["DELUXE 201", "SUITE 305", "STANDARD 102", "VILLA 01"],
    scheduleEvents: [
      {
        column: 1,
        time: "8:00 - 11:00 AM",
        title: "Guest Stay",
        subtitle: "Check-out 11AM",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-3"
      },
      {
        column: 3,
        time: "9:00 - 12:00 PM",
        title: "Extended Stay",
        subtitle: "9:00 - 12:00 PM",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        gridRowStart: "row-start-2",
        gridRowEnd: "row-end-4"
      },
      {
        column: 2,
        time: "12:00 - 2:00 PM",
        title: "VIP Arrival Prep",
        subtitle: "12:00 - 2:00 PM",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        gridRowStart: "row-start-3",
        gridRowEnd: "row-end-5"
      },
      {
        column: 4,
        time: "2:00 - 5:00 PM",
        title: "Family Check-in",
        subtitle: "2:00 - 5:00 PM",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        gridRowStart: "row-start-4",
        gridRowEnd: "row-end-6"
      },
      {
        column: 1,
        time: "3:00 - 6:00 PM",
        title: "New Guest In",
        subtitle: "3:00 - 6:00 PM",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        gridRowStart: "row-start-5",
        gridRowEnd: "row-end-7"
      },
      {
        column: 3,
        time: "6:00 - 8:00 PM",
        title: "Express Check-in",
        subtitle: "6:00 - 8:00 PM",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        gridRowStart: "row-start-6",
        gridRowEnd: "row-end-8"
      }
    ]
  },
  warehouse: {
    brandName: "STORVYN WAREHOUSE",
    sidebarLogoLetter: "W",
    industryTitle: "Supply Chain & Stock Management Platform",
    sidebarItems: [
      "Overview",
      "Inventory List",
      "Stock Inbound",
      "Stock Outbound",
      "Suppliers",
      "Branches List",
      "Activity Logs",
      "Reports"
    ],
    stats: [
      { label: "TOTAL SKU COUNT", value: "4,250 Items", trend: "+ 12% vs last month", trendUp: true, subtext: "" },
      { label: "LOW STOCK ALERTS", value: "12 Items", trend: "Alert active", trendUp: false, subtext: "" },
      { label: "SHIPMENTS TODAY", value: "38 Orders", trend: "+ 8.2% vs yesterday", trendUp: true, subtext: "" },
      { label: "TOTAL STOCK VALUE", value: "₱2.4M", trend: "Valuation snapshot", trendUp: true, subtext: "" }
    ],
    scheduleHeaders: ["DOCK A", "DOCK B", "PACKING ZONE", "QUALITY CHECK"],
    scheduleEvents: [
      {
        column: 1,
        time: "8:00 - 10:00 AM",
        title: "Supplier Inbound",
        subtitle: "8:00 - 10:00 AM",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        gridRowStart: "row-start-1",
        gridRowEnd: "row-end-3"
      },
      {
        column: 2,
        time: "9:00 - 11:00 AM",
        title: "Outbound Dispatch",
        subtitle: "9:00 - 11:00 AM",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        gridRowStart: "row-start-2",
        gridRowEnd: "row-end-4"
      },
      {
        column: 3,
        time: "11:00 - 1:00 PM",
        title: "Bulk Packing",
        subtitle: "11:00 - 1:00 PM",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        gridRowStart: "row-start-3",
        gridRowEnd: "row-end-5"
      },
      {
        column: 4,
        time: "1:00 - 3:00 PM",
        title: "Electronics QC",
        subtitle: "1:00 - 3:00 PM",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        gridRowStart: "row-start-4",
        gridRowEnd: "row-end-6"
      },
      {
        column: 1,
        time: "4:00 - 6:00 PM",
        title: "Express Delivery",
        subtitle: "4:00 - 6:00 PM",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        gridRowStart: "row-start-5",
        gridRowEnd: "row-end-7"
      },
      {
        column: 2,
        time: "6:00 - 8:00 PM",
        title: "Night Shift Load",
        subtitle: "6:00 - 8:00 PM",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        textColor: "text-slate-700",
        gridRowStart: "row-start-6",
        gridRowEnd: "row-end-8"
      }
    ]
  }
};

export default function InteractiveDashboard() {
  const [activeTab, setActiveTab] = useState<Industry>("sports");
  const data = DASHBOARDS[activeTab];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMobileMode, setIsMobileMode] = useState(false);

  // Check resize for scaling and mobile layout detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsMobileMode(true);
        setScale(1);
      } else {
        setIsMobileMode(false);
        if (containerRef.current) {
          const parentWidth = containerRef.current.parentElement?.clientWidth || 0;
          const designWidth = 760;
          if (parentWidth < designWidth && parentWidth > 0) {
            setScale(parentWidth / designWidth);
          } else {
            setScale(1);
          }
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

  const getTabIcon = (tab: Industry) => {
    switch (tab) {
      case "sports":
        return <Activity className="w-3.5 h-3.5" />;
      case "clinics":
        return <Heart className="w-3.5 h-3.5" />;
      case "restaurants":
        return <Utensils className="w-3.5 h-3.5" />;
      case "hotels":
        return <Bed className="w-3.5 h-3.5" />;
      case "warehouse":
        return <Box className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 select-none relative">
      {/* Hand-drawn styled arrow "Try Live Demo" above tabs (hidden on small screen) */}
      <div className="hidden lg:block absolute -top-11 right-6 z-10">
        <div className="flex flex-col items-center gap-1">
          <span className="font-serif italic text-xs text-emerald-600 font-bold tracking-wide transform rotate-3 pr-6">
            Try Live Demo
          </span>
          <svg className="w-14 h-8 text-emerald-600 transform -rotate-12 translate-x-3" fill="none" viewBox="0 0 56 32">
            <path
              d="M1 25C15 20 28 8 50 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M44 9L51 3L53 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Industry Tabs Bar (Horizontal scrolling on mobile) */}
      <div className="flex overflow-x-auto scrollbar-none gap-2 pb-1 mx-[-24px] px-6 sm:mx-0 sm:px-0 sm:flex-wrap justify-start sm:justify-start">
        {(Object.keys(DASHBOARDS) as Industry[]).map((tab) => {
          const isActive = activeTab === tab;
          const label =
            tab === "sports"
              ? "Sports Facilities"
              : tab === "clinics"
              ? "Clinics"
              : tab === "restaurants"
              ? "Restaurants"
              : tab === "hotels"
              ? "Hotels"
              : "Warehouse";

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex items-center gap-1.5 shrink-0 px-4 py-2 text-xs font-bold rounded-full border transition-all duration-300 active:scale-95 cursor-pointer ${
                isActive
                  ? "bg-white border-emerald-500 text-emerald-600 shadow-md shadow-emerald-500/5"
                  : "bg-white border-slate-205 hover:border-slate-300 text-slate-500 hover:text-slate-800"
              }`}
            >
              {getTabIcon(tab)}
              {label}
            </button>
          );
        })}
      </div>

      {/* Main Preview Screen */}
      <div
        ref={containerRef}
        className="w-full rounded-3xl border border-slate-200/85 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.03)] relative overflow-hidden"
        style={{ height: isMobileMode ? "480px" : `${520 * scale}px` }}
      >
        {isMobileMode ? (
          /* MOBILE MODE - SLEEK APP INTERACTIVE PREVIEW */
          <div className="w-full h-full flex flex-col bg-slate-50 text-slate-800 font-sans p-4 justify-between overflow-hidden">
            {/* Phone Top Notch Status bar */}
            <div className="flex justify-between items-center px-2 text-[10px] font-bold text-slate-400 shrink-0 select-none">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <div className="w-4 h-2 border border-slate-350 rounded-sm p-0.5 flex items-center"><div className="w-full h-full bg-slate-400 rounded-2xs" /></div>
              </div>
            </div>

            {/* Mock Mobile App header */}
            <div className="flex items-center justify-between mt-3 px-1 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                  {data.sidebarLogoLetter}
                </span>
                <span className="font-black text-xs tracking-tight text-slate-900">{data.brandName}</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border-2 border-white shadow-sm" />
            </div>

            {/* Statistics Carousel for Mobile */}
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none py-3 px-0.5 shrink-0">
              {data.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-150 rounded-xl p-3 min-w-[130px] flex flex-col justify-between shadow-sm shrink-0"
                >
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                    {stat.label}
                  </span>
                  <div className="mt-2 flex flex-col">
                    <span className="text-xs font-black text-slate-950 tracking-tight leading-tight">
                      {stat.value}
                    </span>
                    <span className="text-[8px] font-bold text-emerald-600 mt-0.5 leading-none">
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Schedule List View */}
            <div className="flex-1 bg-white border border-slate-150 rounded-2xl p-3.5 flex flex-col overflow-hidden min-h-0">
              <div className="flex justify-between items-center mb-2.5 shrink-0">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Today&apos;s Schedule</span>
                <span className="text-[8px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                  <Clock3 className="w-2.5 h-2.5" /> LIVE
                </span>
              </div>
              
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-0.5">
                {data.scheduleEvents.slice(0, 4).map((evt, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 border rounded-xl shadow-2xs ${evt.bgColor} ${evt.borderColor} ${evt.textColor}`}
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold leading-tight">{evt.title}</span>
                      <span className="text-[8px] opacity-75 mt-0.5 font-medium">{evt.time}</span>
                    </div>
                    <span className="text-[8.5px] font-bold uppercase tracking-wider bg-white/50 px-1.5 py-0.5 rounded border border-white/20">
                      View
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone Bottom Nav Bar */}
            <div className="flex items-center justify-around bg-white border-t border-slate-150 py-2.5 mt-3 rounded-t-xl shrink-0 select-none">
              <div className="flex flex-col items-center gap-0.5 text-emerald-600">
                <Sparkles className="w-4 h-4" />
                <span className="text-[8px] font-bold">Home</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                <Calendar className="w-4 h-4" />
                <span className="text-[8px] font-bold">Bookings</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                <Layers className="w-4 h-4" />
                <span className="text-[8px] font-bold">More</span>
              </div>
            </div>
          </div>
        ) : (
          /* DESKTOP MODE - FULL WEB MOCKUP ENGINE */
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
                  <span className="w-5.5 h-5.5 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-extrabold shadow-sm shrink-0">
                    {data.sidebarLogoLetter}
                  </span>
                  <span className="font-extrabold text-[10px] tracking-wider text-slate-950 uppercase shrink-0">
                    {data.brandName}
                  </span>
                </div>

                {/* Sidebar Menu Items */}
                <nav className="flex flex-col gap-0.5">
                  {data.sidebarItems.map((item, idx) => {
                    const isFirst = idx === 0;
                    return (
                      <div
                        key={item}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                          isFirst
                            ? "bg-slate-200/50 text-slate-950 font-black"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-850"
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
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-850 transition-colors cursor-pointer">
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
                  <h3 className="text-base font-black text-slate-900 leading-tight">Overview</h3>
                  <p className="text-[10px] text-slate-400 font-bold">
                    {data.industryTitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-650">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Today, May 22
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3 mb-4.5 shrink-0">
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
                      <span className="text-[8px] font-bold text-slate-400 tracking-wider uppercase leading-none">
                        {stat.label}
                      </span>
                      <div className="mt-2.5 flex flex-col">
                        <span className="text-base font-black text-slate-950 tracking-tight leading-tight">
                          {stat.value}
                        </span>
                        <div className="flex items-center gap-1 text-[9px] font-semibold mt-1 leading-none">
                          <span
                            className={`flex items-center gap-0.5 ${
                              stat.trendUp ? "text-emerald-600" : "text-rose-500"
                            }`}
                          >
                            {stat.trend.startsWith("-") || !stat.trendUp ? "▼" : "▲"} {stat.trend}
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
                  <h4 className="text-[9px] font-bold text-slate-800 tracking-wider uppercase">
                    Today&apos;s Schedule
                  </h4>
                  <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Clock className="w-2.5 h-2.5" /> Live Scheduler
                  </div>
                </div>

                {/* Schedule Table */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {/* Column Headers */}
                  <div className="grid grid-cols-[55px_repeat(4,1fr)] border-b border-slate-150 pb-1.5 mb-1.5 text-center text-[8px] font-bold text-slate-400 tracking-wider uppercase shrink-0">
                    <div className="text-left pl-1">Time</div>
                    {data.scheduleHeaders.map((header) => (
                      <div key={header}>{header}</div>
                    ))}
                  </div>

                  {/* Scheduler Grid Wrapper */}
                  <div className="flex-1 grid grid-cols-[55px_repeat(4,1fr)] grid-rows-[repeat(7,24px)] relative text-left overflow-y-auto pr-0.5">
                    {/* Time Grid Lines (Rows) */}
                    <div className="row-start-1 text-[9px] font-bold text-slate-400">8:00 AM</div>
                    <div className="row-start-2 text-[9px] font-bold text-slate-400">10:00 AM</div>
                    <div className="row-start-3 text-[9px] font-bold text-slate-400">12:00 PM</div>
                    <div className="row-start-4 text-[9px] font-bold text-slate-400">2:00 PM</div>
                    <div className="row-start-5 text-[9px] font-bold text-slate-400">4:00 PM</div>
                    <div className="row-start-6 text-[9px] font-bold text-slate-400">6:00 PM</div>
                    <div className="row-start-7 text-[9px] font-bold text-slate-400">8:00 PM</div>

                    {/* Vertical Column Divider Lines */}
                    <div className="col-start-2 col-end-3 row-start-1 row-end-8 border-r border-slate-150/40" />
                    <div className="col-start-3 col-end-4 row-start-1 row-end-8 border-r border-slate-150/40" />
                    <div className="col-start-4 col-end-5 row-start-1 row-end-8 border-r border-slate-150/40" />
                    <div className="col-start-5 col-end-6 row-start-1 row-end-8 border-r border-slate-150/40" />

                    {/* Horizontal Divider lines */}
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-x-0 border-b border-slate-100/50 pointer-events-none"
                        style={{ top: `${(i + 1) * 24}px` }}
                      />
                    ))}

                    {/* Booking Event Badges */}
                    <AnimatePresence mode="popLayout">
                      {data.scheduleEvents.map((evt, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute inset-x-1 top-0.5 bottom-0.5 border rounded-md p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex flex-col justify-between overflow-hidden ${
                            evt.bgColor
                          } ${evt.borderColor} ${evt.textColor}`}
                          style={{
                            gridColumnStart: evt.column + 1,
                            gridColumnEnd: evt.column + 2,
                            gridRowStart: evt.gridRowStart.split("-")[2],
                            gridRowEnd: evt.gridRowEnd.split("-")[2],
                          }}
                        >
                          <div className="flex flex-col text-left leading-none">
                            <span className="text-[9px] font-bold tracking-tight">
                              {evt.title}
                            </span>
                            {evt.subtitle && (
                              <span className="text-[7.5px] opacity-75 font-semibold mt-0.5">
                                {evt.subtitle}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>

      {/* Bottom info banner matching the mockup */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 bg-emerald-50/40 border border-emerald-100 rounded-xl px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-left leading-relaxed">
            <strong>Interactive Demo:</strong> Explore the platform for different industries using the tabs above.
          </span>
        </div>
        <a href="#capabilities" className="flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 font-bold shrink-0 mt-1 sm:mt-0">
          Explore all solutions <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
