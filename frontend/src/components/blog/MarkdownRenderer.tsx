import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { CodeBlock, normalizeLanguage } from "./CodeBlock"

interface MarkdownRendererProps {
  content: string
  className?: string
}

/**
 * Convert heading text to a URL-safe slug
 * Must match the slugify function in TableOfContents.tsx
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
}

/**
 * Extract text content from React children
 */
function getTextContent(children: ReactNode): string {
  if (typeof children === "string") {
    return children
  }
  if (Array.isArray(children)) {
    return children.map(getTextContent).join("")
  }
  if (children && typeof children === "object" && "props" in children) {
    return getTextContent(children.props.children)
  }
  return ""
}

/**
 * Create heading component with auto-generated ID for anchor links
 */
function createHeadingComponent(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  return function HeadingComponent({ children }: { children?: ReactNode }) {
    const text = getTextContent(children)
    const id = slugify(text)
    return <Tag id={id}>{children}</Tag>
  }
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-lg prose-neutral dark:prose-invert max-w-none",
        // Base Typography - larger text and more spacing for readability
        "prose-p:text-foreground/90 prose-p:leading-8 prose-p:mb-8",
        "prose-strong:text-foreground prose-strong:font-bold",
        "prose-em:text-foreground/80",

        // Headings - Better visual hierarchy and generous spacing
        "prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight",
        "prose-h1:text-4xl prose-h1:mb-10 prose-h1:mt-14 prose-h1:font-extrabold",
        "prose-h2:text-2xl prose-h2:mb-8 prose-h2:mt-14",
        "prose-h3:text-xl prose-h3:mb-6 prose-h3:mt-10",
        "prose-h4:text-lg prose-h4:mb-4 prose-h4:mt-8",

        // Links
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:transition-colors",

        // Lists - more breathing room
        "prose-ul:text-foreground/90 prose-ul:my-8 prose-ul:list-disc prose-ul:pl-6",
        "prose-ol:text-foreground/90 prose-ol:my-8 prose-ol:pl-6",
        "prose-li:my-3 prose-li:marker:text-primary/50",

        // Code - larger padding for inline code
        "prose-code:text-primary prose-code:bg-secondary/50 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:font-medium",
        "prose-pre:bg-secondary/30 prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:shadow-sm",
        "prose-pre:text-sm prose-pre:leading-relaxed",

        // Blockquotes - more vertical space
        "prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-secondary/20 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:my-10",
        "prose-blockquote:text-foreground/80 prose-blockquote:italic",

        // Tables - more vertical space
        "prose-table:border prose-table:border-border prose-table:rounded-xl prose-table:overflow-hidden prose-table:my-10",
        "prose-thead:bg-secondary/50",
        "prose-th:text-foreground prose-th:font-semibold prose-th:p-4 prose-th:text-left",
        "prose-td:p-4 prose-td:border-t prose-td:border-border/50",

        // Images - more vertical space
        "prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-img:shadow-md prose-img:my-10",

        // Horizontal rules
        "prose-hr:border-border prose-hr:my-12",

        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: createHeadingComponent(1),
          h2: createHeadingComponent(2),
          h3: createHeadingComponent(3),
          h4: createHeadingComponent(4),
          h5: createHeadingComponent(5),
          h6: createHeadingComponent(6),
          code({ className, children, ...props }) {
            // Check if this is an inline code or code block
            // Code blocks have a className like "language-javascript"
            const match = /language-(\w+)/.exec(className || "")
            const isInline = !match && !className?.includes("language-")

            if (isInline) {
              // Inline code - use default styling from prose classes
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }

            // Code block - use CodeBlock component with syntax highlighting
            const language = normalizeLanguage(match?.[1])
            const codeString = String(children).replace(/\n$/, "")

            return (
              <CodeBlock language={language} showLineNumbers={codeString.split("\n").length > 1}>
                {codeString}
              </CodeBlock>
            )
          },
          pre({ children }) {
            // The pre element is already handled by the code component
            // Just render children without additional wrapper
            return <>{children}</>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
