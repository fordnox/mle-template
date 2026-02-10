import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DatabaseZap, ArrowRight, Loader2, Database } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { useAuth } from "@/hooks/useAuth.ts"
import { usePopularRepos } from "@/hooks/useReposQuery.ts"
import client from "@/lib/api.ts"

const placeholderExamples = [
  "A restaurant app with menus, reservations, and reviews",
  "An e-commerce platform with products, orders, and reviews",
  "A fitness tracker with workouts, goals, and progress",
  "A project management tool with teams, tasks, and deadlines",
  "A social network with users, posts, and comments",
  "A booking system with appointments and availability",
]

function useTypewriter(texts: string[], typingSpeed = 50, deletingSpeed = 30, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState("")
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseDuration)
      return () => clearTimeout(pauseTimer)
    }

    if (isDeleting) {
      if (displayText === "") {
        setIsDeleting(false)
        setTextIndex((prev) => (prev + 1) % texts.length)
        return
      }
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1))
      }, deletingSpeed)
      return () => clearTimeout(timer)
    }

    if (displayText === currentText) {
      setIsPaused(true)
      return
    }

    const timer = setTimeout(() => {
      setDisplayText(currentText.slice(0, displayText.length + 1))
    }, typingSpeed)
    return () => clearTimeout(timer)
  }, [displayText, textIndex, isDeleting, isPaused, texts, typingSpeed, deletingSpeed, pauseDuration])

  return displayText
}

const rotatingPhrases = [
    "AI App starts with data model",
    "Like GitHub for data models",
    "Create data model with AI",
    "Get perfect one shot LLM prompt",
    "Hub for 1000+ of DB schemas",
    "AI native DB Schema Builder",
    "Instant API",
    "Export schema to 20+ formats",
]

export function SectionHero() {
  const [vibeInput, setVibeInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const animatedPlaceholder = useTypewriter(placeholderExamples, 40, 25, 2500)
  const { data: popularRepos = [] } = usePopularRepos()

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length)
        setIsAnimating(false)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleGenerate = async () => {
    if (!vibeInput.trim()) return
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    setIsGenerating(true)

    // @ts-expect-error endpoint not yet in backend schema
    const { data, error } = await client.POST("/repo", {
      body: { description: vibeInput },
    })

    setIsGenerating(false)

    if (error || !data) {
      return
    }

    // TODO: Get owner from auth context when available
    navigate(`/schemahub/${(data as any).name}`)
  }

  const handleTemplateClick = (ownerUsername: string, projectName: string) => {
    navigate(`/${ownerUsername}/${projectName}`)
  }

  return (
    <section className="relative mb-16 px-6 pt-16 isolate">

      {/* Main SectionHeroSimple */}
      <div className="relative z-10 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4 text-balance">
          <span
            className={`inline-block transition-all duration-300 ${
              isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            {rotatingPhrases[phraseIndex]}
          </span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 text-pretty">
          Every app starts with data model
        </p>
      </div>

      {/* Vibe Input */}
      <div className="relative z-10 max-w-3xl mx-auto mb-12">
        <div className="relative">
          <div className="relative bg-card/80 backdrop-blur-sm border border-primary rounded-lg overflow-hidden shadow-lg shadow-primary/20 ring-1 ring-primary/30 p-2 sm:p-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex-1 relative">
                <DatabaseZap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  type="text"
                  value={vibeInput}
                  onChange={(e) => setVibeInput(e.target.value)}
                  placeholder={animatedPlaceholder}
                  className="w-full bg-transparent pl-11 pr-4 py-3 sm:py-4 text-foreground placeholder:text-muted-foreground focus:outline-none font-mono text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !vibeInput.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6 h-11 w-full sm:w-auto sm:mr-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Create
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Example prompts */}
        <div className="relative z-10 flex items-center justify-center gap-2 mt-4 flex-wrap">
          <span className="text-xs text-muted-foreground">Try:</span>
          {["Blog with comments", "Task management app", "Booking system"].map((example) => (
            <button
              key={example}
              onClick={() => setVibeInput(example)}
              className="text-xs px-2.5 py-1 rounded-md bg-muted/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Projects */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-sm font-medium text-muted-foreground text-center mb-4">
          Or start with a popular schema
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {popularRepos.map((repo, index) => (
            <button
              key={repo.id}
              onClick={() => handleTemplateClick(repo.owner.username, repo.name)}
              className="group p-4 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:border-primary/30 hover:bg-card/90 transition-all text-left"
            >
              <Database className={`w-5 h-5 mb-2 ${
                index === 0 ? "text-chart-1" :
                index === 1 ? "text-chart-2" :
                index === 2 ? "text-chart-4" :
                "text-chart-5"
              }`} />
              <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                {repo.title}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {repo.category ?? "Schema"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
