import { Link } from "react-router-dom"
import { useRecentRepos } from "@/hooks/useReposQuery.ts"
import { Button } from "@/components/ui/button.tsx"
import { ArrowRight, Clock, Loader2, Database, Tag } from "lucide-react"

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function SectionRecentSchemas() {
  const { data: recentRepos = [], isLoading } = useRecentRepos(6)

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 flex items-center justify-center h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    )
  }

  if (recentRepos.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Recently Created Schemas
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the latest database schemas created by our community.
            Get inspired by fresh designs and new approaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {recentRepos.map((repo) => {
            const repoUrl = `/${repo.owner.username}/${repo.name}`
            return (
              <Link
                key={repo.id}
                to={repoUrl}
                className="group p-4 bg-card border border-border rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-primary flex-shrink-0" />
                  <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {repo.title}
                  </h3>
                </div>
                {repo.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(repo.updated_at)}
                  </div>
                  {repo.category && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {repo.category}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="flex justify-center mt-8">
          <Link to="/explore">
            <Button variant="outline" className="gap-2">
              View all schemas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
