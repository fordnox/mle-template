import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config"
import { ProjectHeader } from "@/components/repo/project-header"
import { DesignGenerator } from "@/components/repo/design-generator"
import { useProject } from "@/contexts/ProjectContext"

export default function RepoDesignPage() {
  const project = useProject()

  const pageTitle = `${project.name} - AI Design Generator | ${config.VITE_APP_TITLE}`
  const pageDescription = `Generate AI-powered UI designs for the ${project.name} database schema with ${project.tables.length} tables`
  const pageUrl = `${config.VITE_APP_URL}/${project.owner}/${project.id}/design`

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      <ProjectHeader project={project} activePage="design" />

      <main className="flex-1 flex flex-col">
        <DesignGenerator project={project} />
      </main>
    </div>
  )
}
