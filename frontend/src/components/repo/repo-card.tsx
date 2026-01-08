import { Link } from "react-router-dom"
import { Database, Calendar, Tag, Share2, GitFork } from "lucide-react"
import { RepoMenu, type RepoMenuAction } from "@/components/repo/repo-menu.tsx"
import { useRepoActions } from "@/hooks/useRepoActions.ts"
import { navActions } from "@/lib/repo-nav.ts"
import type { components } from "@/lib/schema"

type RepoSummary = components["schemas"]["RepoSummary"]

interface RepoCardProps {
  repo: RepoSummary
  isOwner?: boolean
  onDelete?: (repoName: string) => Promise<void>
}

export function RepoCard({ repo, isOwner, onDelete }: RepoCardProps) {
  const repoUrl = `/${repo.owner.username}/${repo.name}`

  const {
    handleShare,
    handleFork,
    handleDelete,
    isForking,
    isDeleting,
    showFork,
  } = useRepoActions({
    repoName: repo.name,
    projectPath: repoUrl,
    isOwner,
    onDelete: onDelete ? () => onDelete(repo.name) : undefined,
  })

  const menuActions: RepoMenuAction[] = [
    // Navigation links
    ...navActions.map((action) => ({
      id: action.id,
      label: action.label,
      icon: action.icon,
      href: `${repoUrl}${action.path}`,
    })),
    // Share
    {
      id: "share",
      label: "Share",
      icon: Share2,
      onClick: handleShare,
    },
    // Fork (conditionally)
    ...(showFork
      ? [
          {
            id: "fork",
            label: "Fork",
            icon: GitFork,
            onClick: handleFork,
            loading: isForking,
          },
        ]
      : []),
  ]

  return (
    <div className="flex items-center gap-2 p-4 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors">
      <Link
        to={repoUrl}
        className="flex-1 min-w-0"
      >
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-4 h-4 text-primary flex-shrink-0" />
          <h3 className="font-semibold text-foreground truncate">
            {repo.title}
          </h3>
        </div>
        {repo.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {repo.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {repo.category && (
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {repo.category}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(repo.updated_at).toLocaleDateString()}
          </span>
        </div>
        {repo.tags && repo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {repo.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {repo.tags.length > 5 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{repo.tags.length - 5} more
              </span>
            )}
          </div>
        )}
      </Link>
      <RepoMenu
        actions={menuActions}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
