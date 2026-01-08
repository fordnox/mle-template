import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config.ts"
import { PageExport } from "@/components/repo/page-export.tsx"
import { useProject } from "@/contexts/ProjectContext"

export default function RepoExportPage() {
  const project = useProject()

  const pageTitle = `${project.name} - Export | ${config.VITE_APP_TITLE}`
  const pageDescription = project.description || `Export ${project.name} database schema to SQL, TypeScript, and more`
  const pageUrl = `${config.VITE_APP_URL}/${project.owner}/${project.id}/export`

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
      <PageExport project={project} />
    </>
  )
}
