
import { useState } from "react"
import { Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { exportCategories } from "@/lib/export-formats.ts"
import type { ProjectMetadata, Project } from "@/lib/data.ts"
import { PagePromptStacks } from "@/components/repo/page-prompt-stacks.tsx"

interface ExportDropdownProps {
  project: Project,
  metadata: ProjectMetadata
  onMetadataChange: (metadata: ProjectMetadata) => void
}

export function ExportDropdown({ project, metadata, onMetadataChange }: ExportDropdownProps) {
  const [copied, setCopied] = useState(false)

  const handleExport = (format: string) => {
    console.log(`Exporting ${project.name} as ${format}`)
  }

  const copyRawPrompt = () => {
    const prompt = `## CONTEXT: Database Schema

Use the following DBML schema as the definitive source of truth for the data model.

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
\`\`\``

    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
  <div className="flex items-center gap-2">
      <PagePromptStacks projectName={project.name} dbml={project.dbml} metadata={metadata} onMetadataChange={onMetadataChange} />

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Export Schema</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuItem onClick={copyRawPrompt} className="gap-2 cursor-pointer">
            <Copy className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-sm">{copied ? "Copied!" : "Copy Raw Prompt"}</span>
          </DropdownMenuItem>
        {exportCategories.map((category, categoryIndex) => (
          <div key={category.id}>
            {categoryIndex > 0 && <DropdownMenuSeparator className="bg-border" />}
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              {category.label}
            </DropdownMenuLabel>
            {category.formats.map((format) => {
              const Icon = format.icon
              return (
                <DropdownMenuItem
                  key={format.id}
                  onClick={() => handleExport(format.id)}
                  className="gap-2 cursor-pointer"
                >
                  <Icon className={`w-4 h-4 ${format.iconColor}`} />
                  <span className="font-mono text-sm">{format.name}</span>
                </DropdownMenuItem>
              )
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  )
}
