import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config.ts"
import { SearchBar } from "@/components/explore/search-bar.tsx"
import { FilterTags } from "@/components/explore/filter-tags.tsx"
import { ExploreSidebar } from "@/components/explore/explore-sidebar.tsx"
import { useReposSummary, useReposCount } from "@/hooks/useReposQuery"
import { RepoCard } from "@/components/repo/repo-card.tsx"
import { PaginationControls } from "@/components/pagination-controls.tsx"

const PAGE_SIZE = 15

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")
  const [page, setPage] = useState(1)

  // Determine API params based on filters
  const tag = selectedTag === "all" ? null : selectedTag
  const search = searchQuery || null

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedTag])

  const skip = (page - 1) * PAGE_SIZE

  const { data, isLoading, error } = useReposSummary({
    tag,
    search,
    skip,
    limit: PAGE_SIZE,
  })
  const { data: totalCount } = useReposCount()

  const repos = data?.repos ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Calculate display range
  const rangeStart = total === 0 ? 0 : skip + 1
  const rangeEnd = Math.min(skip + PAGE_SIZE, total)

  return (
    <>
      <Helmet>
        <title>{`Explore Database Schemas | ${config.VITE_APP_TITLE}`}</title>
        <meta name="description" content="Browse and discover database schemas across various industries. Find ERD diagrams, DBML schemas, and data models for e-commerce, healthcare, finance, and more." />
        <link rel="canonical" href={`${config.VITE_APP_URL}/explore`} />
        <meta property="og:title" content={`Explore Database Schemas | ${config.VITE_APP_TITLE}`} />
        <meta property="og:description" content="Browse and discover database schemas across various industries. Find ERD diagrams, DBML schemas, and data models for e-commerce, healthcare, finance, and more." />
        <meta property="og:url" content={`${config.VITE_APP_URL}/explore`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={`Explore Database Schemas | ${config.VITE_APP_TITLE}`} />
        <meta name="twitter:description" content="Browse and discover database schemas across various industries. Find ERD diagrams, DBML schemas, and data models for e-commerce, healthcare, finance, and more." />
      </Helmet>
      <main className="flex-1 container mx-auto px-6 py-8">

        {/* Page Header */}
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Explore Schemas</h1>
          <p className="text-muted-foreground py-4">
            Browse {totalCount ?? "..."} database schemas across various industries and use cases.
          </p>
            {/* Search and Filters */}
            <div className="mb-8 space-y-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <FilterTags value={selectedTag} onChange={setSelectedTag} />
            </div>
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
                    <RepoCard
                      key={repo.id}
                      repo={repo}
                    />
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
