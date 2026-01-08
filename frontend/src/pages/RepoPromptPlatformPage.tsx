import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config.ts"
import { PagePromptPlatform } from "@/components/repo/page-prompt-platform.tsx"
import { useProject } from "@/contexts/ProjectContext"

export default function RepoPromptPlatformPage() {
  const project = useProject()

  const pageTitle = `${project.name} - Platform Stack Prompt | ${config.VITE_APP_TITLE}`
  const pageDescription = project.description || `Configure platform stack for AI prompts for ${project.name} database schema`
  const pageUrl = `${config.VITE_APP_URL}/${project.owner}/${project.id}/prompt/platform`

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
      <PagePromptPlatform project={project} />
    </>
  )
}
