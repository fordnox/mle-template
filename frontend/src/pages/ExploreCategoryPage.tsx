import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { ChevronRight } from "lucide-react"
import { config } from "@/lib/config.ts"
import { SearchBar } from "@/components/explore/search-bar.tsx"
import { ExploreSidebar } from "@/components/explore/explore-sidebar.tsx"
import { useReposSummary } from "@/hooks/useReposQuery"
import { RepoCard } from "@/components/repo/repo-card.tsx"
import { PaginationControls } from "@/components/pagination-controls.tsx"

const PAGE_SIZE = 15

export default function ExploreCategoryPage() {
  const { category } = useParams<{ category: string }>()
  const decodedCategory = category ? decodeURIComponent(category) : ""

  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)

  const search = searchQuery || null

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, category])

  const skip = (page - 1) * PAGE_SIZE

  const { data, isLoading, error } = useReposSummary({
    category: decodedCategory,
    search,
    skip,
    limit: PAGE_SIZE,
  })

  const repos = data?.repos ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const rangeStart = total === 0 ? 0 : skip + 1
  const rangeEnd = Math.min(skip + PAGE_SIZE, total)

  const pageTitle = `${decodedCategory} Database Schemas | ${config.VITE_APP_TITLE}`
  const pageDescription = `Browse ${decodedCategory} database schemas. Find ERD diagrams and DBML schemas for ${decodedCategory} applications.`
  const pageUrl = `${config.VITE_APP_URL}/explore/category/${encodeURIComponent(decodedCategory)}`

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
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/explore" className="hover:text-foreground transition-colors">
            Explore
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{decodedCategory}</span>
        </nav>

        {/* Page Header */}
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {decodedCategory} Schemas
          </h1>
          <p className="text-muted-foreground">
            {total} schema{total !== 1 ? "s" : ""} found
          </p>
          {/* Search */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </section>

        <div className="flex gap-8">
          {/* Sidebar - hidden on mobile */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <ExploreSidebar />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Project Grid */}
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading schemas...</div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">Failed to load schemas</div>
            ) : repos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No schemas found</div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {repos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 space-y-4">
                  <p className="text-center text-sm text-muted-foreground">
                    Showing {rangeStart}-{rangeEnd} of {total} schemas
                  </p>
                  <PaginationControls
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
