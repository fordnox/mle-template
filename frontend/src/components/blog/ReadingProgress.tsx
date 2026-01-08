import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ReadingProgressProps {
  className?: string
}

/**
 * A reading progress indicator that shows how far the user has scrolled through the page.
 * Displays as a thin bar at the top of the viewport that fills as the user scrolls.
 */
export function ReadingProgress({ className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, scrollProgress)))
    }

    calculateProgress()
    window.addEventListener("scroll", calculateProgress, { passive: true })
    window.addEventListener("resize", calculateProgress, { passive: true })

    return () => {
      window.removeEventListener("scroll", calculateProgress)
      window.removeEventListener("resize", calculateProgress)
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-1 bg-muted",
        className
      )}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-primary transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
