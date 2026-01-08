
import { useState } from "react"
import { Sparkles, Copy, Check, ChevronRight, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import { cn } from "@/lib/utils.ts"
import { stackTemplates, type StackTemplate } from "@/lib/stack-templates.ts"
import type { ProjectMetadata } from "@/lib/data.ts"

interface LLMPromptDialogProps {
  projectName: string
  dbml?: string
  metadata: ProjectMetadata
  onMetadataChange: (metadata: ProjectMetadata) => void
}

const frontendFrameworkOptions = ["Next.js", "React", "Vue", "Svelte", "Nuxt", "Remix", "HTMX", "Hotwire", "Blazor", "None"]
const frontendLanguageOptions = ["TypeScript", "JavaScript", "C#", "N/A"]
const stylingOptions = ["Tailwind CSS", "CSS Modules", "Styled Components", "Bootstrap", "Sass", "N/A"]

const backendFrameworkOptions = ["Next.js API Routes", "Express", "FastAPI", "Django", "Ruby on Rails", "Laravel", "Spring Boot", "ASP.NET Core", "Phoenix", "Actix Web", "Gin", "tRPC", "Supabase", "Node.js"]
const backendLanguageOptions = ["TypeScript", "JavaScript", "Python", "Ruby", "PHP", "Java", "C#", "Elixir", "Rust", "Go"]
const databaseOptions = ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "SQL Server"]

export function PagePromptStacks({ projectName, dbml, metadata, onMetadataChange }: LLMPromptDialogProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showCustomize, setShowCustomize] = useState(false)

  const handleTemplateSelect = (template: StackTemplate) => {
    setSelectedTemplate(template.id)
    onMetadataChange({
      ...metadata,
      frontend: template.frontend,
      backend: template.backend,
    })
    setShowCustomize(false)
  }

  const generatePrompt = () => {
    const prompt = `## CONTEXT: Database Schema

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
${dbml || "// No schema available"}
\`\`\`

---

When generating code:
1. Use the exact table and column names from the schema above
2. Respect all foreign key relationships
3. Handle nullable fields appropriately
4. Follow the project stack conventions specified above`

    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentTemplate = stackTemplates.find((t) => t.id === selectedTemplate)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2" size="sm">
          <Sparkles className="w-4 h-4" />
          Generate LLM Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card border-border p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generate LLM Prompt
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Select a project stack template to configure your prompt context
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Template Grid */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Stack Templates</h4>
            <div className="max-h-64 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-2">
                {stackTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={cn(
                      "text-left p-3 rounded-lg border transition-all",
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-muted-foreground/30 hover:bg-muted/50",
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
          </div>

          {/* Customize Toggle */}
          <div>
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
                        onMetadataChange({ ...metadata, frontend: { ...metadata.frontend, framework: v } })
                        setSelectedTemplate(null)
                      }}
                    />
                    <StackSelect
                      label="Language"
                      value={metadata.frontend.language}
                      options={frontendLanguageOptions}
                      onChange={(v) => {
                        onMetadataChange({ ...metadata, frontend: { ...metadata.frontend, language: v } })
                        setSelectedTemplate(null)
                      }}
                    />
                    <StackSelect
                      label="Styling"
                      value={metadata.frontend.styling}
                      options={stylingOptions}
                      onChange={(v) => {
                        onMetadataChange({ ...metadata, frontend: { ...metadata.frontend, styling: v } })
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
                        onMetadataChange({ ...metadata, backend: { ...metadata.backend, framework: v } })
                        setSelectedTemplate(null)
                      }}
                    />
                    <StackSelect
                      label="Language"
                      value={metadata.backend.language}
                      options={backendLanguageOptions}
                      onChange={(v) => {
                        onMetadataChange({ ...metadata, backend: { ...metadata.backend, language: v } })
                        setSelectedTemplate(null)
                      }}
                    />
                    <StackSelect
                      label="Database"
                      value={metadata.backend.database}
                      options={databaseOptions}
                      onChange={(v) => {
                        onMetadataChange({ ...metadata, backend: { ...metadata.backend, database: v } })
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
                    onChange={(e) => onMetadataChange({ ...metadata, notes: e.target.value })}
                    placeholder="Any extra context for the LLM..."
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-20 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Current Stack Preview */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Current Configuration
            </h4>
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
              <p className="text-xs text-muted-foreground mt-2">
                Using template: <span className="text-foreground">{currentTemplate.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Prompt will be copied to clipboard</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={generatePrompt}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              size="sm"
            >
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
        </div>
      </DialogContent>
    </Dialog>
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
        className="w-full bg-background border border-border rounded-md px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
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
    <span className="px-2.5 py-1 text-xs font-mono bg-background border border-border rounded-md text-foreground">
      {label}
    </span>
  )
}
