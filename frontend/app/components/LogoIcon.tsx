import React from "react";

interface LogoIconProps {
  className?: string;
  size?: number;
}

export default function LogoIcon({ className = "", size = 32 }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform hover:scale-105 duration-300`}
    >
      {/* 
        Geometric "N" mark consisting of three overlapping slanted ribbons
        rendered in Novaryn's emerald primary theme colors.
      */}
      <path
        d="M6 25L14 7H19L11 25H6Z"
        fill="#10B981"
      />
      <path
        d="M13 25L21 7H26L18 25H13Z"
        fill="#059669"
      />
      <path
        d="M11 25L19 7H21L13 25H11Z"
        fill="#047857"
        opacity="0.3"
      />
    </svg>
  );
}
