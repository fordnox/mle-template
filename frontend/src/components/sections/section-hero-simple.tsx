import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, ArrowRight, Database } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { usePopularRepos, useReposCount } from "@/hooks/useReposQuery.ts"

export function SectionHeroSimple() {
    const { data: popularRepos = [] } = usePopularRepos(8)
    const { data: totalCount } = useReposCount()
    const [currentIndex, setCurrentIndex] = useState(0)

    // Auto-rotate carousel
    useEffect(() => {
        if (popularRepos.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % popularRepos.length)
        }, 4000) // Change every 4 seconds

        return () => clearInterval(interval)
    }, [popularRepos.length])

    const goToPrevious = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? popularRepos.length - 1 : prev - 1
        )
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % popularRepos.length)
    }

    if (popularRepos.length === 0) {
        return null
    }

    const currentRepo = popularRepos[currentIndex]

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border-b border-border">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Text */}
                    <div className="space-y-6">
                        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                            Explore the data model of{" "}
                            <span className="text-primary">any application</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-xl">
                            Browse hundreds of database schemas, visualize relationships, and export DBML for your projects.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span>{totalCount ?? "..."} schemas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span>Real-world examples</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <Link to="/explore">
                                <Button size="lg" className="gap-2">
                                    Explore schemas
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link to="/viewer">
                                <Button variant="outline" size="lg">
                                    DBML Viewer
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Carousel */}
                    <div className="relative">
                        <div className="relative bg-canvas border border-border rounded-lg overflow-hidden shadow-2xl">
                            {/* Clickable project card */}
                            <Link
                                to={`/${currentRepo.owner.username}/${currentRepo.name}`}
                                className="block cursor-pointer group"
                            >
                                {/* Project info */}
                                <div className="absolute top-4 left-4 right-4 z-10 bg-card/90 backdrop-blur-sm border border-border rounded-md px-4 py-2 group-hover:bg-card group-hover:border-primary/50 transition-colors">
                                    <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                        {currentRepo.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {currentRepo.category ?? "Schema"}
                                    </p>
                                </div>

                                {/* Visual placeholder - gradient with icon */}
                                <div className="h-96 relative group-hover:opacity-90 transition-opacity bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center">
                                    <Database className="w-24 h-24 text-primary/20" />
                                </div>
                            </Link>

                            {/* Navigation arrows */}
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-full p-2 hover:bg-muted transition-colors"
                                aria-label="Previous project"
                            >
                                <ChevronLeft className="w-5 h-5 text-foreground" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-full p-2 hover:bg-muted transition-colors"
                                aria-label="Next project"
                            >
                                <ChevronRight className="w-5 h-5 text-foreground" />
                            </button>

                            {/* Dots indicator */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {popularRepos.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                                ? "bg-primary w-6"
                                                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                            }`}
                                        aria-label={`Go to project ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
