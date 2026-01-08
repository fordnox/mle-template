import { Zap, Code2, Server, Shield } from "lucide-react"

export function SectionApiEndpoints() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            Coming Soon
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Instant API Endpoints
          </h2>
          <p className="text-lg text-muted-foreground">
            Turn your database schema (DBML) into production-ready REST APIs in seconds.
            Full CRUD operations, and documentation out of the box.
          </p>
        </div>

        {/* Code Preview */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">Generated API Endpoints</span>
            </div>
            <div className="p-4 font-mono text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-500/20 text-green-400">GET</span>
                  <span className="text-muted-foreground">/api/users</span>
                  <span className="text-muted-foreground/50 text-xs ml-auto">List all users</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-400">POST</span>
                  <span className="text-muted-foreground">/api/users</span>
                  <span className="text-muted-foreground/50 text-xs ml-auto">Create user</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-500/20 text-green-400">GET</span>
                  <span className="text-muted-foreground">/api/users/:id</span>
                  <span className="text-muted-foreground/50 text-xs ml-auto">Get user by ID</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-yellow-500/20 text-yellow-400">PUT</span>
                  <span className="text-muted-foreground">/api/users/:id</span>
                  <span className="text-muted-foreground/50 text-xs ml-auto">Update user</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-red-500/20 text-red-400">DELETE</span>
                  <span className="text-muted-foreground">/api/users/:id</span>
                  <span className="text-muted-foreground/50 text-xs ml-auto">Delete user</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-500/20 text-green-400">GET</span>
                  <span className="text-muted-foreground">/api/users/:id/posts</span>
                  <span className="text-muted-foreground/50 text-xs ml-auto">Get user's posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Zero Config
            </h3>
            <p className="text-sm text-muted-foreground">
              Create schema with AI, get working endpoints instantly. No server setup required.
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Full CRUD
            </h3>
            <p className="text-sm text-muted-foreground">
              Create, read, update, delete operations generated automatically for every table.
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Relationships
            </h3>
            <p className="text-sm text-muted-foreground">
              Foreign keys become nested endpoints. Query related data with ease.
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Auth Ready
            </h3>
            <p className="text-sm text-muted-foreground">
              Built-in authentication and authorization. API keys or JWT tokens.
            </p>
          </div>
        </div>
        </div>

      </div>
    </section>
  )
}
