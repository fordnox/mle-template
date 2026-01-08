import { createContext, useContext, useState, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import type { Project } from "@/lib/data"

interface ProjectContextValue {
  project: Project
  updateProject: (updates: Partial<Project>) => void
  refetchProject: () => void
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export function ProjectProvider({
  project: initialProject,
  children,
}: {
  project: Project
  children: React.ReactNode
}) {
  const [project, setProject] = useState(initialProject)
  const queryClient = useQueryClient()

  const updateProject = useCallback((updates: Partial<Project>) => {
    setProject((prev) => ({ ...prev, ...updates }))
  }, [])

  const refetchProject = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["project", project.id] })
  }, [queryClient, project.id])

  return (
    <ProjectContext.Provider value={{ project, updateProject, refetchProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject(): Project {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context.project
}

export function useProjectActions() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error("useProjectActions must be used within a ProjectProvider")
  }
  return {
    updateProject: context.updateProject,
    refetchProject: context.refetchProject,
  }
}
