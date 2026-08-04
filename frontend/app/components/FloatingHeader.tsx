"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Check, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FloatingHeaderProps {
  email: string;
  onCopySuccess: () => void;
  onOpenConsultation: () => void;
}

export default function FloatingHeader({ email, onCopySuccess, onOpenConsultation }: FloatingHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll section detection on landing page
      if (pathname === "/") {
        const sections = ["capabilities", "process", "pricing", "faq"];
        let currentSection = "";

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Trigger when the top of the section is near the upper middle of the viewport
            if (rect.top <= 160 && rect.bottom >= 160) {
              currentSection = sectionId;
              break;
            }
          }
        }
        setActiveSection(currentSection);
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const getLinkClass = (isActive: boolean) => 
    `text-sm font-semibold transition-colors cursor-pointer ${
      isActive ? "text-emerald-600 font-bold" : "text-slate-650 hover:text-slate-950"
    }`;

  const getMobileLinkClass = (isActive: boolean) => 
    `text-base font-bold transition-colors py-1 ${
      isActive ? "text-emerald-600" : "text-slate-850 hover:text-emerald-600"
    }`;

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-50 transition-all duration-350 rounded-2xl ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-lg border border-slate-200/60 py-3"
            : "bg-white/40 backdrop-blur-sm border border-slate-200/30 py-4"
        }`}
      >
        <div className="px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img 
              src="/novaryn-logo.png" 
              alt="Novaryn Logo" 
              className="w-7 h-7 object-contain transition-transform group-hover:scale-105 duration-300"
            />
            <span className="font-sans font-bold text-lg tracking-tight text-slate-900">
              NOVARYN
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group/menu">
              <button className="flex items-center gap-1 text-sm font-medium text-slate-650 hover:text-slate-950 transition-colors py-1 cursor-pointer">
                Solutions <ChevronDown className="w-4 h-4 text-slate-400 group-hover/menu:rotate-180 transition-transform duration-200" />
              </button>
              {/* Dropdown Menu - Added before pseudo-element hover bridge to eliminate gap auto-close issue */}
              <div className="absolute top-full -left-4 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto transition-all duration-200 p-2 z-50 before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4">
                <span className="block px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vertical Case Study</span>
                <Link href="/projects" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-lg transition-colors font-medium">
                  PaddleYard Platform
                </Link>
                <div className="h-[1px] bg-slate-100 my-1"></div>
                <span className="block px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Services</span>
                <Link href="/#capabilities" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-lg transition-colors">
                  Explore Custom Builds
                </Link>
              </div>
            </div>

            <Link href="/projects" className={getLinkClass(pathname === "/projects")}>
              Projects
            </Link>

            <Link href="/#capabilities" className={getLinkClass(pathname === "/" && activeSection === "capabilities")}>
              Capabilities
            </Link>
            
            <Link href="/#process" className={getLinkClass(pathname === "/" && activeSection === "process")}>
              Process
            </Link>

            <Link href="/#pricing" className={getLinkClass(pathname === "/" && activeSection === "pricing")}>
              Pricing
            </Link>

            <Link href="/#faq" className={getLinkClass(pathname === "/" && activeSection === "faq")}>
              FAQ
            </Link>
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-4.5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-98 cursor-pointer"
            >
              Book a Consultation
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-650 hover:text-slate-950 transition-colors rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute top-24 left-4 right-4 bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-6 transition-all duration-300 ${
            isOpen ? "translate-y-0 scale-100 opacity-100" : "-translate-y-4 scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col gap-4 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solutions</span>
            <div className="grid grid-cols-2 gap-2 pl-2">
              <Link
                href="/projects"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-slate-700 hover:text-emerald-600 py-1.5"
              >
                PaddleYard
              </Link>
              <Link
                href="/#capabilities"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-slate-700 hover:text-emerald-600 py-1.5"
              >
                All Builds
              </Link>
            </div>

            <div className="h-[1px] bg-slate-100 my-1"></div>

            <Link
              href="/projects"
              onClick={() => setIsOpen(false)}
              className={getMobileLinkClass(pathname === "/projects")}
            >
              Projects Page
            </Link>
            <Link
              href="/#capabilities"
              onClick={() => setIsOpen(false)}
              className={getMobileLinkClass(pathname === "/" && activeSection === "capabilities")}
            >
              Capabilities
            </Link>
            <Link
              href="/#process"
              onClick={() => setIsOpen(false)}
              className={getMobileLinkClass(pathname === "/" && activeSection === "process")}
            >
              Our Process
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setIsOpen(false)}
              className={getMobileLinkClass(pathname === "/" && activeSection === "pricing")}
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              onClick={() => setIsOpen(false)}
              className={getMobileLinkClass(pathname === "/" && activeSection === "faq")}
            >
              FAQ
            </Link>
          </nav>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenConsultation();
              }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/10 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              Book a Consultation
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
