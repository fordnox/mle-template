import { useState, useEffect, useRef, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, X, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { searchPosts, type BlogPost } from "@/content/blog"
import { cn } from "@/lib/utils"

interface BlogSearchProps {
  className?: string
  /** Placeholder text for the search input */
  placeholder?: string
  /** Maximum number of results to show in dropdown */
  maxResults?: number
}

export function BlogSearch({
  className,
  placeholder = "Search articles...",
  maxResults = 5,
}: BlogSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BlogPost[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Debounced search
  useEffect(() => {
    const trimmedQuery = query.trim()
    if (trimmedQuery.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timeoutId = setTimeout(() => {
      const searchResults = searchPosts(trimmedQuery).slice(0, maxResults)
      setResults(searchResults)
      setIsOpen(searchResults.length > 0 || trimmedQuery.length >= 2)
      setSelectedIndex(-1)
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [query, maxResults])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          )
          break
        case "ArrowUp":
          event.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Enter":
          event.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            navigate(`/blog/${results[selectedIndex].slug}`)
            setQuery("")
            setIsOpen(false)
          }
          break
        case "Escape":
          setIsOpen(false)
          setSelectedIndex(-1)
          inputRef.current?.blur()
          break
      }
    },
    [isOpen, results, selectedIndex, navigate]
  )

  const handleClear = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleResultClick = () => {
    setQuery("")
    setIsOpen(false)
  }

  // Highlight matching text in results
  const highlightMatch = (text: string, maxLength = 100) => {
    const trimmedQuery = query.trim().toLowerCase()
    if (!trimmedQuery) return text.slice(0, maxLength)

    const words = trimmedQuery.split(/\s+/)
    const lowerText = text.toLowerCase()
    let displayText = text.slice(0, maxLength)

    // Find the first match position to center the excerpt around it
    let firstMatchIndex = -1
    for (const word of words) {
      const idx = lowerText.indexOf(word)
      if (idx !== -1 && (firstMatchIndex === -1 || idx < firstMatchIndex)) {
        firstMatchIndex = idx
      }
    }

    // If match is beyond visible text, adjust the excerpt
    if (firstMatchIndex > maxLength - 20) {
      const start = Math.max(0, firstMatchIndex - 30)
      displayText = (start > 0 ? "..." : "") + text.slice(start, start + maxLength)
    } else if (text.length > maxLength) {
      displayText = text.slice(0, maxLength) + "..."
    }

    return displayText
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0 || query.trim().length >= 2) {
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          className="pl-9 pr-9"
          aria-label="Search blog posts"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden"
          role="listbox"
        >
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((post, index) => (
                <li key={post.slug} role="option" aria-selected={index === selectedIndex}>
                  <Link
                    to={`/blog/${post.slug}`}
                    onClick={handleResultClick}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                      index === selectedIndex && "bg-muted/50"
                    )}
                  >
                    <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground truncate">
                        {post.title}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                        {highlightMatch(post.excerpt, 120)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {post.readTimeMinutes} min read
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No articles found for "{query.trim()}"</p>
              <p className="text-sm mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
