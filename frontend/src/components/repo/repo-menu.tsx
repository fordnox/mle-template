import { Link } from "react-router-dom"
import { EllipsisVertical, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"

export interface RepoMenuAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick?: () => void
  href?: string
  isActive?: boolean
  disabled?: boolean
  loading?: boolean
}

interface RepoMenuProps {
  actions: RepoMenuAction[]
  onDelete?: () => void
  isDeleting?: boolean
  variant?: "ghost" | "outline"
}

export function RepoMenu({ actions, onDelete, isDeleting, variant = "ghost" }: RepoMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="flex-shrink-0">
          <EllipsisVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {actions.map((action) => {
          const Icon = action.icon
          const content = (
            <>
              {action.loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              {action.loading ? `${action.label}...` : action.label}
            </>
          )

          if (action.href) {
            return (
              <DropdownMenuItem key={action.id} asChild>
                <Link
                  to={action.href}
                  className={`flex items-center gap-2 ${action.isActive ? "bg-secondary" : ""}`}
                >
                  {content}
                </Link>
              </DropdownMenuItem>
            )
          }

          return (
            <DropdownMenuItem
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              className={`flex items-center gap-2 ${action.isActive ? "bg-secondary" : ""}`}
            >
              {content}
            </DropdownMenuItem>
          )
        })}

        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 text-destructive focus:text-destructive"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
