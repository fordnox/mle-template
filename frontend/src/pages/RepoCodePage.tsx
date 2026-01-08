import { useState, useRef, useCallback, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { AlertCircle, PanelLeftClose, PanelRightClose, X } from "lucide-react"
import { config } from "@/lib/config.ts"
import { ProjectHeader } from "@/components/repo/project-header.tsx"
import { CodeViewer } from "@/components/repo/code-viewer.tsx"
import { SchemaCanvas, type SchemaCanvasHandle } from "@/components/canvas/schema-canvas.tsx"
import { CanvasControls } from "@/components/canvas/canvas-controls.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useProject, useProjectActions } from "@/contexts/ProjectContext"
import { parseDbml, type DbmlParseError } from "@/lib/repo"

const MIN_PANEL_WIDTH = 250
const MAX_PANEL_WIDTH = 800
const DEFAULT_PANEL_WIDTH = 350

export default function RepoCodePage() {
  const project = useProject()
  const { updateProject } = useProjectActions()

  const pageTitle = `${project.name} - Code | ${config.VITE_APP_TITLE}`
  const pageDescription = project.description || `DBML source code for ${project.name} database schema`
  const pageUrl = `${config.VITE_APP_URL}/${project.owner}/${project.id}`

  // Canvas state
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [codeEditorVisible, setCodeEditorVisible] = useState(true)
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [parseErrors, setParseErrors] = useState<DbmlParseError[]>([])
  const canvasRef = useRef<SchemaCanvasHandle>(null)

  // Handle resize drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, e.clientX))
      setPanelWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  // Live DBML editing - updates diagram in real-time
  const handleDbmlEdit = useCallback(
    (newDbml: string) => {
      const { tables, refs, errors } = parseDbml(newDbml)
      setParseErrors(errors)
      updateProject({
        dbml: newDbml,
        tables,
        refs,
      })
    },
    [updateProject]
  )

  // Canvas controls
  const handleZoomIn = useCallback(() => canvasRef.current?.zoomIn(), [])
  const handleZoomOut = useCallback(() => canvasRef.current?.zoomOut(), [])
  const handleFitToScreen = useCallback(() => canvasRef.current?.fitView(), [])

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

      <ProjectHeader project={project} activePage="code" />

      <div className={`flex-1 flex overflow-hidden ${isResizing ? "select-none" : ""}`}>
        {/* Code Editor - resizable */}
        {codeEditorVisible && (
          <div
            className="relative flex flex-col border-r border-border"
            style={{ width: panelWidth, minWidth: MIN_PANEL_WIDTH, maxWidth: MAX_PANEL_WIDTH }}
          >
            <CodeViewer
              dbml={project.dbml}
              repoName={project.id}
              repoOwner={project.owner}
              onDbmlChange={handleDbmlEdit}
              onEdit={handleDbmlEdit}
            />
            {/* Resize handle */}
            <div
              onMouseDown={handleMouseDown}
              className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 active:bg-primary/70 transition-colors ${isResizing ? "bg-primary/70" : ""}`}
            />
          </div>
        )}

        {/* Schema Canvas */}
        <div className="flex-1 relative bg-canvas overflow-hidden">
          {/* Code Editor Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-sm"
            onClick={() => setCodeEditorVisible(!codeEditorVisible)}
            title={codeEditorVisible ? "Hide code editor" : "Show code editor"}
          >
            {codeEditorVisible ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelRightClose className="w-4 h-4" />
            )}
          </Button>
          <SchemaCanvas
            ref={canvasRef}
            tables={project.tables}
            refs={project.refs}
            selectedTable={selectedTable}
            onTableSelect={setSelectedTable}
            nodesDraggable={true}
            showMinimap={true}
          />
          <CanvasControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onFitToScreen={handleFitToScreen}
            projectPath={`/${project.owner ?? "schema"}/${project.id}`}
            projectName={project.name}
          />

          {/* Parse Errors Panel */}
          {parseErrors.length > 0 && (
            <div className="absolute bottom-3 left-3 right-3 z-10 max-h-40 overflow-auto bg-destructive/10 border border-destructive/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-between px-3 py-2 border-b border-destructive/20">
                <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    {parseErrors.length} parsing error{parseErrors.length > 1 ? "s" : ""}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={() => setParseErrors([])}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <ul className="px-3 py-2 space-y-1">
                {parseErrors.map((error, index) => (
                  <li key={index} className="text-sm text-destructive/90 font-mono">
                    {error.line && error.column && (
                      <span className="text-destructive/70">
                        Line {error.line}:{error.column} -{" "}
                      </span>
                    )}
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
