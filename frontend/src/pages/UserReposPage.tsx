import { useState } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config.ts"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Database, Loader2, User } from "lucide-react"
import { RepoCard } from "@/components/repo/repo-card.tsx"
import { PaginationControls } from "@/components/pagination-controls.tsx"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import client from "@/lib/api"
import { SectionCta } from "@/components/sections/section-cta"

const ITEMS_PER_PAGE = 20

export default function UserReposPage() {
  const { username } = useParams<{ username: string }>()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [deletingRepo, setDeletingRepo] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const isOwnProfile = user?.username === username

  const { data, isLoading, error } = useQuery({
    queryKey: ["repos", "user", username, currentPage],
    queryFn: async () => {
      if (!username) return null
      const { data, error } = await client.GET("/repo/user/{username}", {
        params: {
          path: { username },
          query: {
            skip: (currentPage - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
          },
        },
      })
      if (error) throw error
      return data
    },
    enabled: !!username,
  })

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (repoName: string) => {
    if (!confirm("Are you sure you want to delete this schema? This action cannot be undone.")) {
      return
    }

    setDeletingRepo(repoName)
    try {
      const { error } = await client.DELETE("/repo/{name}", {
        params: { path: { name: repoName } },
      })

      if (error) {
        toast.error("Failed to delete schema")
        return
      }

      toast.success("Schema deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["repos", "user", username] })
    } catch {
      toast.error("Failed to delete schema")
    } finally {
      setDeletingRepo(null)
    }
  }

  if (isLoading) {
    return (
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto text-center py-16">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground mb-2">User Not Found</h1>
          <p className="text-muted-foreground">
            The user "{username}" doesn't exist or has no public schemas.
          </p>
        </div>
      </main>
    )
  }

  const repos = data.repos || []

  const pageTitle = `${username}'s Schemas | ${config.VITE_APP_TITLE}`
  const pageDescription = `Browse ${data.total} database schemas by ${username} on SchemaHub`
  const pageUrl = `${config.VITE_APP_URL}/${username}`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>
      <main className="flex-1 container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{username}</h1>
              <p className="text-sm text-muted-foreground">
                {data.total} schema{data.total !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Repos List */}
        {repos.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No schemas yet</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {repos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  isOwner={isOwnProfile}
                  onDelete={isOwnProfile ? handleDelete : undefined}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </main>
    <SectionCta />
</>
  )
}
