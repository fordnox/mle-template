import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input.tsx"

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  debounceMs?: number
}

export function SearchBar({ value = "", onChange, debounceMs = 300 }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sync local value when external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange?.(localValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, debounceMs, onChange, value])

  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        type="text"
        placeholder="Search schemas by name, table, or tag..."
        className="w-full h-11 pl-11 pr-4 bg-card border-border text-foreground placeholder:text-muted-foreground font-mono text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted text-muted-foreground rounded border border-border">
          ⌘
        </kbd>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted text-muted-foreground rounded border border-border">
          K
        </kbd>
      </div>
    </div>
  )
}
