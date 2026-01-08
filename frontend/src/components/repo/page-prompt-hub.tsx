import { useState } from "react"
import { Copy, Check, Sparkles, Palette, Settings2, ChevronRight, Loader2, ChevronDown, ExternalLink, Hammer, Lock } from "lucide-react"
import { toast } from "sonner"
import { ProjectHeader } from "@/components/repo/project-header.tsx"
import { OptimizeResultDialog } from "@/components/repo/optimize-result-dialog.tsx"
import { DesignTemplateCard, DesignTemplatePreview } from "@/components/design-template-card.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu.tsx"
import { cn } from "@/lib/utils.ts"
import { stackTemplates, type StackTemplate } from "@/lib/stack-templates.ts"
import { designTemplates, type DesignTemplate } from "@/lib/design-templates.ts"
import { vibePlatforms } from "@/lib/vibe-platforms.ts"
import { useAuth } from "@/hooks/useAuth.ts"
import client from "@/lib/api.ts"
import type { Project, ProjectMetadata } from "@/lib/data.ts"

const defaultMetadata: ProjectMetadata = {
  frontend: {
    framework: "Next.js",
    language: "TypeScript",
    styling: "Tailwind CSS",
  },
  backend: {
    framework: "Next.js API Routes",
    language: "TypeScript",
    database: "PostgreSQL",
  },
  notes: "",
}

const frontendFrameworkOptions = ["Next.js", "React", "Vue", "Svelte", "Nuxt", "Remix", "HTMX", "Hotwire", "Blazor", "None"]
const frontendLanguageOptions = ["TypeScript", "JavaScript", "C#", "N/A"]
const stylingOptions = ["Tailwind CSS", "CSS Modules", "Styled Components", "Bootstrap", "Sass", "N/A"]

const backendFrameworkOptions = ["Next.js API Routes", "Express", "FastAPI", "Django", "Ruby on Rails", "Laravel", "Spring Boot", "ASP.NET Core", "Phoenix", "Actix Web", "Gin", "tRPC", "Supabase", "Node.js"]
const backendLanguageOptions = ["TypeScript", "JavaScript", "Python", "Ruby", "PHP", "Java", "C#", "Elixir", "Rust", "Go"]
const databaseOptions = ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "SQL Server"]

type TabType = "stack" | "design"

interface PagePromptHubProps {
  project: Project
}

export function PagePromptHub({ project }: PagePromptHubProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("design")
  const [metadata, setMetadata] = useState<ProjectMetadata>(defaultMetadata)
  const [selectedStackTemplate, setSelectedStackTemplate] = useState<string | null>(null)
  const [selectedDesignTemplate, setSelectedDesignTemplate] = useState<DesignTemplate | null>(
    () => designTemplates[Math.floor(Math.random() * Math.min(9, designTemplates.length))]
  )
  const [showCustomize, setShowCustomize] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizedPrompt, setOptimizedPrompt] = useState("")
  const [isOptimizeModalOpen, setIsOptimizeModalOpen] = useState(false)

  const handleStackTemplateSelect = (template: StackTemplate) => {
    setSelectedStackTemplate(template.id)
    setMetadata({
      ...metadata,
      frontend: template.frontend,
      backend: template.backend,
    })
    setShowCustomize(false)
  }

  const generatePrompt = () => {
    let prompt = `## CONTEXT: Database Schema

Use the following DBML schema as the definitive source of truth for the data model. All generated code must adhere to these definitions.`

    if (selectedStackTemplate) {
      prompt += `

### Project Stack

**Frontend:**
- Framework: ${metadata.frontend.framework}
- Language: ${metadata.frontend.language}
- Styling: ${metadata.frontend.styling}

**Backend:**
- Framework: ${metadata.backend.framework}
- Language: ${metadata.backend.language}
- Database: ${metadata.backend.database}${metadata.notes ? `

**Notes:** ${metadata.notes}` : ""}`
    }

    if (selectedDesignTemplate) {
      prompt += `

### Design System: ${selectedDesignTemplate.name}

${selectedDesignTemplate.description}

**Visual Characteristics:**
${selectedDesignTemplate.characteristics.map((c) => `- ${c}`).join("\n")}

**Color Palette:**
- Primary: ${selectedDesignTemplate.colors.primary}
- Secondary: ${selectedDesignTemplate.colors.secondary}
- Accent: ${selectedDesignTemplate.colors.accent}
- Background: ${selectedDesignTemplate.colors.background}`
    }

    prompt += `

### DBML Schema

\`\`\`dbml
${project.dbml || "// No schema available"}
\`\`\`

---

When generating code:
1. Use the exact table and column names from the schema above
2. Respect all foreign key relationships
3. Handle nullable fields appropriately`

    let ruleNum = 4
    if (selectedStackTemplate) {
      prompt += `
${ruleNum}. Follow the project stack conventions specified above`
      ruleNum++
    }

    if (selectedDesignTemplate) {
      prompt += `
${ruleNum}. Apply the ${selectedDesignTemplate.name} design system consistently across all components
${ruleNum + 1}. Use the color palette for theming (CSS variables or theme config)
${ruleNum + 2}. Match the visual characteristics described above
${ruleNum + 3}. Ensure responsive design for mobile and desktop`
    }

    return prompt
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOptimize = async () => {
    if (!user) {
      toast.error("Please log in to optimize prompts")
      return
    }

    setIsOptimizing(true)
    const { data, error } = await client.POST("/user/optimize-prompt", {
      body: { prompt: generatePrompt() },
    })
    setIsOptimizing(false)

    if (error || !data) {
      return
    }

    setOptimizedPrompt(data.optimized_prompt)
    setIsOptimizeModalOpen(true)
  }

  const currentStackTemplate = stackTemplates.find((t) => t.id === selectedStackTemplate)

  const handleBuildWith = (url: string) => {
    navigator.clipboard.writeText(generatePrompt())
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProjectHeader project={project} activePage="prompt" />

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Prompt for "{project.name}"</h1>
            <p className="text-muted-foreground">
              Configure your stack and design system to generate optimized prompts for AI coding assistants.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Configuration */}
            <div className="space-y-6 flex flex-col">
              {/* Tab Navigation */}
              <div className="flex gap-1 p-1 bg-muted/50 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab("design")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    activeTab === "design"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Palette className="w-4 h-4" />
                  Design System
                  {selectedDesignTemplate && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("stack")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    activeTab === "stack"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  Platform Stack
                  {selectedStackTemplate && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              </div>

              {/* Stack Tab Content */}
              {activeTab === "stack" && (
                <div className="space-y-6">
                  {/* Template Grid */}
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Stack Templates
                      </h2>
                      {selectedStackTemplate && (
                        <button
                          onClick={() => setSelectedStackTemplate(null)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Clear selection
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Optional: Configure stack for your prompt
                    </p>
                    <div className="max-h-72 overflow-y-auto pr-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {stackTemplates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => {
                              if (selectedStackTemplate === template.id) {
                                setSelectedStackTemplate(null)
                              } else {
                                handleStackTemplateSelect(template)
                              }
                            }}
                            className={cn(
                              "text-left p-3 rounded-lg border transition-all",
                              selectedStackTemplate === template.id
                                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base">{template.icon}</span>
                              <span className="font-medium text-sm text-foreground">{template.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Customize Toggle */}
                  <section>
                    <button
                      onClick={() => setShowCustomize(!showCustomize)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Settings2 className="w-4 h-4" />
                      <span>Customize Stack</span>
                      <ChevronRight className={cn("w-4 h-4 transition-transform", showCustomize && "rotate-90")} />
                    </button>

                    {showCustomize && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border space-y-4">
                        {/* Frontend Section */}
                        <div>
                          <h5 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Frontend</h5>
                          <div className="grid grid-cols-3 gap-3">
                            <StackSelect
                              label="Framework"
                              value={metadata.frontend.framework}
                              options={frontendFrameworkOptions}
                              onChange={(v) => {
                                setMetadata({ ...metadata, frontend: { ...metadata.frontend, framework: v } })
                                setSelectedStackTemplate(null)
                              }}
                            />
                            <StackSelect
                              label="Language"
                              value={metadata.frontend.language}
                              options={frontendLanguageOptions}
                              onChange={(v) => {
                                setMetadata({ ...metadata, frontend: { ...metadata.frontend, language: v } })
                                setSelectedStackTemplate(null)
                              }}
                            />
                            <StackSelect
                              label="Styling"
                              value={metadata.frontend.styling}
                              options={stylingOptions}
                              onChange={(v) => {
                                setMetadata({ ...metadata, frontend: { ...metadata.frontend, styling: v } })
                                setSelectedStackTemplate(null)
                              }}
                            />
                          </div>
                        </div>

                        {/* Backend Section */}
                        <div>
                          <h5 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Backend</h5>
                          <div className="grid grid-cols-3 gap-3">
                            <StackSelect
                              label="Framework"
                              value={metadata.backend.framework}
                              options={backendFrameworkOptions}
                              onChange={(v) => {
                                setMetadata({ ...metadata, backend: { ...metadata.backend, framework: v } })
                                setSelectedStackTemplate(null)
                              }}
                            />
                            <StackSelect
                              label="Language"
                              value={metadata.backend.language}
                              options={backendLanguageOptions}
                              onChange={(v) => {
                                setMetadata({ ...metadata, backend: { ...metadata.backend, language: v } })
                                setSelectedStackTemplate(null)
                              }}
                            />
                            <StackSelect
                              label="Database"
                              value={metadata.backend.database}
                              options={databaseOptions}
                              onChange={(v) => {
                                setMetadata({ ...metadata, backend: { ...metadata.backend, database: v } })
                                setSelectedStackTemplate(null)
                              }}
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1.5">Additional Notes</label>
                          <textarea
                            value={metadata.notes}
                            onChange={(e) => setMetadata({ ...metadata, notes: e.target.value })}
                            placeholder="Any extra context for the LLM..."
                            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-20 font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Current Stack Preview */}
                  {/*{currentStackTemplate && (*/}
                  {/*  <section className="p-4 bg-muted/30 rounded-lg border border-border">*/}
                  {/*    <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">*/}
                  {/*      Selected: {currentStackTemplate.name}*/}
                  {/*    </h3>*/}
                  {/*    <div className="space-y-2">*/}
                  {/*      <div className="flex flex-wrap items-center gap-2">*/}
                  {/*        <span className="text-xs text-muted-foreground w-16">Frontend:</span>*/}
                  {/*        <StackBadge label={metadata.frontend.framework} />*/}
                  {/*        <StackBadge label={metadata.frontend.language} />*/}
                  {/*        <StackBadge label={metadata.frontend.styling} />*/}
                  {/*      </div>*/}
                  {/*      <div className="flex flex-wrap items-center gap-2">*/}
                  {/*        <span className="text-xs text-muted-foreground w-16">Backend:</span>*/}
                  {/*        <StackBadge label={metadata.backend.framework} />*/}
                  {/*        <StackBadge label={metadata.backend.language} />*/}
                  {/*        <StackBadge label={metadata.backend.database} />*/}
                  {/*      </div>*/}
                  {/*    </div>*/}
                  {/*  </section>*/}
                  {/*)}*/}

                  {!currentStackTemplate && (
                    <div className="p-4 bg-muted/20 rounded-lg border border-dashed border-border text-center">
                      <p className="text-sm text-muted-foreground">
                        No stack template selected. Your prompt will include design system only.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Design Tab Content */}
              {activeTab === "design" && (
                <div className="space-y-6">
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Design Templates ({designTemplates.length})
                      </h2>
                      {selectedDesignTemplate && (
                        <button
                          onClick={() => setSelectedDesignTemplate(null)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Clear selection
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Optional: Add visual design guidance to your prompt
                    </p>
                    <div className="max-h-80 overflow-y-auto pr-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {designTemplates.map((template) => (
                          <DesignTemplateCard
                            key={template.id}
                            template={template}
                            selected={selectedDesignTemplate?.id === template.id}
                            onClick={() => setSelectedDesignTemplate(
                              selectedDesignTemplate?.id === template.id ? null : template
                            )}
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Selected Design Preview */}
                  {selectedDesignTemplate && (
                    <section className="p-4 bg-muted/30 rounded-lg border border-border">
                      <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                        Selected: {selectedDesignTemplate.name}
                      </h3>
                      <DesignTemplatePreview template={selectedDesignTemplate} />
                    </section>
                  )}

                  {!selectedDesignTemplate && (
                    <div className="p-4 bg-muted/20 rounded-lg border border-dashed border-border text-center">
                      <p className="text-sm text-muted-foreground">
                        No design template selected. Your prompt will include DB schema only.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Prompt Preview */}
            <div className="space-y-4 flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold tracking-wider text-primary drop-shadow-[0_0_10px_var(--primary)] animate-pulse">
                  OneShotPrompt
                </h2>
                <div className="flex items-center">
                  <Button onClick={copyPrompt} className="gap-2 rounded-r-none" size="sm" variant={"secondary"}>
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="rounded-l-none border-l-0 px-2" disabled={isOptimizing} variant={"secondary"}>
                        {isOptimizing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleOptimize} disabled={isOptimizing}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isOptimizing ? "Optimizing..." : "Gemini 3 Optimized Prompt"}
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={true}>
                        <Lock className="w-4 h-4 mr-2" />
                        With all possible subpages
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={true}>
                        <Lock className="w-4 h-4 mr-2" />
                        With sample data
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={true}>
                        <Lock className="w-4 h-4 mr-2" />
                        With accessibility requirements
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={true}>
                        <Lock className="w-4 h-4 mr-2" />
                        With API endpoints
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    className="ml-2 gap-2 rounded-r-none"
                    size="sm"
                    onClick={() => handleBuildWith(vibePlatforms[0].aff_url)}
                  >
                    <Hammer className="w-4 h-4" />
                    Build
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="rounded-l-none border-l-0 px-2">
                          <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="text-xs text-muted-foreground">Build with</DropdownMenuLabel>
                      {vibePlatforms.map((platform) => (
                        <DropdownMenuItem
                          key={platform.id}
                          onClick={() => handleBuildWith(platform.aff_url)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {platform.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Selection Summary */}
              <div className="flex flex-wrap gap-2">
                {currentStackTemplate && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                    <Sparkles className="w-3 h-3" />
                    {currentStackTemplate.name}
                  </span>
                )}
                {selectedDesignTemplate && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md">
                    <Palette className="w-3 h-3" />
                    {selectedDesignTemplate.name}
                  </span>
                )}
              </div>

              <div className="flex-1 rounded-lg border border-border bg-muted/30 overflow-hidden h-[50vh]">
                <textarea
                  className="p-4 text-xs text-foreground font-mono whitespace-pre-wrap w-full h-full overflow-y-auto leading-relaxed bg-transparent resize-none select-none cursor-default focus:outline-none"
                  value={generatePrompt()}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <OptimizeResultDialog
        open={isOptimizeModalOpen}
        onOpenChange={setIsOptimizeModalOpen}
        optimizedPrompt={optimizedPrompt}
      />
    </div>
  )
}

function StackSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground block mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border rounded-md px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

function StackBadge({ label }: { label: string }) {
  return (
    <span className="px-2 py-1 text-xs font-mono bg-background border border-border rounded-md text-foreground">
      {label}
    </span>
  )
}
