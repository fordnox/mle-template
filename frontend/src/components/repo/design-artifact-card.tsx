import { useState } from "react"
import { cn } from "@/lib/utils"
import { Loader2, Star, Trash2, Code, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { components } from "@/lib/schema"

type DesignResponse = components["schemas"]["DesignResponse"]

interface DesignArtifactCardProps {
  design: DesignResponse
  isFocused: boolean
  isLoading?: boolean
  onClick: () => void
  onDelete?: () => void
  onToggleFavorite?: () => void
  onViewCode?: () => void
  onGenerateVariations?: () => void
}

export function DesignArtifactCard({
  design,
  isFocused,
  isLoading,
  onClick,
  onDelete,
  onToggleFavorite,
  onViewCode,
  onGenerateVariations,
}: DesignArtifactCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card overflow-hidden transition-all duration-300 cursor-pointer group",
        isFocused
          ? "fixed inset-4 md:inset-8 lg:inset-12 z-50 border-primary shadow-2xl"
          : "hover:border-primary/50 hover:shadow-lg",
        isLoading && "animate-pulse"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{design.name}</span>
          {design.is_favorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
        </div>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      {/* Preview */}
      <div className={cn("relative", isFocused ? "h-[calc(100%-120px)]" : "h-48 md:h-64")}>
        <iframe
          srcDoc={design.html}
          title={design.name}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          style={{
            transform: isFocused ? "scale(1)" : "scale(0.5)",
            transformOrigin: "top left",
            width: isFocused ? "100%" : "200%",
            height: isFocused ? "100%" : "200%",
          }}
        />
      </div>

      {/* Action bar - visible on hover or when focused */}
      {(isHovered || isFocused) && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 p-3 bg-background/95 backdrop-blur border-t border-border",
            "transition-opacity duration-200",
            isHovered || isFocused ? "opacity-100" : "opacity-0"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {onViewCode && (
            <Button variant="outline" size="sm" onClick={onViewCode}>
              <Code className="w-4 h-4 mr-1" />
              Code
            </Button>
          )}
          {onGenerateVariations && (
            <Button variant="outline" size="sm" onClick={onGenerateVariations}>
              <Sparkles className="w-4 h-4 mr-1" />
              Variations
            </Button>
          )}
          {onToggleFavorite && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFavorite}
              className={cn(design.is_favorite && "text-yellow-500")}
            >
              <Star className={cn("w-4 h-4", design.is_favorite && "fill-yellow-500")} />
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Skeleton version for loading state
export function DesignArtifactCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden animate-pulse">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <div className="h-4 w-32 bg-muted rounded" />
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
      <div className="h-48 md:h-64 bg-muted/30" />
    </div>
  )
}
