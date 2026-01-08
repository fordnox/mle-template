import { Linkedin, Twitter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { BlogAuthor } from "@/content/blog/types"

interface AuthorCardProps {
  author: BlogAuthor
  publishedAt?: string
  readTimeMinutes?: number
  className?: string
}

export function AuthorCard({
  author,
  publishedAt,
  readTimeMinutes,
  className,
}: AuthorCardProps) {
  const authorInitials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 bg-card border border-border rounded-xl",
        className
      )}
    >
      <Avatar className="w-14 h-14">
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback className="text-lg">{authorInitials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold text-foreground">{author.name}</h4>
          {/* Social Links */}
          <div className="flex items-center gap-1">
            {author.linkedin && (
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                aria-label={`${author.name} on LinkedIn`}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {author.twitter && (
              <a
                href={author.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                aria-label={`${author.name} on Twitter`}
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{author.title}</p>

        {/* Meta info */}
        {(publishedAt || readTimeMinutes) && (
          <p className="text-xs text-muted-foreground mt-1">
            {publishedAt && (
              <span>
                {new Date(publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {publishedAt && readTimeMinutes && <span> · </span>}
            {readTimeMinutes && <span>{readTimeMinutes} min read</span>}
          </p>
        )}
      </div>
    </div>
  )
}
