"use client";

import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary:
      "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
    ghost:
      "text-gray-600 hover:bg-gray-100",
  };

  return (
    <button
      {...props}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
