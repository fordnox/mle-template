import { Link } from "react-router-dom"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getRelatedPosts } from "@/content/blog"
import type { BlogPost } from "@/content/blog/types"

interface RelatedPostsProps {
  currentPost: BlogPost
  className?: string
  /** Maximum number of related posts to display (default: 3) */
  maxPosts?: number
  /** Optional title for the section */
  title?: string
}

export function RelatedPosts({
  currentPost,
  className,
  maxPosts = 3,
  title = "Related Articles",
}: RelatedPostsProps) {
  const relatedPosts = getRelatedPosts(currentPost, maxPosts)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className={cn("", className)}>
      <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <RelatedPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}

interface RelatedPostCardProps {
  post: BlogPost
}

function RelatedPostCard({ post }: RelatedPostCardProps) {
  const postUrl = `/blog/${post.slug}`

  return (
    <Link
      to={postUrl}
      className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      {/* Featured Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {post.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTimeMinutes} min
            </span>
          </div>
          <span className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
            Read <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
