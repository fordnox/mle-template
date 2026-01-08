
import { exportCategories, exportFormats } from "@/lib/export-formats.ts"

export function SectionExportFormats() {
  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Export to {exportFormats.length}+ formats
          </h2>
          <p className="text-lg text-muted-foreground">
            Generate production-ready code for your favorite language and framework.
            From SQL DDL to ORM models, we've got you covered.
          </p>
        </div>

        {/* Format Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {exportCategories.map((category) => (
            <div
              key={category.id}
              className="p-5 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {category.label}
              </h3>
              <div className="space-y-2">
                {category.formats.map((format) => {
                  const Icon = format.icon
                  return (
                    <div
                      key={format.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <Icon className={`w-5 h-5 ${format.iconColor}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-foreground">
                          {format.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {format.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Languages supported */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Supported languages and frameworks</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Python", "TypeScript", "Prisma", "Drizzle", "TypeORM", "MikroORM", "Ruby", "PHP", "PostgreSQL", "MySQL", "SQLite", "SQL Server", "JSON"].map((lang) => (
              <span
                key={lang}
                className="px-3 py-1.5 bg-muted rounded-full text-xs font-mono text-muted-foreground"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
