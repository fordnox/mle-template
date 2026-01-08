import { useParams, Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { ArrowLeft } from "lucide-react"
import { config } from "@/lib/config"
import { getPostsByCategory, getAllCategories } from "@/content/blog"
import { BlogPostCard } from "@/components/blog/BlogPostCard"
import { BlogStructuredData } from "@/components/blog/StructuredData"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BreadcrumbStructuredData } from "@/components/blog/StructuredData"
import { Home } from "lucide-react"

// Category descriptions for SEO and user context
const categoryDescriptions: Record<string, string> = {
  "AI Development":
    "Explore best practices for AI-assisted coding, prompt engineering for developers, and how to effectively collaborate with AI tools to build better software faster.",
  "Best Practices":
    "Learn proven development patterns, code quality standards, and architectural approaches that help teams ship reliable software.",
  Tutorials:
    "Step-by-step guides and hands-on tutorials covering database design, DBML, schema modeling, and modern development workflows.",
  Product:
    "Product updates, feature announcements, and insights into how SchemaHub is evolving to serve the developer community.",
  Community:
    "Stories from the SchemaHub community, user milestones, and highlights from developers using schema-first development.",
  Future:
    "Forward-looking perspectives on software development, emerging technologies, and the evolving landscape of developer tools.",
}

export default function BlogCategoryPage() {
  const { category } = useParams<{ category: string }>()
  const decodedCategory = category ? decodeURIComponent(category) : ""

  const posts = getPostsByCategory(decodedCategory)
  const allCategories = getAllCategories()
  const categoryExists = allCategories.includes(decodedCategory)

  const description =
    categoryDescriptions[decodedCategory] ||
    `Browse all blog posts in the ${decodedCategory} category.`
  const pageTitle = `${decodedCategory} | Blog | ${config.VITE_APP_TITLE}`
  const pageUrl = `${config.VITE_APP_URL}/blog/category/${encodeURIComponent(decodedCategory)}`

  const breadcrumbItems = [
    { name: "Home", url: config.VITE_APP_URL },
    { name: "Blog", url: `${config.VITE_APP_URL}/blog` },
    { name: decodedCategory, url: pageUrl },
  ]

  if (!categoryExists) {
    return (
      <>
        <Helmet>
          <title>{`Category Not Found | Blog | ${config.VITE_APP_TITLE}`}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Category Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The category "{decodedCategory}" doesn't exist or has no posts.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      {/* Structured Data */}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <BlogStructuredData posts={posts} url={pageUrl} description={description} />

      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/blog">Blog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{decodedCategory}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {decodedCategory}
          </h1>
          <p className="text-muted-foreground py-4 max-w-2xl mx-auto">
            {description}
          </p>
          <p className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </section>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">
              No posts in this category yet. Check back soon!
            </p>
            <Button asChild variant="outline">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                View All Posts
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {/* Back to Blog Link */}
        <div className="mt-8 text-center">
          <Button asChild variant="ghost">
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Posts
            </Link>
          </Button>
        </div>
      </main>
    </>
  )
}
