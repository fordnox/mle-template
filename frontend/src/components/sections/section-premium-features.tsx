import { useState } from "react"
import { Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { toast } from "sonner"
import api from "@/lib/api.ts"

interface Feature {
  name: string
  free: boolean | string
  pro: boolean | string
}

const features: Feature[] = [
  { name: "Public schemas", free: "Unlimited", pro: "Unlimited" },
  { name: "Private schemas", free: false, pro: "Unlimited" },
  { name: "AI prompt generation", free: "5/day", pro: "Usage based" },
  { name: "AI schema improvement", free: "3/day", pro: "Usage based" },
  { name: "Schema diagram & visualization", free: true, pro: true },
  { name: "Export to SQL, TypeScript, Prisma", free: true, pro: true },
  { name: "Fork existing schemas", free: true, pro: true },
  { name: "Database schema importing", free: true, pro: true },
  { name: "Sell schema as digital product", free: false, pro: true },
  { name: "BYOK - Use your own provider API keys", free: false, pro: true },
  { name: "Embedable schemas", free: false, pro: true },
  { name: "REST API endpoints generation", free: false, pro: true },
  { name: "Mock data generation", free: false, pro: true },
  { name: "Index optimization suggestions", free: false, pro: true },
  { name: "Export to OpenAPI spec", free: false, pro: true },
  { name: "API access & keys", free: false, pro: true },
  { name: "Organizations and team collaboration", free: false, pro: true },
  { name: "Audit log", free: false, pro: true },
  { name: "Sync with GitHub", free: false, pro: true },
  { name: "Priority support", free: false, pro: true },
]

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-foreground">{value}</span>
  }
  if (value) {
    return <Check className="w-5 h-5 text-primary" />
  }
  return <X className="w-5 h-5 text-muted-foreground/50" />
}

export function SectionPremiumFeatures() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const { error } = await api.POST("/waitlist", {
        body: { email },
      })

      if (error) {
        toast.error("Failed to join waitlist")
        return
      }

      setSubmitted(true)
      setEmail("")
      toast.success("You're on the list!")
    } catch {
      toast.error("Failed to join waitlist")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and upgrade when you need more power.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Free Plan */}
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Perfect for learning and personal projects
              </p>
            </div>
            <Button variant="outline" className="w-full mb-6">
              Get Started
            </Button>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Unlimited public schemas</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Schema visualization</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Export to SQL, TypeScript, Prisma</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">5 AI prompts per day</span>
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="p-6 bg-card border-2 border-primary rounded-xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">Usage</span>
                <span className="text-muted-foreground">Based. Upfront top-up</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                For teams requiring more power and flexibility.
              </p>
            </div>

            {/* Waitlist Form */}
            {submitted ? (
              <div className="flex items-center justify-center gap-2 text-primary py-2 mb-6">
                <Check className="w-5 h-5" />
                <span className="font-medium">You're on the list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 pr-20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button type="submit" size="sm" disabled={isSubmitting} className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 text-xs">
                  {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Join"}
                </Button>
              </form>
            )}

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Everything in Free</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Unlimited private schemas</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Unlimited AI prompts</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">REST API Endpoints</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">SSO SAML integration</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Team collaboration</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground text-center mb-6">
            Feature Comparison
          </h3>
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left py-4 px-6 font-medium text-foreground">Feature</th>
                  <th className="text-center py-4 px-6 font-medium text-foreground w-42">Free</th>
                  <th className="text-center py-4 px-6 font-medium text-foreground w-42">Pro</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}
                  >
                    <td className="py-3 px-6 text-sm text-muted-foreground">
                      {feature.name}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center">
                        <FeatureValue value={feature.free} />
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center">
                        <FeatureValue value={feature.pro} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
