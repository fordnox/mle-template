import { Link } from "react-router-dom"
import { Home } from "lucide-react"
import { config } from "@/lib/config"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BreadcrumbStructuredData } from "@/components/blog/StructuredData"

interface BlogBreadcrumbsProps {
  postTitle?: string
  className?: string
}

/**
 * Breadcrumb navigation for blog pages with schema.org BreadcrumbList structured data.
 * Shows: Home > Blog > [Post Title]
 */
export function BlogBreadcrumbs({ postTitle, className }: BlogBreadcrumbsProps) {
  const breadcrumbItems = [
    { name: "Home", url: config.VITE_APP_URL },
    { name: "Blog", url: `${config.VITE_APP_URL}/blog` },
    ...(postTitle
      ? [{ name: postTitle, url: `${config.VITE_APP_URL}/blog` }]
      : []),
  ]

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <Breadcrumb className={className}>
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
            {postTitle ? (
              <BreadcrumbLink asChild>
                <Link to="/blog">Blog</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>Blog</BreadcrumbPage>
            )}
          </BreadcrumbItem>

          {postTitle && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[200px] truncate md:max-w-[400px]">
                  {postTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
