import { useState } from "react"
import { cn } from "@/lib/utils"
import { Loader2, LayoutGrid, X, Palette } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { DesignArtifactCard, DesignArtifactCardSkeleton } from "./design-artifact-card"
import { DesignInput } from "./design-input"
import { SideDrawer } from "./side-drawer"
import { useDesignsQuery, useGenerateDesigns, useDeleteDesign, useUpdateDesign, useGenerateVariations } from "@/hooks/useDesignsQuery"
import type { Project } from "@/lib/data"
import type { components } from "@/lib/schema"

type DesignResponse = components["schemas"]["DesignResponse"]

interface DesignGeneratorProps {
  project: Project
}

export function DesignGenerator({ project }: DesignGeneratorProps) {
  const [focusedDesignId, setFocusedDesignId] = useState<string | null>(null)
  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean
    mode: "code" | "variations" | null
    data?: DesignResponse
  }>({ isOpen: false, mode: null })

  // Queries and mutations
  const { data: designsData, isLoading: isLoadingDesigns } = useDesignsQuery(project.id)
  const generateMutation = useGenerateDesigns(project.id)
  const deleteMutation = useDeleteDesign(project.id)
  const updateMutation = useUpdateDesign(project.id)
  const variationsMutation = useGenerateVariations(project.id)

  const designs = designsData?.designs ?? []
  const focusedDesign = designs.find((d) => d.id === focusedDesignId)
  const tableSuggestions = project.tables?.map((t) => t.name) ?? []

  const handleGenerate = async (prompt: string) => {
    try {
      await generateMutation.mutateAsync({ prompt })
      toast.success("Designs generated successfully!")
    } catch {
      toast.error("Failed to generate designs")
    }
  }

  const handleDelete = async (designId: string) => {
    try {
      await deleteMutation.mutateAsync(designId)
      if (focusedDesignId === designId) {
        setFocusedDesignId(null)
      }
      toast.success("Design deleted")
    } catch {
      toast.error("Failed to delete design")
    }
  }

  const handleToggleFavorite = async (design: DesignResponse) => {
    try {
      await updateMutation.mutateAsync({
        designId: design.id,
        is_favorite: !design.is_favorite,
      })
    } catch {
      toast.error("Failed to update design")
    }
  }

  const handleViewCode = (design: DesignResponse) => {
    setDrawerState({ isOpen: true, mode: "code", data: design })
  }

  const handleGenerateVariations = async (design: DesignResponse) => {
    try {
      await variationsMutation.mutateAsync({
        designId: design.id,
        prompt: "Create variations with different visual styles",
      })
      toast.success("Variations generated!")
    } catch {
      toast.error("Failed to generate variations")
    }
  }

  const isGenerating = generateMutation.isPending || variationsMutation.isPending

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Empty State */}
        {!isLoadingDesigns && designs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <h3 className="text-xl font-semibold text-foreground mb-2">Design inspirations will be shown here</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Get Inspired by imagining different sections of the app by generating UI components and designs based on your database schema. Describe what you want to build.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoadingDesigns && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DesignArtifactCardSkeleton />
            <DesignArtifactCardSkeleton />
            <DesignArtifactCardSkeleton />
          </div>
        )}

        {/* Design Grid */}
        {!isLoadingDesigns && designs.length > 0 && (
          <div
            className={cn(
              "grid gap-6 transition-all duration-300",
              focusedDesignId ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {designs.map((design) => (
              <div
                key={design.id}
                className={cn(
                  "transition-all duration-300",
                  focusedDesignId && focusedDesignId !== design.id && "hidden"
                )}
              >
                <DesignArtifactCard
                  design={design}
                  isFocused={focusedDesignId === design.id}
                  onClick={() => setFocusedDesignId(focusedDesignId === design.id ? null : design.id)}
                  onDelete={() => handleDelete(design.id)}
                  onToggleFavorite={() => handleToggleFavorite(design)}
                  onViewCode={() => handleViewCode(design)}
                  onGenerateVariations={() => handleGenerateVariations(design)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Generating indicator */}
        {isGenerating && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <DesignArtifactCardSkeleton />
            <DesignArtifactCardSkeleton />
            <DesignArtifactCardSkeleton />
          </div>
        )}
      </div>

      {/* Focused Design Overlay Close Button */}
      {focusedDesignId && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-50"
          onClick={() => setFocusedDesignId(null)}
        >
          <X className="w-5 h-5" />
        </Button>
      )}

      {/* Back to Grid Button */}
      {focusedDesignId && (
        <Button
          variant="outline"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          onClick={() => setFocusedDesignId(null)}
        >
          <LayoutGrid className="w-4 h-4 mr-2" />
          View All Designs
        </Button>
      )}

      {/* Input Area - Fixed at bottom */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border p-6">
        <div className="max-w-3xl mx-auto">
          <DesignInput onSubmit={handleGenerate} isLoading={isGenerating} tableSuggestions={tableSuggestions} />
        </div>
      </div>

      {/* Code Drawer */}
      <SideDrawer
        isOpen={drawerState.isOpen && drawerState.mode === "code"}
        onClose={() => setDrawerState({ isOpen: false, mode: null })}
        title={`Source Code - ${drawerState.data?.name || ""}`}
      >
        {drawerState.data && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">HTML/CSS/JavaScript</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(drawerState.data!.html)
                  toast.success("Code copied to clipboard")
                }}
              >
                Copy Code
              </Button>
            </div>
            <pre className="p-4 rounded-lg bg-muted/50 border border-border overflow-auto max-h-[70vh]">
              <code className="text-sm text-green-400 font-mono whitespace-pre-wrap">{drawerState.data.html}</code>
            </pre>
          </div>
        )}
      </SideDrawer>
    </div>
  )
}
