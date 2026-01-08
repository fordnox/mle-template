import { Link } from "react-router-dom"
import { FolderOpen, Tag, Loader2 } from "lucide-react"
import { useCategories, usePopularTags } from "@/hooks/useReposQuery"

export function ExploreSidebar() {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const { data: popularTags = [], isLoading: tagsLoading } = usePopularTags(20)

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
          <FolderOpen className="w-4 h-4" />
          Categories
        </h3>
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ul className="space-y-1 max-h-64 overflow-y-auto">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  to={`/explore/category/${encodeURIComponent(category)}`}
                  className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Popular Tags Section */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
          <Tag className="w-4 h-4" />
          Tags
        </h3>
        {tagsLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ul className="space-y-1 max-h-64 overflow-y-auto">
            {popularTags.map((tag) => (
              <li key={tag.id}>
                <Link
                  to={`/explore/tag/${encodeURIComponent(tag.id)}`}
                  className="flex items-center justify-between px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                >
                  <span>{tag.label}</span>
                  <span className="text-xs text-muted-foreground/60">{tag.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
