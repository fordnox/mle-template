import { useState, useEffect } from "react"
import { ArrowUp, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

// Generate dynamic placeholder prompts based on table names
function generatePlaceholderPrompts(tables: string[]): string[] {
  if (tables.length === 0) {
    return [
      "Design a data management dashboard",
      "Create an admin interface for your schema",
      "Build a data explorer with relationships",
    ]
  }

  const promptTemplates = [
    (t: string) => `Design a ${t} management dashboard`,
    (t: string) => `Create a ${t} listing with filters`,
    (t: string) => `Build a ${t} detail view with relationships`,
    (t: string) => `Generate a ${t} creation form`,
    (t: string) => `Design analytics for ${t} data`,
  ]

  const prompts: string[] = []
  for (let i = 0; i < Math.min(tables.length * 2, 10); i++) {
    const table = tables[i % tables.length]
    const template = promptTemplates[i % promptTemplates.length]
    prompts.push(template(table))
  }

  return prompts
}

interface DesignInputProps {
  onSubmit: (prompt: string) => void
  isLoading: boolean
  tableSuggestions?: string[]
}

export function DesignInput({ onSubmit, isLoading, tableSuggestions = [] }: DesignInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const placeholderPrompts = generatePlaceholderPrompts(tableSuggestions)

  // Cycle through placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderPrompts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [placeholderPrompts.length])

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    onSubmit(inputValue.trim())
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSurpriseMe = () => {
    const randomPrompt = placeholderPrompts[Math.floor(Math.random() * placeholderPrompts.length)]
    onSubmit(randomPrompt)
  }

  return (
    <div className="space-y-4">
      {/* Input Area */}
      <div className="relative">
        <div className="flex items-center gap-2 p-2 rounded-xl border border-border bg-muted/50 backdrop-blur focus-within:border-primary transition-colors glow-accent ">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderPrompts[placeholderIndex]}
            disabled={isLoading}
            className="flex-1 bg-transparent border-0 outline-none px-2 py-2 text-foreground placeholder:text-muted-foreground"
          />

          <Button variant="ghost" size="sm" onClick={handleSurpriseMe} disabled={isLoading} className="shrink-0">
            <Sparkles className="w-4 h-4 mr-1" />
            Surprise me
          </Button>

          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={isLoading || !inputValue.trim()}
            className="shrink-0"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
