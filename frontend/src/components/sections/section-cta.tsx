import { Link } from "react-router-dom"
import { ArrowRight, Database } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { useReposCount } from "@/hooks/useReposQuery.ts"

export function SectionCta() {
  const { data: totalCount } = useReposCount()

  return (
    <section className="py-16 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Browse {totalCount ?? "..."}+ database schemas
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            From real-world applications. Find inspiration for your next project.
          </p>
          <Link to="/explore">
            <Button size="lg" className="gap-2">
              Explore all schemas
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
