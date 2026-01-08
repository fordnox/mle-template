import { Link } from "react-router-dom"
import { SchemaSlider } from "@/components/canvas/schema-slider.tsx"
import { usePopularRepos } from "@/hooks/useReposQuery.ts"
import { Button } from "@/components/ui/button.tsx"
import { ArrowRight, Loader2 } from "lucide-react"

export function SectionPopularSchemas() {
  const { data: popularRepos = [], isLoading } = usePopularRepos()

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 flex items-center justify-center h-[600px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    )
  }

  if (popularRepos.length === 0) {
    return null
  }

  // Convert popular repos to slide config
  const slides = popularRepos.map((repo) => ({
    projectSlug: repo.name,
    title: repo.title ?? repo.name,
  }))

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-32">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Explore 2500+ Database Schemas
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore production-ready database schemas from real-world applications.
            Use them as starting points for your own projects or learn from their design patterns.
          </p>
        </div>

        <SchemaSlider
          slides={slides}
          autoRotate={true}
          rotationInterval={5000}
        />

        <div className="flex justify-center mt-8">
          <Link to="/explore">
            <Button variant="outline" className="gap-2">
              Browse all schemas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
