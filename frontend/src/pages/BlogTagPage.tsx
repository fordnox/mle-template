import { useParams, Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { ArrowLeft, Tag, Home } from "lucide-react"
import { config } from "@/lib/config"
import { getPostsByTag, getAllTags } from "@/content/blog"
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

export default function BlogTagPage() {
  const { tag } = useParams<{ tag: string }>()
  const decodedTag = tag ? decodeURIComponent(tag) : ""

  const posts = getPostsByTag(decodedTag)
  const allTags = getAllTags()
  const tagExists = allTags.includes(decodedTag)

  const description = `Browse all blog posts tagged with "${decodedTag}" on SchemaHub.`
  const pageTitle = `#${decodedTag} | Blog | ${config.VITE_APP_TITLE}`
  const pageUrl = `${config.VITE_APP_URL}/blog/tag/${encodeURIComponent(decodedTag)}`

  const breadcrumbItems = [
    { name: "Home", url: config.VITE_APP_URL },
    { name: "Blog", url: `${config.VITE_APP_URL}/blog` },
    { name: `#${decodedTag}`, url: pageUrl },
  ]

  if (!tagExists) {
    return (
      <>
        <Helmet>
          <title>{`Tag Not Found | Blog | ${config.VITE_APP_TITLE}`}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Tag Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The tag "#{decodedTag}" doesn't exist or has no posts.
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
              <BreadcrumbPage>#{decodedTag}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <section className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Tag className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              #{decodedTag}
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </section>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">
              No posts with this tag yet. Check back soon!
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
