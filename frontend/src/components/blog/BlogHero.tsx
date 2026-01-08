import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { BlogPost } from "@/content/blog/types"

interface BlogHeroProps {
  post: BlogPost
  className?: string
}

export function BlogHero({ post, className }: BlogHeroProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-muted",
        className
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-end min-h-[300px] sm:min-h-[400px] p-6 sm:p-8">
        {/* Category and Read Time */}
        <div className="flex items-center gap-3 mb-4">
          <Badge
            variant="secondary"
            className="bg-white/90 text-foreground backdrop-blur-sm"
          >
            {post.category}
          </Badge>
          <span className="flex items-center gap-1.5 text-sm text-white/90">
            <Clock className="w-4 h-4" />
            {post.readTimeMinutes} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 max-w-4xl">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-base sm:text-lg text-white/80 max-w-2xl line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </div>
  )
}
