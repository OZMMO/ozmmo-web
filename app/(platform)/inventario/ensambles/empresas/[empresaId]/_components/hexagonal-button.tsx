"use client"

import type React from "react"

import type { ReactNode } from "react"

export function HexagonalButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      className="relative inline-flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg"></div>
      <span className="relative z-10 px-6 py-2 font-medium text-white">{children}</span>
    </button>
  )
}