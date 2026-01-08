import { useEffect, useState, useCallback } from "react"
import { List } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

/**
 * Extracts h2 and h3 headings from markdown content
 * Returns an array of TocItem objects with id slugs and text
 */
export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3
    const text = match[2].trim()
    const id = slugify(text)

    headings.push({ id, text, level })
  }

  return headings
}

/**
 * Convert heading text to a URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
}

interface TableOfContentsProps {
  content: string
  className?: string
  /** Minimum number of headings required to show TOC */
  minHeadings?: number
  /** Title for the TOC section */
  title?: string
}

export function TableOfContents({
  content,
  className,
  minHeadings = 3,
  title = "Table of Contents",
}: TableOfContentsProps) {
  const headings = extractHeadings(content)
  const [activeId, setActiveId] = useState<string>("")

  // Track scroll position and update active heading
  useEffect(() => {
    if (headings.length < minHeadings) return

    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[]

      if (headingElements.length === 0) return

      // Find the heading that's currently in view
      // Use a threshold of 100px from the top of the viewport
      const scrollPosition = window.scrollY + 100

      let currentActiveId = headings[0]?.id || ""

      for (const element of headingElements) {
        if (element.offsetTop <= scrollPosition) {
          currentActiveId = element.id
        } else {
          break
        }
      }

      setActiveId(currentActiveId)
    }

    // Initial check
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings, minHeadings])

  // Smooth scroll handler
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault()
      const element = document.getElementById(id)
      if (element) {
        const offset = 80 // Account for sticky header
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.scrollY - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })

        // Update URL hash without jumping
        window.history.pushState(null, "", `#${id}`)
        setActiveId(id)
      }
    },
    []
  )

  // Don't render if not enough headings
  if (headings.length < minHeadings) {
    return null
  }

  return (
    <nav
      aria-label="Table of contents"
      className={cn("", className)}
    >
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <ul className="space-y-2 text-sm">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id
          return (
            <li
              key={`${heading.id}-${index}`}
              className={cn(heading.level === 3 && "ml-4")}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={cn(
                  "block transition-colors duration-200",
                  "hover:underline underline-offset-2",
                  heading.level === 2 && "font-medium",
                  heading.level === 3 && "text-xs",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "location" : undefined}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
