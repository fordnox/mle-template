
import { useState } from "react"
import { Copy, Check, ChevronRight, Settings2 } from "lucide-react"
import { ProjectHeader } from "@/components/repo/project-header.tsx"
import { Button } from "@/components/ui/button.tsx"
import { cn } from "@/lib/utils.ts"
import { stackTemplates, type StackTemplate } from "@/lib/stack-templates.ts"
import type { Project, ProjectMetadata } from "@/lib/data.ts"

const frontendFrameworkOptions = ["Next.js", "React", "Vue", "Svelte", "Nuxt", "Remix", "HTMX", "Hotwire", "Blazor", "None"]
const frontendLanguageOptions = ["TypeScript", "JavaScript", "C#", "N/A"]
const stylingOptions = ["Tailwind CSS", "CSS Modules", "Styled Components", "Bootstrap", "Sass", "N/A"]

const backendFrameworkOptions = ["Next.js API Routes", "Express", "FastAPI", "Django", "Ruby on Rails", "Laravel", "Spring Boot", "ASP.NET Core", "Phoenix", "Actix Web", "Gin", "tRPC", "Supabase", "Node.js"]
const backendLanguageOptions = ["TypeScript", "JavaScript", "Python", "Ruby", "PHP", "Java", "C#", "Elixir", "Rust", "Go"]
const databaseOptions = ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "SQL Server"]

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

interface PromptPageContentProps {
  project: Project
}

export function PagePromptPlatform({ project }: PromptPageContentProps) {
  const [metadata, setMetadata] = useState<ProjectMetadata>(defaultMetadata)
  const [copied, setCopied] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showCustomize, setShowCustomize] = useState(false)

  const handleTemplateSelect = (template: StackTemplate) => {
    setSelectedTemplate(template.id)
    setMetadata({
      ...metadata,
      frontend: template.frontend,
      backend: template.backend,
    })
    setShowCustomize(false)
  }

  const generatePrompt = () => {
    return `## CONTEXT: Database Schema

Use the following DBML schema as the definitive source of truth for the data model. All generated code must adhere to these definitions.

### Project Stack

**Frontend:**
- Framework: ${metadata.frontend.framework}
- Language: ${metadata.frontend.language}
- Styling: ${metadata.frontend.styling}

**Backend:**
- Framework: ${metadata.backend.framework}
- Language: ${metadata.backend.language}
- Database: ${metadata.backend.database}${metadata.notes ? `

**Notes:** ${metadata.notes}` : ""}

### DBML Schema

\`\`\`dbml
${project.dbml || "// No schema available"}
\`\`\`

---

When generating code:
1. Use the exact table and column names from the schema above
2. Respect all foreign key relationships
3. Handle nullable fields appropriately
4. Follow the project stack conventions specified above`
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentTemplate = stackTemplates.find((t) => t.id === selectedTemplate)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProjectHeader project={project} activePage="prompt" />

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              {/* Template Grid */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Stack Templates</h2>
                <p className="text-sm text-muted-foreground">
                  Select a template to configure your prompt context
                </p>
                <div className="max-h-80 overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-3">
                    {stackTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={cn(
                          "text-left p-4 rounded-lg border transition-all",
                          selectedTemplate === template.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{template.icon}</span>
                          <span className="font-medium text-foreground">{template.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
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
                            setSelectedTemplate(null)
                          }}
                        />
                        <StackSelect
                          label="Language"
                          value={metadata.frontend.language}
                          options={frontendLanguageOptions}
                          onChange={(v) => {
                            setMetadata({ ...metadata, frontend: { ...metadata.frontend, language: v } })
                            setSelectedTemplate(null)
                          }}
                        />
                        <StackSelect
                          label="Styling"
                          value={metadata.frontend.styling}
                          options={stylingOptions}
                          onChange={(v) => {
                            setMetadata({ ...metadata, frontend: { ...metadata.frontend, styling: v } })
                            setSelectedTemplate(null)
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
                            setSelectedTemplate(null)
                          }}
                        />
                        <StackSelect
                          label="Language"
                          value={metadata.backend.language}
                          options={backendLanguageOptions}
                          onChange={(v) => {
                            setMetadata({ ...metadata, backend: { ...metadata.backend, language: v } })
                            setSelectedTemplate(null)
                          }}
                        />
                        <StackSelect
                          label="Database"
                          value={metadata.backend.database}
                          options={databaseOptions}
                          onChange={(v) => {
                            setMetadata({ ...metadata, backend: { ...metadata.backend, database: v } })
                            setSelectedTemplate(null)
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
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-24 font-mono"
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Current Stack Preview */}
              <section className="p-4 bg-muted/30 rounded-lg border border-border">
                <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  Current Configuration
                </h3>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">Frontend:</span>
                    <StackBadge label={metadata.frontend.framework} />
                    <StackBadge label={metadata.frontend.language} />
                    <StackBadge label={metadata.frontend.styling} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">Backend:</span>
                    <StackBadge label={metadata.backend.framework} />
                    <StackBadge label={metadata.backend.language} />
                    <StackBadge label={metadata.backend.database} />
                  </div>
                </div>
                {currentTemplate && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Using template: <span className="text-foreground">{currentTemplate.name}</span>
                  </p>
                )}
              </section>
            </div>

            {/* Right Column - Prompt Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Prompt Preview</h2>
                <Button onClick={copyPrompt} className="gap-2" size="default">
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
                <pre className="p-4 text-sm text-foreground font-mono whitespace-pre-wrap overflow-x-auto max-h-[480px] overflow-y-auto">
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
    <span className="px-3 py-1.5 text-sm font-mono bg-background border border-border rounded-md text-foreground">
      {label}
    </span>
  )
}
