import { Link } from "react-router-dom"
import { Folder } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Category descriptions for tooltips and dropdown
const categoryDescriptions: Record<string, string> = {
  "AI Development":
    "Best practices for AI-assisted coding and developer tools",
  "Best Practices":
    "Proven patterns, code quality, and architectural approaches",
  Tutorials:
    "Step-by-step guides for database design and DBML",
  Product:
    "Feature announcements and product updates",
  Community:
    "Stories and milestones from the SchemaHub community",
  Future:
    "Forward-looking perspectives on software development",
}

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  className?: string
  /** Show count of posts per category */
  postCounts?: Record<string, number>
  /** Enable link mode - clicking category navigates to category page instead of filtering */
  linkMode?: boolean
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
  postCounts,
  linkMode = false,
}: CategoryFilterProps) {
  const handleSelectChange = (value: string) => {
    if (value === "all") {
      onCategoryChange(null)
    } else {
      onCategoryChange(value)
    }
  }

  // Mobile: Dropdown select
  const MobileFilter = (
    <div className="md:hidden w-full">
      <Select
        value={selectedCategory || "all"}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger className="w-full">
          <Folder className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            All Categories
          </SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              <span className="flex items-center justify-between w-full">
                <span>{category}</span>
                {postCounts && postCounts[category] !== undefined && (
                  <span className="text-muted-foreground ml-2">
                    ({postCounts[category]})
                  </span>
                )}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  // Desktop: Badge pills
  const DesktopFilter = (
    <div className="hidden md:flex flex-wrap justify-center gap-2">
      {linkMode ? (
        <Link to="/blog">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-colors hover:bg-primary/80",
              selectedCategory === null && "bg-primary text-primary-foreground"
            )}
          >
            All
          </Badge>
        </Link>
      ) : (
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-colors hover:bg-primary/80",
            selectedCategory === null && "bg-primary text-primary-foreground"
          )}
          onClick={() => onCategoryChange(null)}
        >
          All
        </Badge>
      )}
      {categories.map((category) => {
        const badge = (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-colors hover:bg-primary/80",
              selectedCategory === category &&
                "bg-primary text-primary-foreground"
            )}
            onClick={linkMode ? undefined : () => onCategoryChange(category)}
            title={categoryDescriptions[category]}
          >
            {category}
            {postCounts && postCounts[category] !== undefined && (
              <span className="ml-1 opacity-70">({postCounts[category]})</span>
            )}
          </Badge>
        )

        if (linkMode) {
          return (
            <Link
              key={category}
              to={`/blog/category/${encodeURIComponent(category)}`}
            >
              {badge}
            </Link>
          )
        }

        return badge
      })}
    </div>
  )

  return (
    <div className={cn("", className)}>
      {MobileFilter}
      {DesktopFilter}
    </div>
  )
}

export { categoryDescriptions }
