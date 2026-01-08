import { useState, useCallback, useMemo, useEffect } from "react"
import { useQueries } from "@tanstack/react-query"
import { SchemaCanvas } from "@/components/canvas/schema-canvas.tsx"
import { getProject } from "@/lib/repo.ts"
import { ChevronLeft, ChevronRight, Loader2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import type { Project } from "@/lib/data.ts"

interface SlideConfig {
  projectSlug: string
  title: string
  icon?: React.ReactNode
}

interface SchemaSliderProps {
  slides?: SlideConfig[]
  className?: string
  autoRotate?: boolean
  rotationInterval?: number
}

const DEFAULT_SLIDES: SlideConfig[] = [
  { projectSlug: "airbnb", title: "Airbnb" },
  { projectSlug: "ecommerce", title: "E-commerce" },
  { projectSlug: "social-network", title: "Social Network" },
]

function useProjectsQuery(slugs: string[]) {
  return useQueries({
    queries: slugs.map((slug) => ({
      queryKey: ["project", slug],
      queryFn: () => getProject(slug),
      staleTime: 5 * 60 * 1000,
    })),
  })
}

function SlideCard({
  project,
  projectSlug,
  title,
  icon,
  isActive,
  offset,
  onClick,
}: {
  project: Project
  projectSlug: string
  title: string
  icon?: React.ReactNode
  isActive: boolean
  offset: number
  onClick: () => void
}) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const handleTableSelect = useCallback((tableName: string) => {
    if (isActive) {
      setSelectedTable(tableName)
    }
  }, [isActive])

  // Calculate transform based on offset (0 = front, 1 = middle, 2 = back)
  const zIndex = 30 - offset * 10
  const translateY = offset * -40
  const scale = 1 - offset * 0.05
  const opacity = isActive ? 1 : 0.8 - offset * 0.15

  return (
    <div
      className="absolute inset-0 transition-all duration-500 ease-out cursor-pointer"
      style={{
        zIndex,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
      }}
      onClick={!isActive ? onClick : undefined}
    >
      <div
        className={`h-full border rounded-xl overflow-hidden shadow-2xl bg-card transition-all duration-300 ${
          isActive
            ? "border-primary/50 shadow-primary/20"
            : "border-border/50 hover:border-border"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
          <div className="flex items-center gap-3">
            {icon && <span className="text-primary">{icon}</span>}
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <a href={`/projects/${projectSlug}`}>
              <ExternalLink className="w-4 h-4" />
              Open
            </a>
          </Button>
        </div>

        {/* Canvas */}
        <div className="h-[calc(100%-52px)] relative bg-canvas overflow-hidden">
          <SchemaCanvas
            tables={project.tables}
            refs={project.refs}
            selectedTable={selectedTable}
            onTableSelect={handleTableSelect}
            nodesDraggable={false}
            showMinimap={false}
            initialX={0}
            initialY={0}
          />
        </div>
      </div>
    </div>
  )
}

function LoadedSlider({
  projects,
  slides,
  autoRotate = true,
  rotationInterval = 4000,
}: {
  projects: Project[]
  slides: SlideConfig[]
  autoRotate?: boolean
  rotationInterval?: number
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }, [projects.length])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % projects.length)
  }, [projects.length])

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || isPaused) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length)
    }, rotationInterval)

    return () => clearInterval(timer)
  }, [autoRotate, isPaused, projects.length, rotationInterval])

  // Reorder slides so active is at front
  const orderedSlides = useMemo(() => {
    const result: { project: Project; config: SlideConfig; offset: number }[] = []
    for (let i = 0; i < projects.length; i++) {
      const actualIndex = (activeIndex + i) % projects.length
      result.push({
        project: projects[actualIndex],
        config: slides[actualIndex],
        offset: i,
      })
    }
    // Reverse so backmost cards render first (proper z-order)
    return result.reverse()
  }, [projects, slides, activeIndex])

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider container */}
      <div
        className="relative mx-auto"
        style={{
          width: "100%",
          maxWidth: "900px",
          height: "450px",
          paddingTop: `${(slides.length - 1) * 40}px`,
        }}
      >
        {orderedSlides.map(({ project, config, offset }) => (
          <SlideCard
            key={config.projectSlug}
            project={project}
            projectSlug={config.projectSlug}
            title={config.title}
            icon={config.icon}
            isActive={offset === 0}
            offset={offset}
            onClick={() => {
              const targetIndex = projects.findIndex(
                (p) => p.id === config.projectSlug
              )
              if (targetIndex !== -1) {
                setActiveIndex(targetIndex)
              }
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.projectSlug}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

export function SchemaSlider({
  slides = DEFAULT_SLIDES,
  className = "",
  autoRotate = true,
  rotationInterval = 4000,
}: SchemaSliderProps) {
  // Fetch all projects using useQueries (proper hook usage)
  const slugs = useMemo(() => slides.map((s) => s.projectSlug), [slides])
  const projectQueries = useProjectsQuery(slugs)

  const isLoading = projectQueries.some((q) => q.isLoading)

  // Build paired data: only include slides where the project loaded successfully
  const pairedData = useMemo(() => {
    const result: { project: Project; slide: SlideConfig }[] = []
    slides.forEach((slide, index) => {
      const project = projectQueries[index]?.data
      if (project) {
        result.push({ project, slide })
      }
    })
    return result
  }, [slides, projectQueries])

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-[550px] ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Need at least 2 slides for the stacked effect
  if (pairedData.length < 2) {
    return null
  }

  return (
    <div className={className}>
      <LoadedSlider
        projects={pairedData.map((d) => d.project)}
        slides={pairedData.map((d) => d.slide)}
        autoRotate={autoRotate}
        rotationInterval={rotationInterval}
      />
    </div>
  )
}
