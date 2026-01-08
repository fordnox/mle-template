import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth.ts"
import api from "@/lib/api.ts"

interface UseRepoActionsProps {
  repoName: string
  projectPath: string
  isOwner?: boolean
  onDelete?: () => Promise<void>
}

export function useRepoActions({ repoName, projectPath, isOwner, onDelete }: UseRepoActionsProps) {
  const [isForking, setIsForking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleShare = useCallback(async () => {
    const url = window.location.origin + projectPath
    const title = "Schema on SchemaHub"

    if (navigator.share) {
      await navigator.share({ title, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard")
    }
  }, [projectPath])

  const handleFork = useCallback(async () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    setIsForking(true)
    try {
      const { data, error } = await api.POST("/repo/{name}/fork", {
        params: { path: { name: repoName } },
      })

      if (error) {
        const message = typeof error.detail === "string" ? error.detail : "Failed to fork schema"
        toast.error("Fork failed", { description: message })
        return
      }

      if (data) {
        toast.success("Schema forked!", {
          description: "You now have your own copy to edit.",
        })
        navigate(`/${data.owner?.username}/${data.name}`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fork schema"
      toast.error("Fork failed", { description: message })
    } finally {
      setIsForking(false)
    }
  }, [isAuthenticated, navigate, repoName])

  const handleDelete = useCallback(async () => {
    if (!onDelete) return

    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
    }
  }, [onDelete])

  return {
    // Handlers
    handleShare,
    handleFork,
    handleDelete: onDelete ? handleDelete : undefined,

    // States
    isForking,
    isDeleting,

    // Computed visibility
    showFork: !isOwner,
    showDelete: Boolean(isOwner && onDelete),
    canEdit: Boolean(isOwner),
  }
}
