import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config"
import { getAllPosts, getAllCategories, getPostsByCategory } from "@/content/blog"
import { BlogPostCard } from "@/components/blog/BlogPostCard"
import { BlogStructuredData } from "@/components/blog/StructuredData"
import { CategoryFilter } from "@/components/blog/CategoryFilter"
import { BlogSearch } from "@/components/blog/BlogSearch"
import { useState, useMemo } from "react"

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const allPosts = getAllPosts()
  const categories = getAllCategories()

  const filteredPosts = selectedCategory
    ? allPosts.filter((post) => post.category === selectedCategory)
    : allPosts

  // Calculate post counts per category for the filter badges
  const postCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    categories.forEach((category) => {
      counts[category] = getPostsByCategory(category).length
    })
    return counts
  }, [categories])

  return (
    <>
      <Helmet>
        <title>{`Blog | ${config.VITE_APP_TITLE}`}</title>
        <meta
          name="description"
          content="Insights on schema-first development, AI-assisted coding, database design, and best practices for building better software faster."
        />
        <link rel="canonical" href={`${config.VITE_APP_URL}/blog`} />
        <meta property="og:title" content={`Blog | ${config.VITE_APP_TITLE}`} />
        <meta
          property="og:description"
          content="Insights on schema-first development, AI-assisted coding, database design, and best practices for building better software faster."
        />
        <meta property="og:url" content={`${config.VITE_APP_URL}/blog`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={`Blog | ${config.VITE_APP_TITLE}`} />
        <meta
          name="twitter:description"
          content="Insights on schema-first development, AI-assisted coding, database design, and best practices for building better software faster."
        />
      </Helmet>

      {/* Structured Data */}
      <BlogStructuredData
        posts={allPosts}
        url={`${config.VITE_APP_URL}/blog`}
        description="Insights on schema-first development, AI-assisted coding, database design, and best practices for building better software faster."
      />

      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Page Header */}
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Blog</h1>
          <p className="text-muted-foreground py-4 max-w-2xl mx-auto">
            Insights on schema-first development, AI-assisted coding, database
            design, and best practices for building better software faster.
          </p>
          {/* Search */}
          <BlogSearch className="max-w-md mx-auto mt-4" placeholder="Search articles..." />
        </section>

        {/* Category Filters */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            postCounts={postCounts}
            className="mb-8"
          />
        )}

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No blog posts yet. Check back soon for new content!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
