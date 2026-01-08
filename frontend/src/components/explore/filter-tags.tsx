import { cn } from "@/lib/utils.ts"
import { usePopularTags } from "@/hooks/useReposQuery.ts"

interface FilterTagsProps {
  value?: string
  onChange?: (value: string) => void
}

export function FilterTags({ value = "all", onChange }: FilterTagsProps) {
  const { data: popularTags = [] } = usePopularTags(10)

  const tags = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular" },
    ...popularTags,
  ]

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => onChange?.(tag.id)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
            value === tag.id
              ? "bg-primary/15 text-primary border border-primary/30"
              : "bg-card text-muted-foreground border border-border hover:border-muted-foreground/30 hover:text-foreground",
          )}
        >
          {tag.label}
        </button>
      ))}
    </div>
  )
}
