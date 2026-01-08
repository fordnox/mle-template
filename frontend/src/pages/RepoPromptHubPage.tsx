import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config.ts"
import { PagePromptHub } from "@/components/repo/page-prompt-hub.tsx"
import { useProject } from "@/contexts/ProjectContext"

export default function RepoPromptHubPage() {
  const project = useProject()

  const pageTitle = `${project.name} - LLM Prompts | ${config.VITE_APP_TITLE}`
  const pageDescription = project.description || `Generate LLM prompts for ${project.name} database schema`
  const pageUrl = `${config.VITE_APP_URL}/${project.owner}/${project.id}/prompt`

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
      <PagePromptHub project={project} />
    </>
  )
}
