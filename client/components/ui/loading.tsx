"use client"

export function LoadingSpinner({ fullscreen = false, size = "default" }: { fullscreen?: boolean; size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    default: "w-12 h-12 border-3",
    large: "w-16 h-16 border-4"
  }

  const spinner = (
    <div className={`${sizeClasses[size]} border-t-accent border-r-accent border-b-transparent border-l-transparent rounded-full animate-spin`} />
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl card-shadow-lg">
          {spinner}
        </div>
      </div>
    )
  }

  return <div className="flex justify-center p-4">{spinner}</div>
}
