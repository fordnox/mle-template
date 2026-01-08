import { useCallback } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import client from "@/lib/api"
import type { components } from "@/lib/schema"

type User = components["schemas"]["UserPrivateResponse"]

async function fetchCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem("token")
  if (!token) {
    return null
  }

  const { data, error } = await client.GET("/user/")
  if (error || !data) {
    localStorage.removeItem("token")
    return null
  }

  return data
}

export function useAuth() {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  })

  const login = useCallback((token: string, userData?: User) => {
    localStorage.setItem("token", token)
    if (userData) {
      queryClient.setQueryData(["auth", "me"], userData)
    } else {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    }
  }, [queryClient])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    queryClient.setQueryData(["auth", "me"], null)
  }, [queryClient])

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }
}
