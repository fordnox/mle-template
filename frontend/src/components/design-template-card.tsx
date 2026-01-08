import { useState } from "react"
import { cn } from "@/lib/utils.ts"
import type { DesignTemplate } from "@/lib/design-templates.ts"

interface DesignTemplateCardProps {
  template: DesignTemplate
  selected?: boolean
  onClick?: () => void
  size?: "sm" | "md"
}

export function DesignTemplateCard({
  template,
  selected = false,
  onClick,
  size = "md",
}: DesignTemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isButton = !!onClick
  const Component = isButton ? "button" : "div"

  const sizeClasses = {
    sm: {
      padding: "p-3",
      icon: "text-base",
      colorBox: "w-4 h-4",
      lineClamp: "line-clamp-1",
      gap: "mb-1",
    },
    md: {
      padding: "p-4",
      icon: "text-lg",
      colorBox: "w-5 h-5",
      lineClamp: "line-clamp-2",
      gap: "mb-2",
    },
  }

  const s = sizeClasses[size]

  return (
    <Component
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden text-left rounded-lg border transition-all aspect-4/3",
        selected
          ? "border-primary ring-1 ring-primary/30"
          : "border-border hover:border-muted-foreground/30"
      )}
    >
      {/* Thumbnail */}
      <img
        src={`/design-thumbs/${template.id}.png`}
        alt={template.name}
        className="w-full h-full object-cover"
      />

      {/* Details overlay - fades in on hover */}
      <div
        className={cn(
          `absolute inset-0 bg-card ${s.padding} flex flex-col transition-opacity duration-200`,
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <div className={`flex items-center gap-2 ${s.gap}`}>
          <span className={s.icon}>{template.icon}</span>
          <span className="font-medium text-sm text-foreground">{template.name}</span>
        </div>
        <p className={`text-xs text-muted-foreground ${s.lineClamp} mb-2`}>
          {template.description}
        </p>
        {/* Color Preview */}
        <div className="flex gap-1 mt-auto">
          <div
            className={`${s.colorBox} rounded border border-border`}
            style={{ backgroundColor: template.colors.primary }}
          />
          <div
            className={`${s.colorBox} rounded border border-border`}
            style={{ backgroundColor: template.colors.secondary }}
          />
          <div
            className={`${s.colorBox} rounded border border-border`}
            style={{ backgroundColor: template.colors.accent }}
          />
          <div
            className={`${s.colorBox} rounded border border-border`}
            style={{ backgroundColor: template.colors.background }}
          />
        </div>
      </div>
    </Component>
  )
}

interface DesignTemplatePreviewProps {
  template: DesignTemplate
}

export function DesignTemplatePreview({ template }: DesignTemplatePreviewProps) {
  return (
    <div className="space-y-3">
      <div>
        <span className="text-xs text-muted-foreground">Characteristics:</span>
        <ul className="mt-1 space-y-1">
          {template.characteristics.slice(0, 3).map((char, i) => (
            <li key={i} className="text-xs text-foreground flex items-start gap-2">
              <span className="text-primary">•</span>
              {char}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Colors:</span>
        <div className="flex gap-1">
          {Object.entries(template.colors).map(([name, color]) => (
            <div
              key={name}
              className="w-5 h-5 rounded border border-border"
              style={{ backgroundColor: color }}
              title={`${name}: ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
