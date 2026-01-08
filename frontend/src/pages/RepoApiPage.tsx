import { Server, Zap, Code2, Shield, Lock } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config.ts"
import { ProjectHeader } from "@/components/repo/project-header.tsx"
import { Badge } from "@/components/ui/badge"
import { useProject } from "@/contexts/ProjectContext"
import { getForeignKeyRef } from "@/lib/data"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

interface Endpoint {
  method: HttpMethod
  path: string
  description: string
}

function generateEndpointsForTable(tableName: string, hasRelations: string[]): Endpoint[] {
  const basePath = `/api/${tableName.toLowerCase()}`
  const endpoints: Endpoint[] = [
    { method: "GET", path: basePath, description: `List all ${tableName}` },
    { method: "POST", path: basePath, description: `Create ${tableName}` },
    { method: "GET", path: `${basePath}/:id`, description: `Get ${tableName} by ID` },
    { method: "PUT", path: `${basePath}/:id`, description: `Update ${tableName}` },
    { method: "DELETE", path: `${basePath}/:id`, description: `Delete ${tableName}` },
  ]

  // Add relationship endpoints
  hasRelations.forEach((relatedTable) => {
    endpoints.push({
      method: "GET",
      path: `${basePath}/:id/${relatedTable.toLowerCase()}`,
      description: `Get ${tableName}'s ${relatedTable}`,
    })
  })

  return endpoints
}

function MethodBadge({ method }: { method: HttpMethod }) {
  const colors: Record<HttpMethod, string> = {
    GET: "bg-green-500/20 text-green-400",
    POST: "bg-blue-500/20 text-blue-400",
    PUT: "bg-yellow-500/20 text-yellow-400",
    DELETE: "bg-red-500/20 text-red-400",
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${colors[method]}`}>
      {method}
    </span>
  )
}

export default function RepoApiPage() {
  const project = useProject()

  // Build a map of table relationships from refs
  const tableRelations = new Map<string, string[]>()
  project.tables.forEach((table) => {
    tableRelations.set(table.name, [])
  })

  // Parse refs to find relationships
  project.refs?.forEach((ref) => {
    if (ref.endpoints && ref.endpoints.length === 2) {
      const [ep1, ep2] = ref.endpoints
      // Add relationship from many side to one side
      if (ep1.relation === "*") {
        const existing = tableRelations.get(ep1.tableName) || []
        if (!existing.includes(ep2.tableName)) {
          tableRelations.set(ep1.tableName, [...existing, ep2.tableName])
        }
      } else if (ep2.relation === "*") {
        const existing = tableRelations.get(ep2.tableName) || []
        if (!existing.includes(ep1.tableName)) {
          tableRelations.set(ep2.tableName, [...existing, ep1.tableName])
        }
      }
    }
  })

  // Also check inline refs in fields
  project.tables.forEach((table) => {
    table.fields?.forEach((field) => {
      const fkRef = getForeignKeyRef(field)
      if (fkRef) {
        const existing = tableRelations.get(table.name) || []
        if (!existing.includes(fkRef.table)) {
          tableRelations.set(table.name, [...existing, fkRef.table])
        }
      }
    })
  })

  // Generate all endpoints
  const allEndpoints = project.tables.flatMap((table) =>
    generateEndpointsForTable(table.name, tableRelations.get(table.name) || [])
  )

  const totalEndpoints = allEndpoints.length

  const pageTitle = `${project.name} - API Endpoints | ${config.VITE_APP_TITLE}`
  const pageDescription = project.description || `Automatic API Endpoints for database schema for ${project.name} with ${project.tables.length} tables`
  const pageUrl = `${config.VITE_APP_URL}/${project.owner}/${project.id}/api`

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

      <ProjectHeader project={project} activePage="api" />

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Coming Soon Banner */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">API Endpoints Coming Soon</h3>
                <Badge variant="outline" className="text-primary border-primary/30">
                  Preview
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on your schema, these REST API endpoints will be automatically generated and hosted.
              </p>
            </div>
          </div>

          {/* Base URL Preview */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Base URL</h2>
            <div className="p-4 rounded-lg bg-muted/50 border border-border font-mono text-sm">
              <span className="text-muted-foreground">{config.VITE_API_URL}</span>
              <span className="text-primary">{project.owner}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-primary">{project.id}</span>
              <span className="text-muted-foreground">/</span>
                <span className="text-primary">v1</span>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">API Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Server className="w-5 h-5" />
                  <span className="text-sm font-medium">Endpoints</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">{totalEndpoints}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Code2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Resources</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">{project.tables.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-medium">CRUD Ops</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">{project.tables.length * 5}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Auth</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">API Key</p>
              </div>
            </div>
          </section>

          {/* Endpoints by Table */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Endpoints ({totalEndpoints})
            </h2>

            <div className="space-y-6">
              {project.tables.map((table) => {
                const relations = tableRelations.get(table.name) || []
                const endpoints = generateEndpointsForTable(table.name, relations)

                return (
                  <div
                    key={table.name}
                    className="rounded-lg border border-border bg-card overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-foreground">
                          {table.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {endpoints.length} endpoints
                        </Badge>
                      </div>
                      {relations.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Relations: {relations.join(", ")}
                        </span>
                      )}
                    </div>
                    <div className="divide-y divide-border">
                      {endpoints.map((endpoint, index) => (
                        <div
                          key={index}
                          className="px-4 py-2.5 flex items-center gap-3 hover:bg-muted/30 transition-colors"
                        >
                          <MethodBadge method={endpoint.method} />
                          <span className="font-mono text-sm text-foreground flex-1">
                            {endpoint.path}
                          </span>
                          <span className="text-xs text-muted-foreground hidden sm:block">
                            {endpoint.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Features */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Included Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-foreground">Zero Config</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Endpoints are generated and hosted automatically. No server setup required.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-foreground">Full CRUD</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create, read, update, delete operations for every table in your schema.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Server className="w-4 h-4 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-foreground">Relationships</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Foreign keys become nested endpoints. Query related data with ease.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold text-foreground">Auth Ready</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Built-in authentication with API keys. JWT tokens coming soon.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
