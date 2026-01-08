import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config.ts"
import { PageDesign } from "@/components/repo/page-design.tsx"
import { useProject } from "@/contexts/ProjectContext"

export default function RepoPromptDesignPage() {
  const project = useProject()

  const pageTitle = `${project.name} - Design System Prompt | ${config.VITE_APP_TITLE}`
  const pageDescription = project.description || `Generate UI design prompts for ${project.name} database schema`
  const pageUrl = `${config.VITE_APP_URL}/${project.owner}/${project.id}/prompt/design`

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
      <PageDesign project={project} />
    </>
  )
}
