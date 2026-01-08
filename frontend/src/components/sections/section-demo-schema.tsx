import { Link } from "react-router-dom"
import { SchemaCanvas, type SchemaCanvasHandle } from "@/components/canvas/schema-canvas.tsx"
import { useState, useCallback, useRef } from "react"
import { useProjectQuery } from "@/hooks/useProjectQuery.ts"
import { useReposCount } from "@/hooks/useReposQuery.ts"
import { Button } from "@/components/ui/button.tsx"
import { ArrowRight, Table2, Link2, ZoomIn, ZoomOut, Maximize2, Loader2 } from "lucide-react"

interface SectionDemoSchemaProps {
  projectSlug?: string
  showStats?: boolean
  showHeader?: boolean
}

export function SectionDemoSchema({ projectSlug = "airbnb", showStats = true, showHeader = true }: SectionDemoSchemaProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const canvasRef = useRef<SchemaCanvasHandle>(null)

  // Fetch project from API
  const { data: project, isLoading } = useProjectQuery(projectSlug)
  const { data: totalCount } = useReposCount()

  const handleTableSelect = useCallback((tableName: string) => {
    setSelectedTable(tableName)
    // Center on selected table
    canvasRef.current?.centerOnNode(tableName)
  }, [])

  const handleZoomIn = useCallback(() => canvasRef.current?.zoomIn(), [])
  const handleZoomOut = useCallback(() => canvasRef.current?.zoomOut(), [])
  const handleReset = useCallback(() => {
    canvasRef.current?.fitView()
    setSelectedTable(null)
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 flex items-center justify-center h-[600px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    )
  }

  if (!project) {
    return null
  }

  const totalRelations = project.refs?.length ?? 0

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto">
        {showHeader && (
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Visualize database schema
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore the data structure visually before pushing prompt to LLM.
              Copy production ready prompt when you are satisfied with the data structure.
              Interactive diagrams that make complex relationships easy to understand.
              Click on tables to explore, drag to pan, and zoom to see details.
            </p>
          </div>
        )}

        {/* Demo Viewer */}
        <div className="max-w-5xl mx-auto">
          <div className="border border-border rounded-lg overflow-hidden shadow-xl bg-card">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-foreground">{project.name}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Table2 className="w-3.5 h-3.5" />
                    {project.tables.length}<span className="hidden sm:inline"> tables</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5" />
                    {totalRelations}<span className="hidden sm:inline"> relations</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Canvas */}
            <div className="h-[500px] relative bg-canvas overflow-hidden">
              <SchemaCanvas
                ref={canvasRef}
                tables={project.tables}
                refs={project.refs}
                selectedTable={selectedTable}
                onTableSelect={handleTableSelect}
                initialX={0}
                initialY={0}
                nodesDraggable={true}
                showMinimap={false}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Drag tables to reposition • Click to select • Use controls to zoom
              </p>
              <Link to={`/${project.owner ?? "schema"}/${project.id}`}>
                <Button size="sm" className="gap-2">
                  Open
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features list */}
        {showStats && (
          <div className="max-w-3xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-1">{totalCount ?? "..."}+</div>
              <div className="text-sm text-muted-foreground">Ready-to-use schemas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1">20+</div>
              <div className="text-sm text-muted-foreground">Export formats</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Free & open source</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
