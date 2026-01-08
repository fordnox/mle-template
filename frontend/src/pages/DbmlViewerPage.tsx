import { useState, useCallback } from "react"
import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config.ts"
import { Compiler } from "@dbml/parse"
import { Header } from "@/layouts/header.tsx"
import { Footer } from "@/layouts/footer.tsx"
import { SchemaViewer } from "@/components/canvas/schema-viewer.tsx"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileCode2, Play, AlertCircle } from "lucide-react"
import type { Project } from "@/lib/data"

const EXAMPLE_DBML = `Table users {
  id integer [pk]
  username varchar(255) [not null, unique]
  email varchar(255) [not null, unique]
  created_at timestamp [default: \`now()\`]
}

Table posts {
  id integer [pk]
  title varchar(255) [not null]
  content text
  user_id integer
  created_at timestamp [default: \`now()\`]
}

Table comments {
  id integer [pk]
  content text [not null]
  post_id integer
  user_id integer
  created_at timestamp [default: \`now()\`]
}

Table tags {
  id integer [pk]
  name varchar(100) [not null, unique]
}

Table post_tags {
  post_id integer
  tag_id integer

  indexes {
    (post_id, tag_id) [pk]
  }
}

// Relations
Ref: posts.user_id > users.id
Ref: comments.post_id > posts.id
Ref: comments.user_id > users.id
Ref: post_tags.post_id > posts.id
Ref: post_tags.tag_id > tags.id`

export default function DbmlViewerPage() {
  const [dbmlInput, setDbmlInput] = useState(EXAMPLE_DBML)
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<string | null>(null)

  const parseDbml = useCallback(() => {
    setError(null)
    try {
      const compiler = new Compiler()
      compiler.setSource(dbmlInput)

      // Check for parse errors first
      const errors = compiler.parse.errors()
      if (errors.length > 0) {
        setError(errors.map(e => e.message).join(", "))
        return
      }

      const database = compiler.parse.rawDb()
      const tables = database?.tables || []
      const refs = database?.refs || []

      if (tables.length === 0) {
        setError("No tables found in DBML. Please check your syntax.")
        return
      }

      const newProject: Project = {
        id: "custom-dbml",
        name: "Custom DBML",
        description: "User-provided DBML schema",
        version: "1.0.0",
        updatedAt: new Date().toISOString(),
        tags: ["custom"],
        tables,
        refs,
        dbml: dbmlInput,
      }

      setProject(newProject)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to parse DBML"
      setError(message)
    }
  }, [dbmlInput])

  const loadExample = useCallback(() => {
    setDbmlInput(EXAMPLE_DBML)
    setError(null)
  }, [])

  if (project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <FileCode2 className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-foreground">DBML Viewer</span>
              </div>
              <span className="text-muted-foreground text-sm">
                {project.tables.length} table{project.tables.length !== 1 ? "s" : ""}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProject(null)}
            >
              Edit DBML
            </Button>
          </div>
        </header>
        <SchemaViewer project={project} />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{`DBML Viewer | ${config.VITE_APP_TITLE}`}</title>
        <meta name="description" content="Visualize your DBML schema online. Paste your database markup language and see your schema diagram instantly." />
        <link rel="canonical" href={`${config.VITE_APP_URL}/viewer`} />
        <meta property="og:title" content={`DBML Viewer | ${config.VITE_APP_TITLE}`} />
        <meta property="og:description" content="Visualize your DBML schema online. Paste your database markup language and see your schema diagram instantly." />
        <meta property="og:url" content={`${config.VITE_APP_URL}/viewer`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={`DBML Viewer | ${config.VITE_APP_TITLE}`} />
        <meta name="twitter:description" content="Visualize your DBML schema online. Paste your database markup language and see your schema diagram instantly." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">DBML Viewer</h1>
            <p className="text-muted-foreground">
              Paste your DBML schema below to visualize and explore your database structure.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="dbml-input" className="text-sm font-medium text-foreground">
                DBML Schema
              </label>
              <Button variant="ghost" size="sm" onClick={loadExample}>
                Load Example
              </Button>
            </div>

            <Textarea
              id="dbml-input"
              value={dbmlInput}
              onChange={(e) => setDbmlInput(e.target.value)}
              placeholder="Paste your DBML schema here..."
              className="font-mono text-sm min-h-[400px] bg-card border-border resize-y"
            />

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Parse Error</p>
                  <p className="opacity-90">{error}</p>
                </div>
              </div>
            )}

            <Button
              onClick={parseDbml}
              disabled={!dbmlInput.trim()}
              className="w-full sm:w-auto"
            >
              <Play className="w-4 h-4 mr-2" />
              Visualize Schema
            </Button>
          </div>

          <div className="pt-6 border-t border-border">
            <h2 className="text-lg font-semibold text-foreground mb-3">DBML Syntax Guide</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-medium text-foreground mb-2">Tables</h3>
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{`Table users {
  id integer [pk]
  name varchar
}`}</pre>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="font-medium text-foreground mb-2">Relationships</h3>
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{`Table posts {
  user_id integer [ref: > users.id]
}`}</pre>
              </div>
            </div>
          </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
