import { Helmet } from "react-helmet-async"
import {
  Cloud,
  Sparkles,
  Database,
  ChevronRight,
  Plug,
  GitBranch,
  Layout,
  Workflow,
  FileText,
} from "lucide-react"
import { config } from "@/lib/config.ts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FeedbackDialog } from "@/components/feedback-dialog"
import { useAuth } from "@/hooks/useAuth"
import { Navigate } from "react-router-dom"

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled?: boolean
  comingSoon?: boolean
}

const platformIntegrations: Integration[] = [
  {
    id: "openrouter-ai",
    name: "OpenRouter",
    description: "AI Router for different LLMs",
    icon: <Sparkles className="w-6 h-6" />,
    enabled: true,
  },
  {
    id: "cloudflare-d1",
    name: "Cloudflare D1",
    description: "Deploy to serverless SQLite database",
    icon: <Cloud className="w-6 h-6" />,
    enabled: false,
    comingSoon: true,
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Connect your Supabase project",
    icon: <Database className="w-6 h-6" />,
    comingSoon: true,
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    description: "MySQL-compatible serverless database",
    icon: <Database className="w-6 h-6" />,
    comingSoon: true,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Sync schemas with your repositories",
    icon: <GitBranch className="w-6 h-6" />,
    comingSoon: true,
  },
  {
    id: "n8n",
    name: "n8n",
    description: "Automate workflows with your schemas",
    icon: <Workflow className="w-6 h-6" />,
    comingSoon: true,
  },
]

function IntegrationCard({
  integration,
  showSetup = false,
}: {
  integration: Integration
  showSetup?: boolean
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-muted-foreground/40 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 text-muted-foreground">
        {integration.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-foreground">{integration.name}</h3>
          {integration.enabled && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              Enabled
            </Badge>
          )}
          {integration.comingSoon && (
            <Badge variant="secondary" className="text-xs">
              Coming Soon
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {integration.description}
        </p>
      </div>
      {showSetup ? (
        <Button
          variant="secondary"
          size="sm"
          disabled={integration.comingSoon}
          className="shrink-0"
        >
          Set up
        </Button>
      ) : (
        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
      )}
    </div>
  )
}

export default function IntegrationsPage() {
  const { isAuthenticated, isLoading } = useAuth()

  const pageTitle = `Integrations | ${config.VITE_APP_TITLE}`
  const pageDescription = "Connect your account with external services and tools"
  const pageUrl = `${config.VITE_APP_URL}/integrations`

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
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

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Page Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plug className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
              <p className="text-muted-foreground">
                Connect your account with external services and tools
              </p>
            </div>
          </div>

          {/* Platform Integrations Section */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Platform integrations
              </h2>
              <p className="text-sm text-muted-foreground">
                Deploy and sync your schemas with cloud databases and services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {platformIntegrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </section>

          {/* Request Integration */}
          <section className="p-6 rounded-lg border border-dashed border-border bg-muted/20">
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">
                Need a different integration?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Let us know which services you'd like to connect with.
              </p>
              <FeedbackDialog>
                <Button variant="outline" size="sm">
                  Request Integration
                </Button>
              </FeedbackDialog>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
