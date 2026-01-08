import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { config } from "@/lib/config.ts"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileCode, Loader2, User, CheckCircle2, Code, Sparkles } from "lucide-react"
import { toast } from "sonner"
import client from "@/lib/api"

const SUPPORTED_FORMATS = [
  { name: "SQL", examples: "PostgreSQL, MySQL, SQLite, SQL Server" },
  { name: "ORM", examples: "Prisma, TypeORM, SQLAlchemy, Sequelize" },
  { name: "Code", examples: "Python, TypeScript, Ruby, PHP models" },
  { name: "Schema", examples: "JSON Schema, Protocol Buffers, DBML" },
  { name: "Data", examples: "CSV, JSON (schema inferred)" },
  { name: "Docs", examples: "Markdown, text describing structure" },
]

export default function DbmlNewPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dbmlInput, setDbmlInput] = useState("")
  const [isImportingDbml, setIsImportingDbml] = useState(false)
  const [descriptionInput, setDescriptionInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }, [])

  const handleFileUpload = async () => {
    if (!selectedFile) return

    if (selectedFile.size > 1_000_000) {
      toast.error("File too large", {
        description: "Maximum file size is 1MB",
      })
      return
    }

    setIsUploading(true)

    try {
      const { data, error } = await client.POST("/repo/import/file", {
        body: { file: selectedFile as unknown as string },
        bodySerializer: (body) => {
          const formData = new FormData()
          formData.append("file", body.file as unknown as File)
          return formData
        },
      })

      if (error || !data) {
        return
      }

      toast.success("Schema imported successfully!", {
        description: `Created: ${data.title}`,
      })
      navigate(`/${data.owner.username}/${data.name}`)
    } catch (error) {
      console.error("Import error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDbmlImport = async () => {
    if (!dbmlInput.trim()) {
      toast.error("DBML required", {
        description: "Please enter DBML schema content",
      })
      return
    }

    if (dbmlInput.length > 500_000) {
      toast.error("DBML too large", {
        description: "Maximum DBML size is 500KB",
      })
      return
    }

    setIsImportingDbml(true)

    try {
      const { data, error } = await client.POST("/repo/import", {
        body: { dbml: dbmlInput },
      })

      if (error || !data) {
        return
      }

      toast.success("Schema imported successfully!", {
        description: `Created: ${data.title}`,
      })
      navigate(`/${data.owner.username}/${data.name}`)
    } catch (error) {
      console.error("Import error:", error)
    } finally {
      setIsImportingDbml(false)
    }
  }

  const handleGenerateFromDescription = async () => {
    if (!descriptionInput.trim()) {
      toast.error("Description required", {
        description: "Please describe the schema you want to create",
      })
      return
    }

    if (descriptionInput.length > 10_000) {
      toast.error("Description too long", {
        description: "Maximum description is 10,000 characters",
      })
      return
    }

    setIsGenerating(true)

    try {
      const { data, error } = await client.POST("/repo", {
        body: { description: descriptionInput },
      })

      if (error || !data) {
        return
      }

      toast.success("Schema generated successfully!", {
        description: `Created: ${data.title}`,
      })
      navigate(`/${data.owner.username}/${data.name}`)
    } catch (error) {
      console.error("Generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (authLoading) {
    return (
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto text-center py-16">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Login Required</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to import database schemas.
          </p>
          <Button onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      </main>
    )
  }

  return (
    <>
      <Helmet>
        <title>{`New Schema | ${config.VITE_APP_TITLE}`}</title>
        <meta name="description" content="Import your database schema from SQL, ORM, or code files. AI will analyze and convert to DBML format automatically." />
        <link rel="canonical" href={`${config.VITE_APP_URL}/import`} />
        <meta property="og:title" content={`Import Schema | ${config.VITE_APP_TITLE}`} />
        <meta property="og:description" content="Import your database schema from SQL, ORM, or code files. AI will analyze and convert to DBML format automatically." />
        <meta property="og:url" content={`${config.VITE_APP_URL}/import`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={`Import Schema | ${config.VITE_APP_TITLE}`} />
        <meta name="twitter:description" content="Import your database schema from SQL, ORM, or code files. AI will analyze and convert to DBML format automatically." />
      </Helmet>
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Schema</h1>
        <p className="text-muted-foreground mb-8">
          Describe what you need, upload a file, or paste DBML. AI will generate the schema.
        </p>

        <Tabs defaultValue="description" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description" className="gap-2">
              <Sparkles className="w-4 h-4" />
              From Description
            </TabsTrigger>
            <TabsTrigger value="file" className="gap-2">
              <Upload className="w-4 h-4" />
              From File
            </TabsTrigger>
            <TabsTrigger value="dbml" className="gap-2">
              <Code className="w-4 h-4" />
              From DBML
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Textarea
                      placeholder={`Describe the database schema you want to create...

Examples:
• A restaurant app with menus, reservations, and reviews
• An e-commerce platform with products, orders, and payments
• A project management tool with teams, tasks, and deadlines
• A social network with users, posts, and comments`}
                      value={descriptionInput}
                      onChange={(e) => setDescriptionInput(e.target.value)}
                      className="min-h-[200px] text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      AI will generate a complete DBML schema from your description
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleGenerateFromDescription}
                      disabled={isGenerating || !descriptionInput.trim()}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Schema...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Schema
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="file">
            <Card>
              <CardContent className="pt-6">
                <div
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                    ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
                    ${selectedFile ? "border-green-500 bg-green-500/5" : ""}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="*/*"
                  />

                  {selectedFile ? (
                    <div className="space-y-3">
                      <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
                      <div>
                        <p className="font-medium text-foreground">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Click or drop another file to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">
                          Drop your file here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Maximum file size: 1MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedFile && (
                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={handleFileUpload}
                      disabled={isUploading}
                      className="flex-1"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <FileCode className="w-4 h-4 mr-2" />
                          Import Schema
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFile(null)}
                      disabled={isUploading}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dbml">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Textarea
                      placeholder={`Paste your DBML schema here...

Example:
Table users {
  id int [pk, increment]
  email varchar(255) [unique, not null]
  created_at timestamp [default: \`now()\`]
}

Table posts {
  id int [pk, increment]
  user_id int [ref: > users.id]
  title varchar(255)
  content text
}`}
                      value={dbmlInput}
                      onChange={(e) => setDbmlInput(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Maximum size: 500KB ({dbmlInput.length.toLocaleString()} characters)
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleDbmlImport}
                      disabled={isImportingDbml || !dbmlInput.trim()}
                      className="flex-1"
                    >
                      {isImportingDbml ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Validating & Importing...
                        </>
                      ) : (
                        <>
                          <FileCode className="w-4 h-4 mr-2" />
                          Import DBML
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supported Formats</CardTitle>
            <CardDescription>
              AI can extract or generate schemas from various file types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SUPPORTED_FORMATS.map((format) => (
                <div
                  key={format.name}
                  className="p-3 rounded-lg bg-muted/50"
                >
                  <p className="font-medium text-sm text-foreground">{format.name}</p>
                  <p className="text-xs text-muted-foreground">{format.examples}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
    </>
  )
}
