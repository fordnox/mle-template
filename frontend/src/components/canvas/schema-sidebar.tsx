
import { Table2, ChevronRight, Key, Link2 } from "lucide-react"
import { cn } from "@/lib/utils.ts"
import type { Table } from "@/lib/data.ts"
import { isForeignKey } from "@/lib/data.ts"

interface SchemaSidebarProps {
  tables: Table[]
  selectedTable: string | null
  onTableSelect: (tableName: string) => void
}

export function SchemaSidebar({
  tables,
  selectedTable,
  onTableSelect,
}: SchemaSidebarProps) {
  return (
    <aside className="w-72 border-r border-border bg-sidebar flex flex-col">
      {/* Tables List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {tables.map((table) => (
            <button
              key={table.name}
              onClick={() => onTableSelect(table.name)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md transition-all group",
                selectedTable === table.name
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-muted border border-transparent",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn("font-mono text-sm", selectedTable === table.name ? "text-primary" : "text-foreground")}
                >
                  {table.name}
                </span>
                <ChevronRight
                  className={cn(
                    "w-3.5 h-3.5 transition-transform",
                    selectedTable === table.name ? "text-primary rotate-90" : "text-muted-foreground",
                  )}
                />
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Key className="w-2.5 h-2.5" />
                  {table.fields.filter((c) => c.pk).length} PK
                </span>
                <span className="flex items-center gap-1">
                  <Link2 className="w-2.5 h-2.5" />
                  {table.fields.filter((c) => isForeignKey(c)).length} FK
                </span>
                <span>{table.fields.length} cols</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Schema Stats */}
      <div className="p-3 border-t border-border">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted rounded-md">
            <div className="text-lg font-semibold text-foreground font-mono">{tables.length}</div>
            <div className="text-[10px] text-muted-foreground">Tables</div>
          </div>
          <div className="p-2 bg-muted rounded-md">
            <div className="text-lg font-semibold text-foreground font-mono">
              {tables.reduce((acc, t) => acc + t.fields.length, 0)}
            </div>
            <div className="text-[10px] text-muted-foreground">Columns</div>
          </div>
          <div className="p-2 bg-muted rounded-md">
            <div className="text-lg font-semibold text-foreground font-mono">
              {tables.reduce((acc, t) => acc + t.fields.filter((c) => isForeignKey(c)).length, 0)}
            </div>
            <div className="text-[10px] text-muted-foreground">Relations</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
