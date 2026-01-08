import { useState, useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Copy, Check, Save, Loader2, X, Wand2, Send, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { CodeEditor } from "@/components/repo/code-editor.tsx"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth.ts"
import { saveSchemaFile } from "@/lib/file-api.ts"
import api from "@/lib/api.ts"

interface CodeViewerProps {
  dbml: string
  repoName: string
  repoOwner?: string
  onDbmlChange?: (newDbml: string) => void
  onEdit?: (newDbml: string) => void
}

export function CodeViewer({
  dbml,
  repoName,
  repoOwner,
  onDbmlChange,
  onEdit,
}: CodeViewerProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  // Track the saved/original dbml separately from the current edited value
  const [savedDbml, setSavedDbml] = useState(dbml)
  const [editedDbml, setEditedDbml] = useState(dbml)
  const [isSaving, setIsSaving] = useState(false)
  const [isImproving, setIsImproving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isSendingPrompt, setIsSendingPrompt] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  // Track if we initiated the change (to avoid syncing our own changes back)
  const isLocalChange = useRef(false)

  const isOwner = user?.username === repoOwner
  const hasChanges = editedDbml !== savedDbml

  // Focus input on component mount
  useEffect(() => {
    if (isOwner) {
      inputRef.current?.focus()
    }
  }, [isOwner])

  // Only sync from parent when the change is external (not from our own edits)
  useEffect(() => {
    if (isLocalChange.current) {
      isLocalChange.current = false
      return
    }
    setSavedDbml(dbml)
    setEditedDbml(dbml)
  }, [dbml])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedDbml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    if (!hasChanges || isSaving) return

    setIsSaving(true)
    try {
      const result = await saveSchemaFile(repoName, editedDbml, "Updated schema.dbml")
      if (result) {
        toast.success("Schema saved", {
          description: "A new version has been created",
        })
        onDbmlChange?.(editedDbml)
        setSavedDbml(editedDbml)
        queryClient.invalidateQueries({ queryKey: ["versions", repoName] })
      } else {
        toast.error("Failed to save schema")
      }
    } catch {
      toast.error("Failed to save schema")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    setEditedDbml(savedDbml)
  }

  const handleImprove = async (prompt?: string) => {
    setIsImproving(true)
    try {
      const { data, error } = await api.POST("/repo/{name}/improve", {
        params: { path: { name: repoName } },
        body: prompt ? { prompt } : undefined,
      })

      if (error) {
        const message = typeof error.detail === "string" ? error.detail : "Failed to improve schema"
        toast.error("Improvement failed", { description: message })
        return
      }

      if (data?.dbml) {
        setEditedDbml(data.dbml)
        onEdit?.(data.dbml)
        onDbmlChange?.(data.dbml)
        queryClient.invalidateQueries({ queryKey: ["versions", repoName] })
        toast.success("Schema improved!", {
          description: "A new version has been created.",
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to improve schema"
      toast.error("Improvement failed", { description: message })
    } finally {
      setIsImproving(false)
    }
  }

  const handleAiSend = async () => {
    if (!aiPrompt.trim() || isSendingPrompt) return

    setIsSendingPrompt(true)
    try {
      const { data, error } = await api.POST("/repo/{name}/improve", {
        params: { path: { name: repoName } },
        body: { prompt: aiPrompt },
      })

      if (error) {
        const message = typeof error.detail === "string" ? error.detail : "Failed to apply prompt"
        toast.error("AI prompt failed", { description: message })
        return
      }

      if (data?.dbml) {
        setEditedDbml(data.dbml)
        onEdit?.(data.dbml)
        onDbmlChange?.(data.dbml)
        setAiPrompt("")
        queryClient.invalidateQueries({ queryKey: ["versions", repoName] })
        toast.success("Schema updated!", {
          description: "A new version has been created.",
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to apply prompt"
      toast.error("AI prompt failed", { description: message })
    } finally {
      setIsSendingPrompt(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* AI Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={isOwner ? "Ask AI for schema changes" : "Fork to edit with AI"}
            disabled={!isOwner}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 pr-20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && isOwner) {
                e.preventDefault()
                handleAiSend()
              }
            }}
          />
          <Button
            size="sm"
            onClick={handleAiSend}
            disabled={!isOwner || isSendingPrompt || !aiPrompt.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 text-xs"
          >
            {isSendingPrompt ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-2 gap-1"
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleImprove()}
              disabled={!isOwner || isImproving}
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Auto-improve with AI
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImprove("Fix missing foreign key references. Analyze the schema and add proper FK relationships where they are implied by naming conventions (e.g., user_id should reference users.id).")}
              disabled={!isOwner || isImproving}
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Fix missing FK
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImprove("Add timestamp columns to all tables. Add created_at and updated_at timestamp columns with appropriate defaults to tables that don't already have them.")}
              disabled={!isOwner || isImproving}
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Add timestamps
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImprove("Identify and create enums. Find columns that should be enums (like status, type, role, state, category, priority, level columns) and create DBML enum definitions for them. Update the column types to reference the new enums. Use descriptive enum names based on the table and column context.")}
              disabled={!isOwner || isImproving}
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Create enums
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImprove("Add soft-delete support. Add a deleted_at timestamp column to tables that would benefit from soft-delete functionality instead of hard deletes.")}
              disabled={!isOwner || isImproving}
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Add soft-delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImprove("Find and add missing indexes. Analyze the schema for columns that would benefit from indexing, such as foreign keys, columns used in lookups, and columns with unique constraints.")}
              disabled={!isOwner || isImproving}
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Add missing indexes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImprove("Find and add missing references (foreign keys). Analyze column names and patterns to identify relationships between tables that should have explicit foreign key references defined.")}
              disabled={!isOwner || isImproving}
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Add missing references
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImprove("Convert primary keys to UUID. Replace integer/serial primary keys with UUID type for better distributed system support and security.")}
              disabled={!isOwner || isImproving}
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Convert to UUID PK
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImprove("Make table names plural. Convert singular table names to plural form following standard naming conventions (e.g., user → users, category → categories).")}
              disabled={!isOwner || isImproving}
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Pluralize table names
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImprove("Convert table names to PascalCase. Change snake_case or other naming conventions to PascalCase (e.g., user_accounts → UserAccounts, order_items → OrderItems).")}
              disabled={!isOwner || isImproving}
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              PascalCase table names
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleImprove("Convert table names to snake_case. Change PascalCase or other naming conventions to snake_case (e.g., UserAccounts → user_accounts, OrderItems → order_items).")}
              disabled={!isOwner || isImproving}
            >
              {isImproving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              snake_case table names
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopy}>
              {copied ? (
                <Check className="w-4 h-4 mr-2 text-primary" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? "Copied!" : "Copy code"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Save/Discard bar - only for owners with changes */}
      {isOwner && hasChanges && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
          <span className="text-xs text-amber-500 font-medium">
            Unsaved changes
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDiscard}
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-7 gap-1.5 text-xs"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 overflow-auto">
        <CodeEditor
          value={editedDbml}
          onChange={isOwner ? (value: string) => {
            setEditedDbml(value)
            isLocalChange.current = true
            onEdit?.(value)
          } : undefined}
          readOnly={!isOwner}
        />
      </div>
    </div>
  )
}
