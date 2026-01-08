import { designTemplates } from "@/lib/design-templates.ts"
import { DesignTemplateCard } from "@/components/design-template-card.tsx"

// Show a curated selection of popular templates
const featuredTemplates = designTemplates.slice(0, 12)

export function SectionDesignTemplates() {
  return (
    <section className="py-16 bg-background border-t border-b border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {designTemplates.length} Design Templates for Ready-to-Build Prompts
          </h2>
          <p className="text-lg text-muted-foreground">
            Transform your database schema into production-ready prompts with beautiful design systems.
            Choose a template to generate perfect vibe coding prompts.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-5xl mx-auto mb-8">
          {featuredTemplates.map((template) => (
            <DesignTemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* More templates note */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            +{designTemplates.length - featuredTemplates.length} more templates including Cyberpunk, Vaporwave, Neo Brutalism, Glassmorphism...
          </p>
        </div>
      </div>
    </section>
  )
}
