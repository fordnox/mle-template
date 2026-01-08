import { useQuery } from "@tanstack/react-query"
import client from "@/lib/api"
import type { components } from "@/lib/schema"

type RepoSummary = components["schemas"]["RepoSummary"]
type RepoSummaryListResponse = components["schemas"]["RepoSummaryListResponse"]

interface ReposSummaryParams {
  skip?: number
  limit?: number
  category?: string | null
  tag?: string | null
  search?: string | null
}

/**
 * Fetch repos summary for browse/search pages
 */
export function useReposSummary(params: ReposSummaryParams = {}) {
  return useQuery({
    queryKey: ["repos", "summary", params],
    queryFn: async (): Promise<RepoSummaryListResponse> => {
      const { data, error } = await client.GET("/repo/summary", {
        params: {
          query: {
            skip: params.skip,
            limit: params.limit,
            category: params.category,
            tag: params.tag,
            search: params.search,
          },
        },
      })
      if (error || !data) {
        throw new Error("Failed to fetch repos")
      }
      return data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Fetch total repos count
 */
export function useReposCount() {
  return useQuery({
    queryKey: ["repos", "count"],
    queryFn: async (): Promise<number> => {
      const { data, error } = await client.GET("/repo/summary", {
        params: { query: { limit: 1 } },
      })
      if (error || !data) {
        throw new Error("Failed to fetch repos count")
      }
      return data.total
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch popular repos (tagged with "popular")
 */
export function usePopularRepos(count: number = 4) {
  return useQuery({
    queryKey: ["repos", "popular", count],
    queryFn: async (): Promise<RepoSummary[]> => {
      const { data, error } = await client.GET("/repo/summary", {
        params: { query: { tag: "popular", limit: count } },
      })
      if (error || !data) {
        throw new Error("Failed to fetch popular repos")
      }
      return data.repos
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ["repos", "categories"],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await client.GET("/repo/categories")
      if (error || !data) {
        throw new Error("Failed to fetch categories")
      }
      return data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

interface PopularTag {
  id: string
  label: string
  count: number
}

/**
 * Fetch popular tags with counts
 */
export function usePopularTags(limit: number = 20) {
  return useQuery({
    queryKey: ["repos", "tags", "popular", limit],
    queryFn: async (): Promise<PopularTag[]> => {
      const { data, error } = await client.GET("/repo/tags/popular", {
        params: { query: { limit } },
      })
      if (error || !data) {
        throw new Error("Failed to fetch popular tags")
      }
      // Transform API response to match expected format
      return (data as unknown as Array<{ name: string; count: number }>).map((tag) => ({
        id: tag.name,
        label: tag.name,
        count: tag.count,
      }))
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Fetch recently created/updated repos
 */
export function useRecentRepos(count: number = 6) {
  return useQuery({
    queryKey: ["repos", "recent", count],
    queryFn: async (): Promise<RepoSummary[]> => {
      const { data, error } = await client.GET("/repo/summary", {
        params: { query: { limit: count } },
      })
      if (error || !data) {
        throw new Error("Failed to fetch recent repos")
      }
      return data.repos
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
