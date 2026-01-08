import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import client from "@/lib/api"
import type { components } from "@/lib/schema"

type DesignResponse = components["schemas"]["DesignResponse"]
type DesignListResponse = components["schemas"]["DesignListResponse"]
type GenerateDesignsResponse = components["schemas"]["GenerateDesignsResponse"]

export function useDesignsQuery(repoName: string | undefined) {
  return useQuery({
    queryKey: ["designs", repoName],
    queryFn: async (): Promise<DesignListResponse | null> => {
      if (!repoName) return null
      const { data, error } = await client.GET("/repo/{name}/designs", {
        params: { path: { name: repoName } },
      })
      if (error) throw error
      return data ?? null
    },
    enabled: !!repoName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useGenerateDesigns(repoName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ prompt }: { prompt: string }): Promise<GenerateDesignsResponse> => {
      const { data, error } = await client.POST("/repo/{name}/designs/generate", {
        params: { path: { name: repoName } },
        body: { prompt },
      })
      if (error) throw error
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs", repoName] })
    },
  })
}

export function useGenerateVariations(repoName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      designId,
      prompt,
    }: {
      designId: string
      prompt: string
    }): Promise<GenerateDesignsResponse> => {
      const { data, error } = await client.POST("/repo/{name}/designs/{design_id}/variations", {
        params: { path: { name: repoName, design_id: designId } },
        body: { prompt },
      })
      if (error) throw error
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs", repoName] })
    },
  })
}

export function useDeleteDesign(repoName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (designId: string): Promise<void> => {
      const { error } = await client.DELETE("/repo/{name}/designs/{design_id}", {
        params: { path: { name: repoName, design_id: designId } },
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs", repoName] })
    },
  })
}

export function useUpdateDesign(repoName: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      designId,
      name,
      html,
      is_favorite,
    }: {
      designId: string
      name?: string
      html?: string
      is_favorite?: boolean
    }): Promise<DesignResponse> => {
      const { data, error } = await client.PATCH("/repo/{name}/designs/{design_id}", {
        params: { path: { name: repoName, design_id: designId } },
        body: { name, html, is_favorite },
      })
      if (error) throw error
      return data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs", repoName] })
    },
  })
}

