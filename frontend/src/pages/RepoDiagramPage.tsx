import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config.ts"
import { SchemaViewer } from "@/components/canvas/schema-viewer.tsx"
import { ProjectHeader } from "@/components/repo/project-header.tsx"
import { useProject } from "@/contexts/ProjectContext"

export default function RepoDiagramPage() {
  const project = useProject()

  const pageTitle = `${project.name} - Schema Diagram ERD | ${config.VITE_APP_TITLE}`
  const pageDescription = project.description || `Interactive database schema diagram for ${project.name} with ${project.tables.length} tables`
  const pageUrl = `${config.VITE_APP_URL}/${project.owner}/${project.id}/diagram`

  return (
    <div className="h-[calc(100vh-3.5rem)] bg-background flex flex-col">
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

      <ProjectHeader project={project} activePage="diagram" />
      <SchemaViewer project={project} />
    </div>
  )
}
