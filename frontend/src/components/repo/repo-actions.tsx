import { Link, useNavigate } from "react-router-dom"
import { Share2, GitFork, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { RepoMenu, type RepoMenuAction } from "@/components/repo/repo-menu.tsx"
import { useRepoActions } from "@/hooks/useRepoActions.ts"
import { navActions, type ActivePage } from "@/lib/repo-nav.ts"

interface RepoActionsProps {
  projectPath: string
  activePage: ActivePage
  repoName: string
  isOwner?: boolean
}

export function RepoActions({ projectPath, activePage, repoName, isOwner }: RepoActionsProps) {
  const navigate = useNavigate()
  const { handleShare, handleFork, isForking, showFork } = useRepoActions({
    repoName,
    projectPath,
    isOwner,
  })

  // Split nav actions into primary (visible) and secondary (overflow menu)
  const primaryNavActions = navActions.filter(a => !a.iconOnly)
  const secondaryNavActions = navActions.filter(a => a.iconOnly)

  // Build desktop overflow menu actions (Export, About, Share)
  const desktopOverflowActions: RepoMenuAction[] = [
    ...secondaryNavActions.map((action) => ({
      id: action.id,
      label: action.label,
      icon: action.icon,
      href: `${projectPath}${action.path}`,
      isActive: activePage === action.id,
    })),
    {
      id: "share",
      label: "Share",
      icon: Share2,
      onClick: handleShare,
    },
  ]

  // Build mobile menu actions
  const mobileActions: RepoMenuAction[] = [
    // Navigation actions
    ...navActions.map((action) => ({
      id: action.id,
      label: action.label,
      icon: action.icon,
      onClick: () => navigate(`${projectPath}${action.path}`),
      isActive: activePage === action.id,
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
    <>
      {/* Desktop: Show all buttons */}
      <div className="hidden sm:flex items-center gap-2">
        {showFork && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleFork}
            disabled={isForking}
          >
            {isForking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GitFork className="w-4 h-4" />
            )}
            {isForking ? "Forking..." : "Fork"}
          </Button>
        )}

        {primaryNavActions.map((action) => {
          const Icon = action.icon
          const isActive = activePage === action.id

          return (
            <Link key={action.id} to={`${projectPath}${action.path}`}>
              <Button
                variant={isActive ? "secondary" : "outline"}
                size="sm"
                className={`lg:gap-2 ${isActive ? "bg-secondary/70 text-foreground shadow-md shadow-primary/15 border-primary/30" : ""}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{action.label}</span>
              </Button>
            </Link>
          )
        })}

        {/* Overflow menu for Export, About, Share */}
        <RepoMenu actions={desktopOverflowActions} variant="outline" />
      </div>

      {/* Mobile: Hamburger menu */}
      <div className="sm:hidden">
        <RepoMenu actions={mobileActions} variant="outline" />
      </div>
    </>
  )
}

export { type ActivePage } from "@/lib/repo-nav.ts"
