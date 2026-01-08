import { useEffect, useRef, useState } from "react"
import { Database, Sparkles, Layers, Code2, Zap, GitBranch, FileCode, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge.tsx"
import { FloatingTables } from "@/components/effects/floating_tables.tsx"

// Mini code preview for Step 3
function CodePreview() {
  const [visibleLines, setVisibleLines] = useState(0)
  const lines = [
    "export const users = pgTable('users', {",
    "  id: serial('id').primaryKey(),",
    "  email: varchar('email', { length: 255 }),",
    "  createdAt: timestamp('created_at'),",
    "});",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines((prev) => (prev >= lines.length ? 0 : prev + 1))
    }, 800)
    return () => clearInterval(timer)
  }, [lines.length])

  return (
    <div className="font-mono text-[10px] leading-relaxed text-primary/70">
      {lines.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="whitespace-nowrap overflow-hidden">
          {line}
        </div>
      ))}
      {visibleLines < lines.length && (
        <span className="inline-block w-1.5 h-3 bg-primary/50 animate-pulse" />
      )}
    </div>
  )
}

// Iteration preview showing schema refinement
function IterationPreview() {
  const [step, setStep] = useState(0)
  const steps = [
    { label: "Add indexes", done: true },
    { label: "Normalize relations", done: true },
    { label: "Add constraints", done: false },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4)
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-1.5">
      {steps.map((s, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 text-[10px] transition-all duration-300 ${
            i <= step ? "opacity-100" : "opacity-30"
          }`}
        >
          <CheckCircle2
            className={`w-3 h-3 ${
              i < step ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <span className={i < step ? "text-foreground" : "text-muted-foreground"}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// Animated flow connector SVG
function FlowConnector({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute top-1/2 -translate-y-1/2 w-8 h-16 ${className}`}
      viewBox="0 0 32 64"
      fill="none"
    >
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
          <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.6">
            <animate
              attributeName="offset"
              values="0;1;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d="M0 32 L12 32 Q16 32 20 28 L24 24 Q28 20 28 32 Q28 44 24 40 L20 36 Q16 32 12 32 L32 32"
        stroke="url(#flowGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="28" cy="32" r="3" fill="var(--primary)" opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.3;0.8;0.3"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}

// Workflow step card component
interface WorkflowStepProps {
  step: number
  icon: React.ElementType
  title: string
  description: string
  preview: React.ReactNode
  badge?: string
  delay?: number
}

function WorkflowStep({ step, icon: Icon, title, description, preview, badge, delay = 0 }: WorkflowStepProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="group relative p-5 bg-card border border-border rounded-xl hover:border-primary/30 transition-all overflow-hidden">
        {/* Preview area */}
        <div className="h-24 mb-4 rounded-lg bg-muted/50 border border-border/50 overflow-hidden relative">
          {preview}
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">Step {step}</span>
          {badge && (
            <Badge variant="secondary" className="ml-auto text-[10px]">
              {badge}
            </Badge>
          )}
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// Benefit card component
interface BenefitCardProps {
  icon: React.ElementType
  title: string
  description: string
}

function BenefitCard({ icon: Icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/20 transition-colors">
      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-foreground mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function SectionAiWorkflow() {
  return (
    <section className="py-16 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            AI-First Workflow
          </Badge>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Building with AI? Start with your data model
          </h2>
          <p className="text-lg text-muted-foreground">
            The most effective AI-assisted development begins with a well-defined database schema.
            Get your data structure right first, then let AI help build the rest.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative">
            {/* Flow connectors (desktop only) */}
            <FlowConnector className="hidden md:block left-[calc(33.33%-16px)] z-10" />
            <FlowConnector className="hidden md:block left-[calc(66.66%-16px)] z-10" />

            <WorkflowStep
              step={1}
              icon={Database}
              title="Define your data model"
              description="Browse existing schemas for inspiration or create your own. Define tables, relationships, and constraints that match your domain."
              badge="1580+ schemas"
              delay={0}
              preview={
                <div className="w-full h-full opacity-60">
                  <FloatingTables
                    tableColor="#22c55e"
                    lineColor="#22c55e"
                    opacity={0.4}
                    speed={0.15}
                    tableCount={4}
                    tableNames={["users", "posts", "comments", "likes"]}
                  />
                </div>
              }
            />

            <WorkflowStep
              step={2}
              icon={Layers}
              title="Iterate before coding"
              description="Refine your schema visually. It's much easier to adjust your data model now than after you've started building."
              delay={200}
              preview={
                <div className="flex items-center justify-center h-full p-3">
                  <IterationPreview />
                </div>
              }
            />

            <WorkflowStep
              step={3}
              icon={Sparkles}
              title="Let AI build the rest"
              description="With a solid data foundation, AI tools can generate accurate APIs, UI components, and business logic that actually work together."
              badge="20+ exports"
              delay={400}
              preview={
                <div className="p-3 h-full flex items-center">
                  <CodePreview />
                </div>
              }
            />
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-medium text-muted-foreground text-center mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Why data-first works better with AI
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BenefitCard
              icon={GitBranch}
              title="Consistent code generation"
              description="AI generates more reliable code when it understands your data relationships"
            />
            <BenefitCard
              icon={Layers}
              title="Fewer rewrites"
              description="Design upfront means fewer migrations and breaking changes later"
            />
            <BenefitCard
              icon={Code2}
              title="Better prompts"
              description="Clear data contracts make it easier to prompt AI for specific features"
            />
            <BenefitCard
              icon={FileCode}
              title="Universal exports"
              description="Export to SQL, ORM models, or DBML to use with any AI coding assistant"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
