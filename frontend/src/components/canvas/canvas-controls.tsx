import { Download } from "lucide-react"
import { Link } from "react-router-dom"
import { toPng, toJpeg, toSvg } from "html-to-image"
import { Button } from "@/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { exportCategories } from "@/lib/export-formats.ts"
import { toast } from "sonner"

interface CanvasControlsProps {
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFitToScreen?: () => void
  projectPath: string
  projectName: string
  embedded?: boolean
}

const imageFormats = exportCategories.find((c) => c.id === "image")?.formats ?? []

export function CanvasControls({
  projectPath,
  projectName,
}: CanvasControlsProps) {
  const handleExport = async (format: string) => {
    // Find the React Flow viewport element
    const viewport = document.querySelector(".react-flow__viewport") as HTMLElement
    if (!viewport) {
      toast.error("Could not find canvas to export")
      return
    }

    try {
      let dataUrl: string
      let filename: string

      // Get the bounding box of all nodes to determine export size
      const nodes = document.querySelectorAll(".react-flow__node")
      if (nodes.length === 0) {
        toast.error("No content to export")
        return
      }

      switch (format) {
        case "png":
          dataUrl = await toPng(viewport, {
            backgroundColor: "transparent",
            filter: (node) => {
              // Exclude minimap and controls from export
              const className = node.className?.toString() || ""
              return !className.includes("react-flow__minimap") &&
                     !className.includes("react-flow__controls")
            },
          })
          filename = `SchemaHub.AI.${projectName}.png`
          break
        case "jpg":
          dataUrl = await toJpeg(viewport, {
            backgroundColor: "#0a0a0f",
            quality: 0.95,
            filter: (node) => {
              const className = node.className?.toString() || ""
              return !className.includes("react-flow__minimap") &&
                     !className.includes("react-flow__controls")
            },
          })
          filename = `SchemaHub.AI.${projectName}.jpg`
          break
        case "svg":
          dataUrl = await toSvg(viewport, {
            backgroundColor: "transparent",
            filter: (node) => {
              const className = node.className?.toString() || ""
              return !className.includes("react-flow__minimap") &&
                     !className.includes("react-flow__controls")
            },
          })
          filename = `SchemaHub.AI.${projectName}.svg`
          break
        default:
          return
      }

      // Trigger download
      const link = document.createElement("a")
      link.download = filename
      link.href = dataUrl
      link.click()

      toast.success(`Downloaded ${filename}`)
    } catch (err) {
      toast.error("Export failed")
      console.error("Export error:", err)
    }
  }

  const downloadButton = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {imageFormats.map((format) => {
          const Icon = format.icon
          return (
            <DropdownMenuItem key={format.id} onClick={() => handleExport(format.id)}>
              <Icon className={`w-4 h-4 mr-2 ${format.iconColor}`} />
              {format.name}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`${projectPath}/export`}>More exports...</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="absolute top-6 right-6 z-10 bg-background/80 backdrop-blur-sm hidden md:block">
      {downloadButton}
    </div>
  )
}
