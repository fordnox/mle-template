export function usePopularRepos(_limit?: number) {
  return { data: [] as any[], isLoading: false }
}

export function useReposCount() {
  return { data: 0, isLoading: false }
}
