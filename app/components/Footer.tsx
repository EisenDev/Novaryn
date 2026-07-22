import React from "react";
import { Mail } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  email: string;
}

// Custom Feather SVGs for brand icons
const FacebookIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Footer({ email }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 mb-16">
          {/* Logo & Description */}
          <div className="lg:col-span-2 flex flex-col gap-5 text-left md:max-w-xs">
            <div className="flex items-center gap-2.5">
              <img 
                src="/novaryn-logo.png" 
                alt="Novaryn Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-xl tracking-tight text-slate-900">
                NOVARYN
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Novaryn builds modern software that helps businesses operate smarter, serve better, and grow faster. We design and code custom platforms tailored to your business operations.
            </p>
          </div>

          {/* Solutions Column */}
          <div className="flex flex-col gap-4 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Solutions
            </span>
            <ul className="flex flex-col gap-3 text-sm font-medium text-slate-550">
              <li>
                <Link href="/projects" className="hover:text-emerald-600 transition-colors">
                  For Sports Facilities
                </Link>
              </li>
              <li>
                <Link href="/#capabilities" className="hover:text-emerald-600 transition-colors">
                  For Clinics & Health
                </Link>
              </li>
              <li>
                <Link href="/#capabilities" className="hover:text-emerald-600 transition-colors">
                  For Restaurants
                </Link>
              </li>
              <li>
                <Link href="/#capabilities" className="hover:text-emerald-600 transition-colors">
                  Custom Platform Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-4 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Company
            </span>
            <ul className="flex flex-col gap-3 text-sm font-medium text-slate-550">
              <li>
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-emerald-600 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Stay Connected Column */}
          <div className="flex flex-col gap-4 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Stay Connected
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-350 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors bg-slate-50"
                aria-label="Facebook link"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-350 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors bg-slate-50"
                aria-label="LinkedIn link"
              >
                <LinkedinIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-350 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors bg-slate-50"
                aria-label="Instagram link"
              >
                <InstagramIcon />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-350 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors bg-slate-50"
                aria-label="Email link"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based in the Philippines.<br />
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-slate-100 mb-8" />

        {/* Bottom copyright info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>
            © {new Date().getFullYear()} Novaryn Technologies. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
