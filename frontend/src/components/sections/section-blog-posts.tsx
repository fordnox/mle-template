import { Link } from "react-router-dom"
import { ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx"
import { getAllPosts } from "@/content/blog"
import type { BlogPost } from "@/content/blog"

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/50">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              {post.category}
            </span>
          </div>
        </div>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTimeMinutes} min read</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function SectionBlogPosts() {
  const recentPosts = getAllPosts().slice(0, 3)

  if (recentPosts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Latest from the Blog
          </h2>
          <p className="text-lg text-muted-foreground">
            Tips, tutorials, and insights on database design, AI-assisted development, and schema-first workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {recentPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link to="/blog">
            <Button variant="outline" className="gap-2">
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
