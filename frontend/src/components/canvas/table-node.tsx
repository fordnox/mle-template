import type React from "react"
import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import { Key, Link2, Hash, Type, Calendar, ToggleLeft } from "lucide-react"
import { cn } from "@/lib/utils.ts"
import type { Table, Column } from "@/lib/data.ts"
import { isForeignKey } from "@/lib/data.ts"

// Data passed to the custom node
export interface TableNodeData extends Record<string, unknown> {
  table: Table
  isSelected: boolean
}

// Type icons for column types
const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  int: Hash,
  integer: Hash,
  bigint: Hash,
  smallint: Hash,
  varchar: Type,
  text: Type,
  string: Type,
  char: Type,
  timestamp: Calendar,
  datetime: Calendar,
  date: Calendar,
  time: Calendar,
  boolean: ToggleLeft,
  bool: ToggleLeft,
  default: Type,
}

// Column row component with handles
function ColumnRow({ column }: { column: Column }) {
  const typeName = column.type?.type_name?.toLowerCase() ?? "unknown"
  const TypeIcon = typeIcons[typeName] || typeIcons.default
  const hasForeignKey = isForeignKey(column)

  return (
    <div className="relative px-4 py-2 flex items-center gap-3 hover:bg-muted/30 transition-colors">
      {/* Target handles for primary keys (connections come IN) - both sides */}
      {column.pk && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id={`${column.name}-target-left`}
            className="!w-2 !h-2 !bg-chart-4 !border-node-border"
            style={{ top: "50%" }}
          />
          <Handle
            type="target"
            position={Position.Right}
            id={`${column.name}-target-right`}
            className="!w-2 !h-2 !bg-chart-4 !border-node-border"
            style={{ top: "50%" }}
          />
        </>
      )}

      {/* Source handles for potential foreign keys (connections go OUT) - both sides
          Created for all non-PK columns to support both inline refs and external Ref: definitions */}
      {!column.pk && (
        <>
          <Handle
            type="source"
            position={Position.Left}
            id={`${column.name}-source-left`}
            className={cn(
              "!w-2 !h-2 !border-node-border",
              hasForeignKey ? "!bg-chart-2" : "!bg-transparent"
            )}
            style={{ top: "50%" }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id={`${column.name}-source-right`}
            className={cn(
              "!w-2 !h-2 !border-node-border",
              hasForeignKey ? "!bg-chart-2" : "!bg-transparent"
            )}
            style={{ top: "50%" }}
          />
        </>
      )}

      <div className="flex items-center gap-2 flex-1 min-w-0">
        {column.pk && <Key className="w-3.5 h-3.5 text-chart-4 flex-shrink-0" />}
        {hasForeignKey && !column.pk && <Link2 className="w-3.5 h-3.5 text-chart-2 flex-shrink-0" />}
        {!column.pk && !hasForeignKey && (
          <TypeIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        )}
        <span
          className={cn(
            "font-mono text-xs truncate",
            column.pk ? "text-chart-4 font-medium" : hasForeignKey ? "text-chart-2" : "text-foreground",
          )}
        >
          {column.name}
        </span>
      </div>
      <span className="font-mono text-[10px] text-muted-foreground uppercase flex-shrink-0">
        {column.type?.type_name ?? "unknown"}
      </span>
      {column.not_null && <span className="text-[10px] text-destructive flex-shrink-0">NOT NULL</span>}
    </div>
  )
}

// Props for the custom node - using the standard React Flow pattern
interface TableNodeProps {
  data: TableNodeData
}

// React Flow custom node component
function TableNodeComponent({ data }: TableNodeProps) {
  const { table, isSelected } = data

  return (
    <div
      className={cn(
        "w-[300px] bg-node border rounded-lg overflow-hidden transition-all",
        isSelected
          ? "border-primary shadow-lg shadow-primary/20 ring-1 ring-primary/30"
          : "border-node-border hover:border-muted-foreground/40",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "px-4 py-2.5 border-b",
          isSelected ? "bg-primary/15 border-primary/30" : "bg-muted/50 border-node-border",
        )}
      >
        <h4 className={cn("font-mono font-semibold text-sm", isSelected ? "text-primary" : "text-foreground")}>
          {table.name}
        </h4>
      </div>

      {/* Columns */}
      <div className="divide-y divide-node-border">
        {table.fields.map((col) => (
          <ColumnRow key={col.name} column={col} />
        ))}
      </div>
    </div>
  )
}

// Memoized export for better performance
export const TableNode = memo(TableNodeComponent)
