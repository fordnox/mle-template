import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { History, Loader2, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { formatDistanceToNow } from "date-fns"
import { getSchemaVersions } from "@/lib/file-api.ts"
import type { components } from "@/lib/schema"

type RepoFileVersionResponse = components["schemas"]["RepoFileVersionResponse"]

interface VersionHistoryProps {
  repoName: string
}

export function VersionHistory({ repoName }: VersionHistoryProps) {
  const [versions, setVersions] = useState<RepoFileVersionResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { data: versionCount } = useQuery({
    queryKey: ["versions", repoName],
    queryFn: async () => {
      const data = await getSchemaVersions(repoName)
      return data?.versions.length ?? 0
    },
  })

  const loadVersions = async () => {
    setIsLoading(true)
    try {
      const data = await getSchemaVersions(repoName)
      if (data) {
        setVersions(data.versions)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && loadVersions()}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 hover:text-foreground transition-colors">
          <History className="w-3.5 h-3.5" />
          <span className="font-mono">
            {versionCount !== undefined ? `v${versionCount}` : "..."}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
            Loading...
          </div>
        ) : versions.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No version history
          </div>
        ) : (
          versions.slice(0, 10).map((v, index) => (
            <DropdownMenuItem
              key={v.sha}
              className="flex flex-col items-start p-3 cursor-default"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono font-medium">
                  v{versions.length - index}
                </span>
                <span className="text-muted-foreground">
                  {formatDistanceToNow(new Date(v.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              {/*{v.author && (*/}
              {/*  <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">*/}
              {/*    {v.author.picture ? (*/}
              {/*      <img*/}
              {/*        src={v.author.picture}*/}
              {/*        alt={v.author.username}*/}
              {/*        className="w-4 h-4 rounded-full"*/}
              {/*      />*/}
              {/*    ) : (*/}
              {/*      <User className="w-3 h-3" />*/}
              {/*    )}*/}
              {/*    {v.author.username}*/}
              {/*  </span>*/}
              {/*)}*/}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
