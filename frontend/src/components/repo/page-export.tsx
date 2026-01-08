import { useState } from "react"
import { Loader2 } from "lucide-react"
import { ProjectHeader } from "@/components/repo/project-header.tsx"
import { exportCategories } from "@/lib/export-formats.ts"
import { cn } from "@/lib/utils.ts"
import type { Project } from "@/lib/data.ts"
import client from "@/lib/api.ts"
import type { components } from "@/lib/schema"
import { toast } from "sonner"

type ExportFormat = components["schemas"]["ExportResponse"]["format"]

// Image formats that are handled client-side
const IMAGE_FORMATS = ["png", "jpg", "svg", "pdf"]

interface ExportPageContentProps {
  project: Project
}

export function PageExport({ project }: ExportPageContentProps) {
  const [exportingFormat, setExportingFormat] = useState<string | null>(null)

  const handleExport = async (formatId: string) => {
    // Image formats are handled client-side
    if (IMAGE_FORMATS.includes(formatId)) {
      toast.info("Image exports are generated from the diagram view")
      return
    }

    setExportingFormat(formatId)

    try {
      const { data, error } = await client.GET("/repo/{name}/export", {
        params: {
          path: { name: project.id },
          query: { format: formatId as ExportFormat },
        },
      })

      if (error) {
        console.error("Export failed:", error)
        return
      }

      // Trigger download
      const blob = new Blob([data.content], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = data.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export error:", err)
    } finally {
      setExportingFormat(null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProjectHeader project={project} activePage="export" />

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Export Categories */}
          {exportCategories.map((category) => (
            <section key={category.id} className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">{category.label}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {category.formats.map((format) => {
                  const Icon = format.icon
                  const isExporting = exportingFormat === format.id
                  return (
                    <button
                      key={format.id}
                      onClick={() => handleExport(format.id)}
                      disabled={isExporting}
                      className={cn(
                        "text-left p-4 rounded-lg border transition-all hover:bg-muted/50",
                        "border-border hover:border-muted-foreground/30",
                        isExporting && "opacity-70 cursor-wait"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {isExporting ? (
                          <Loader2 className={cn("w-5 h-5 animate-spin", format.iconColor)} />
                        ) : (
                          <Icon className={cn("w-5 h-5", format.iconColor)} />
                        )}
                        <span className="font-medium font-mono text-foreground">{format.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{format.description}</p>
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
