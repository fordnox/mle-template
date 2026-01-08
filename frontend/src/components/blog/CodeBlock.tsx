import { useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  children: string
  language?: string
  showLineNumbers?: boolean
  className?: string
}

// Custom theme that matches SchemaHub's dark aesthetic
const schemaHubTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: "oklch(0.12 0.005 260)", // --card
    margin: 0,
    padding: "1rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    lineHeight: "1.625",
    fontFamily: '"JetBrains Mono", "Fira Code", "Geist Mono", monospace',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "transparent",
    fontFamily: '"JetBrains Mono", "Fira Code", "Geist Mono", monospace',
    fontSize: "0.875rem",
    lineHeight: "1.625",
  },
}

export function CodeBlock({
  children,
  language = "text",
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  // Clean up the code string (remove trailing newlines)
  const code = children.replace(/\n$/, "")

  return (
    <div className={cn("group relative my-4", className)}>
      {/* Language badge and copy button */}
      <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
        {language && language !== "text" && (
          <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground opacity-80">
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className={cn(
            "rounded p-1.5 transition-all duration-200",
            "text-muted-foreground hover:text-foreground",
            "bg-muted/80 hover:bg-muted",
            "opacity-0 group-hover:opacity-100 focus:opacity-100",
            copied && "text-primary opacity-100"
          )}
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Syntax highlighted code */}
      <SyntaxHighlighter
        language={language}
        style={schemaHubTheme}
        showLineNumbers={showLineNumbers}
        wrapLines
        wrapLongLines
        customStyle={{
          border: "1px solid oklch(0.22 0.005 260)", // --border
          borderRadius: "0.5rem",
          overflow: "auto",
        }}
        lineNumberStyle={{
          minWidth: "2.5em",
          paddingRight: "1em",
          color: "oklch(0.45 0 0)", // dimmed line numbers
          userSelect: "none",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

// Map common language aliases for react-syntax-highlighter
export function normalizeLanguage(lang: string | undefined): string {
  if (!lang) return "text"

  const aliases: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    tsx: "tsx",
    jsx: "jsx",
    py: "python",
    rb: "ruby",
    sh: "bash",
    shell: "bash",
    zsh: "bash",
    yml: "yaml",
    md: "markdown",
    json: "json",
    sql: "sql",
    dbml: "sql", // DBML uses SQL-like syntax highlighting
    prisma: "graphql", // Prisma uses similar syntax to GraphQL
    graphql: "graphql",
    gql: "graphql",
    html: "markup",
    xml: "markup",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    go: "go",
    rust: "rust",
    rs: "rust",
    c: "c",
    cpp: "cpp",
    "c++": "cpp",
    java: "java",
    kotlin: "kotlin",
    kt: "kotlin",
    swift: "swift",
    php: "php",
    dockerfile: "docker",
    docker: "docker",
    makefile: "makefile",
    make: "makefile",
    toml: "toml",
    ini: "ini",
    conf: "ini",
    diff: "diff",
    patch: "diff",
  }

  const normalized = lang.toLowerCase()
  return aliases[normalized] || normalized
}
