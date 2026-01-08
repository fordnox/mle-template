import { useState, useRef, useCallback } from "react"
import { SchemaSidebar } from "@/components/canvas/schema-sidebar.tsx"
import { SchemaCanvas, type SchemaCanvasHandle } from "@/components/canvas/schema-canvas.tsx"
import { CanvasControls } from "@/components/canvas/canvas-controls.tsx"
import { Button } from "@/components/ui/button.tsx"
import { PanelLeftClose, PanelRightClose } from "lucide-react"
import type { Project } from "@/lib/data.ts"

interface SchemaViewerProps {
  project: Project
}

export function SchemaViewer({ project }: SchemaViewerProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const canvasRef = useRef<SchemaCanvasHandle>(null)

  // Handle table selection from canvas (just highlight, no centering)
  const handleCanvasTableSelect = useCallback((tableName: string) => {
    setSelectedTable(tableName)
  }, [])

  // Handle table selection from sidebar (highlight and center)
  const handleSidebarTableSelect = useCallback((tableName: string) => {
    setSelectedTable(tableName)
    // Center on the selected table using the canvas ref
    canvasRef.current?.centerOnNode(tableName)
  }, [])

  // Canvas control handlers
  const handleZoomIn = useCallback(() => {
    canvasRef.current?.zoomIn()
  }, [])

  const handleZoomOut = useCallback(() => {
    canvasRef.current?.zoomOut()
  }, [])

  const handleFitToScreen = useCallback(() => {
    canvasRef.current?.fitView()
  }, [])

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      {sidebarVisible && (
        <SchemaSidebar
          tables={project.tables}
          selectedTable={selectedTable}
          onTableSelect={handleSidebarTableSelect}
        />
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 relative bg-canvas overflow-hidden">
        {/* Sidebar Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarVisible(!sidebarVisible)}
          title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
        >
          {sidebarVisible ? (
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
          onTableSelect={handleCanvasTableSelect}
          showMinimap={true}
          nodesDraggable={true}
        />

        <CanvasControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitToScreen={handleFitToScreen}
          projectPath={`/${project.owner ?? "schema"}/${project.id}`}
          projectName={project.name}
        />
      </div>
    </div>
  )
}
