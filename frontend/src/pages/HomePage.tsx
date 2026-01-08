import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config.ts"
import { SectionDemoSchema } from "@/components/sections/section-demo-schema.tsx"
import { SectionAiWorkflow } from "@/components/sections/section-ai-workflow.tsx"
import { SectionApiEndpoints } from "@/components/sections/section-api-endpoints.tsx"
import { SectionExportFormats } from "@/components/sections/section-export-formats.tsx"
import { SectionHero } from "@/components/sections/section-hero.tsx"
import { SectionTestimonials } from "@/components/sections/section-testimonials.tsx"
import { SectionPremiumFeatures } from "@/components/sections/section-premium-features.tsx"
import { SectionPopularSchemas } from "@/components/sections/section-popular-schemas.tsx"
import { SectionDesignTemplates } from "@/components/sections/section-design-templates.tsx"
import { SectionRecentSchemas } from "@/components/sections/section-recent-schemas.tsx"
import { SectionFaq } from "@/components/sections/section-faq.tsx"
import { SectionBlogPosts } from "@/components/sections/section-blog-posts.tsx"

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>{`${config.VITE_APP_TITLE} - Database Schema Design & Visualization Platform`}</title>
        <meta name="description" content="Design, visualize, and share database schemas. AI-powered schema generation, ERD diagrams, and export to SQL, TypeScript, Prisma, and more." />
        <link rel="canonical" href={config.VITE_APP_URL} />

        {/* Open Graph */}
        <meta property="og:title" content={`${config.VITE_APP_TITLE} - Database Schema Design & Visualization Platform`} />
        <meta property="og:description" content="Design, visualize, and share database schemas. AI-powered schema generation, ERD diagrams, and export to SQL, TypeScript, Prisma, and more." />
        <meta property="og:url" content={config.VITE_APP_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${config.VITE_APP_URL}/opengraph-image.png`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${config.VITE_APP_TITLE} - Database Schema Design & Visualization Platform`} />
        <meta name="twitter:description" content="Design, visualize, and share database schemas. AI-powered schema generation, ERD diagrams, and export to SQL, TypeScript, Prisma, and more." />
        <meta name="twitter:image" content={`${config.VITE_APP_URL}/opengraph-image.png`} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": config.VITE_APP_TITLE,
            "alternateName": "AI Database Schema Repository",
            "@id": config.VITE_APP_URL,
            "url": config.VITE_APP_URL,
            "logo": `${config.VITE_APP_URL}/logo.png`,
            "image": `${config.VITE_APP_URL}/opengraph-image.png`,
            "description": "Design, visualize, and share database schemas. AI-powered schema generation, ERD diagrams, and export to SQL, TypeScript, Prisma, and more.",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "sameAs": [
              "https://twitter.com/SchemaHubAI"
            ]
          })}
        </script>
      </Helmet>
      <SectionHero />
      <SectionPopularSchemas />
      <SectionRecentSchemas />
      <SectionDesignTemplates />
      <SectionApiEndpoints />
      <SectionExportFormats />
      <SectionAiWorkflow />
      <SectionBlogPosts />
      <SectionPremiumFeatures />
      <SectionTestimonials />
      <SectionFaq />
      <SectionDemoSchema />
    </>
  )
}
