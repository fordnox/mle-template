export interface DesignTemplate {
  id: string
  name: string
  description: string
  thumbnail: string
  icon: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    [key: string]: string
  }
  characteristics: string[]
}

export const designTemplates: DesignTemplate[] = []
