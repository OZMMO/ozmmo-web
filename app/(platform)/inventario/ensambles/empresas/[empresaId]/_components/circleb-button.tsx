'use client'

import { ReactNode } from "react"

export function CircleButton({
  children,
  onClick,
  color = "purple",
}: {
  children: ReactNode
  onClick?: (e: React.MouseEvent) => void
  color?: "cyan" | "amber" | "purple"
}) {
  const colorClasses = {
    purple: "from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700",
    cyan: "from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700",
    amber: "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
  }

  return (
    <button
      className={`text-xs font-medium text-white px-3 py-1 rounded-full bg-gradient-to-r ${colorClasses[color]} hover:scale-105 active:scale-95 transition-transform`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
