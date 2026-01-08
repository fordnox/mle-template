import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.tsx"

interface OptimizeResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  optimizedPrompt: string
}

export function OptimizeResultDialog({
  open,
  onOpenChange,
  optimizedPrompt,
}: OptimizeResultDialogProps) {
  const [copied, setCopied] = useState(false)

  const copyPrompt = () => {
    navigator.clipboard.writeText(optimizedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Optimized Prompt</DialogTitle>
          <DialogDescription>
            Your prompt has been optimized for AI coding assistants. Copy it and paste into your favorite platform.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col gap-4">
          {/* Prompt Preview */}
          <div className="flex-1 min-h-0 rounded-lg border border-border bg-muted/30 overflow-hidden">
            <pre className="p-4 text-xs text-foreground font-mono whitespace-pre-wrap overflow-y-auto h-full max-h-[300px]">
              {optimizedPrompt}
            </pre>
          </div>

          {/* Copy Button */}
          <Button onClick={copyPrompt} className="gap-2 w-full" size="lg">
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Prompt
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
