import { config } from "@/lib/config"
import type { BlogPost } from "@/content/blog"

interface ArticleSchemaProps {
  post: BlogPost
  url: string
}

interface BlogSchemaProps {
  posts: BlogPost[]
  url: string
  description: string
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

/**
 * Generates JSON-LD structured data for an Article (blog post)
 * https://schema.org/Article
 */
export function ArticleStructuredData({ post, url }: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: `${config.VITE_APP_URL}${post.featuredImage}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt, // Use publishedAt as fallback since we don't track modifications
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.linkedin,
      ...(post.author.twitter && {
        sameAs: [
          post.author.linkedin,
          `https://twitter.com/${post.author.twitter.replace("@", "")}`,
        ].filter(Boolean),
      }),
    },
    publisher: {
      "@type": "Organization",
      name: config.VITE_APP_TITLE,
      url: config.VITE_APP_URL,
      logo: {
        "@type": "ImageObject",
        url: `${config.VITE_APP_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.readTimeMinutes}M`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Generates JSON-LD structured data for a Blog
 * https://schema.org/Blog
 */
export function BlogStructuredData({ posts, url, description }: BlogSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${config.VITE_APP_TITLE} Blog`,
    description,
    url,
    publisher: {
      "@type": "Organization",
      name: config.VITE_APP_TITLE,
      url: config.VITE_APP_URL,
      logo: {
        "@type": "ImageObject",
        url: `${config.VITE_APP_URL}/logo.svg`,
      },
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      url: `${config.VITE_APP_URL}/blog/${post.slug}`,
      image: `${config.VITE_APP_URL}${post.featuredImage}`,
      datePublished: post.publishedAt,
      author: {
        "@type": "Person",
        name: post.author.name,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Generates JSON-LD structured data for Breadcrumbs
 * https://schema.org/BreadcrumbList
 */
export function BreadcrumbStructuredData({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
