import { Link } from "react-router-dom"
import { Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { blogPosts } from "@/content/blog"

interface TagWithCount {
  name: string
  count: number
  weight: "sm" | "md" | "lg" | "xl"
}

/**
 * Calculate tag counts and assign weights based on frequency
 */
function getTagsWithWeights(): TagWithCount[] {
  // Count occurrences of each tag
  const tagCounts = new Map<string, number>()
  blogPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })

  // Convert to array and sort by count (descending)
  const tags = Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  if (tags.length === 0) return []

  // Calculate weight thresholds based on distribution
  const maxCount = tags[0].count
  const minCount = tags[tags.length - 1].count
  const range = maxCount - minCount

  return tags.map(({ name, count }) => {
    let weight: TagWithCount["weight"]

    if (range === 0) {
      // All tags have same count
      weight = "md"
    } else {
      const normalizedValue = (count - minCount) / range
      if (normalizedValue >= 0.75) {
        weight = "xl"
      } else if (normalizedValue >= 0.5) {
        weight = "lg"
      } else if (normalizedValue >= 0.25) {
        weight = "md"
      } else {
        weight = "sm"
      }
    }

    return { name, count, weight }
  })
}

// Weight-based styling classes
const weightStyles: Record<TagWithCount["weight"], string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5 font-medium",
  xl: "text-lg px-4 py-2 font-semibold",
}

interface TagCloudProps {
  className?: string
  /** Maximum number of tags to display */
  maxTags?: number
  /** Show post count next to each tag */
  showCounts?: boolean
  /** Display mode: 'cloud' for weighted sizing, 'list' for uniform sizing */
  mode?: "cloud" | "list"
}

export function TagCloud({
  className,
  maxTags,
  showCounts = false,
  mode = "cloud",
}: TagCloudProps) {
  const tags = getTagsWithWeights()
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags

  if (displayTags.length === 0) {
    return null
  }

  return (
    <div className={cn("", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Popular Tags</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <Link
            key={tag.name}
            to={`/blog/tag/${encodeURIComponent(tag.name)}`}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-border bg-background text-foreground",
              "hover:bg-accent hover:text-accent-foreground hover:border-accent",
              "transition-colors duration-200",
              mode === "cloud" ? weightStyles[tag.weight] : "text-sm px-3 py-1"
            )}
          >
            <span>#</span>
            <span>{tag.name}</span>
            {showCounts && (
              <span className="text-muted-foreground ml-1">({tag.count})</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export { getTagsWithWeights, type TagWithCount }
