import { useParams, Navigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config"
import { getPostBySlug } from "@/content/blog"
import { BlogHero } from "@/components/blog/BlogHero"
import { AuthorCard } from "@/components/blog/AuthorCard"
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer"
import { RelatedPosts } from "@/components/blog/RelatedPosts"
import { ArticleStructuredData } from "@/components/blog/StructuredData"
import { BlogBreadcrumbs } from "@/components/blog/Breadcrumbs"
import { PostNavigation } from "@/components/blog/PostNavigation"
import { ReadingProgress } from "@/components/blog/ReadingProgress"
import { TableOfContents } from "@/components/blog/TableOfContents"

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const postUrl = `${config.VITE_APP_URL}/blog/${post.slug}`

  return (
    <>
      <Helmet>
        <title>{`${post.title} | ${config.VITE_APP_TITLE}`}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={postUrl} />

        {/* OpenGraph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content={`${config.VITE_APP_URL}${post.featuredImage}`}
        />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={post.category} />
        {post.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta
          name="twitter:image"
          content={`${config.VITE_APP_URL}${post.featuredImage}`}
        />

      </Helmet>

      {/* Structured Data */}
      <ArticleStructuredData post={post} url={postUrl} />

      {/* Reading Progress Indicator */}
      <ReadingProgress />

      <main className="flex-1">
        <div className="container mx-auto px-6 py-8">
          {/* Breadcrumb Navigation */}
          <BlogBreadcrumbs postTitle={post.title} className="mb-6" />

          {/* Hero Section */}
          <BlogHero post={post} className="mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Main Content */}
            <article>
              <MarkdownRenderer content={post.content} />
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="sticky top-20 space-y-8">
                {/* Table of Contents */}
                <TableOfContents
                  content={post.content}
                  minHeadings={3}
                  className="pb-6 border-b border-border"
                />

                {/* Author Card */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Written by
                  </h3>
                  <AuthorCard
                    author={post.author}
                    publishedAt={post.publishedAt}
                    readTimeMinutes={post.readTimeMinutes}
                  />
                </div>
              </div>
            </aside>
          </div>

          {/* Previous/Next Post Navigation */}
          <PostNavigation
            currentSlug={post.slug}
            className="mt-12 pt-8 border-t border-border"
          />

          {/* Related Posts */}
          <RelatedPosts
            currentPost={post}
            className="mt-12 pt-8 border-t border-border"
          />
        </div>
      </main>
    </>
  )
}
