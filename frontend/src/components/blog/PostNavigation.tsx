import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAllPosts, type BlogPost } from "@/content/blog"

interface PostNavigationProps {
  currentSlug: string
  className?: string
}

interface NavLinkProps {
  post: BlogPost
  direction: "prev" | "next"
}

function NavLink({ post, direction }: NavLinkProps) {
  const isPrev = direction === "prev"

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col gap-1 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50",
        isPrev ? "items-start" : "items-end"
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1 text-sm text-muted-foreground",
          isPrev ? "flex-row" : "flex-row-reverse"
        )}
      >
        {isPrev ? (
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        ) : (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        )}
        {isPrev ? "Previous" : "Next"}
      </span>
      <span
        className={cn(
          "font-medium text-foreground line-clamp-2",
          isPrev ? "text-left" : "text-right"
        )}
      >
        {post.title}
      </span>
    </Link>
  )
}

/**
 * Navigation component showing links to previous and next blog posts.
 * Posts are ordered by publication date (newest first).
 */
export function PostNavigation({ currentSlug, className }: PostNavigationProps) {
  const posts = getAllPosts()
  const currentIndex = posts.findIndex((p) => p.slug === currentSlug)

  if (currentIndex === -1) return null

  // Previous post is the next item in the array (older post)
  const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
  // Next post is the previous item in the array (newer post)
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null

  if (!prevPost && !nextPost) return null

  return (
    <nav
      aria-label="Post navigation"
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}
    >
      <div>{prevPost && <NavLink post={prevPost} direction="prev" />}</div>
      <div>{nextPost && <NavLink post={nextPost} direction="next" />}</div>
    </nav>
  )
}
