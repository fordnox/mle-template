import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { ProjectHeader } from "@/components/repo/project-header.tsx"
import { Button } from "@/components/ui/button.tsx"
import { cn } from "@/lib/utils.ts"
import { designTemplates, type DesignTemplate } from "@/lib/design-templates.ts"
import type { Project } from "@/lib/data.ts"

interface PageDesignProps {
  project: Project
}

export function PageDesign({ project }: PageDesignProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(designTemplates[0])
  const [copied, setCopied] = useState(false)

  const generatePrompt = () => {
    if (!selectedTemplate) {
      return "Please select a design template to generate a prompt."
    }

    return `## CONTEXT: Database Schema with Design System

Use the following DBML schema and apply the specified design system when generating UI components.

### Design System: ${selectedTemplate.name}

${selectedTemplate.description}

**Visual Characteristics:**
${selectedTemplate.characteristics.map((c) => `- ${c}`).join("\n")}

**Color Palette:**
- Primary: ${selectedTemplate.colors.primary}
- Secondary: ${selectedTemplate.colors.secondary}
- Accent: ${selectedTemplate.colors.accent}
- Background: ${selectedTemplate.colors.background}

### DBML Schema

\`\`\`dbml
${project.dbml || "// No schema available"}
\`\`\`

---

When generating UI:
1. Apply the ${selectedTemplate.name} design system consistently across all components
2. Use the color palette for theming (CSS variables or theme config)
3. Match the visual characteristics described above
4. Create components for each table in the schema
5. Include proper form fields based on column types
6. Ensure responsive design for mobile and desktop
7. Add appropriate hover/focus states matching the design style`
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProjectHeader project={project} activePage="prompt" />

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Template Selection */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Design Templates</h2>
                <p className="text-sm text-muted-foreground">
                  Select a visual style to include in your LLM prompt
                </p>
                <div className="max-h-[520px] overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-3">
                    {designTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={cn(
                          "text-left p-4 rounded-lg border transition-all",
                          selectedTemplate?.id === template.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{template.icon}</span>
                          <span className="font-medium text-foreground">{template.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {template.description}
                        </p>
                        {/* Color Preview */}
                        <div className="flex gap-1">
                          <div
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: template.colors.primary }}
                            title="Primary"
                          />
                          <div
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: template.colors.secondary }}
                            title="Secondary"
                          />
                          <div
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: template.colors.accent }}
                            title="Accent"
                          />
                          <div
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: template.colors.background }}
                            title="Background"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Selected Template Details */}
              {selectedTemplate && (
                <section className="p-4 bg-muted/30 rounded-lg border border-border">
                  <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                    Selected: {selectedTemplate.name}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Characteristics:</span>
                      <ul className="mt-1 space-y-1">
                        {selectedTemplate.characteristics.slice(0, 3).map((char, i) => (
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
                        {Object.entries(selectedTemplate.colors).map(([name, color]) => (
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
                </section>
              )}
            </div>

            {/* Right Column - Prompt Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Prompt Preview</h2>
                <Button onClick={copyPrompt} className="gap-2" size="default" disabled={!selectedTemplate}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 overflow-hidden">
                <pre className="p-4 text-sm text-foreground font-mono whitespace-pre-wrap overflow-x-auto max-h-[560px] overflow-y-auto">
                  {generatePrompt()}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
