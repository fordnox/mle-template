import { useQuery } from "@tanstack/react-query"
import { getProject } from "@/lib/repo"

export function useProjectQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) return null
      return await getProject(id)
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
