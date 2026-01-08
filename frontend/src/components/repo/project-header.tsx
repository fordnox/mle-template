import { Link } from "react-router-dom"
import { ArrowLeft, Table2 } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { RepoActions, type ActivePage } from "@/components/repo/repo-actions.tsx"
import { VersionHistory } from "@/components/repo/version-history.tsx"
import { useAuth } from "@/hooks/useAuth.ts"
import type { Project } from "@/lib/data.ts"

interface ProjectHeaderProps {
  project: Project
  activePage?: ActivePage
}

export function ProjectHeader({ project, activePage = "code" }: ProjectHeaderProps) {
  const { user } = useAuth()
  const projectPath = `/${project.owner ?? "schema"}/${project.id}`
  const isOwner = user?.username === project.owner

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm top-0 z-40">
      <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {activePage !== "code" ? (
              <>
                <Link to={projectPath} className="text-muted-foreground hover:text-foreground transition-colors truncate hidden sm:block">
                  {project.name}
                </Link>
                <span className="text-muted-foreground hidden sm:block">/</span>
                <h1 className="font-semibold text-foreground truncate">
                  {activePage === "diagram" && "Diagram"}
                  {activePage === "design" && "Design"}
                  {activePage === "about" && "About"}
                  {activePage === "export" && "Export"}
                  {activePage === "prompt" && "Prompt"}
                  {activePage === "api" && "API"}
                </h1>
              </>
            ) : (
              <h1 className="font-semibold text-foreground truncate">{project.name}</h1>
            )}
            {/* Meta info - hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
              <VersionHistory repoName={project.id} />
            </div>
          </div>
        </div>

        <RepoActions
          projectPath={projectPath}
          activePage={activePage}
          repoName={project.id}
          isOwner={isOwner}
        />
      </div>
    </header>
  )
}
