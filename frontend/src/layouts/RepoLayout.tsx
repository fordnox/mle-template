import { useParams, Outlet } from "react-router-dom"
import { ProjectProvider } from "@/contexts/ProjectContext"
import { useProjectQuery } from "@/hooks/useProjectQuery"
import { Header } from "@/layouts/Header.tsx"

export default function RepoLayout() {
  const { id } = useParams<{ username: string; id: string }>()
  const { data: project, isLoading } = useProjectQuery(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Schema not found</div>
        </div>
      </div>
    )
  }

  return (
    <ProjectProvider project={project}>
      <Header />
      <Outlet />
    </ProjectProvider>
  )
}
