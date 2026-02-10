export interface Project {
  id: string
  name: string
  title?: string
  description?: string
  category?: string
  owner: {
    username: string
  }
}
