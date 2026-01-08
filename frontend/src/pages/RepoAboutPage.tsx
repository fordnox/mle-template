import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { config } from "@/lib/config.ts"
import { Tag, FolderOpen, Table2, List, Link2 } from "lucide-react"
import { ProjectHeader } from "@/components/repo/project-header.tsx"
import { Badge } from "@/components/ui/badge"
import { useProject } from "@/contexts/ProjectContext"
import { SectionDemoSchema } from "@/components/sections/section-demo-schema.tsx"

export default function RepoAboutPage() {
  const project = useProject()

  const totalColumns = project.tables.reduce(
    (sum, table) => sum + (table.fields?.length ?? 0),
    0
  )
  const totalRefs = project.refs?.length ?? 0

  const pageTitle = `${project.name} - About | ${config.VITE_APP_TITLE}`
  const pageDescription = project.description || `Database schema for ${project.name} with ${project.tables.length} tables`
  const pageUrl = `${config.VITE_APP_URL}/${project.owner}/${project.id}/about`

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      <ProjectHeader project={project} activePage="about" />

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Description */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Description</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{project.description}</p>
          </section>

          {/* Category & Tags */}
          <section className="grid md:grid-cols-2 gap-6">
            {project.category && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  Category
                </h2>
                <Link to={`/explore/category/${encodeURIComponent(project.category)}`}>
                  <Badge variant="secondary" className="text-base px-4 py-1 hover:bg-secondary/80 transition-colors">
                    {project.category}
                  </Badge>
                </Link>
              </div>
            )}

            {project.tags.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Link key={tag} to={`/explore/tag/${encodeURIComponent(tag)}`}>
                      <Badge variant="outline" className="text-sm hover:bg-muted transition-colors">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Stats Grid */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Schema Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Table2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Tables</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">{project.tables.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <FolderOpen className="w-5 h-5" />
                  <span className="text-sm font-medium">Columns</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">{totalColumns}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Link2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Relationships</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">{totalRefs}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <List className="w-5 h-5" />
                  <span className="text-sm font-medium">Enums</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">{project.enums?.length ?? 0}</p>
              </div>
            </div>
          </section>

          {/* Tables List */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Table2 className="w-5 h-5" />
              Tables ({project.tables.length})
            </h2>
            <div className="rounded-lg border border-border bg-muted/30 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {project.tables.map((table, index) => (
                  <div
                    key={`${table.name}-${index}`}
                    className="px-4 py-3 flex items-center justify-between border-b border-r border-border last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
                  >
                    <span className="font-mono text-foreground">{table.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {table.fields?.length ?? 0} columns
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Schema Section */}
          <section className="space-y-4">
          <SectionDemoSchema projectSlug={project.id} showStats={false} showHeader={false} />
          </section>
        </div>
      </main>

    </div>
  )
}
