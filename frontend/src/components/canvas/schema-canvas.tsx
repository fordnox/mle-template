import { useMemo, useCallback, forwardRef, useImperativeHandle, useEffect, useState } from "react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeTypes,
} from "@xyflow/react"
import { TableNode, type TableNodeData } from "@/components/canvas/table-node.tsx"
import type { Table, Ref } from "@/lib/data.ts"
import { isForeignKey, getForeignKeyRef } from "@/lib/data.ts"

// const LINE_TYPE = "smoothstep"
const LINE_TYPE = "default"

// Layout constants - exported for use in other components
export const CANVAS_LAYOUT = {
  COLUMNS_PER_ROW: 4,
  X_SPACING: 450,
  INITIAL_X: 50,
  INITIAL_Y: 50,
  ROW_GAP: 100,
  HEADER_HEIGHT: 41,
  FIELD_HEIGHT: 33,
  TABLE_WIDTH: 300,
} as const

// Calculate table positions - exported for use in centering logic
export function calculateTablePositions(
  tables: Table[],
  initialX: number = CANVAS_LAYOUT.INITIAL_X,
  initialY: number = CANVAS_LAYOUT.INITIAL_Y
): { x: number; y: number }[] {
  const { COLUMNS_PER_ROW, X_SPACING, ROW_GAP, HEADER_HEIGHT, FIELD_HEIGHT } = CANVAS_LAYOUT

  const positions: { x: number; y: number }[] = []
  let currentY = initialY

  for (let i = 0; i < tables.length; i += COLUMNS_PER_ROW) {
    const rowTables = tables.slice(i, i + COLUMNS_PER_ROW)
    const maxFieldsInRow = Math.max(...rowTables.map((t) => t.fields.length))
    const maxRowHeight = HEADER_HEIGHT + maxFieldsInRow * FIELD_HEIGHT

    for (let j = 0; j < rowTables.length; j++) {
      positions.push({
        x: initialX + j * X_SPACING,
        y: currentY,
      })
    }

    currentY += maxRowHeight + ROW_GAP
  }

  return positions
}

// Node types registration (must be outside component to prevent re-renders)
const nodeTypes: NodeTypes = {
  tableNode: TableNode,
}

// Type for our custom nodes
type TableNode = Node<TableNodeData, "tableNode">

// Convert tables to React Flow nodes
function tablesToNodes(
  tables: Table[],
  selectedTable: string | null,
  initialX?: number,
  initialY?: number
): TableNode[] {
  const positions = calculateTablePositions(tables, initialX, initialY)

  return tables.map((table, i) => ({
    id: table.name,
    type: "tableNode" as const,
    position: positions[i],
    data: {
      table,
      isSelected: selectedTable === table.name,
    },
  }))
}

// Determine optimal handle sides based on node positions
function getHandleSides(
  sourcePos: { x: number; y: number },
  targetPos: { x: number; y: number }
): { sourceSide: "left" | "right"; targetSide: "left" | "right" } {
  const sourceCenter = sourcePos.x + CANVAS_LAYOUT.TABLE_WIDTH / 2
  const targetCenter = targetPos.x + CANVAS_LAYOUT.TABLE_WIDTH / 2

  // If source is to the left of target, connect right->left
  // If source is to the right of target, connect left->right
  if (sourceCenter < targetCenter) {
    return { sourceSide: "right", targetSide: "left" }
  } else {
    return { sourceSide: "left", targetSide: "right" }
  }
}

// Convert references to React Flow edges
function refsToEdges(
  tables: Table[],
  refs?: Ref[],
  nodePositions?: Map<string, { x: number; y: number }>
): Edge[] {
  const edges: Edge[] = []
  const seen = new Set<string>()

  // Build position map from calculated positions if not provided
  const positions =
    nodePositions ||
    new Map(
      tables.map((t, i) => {
        const pos = calculateTablePositions(tables)[i]
        return [t.name, pos]
      })
    )

  // From inline refs on columns
  tables.forEach((table) => {
    table.fields.forEach((col) => {
      if (isForeignKey(col)) {
        const fkRef = getForeignKeyRef(col)
        if (fkRef) {
          const edgeId = `${table.name}-${col.name}-${fkRef.table}-${fkRef.column}`
          if (!seen.has(edgeId)) {
            seen.add(edgeId)

            // Get optimal handle sides based on positions
            const sourcePos = positions.get(table.name)
            const targetPos = positions.get(fkRef.table)
            const { sourceSide, targetSide } =
              sourcePos && targetPos
                ? getHandleSides(sourcePos, targetPos)
                : { sourceSide: "right" as const, targetSide: "left" as const }

            edges.push({
              id: edgeId,
              source: table.name,
              target: fkRef.table,
              sourceHandle: `${col.name}-source-${sourceSide}`,
              targetHandle: `${fkRef.column}-target-${targetSide}`,
              type: LINE_TYPE,
              style: {
                stroke: "var(--connection)",
                strokeWidth: 2,
                strokeDasharray: "4 2",
              },
              animated: false,
            })
          }
        }
      }
    })
  })

  // From standalone Ref definitions
  if (refs) {
    refs.forEach((refDef) => {
      if (refDef.endpoints && refDef.endpoints.length === 2) {
        const [endpoint1, endpoint2] = refDef.endpoints

        // Determine which endpoint is the "from" (foreign key) side
        // "*" = many side (has the foreign key), "1" = one side (referenced)
        // If endpoint1 has "*", it's the from side
        // If endpoint2 has "*", it's the from side
        // Otherwise, use endpoint1 as from (for one-to-one or unspecified)
        let fromEndpoint = endpoint1
        let toEndpoint = endpoint2

        if (endpoint2.relation === "*") {
          fromEndpoint = endpoint2
          toEndpoint = endpoint1
        }

        const fromCol = fromEndpoint.fieldNames?.[0] || ""
        const toCol = toEndpoint.fieldNames?.[0] || ""

        if (!fromEndpoint.tableName || !toEndpoint.tableName) {
          return
        }

        const edgeId = `${fromEndpoint.tableName}-${fromCol}-${toEndpoint.tableName}-${toCol}`

        if (!seen.has(edgeId)) {
          seen.add(edgeId)

          // Get optimal handle sides based on positions
          const sourcePos = positions.get(fromEndpoint.tableName)
          const targetPos = positions.get(toEndpoint.tableName)
          const { sourceSide, targetSide } =
            sourcePos && targetPos
              ? getHandleSides(sourcePos, targetPos)
              : { sourceSide: "right" as const, targetSide: "left" as const }

          edges.push({
            id: edgeId,
            source: fromEndpoint.tableName,
            target: toEndpoint.tableName,
            sourceHandle: `${fromCol}-source-${sourceSide}`,
            targetHandle: `${toCol}-target-${targetSide}`,
            type: LINE_TYPE,
            style: {
              stroke: "var(--connection)",
              strokeWidth: 2,
              strokeDasharray: "4 2",
            },
            animated: false,
          })
        }
      }
    })
  }

  return edges
}

// Props for the inner canvas component
interface SchemaCanvasInnerProps {
  tables: Table[]
  refs?: Ref[]
  selectedTable: string | null
  onTableSelect: (tableName: string) => void
  initialX?: number
  initialY?: number
  nodesDraggable?: boolean
  showMinimap?: boolean
}

// Export handle type for parent component access
export interface SchemaCanvasHandle {
  fitView: () => void
  zoomIn: () => void
  zoomOut: () => void
  getZoom: () => number
  centerOnNode: (nodeId: string) => void
}

// Inner component with access to React Flow hooks
function SchemaCanvasInner({
  tables,
  refs,
  selectedTable,
  onTableSelect,
  initialX,
  initialY,
  nodesDraggable = true,
  showMinimap = false,
}: SchemaCanvasInnerProps) {
  // Initialize nodes and edges
  const initialNodes = useMemo(
    () => tablesToNodes(tables, selectedTable, initialX, initialY),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tables, initialX, initialY]
  )

  const initialEdges = useMemo(() => refsToEdges(tables, refs), [tables, refs])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null)

  // Update nodes when tables data changes (e.g., from DBML editing)
  useEffect(() => {
    setNodes((currentNodes) => {
      // Create a map of current node positions (to preserve user-dragged positions)
      const currentPositions = new Map(currentNodes.map((n) => [n.id, n.position]))

      const newNodes = tablesToNodes(tables, null, initialX, initialY)

      // Merge: use existing positions if available, otherwise use calculated positions
      return newNodes.map((node) => ({
        ...node,
        position: currentPositions.get(node.id) ?? node.position,
        data: {
          ...node.data,
          isSelected: selectedTable === node.id,
        },
      }))
    })
  }, [tables, initialX, initialY, selectedTable, setNodes])

  // Update edges when refs change or nodes move, applying selection styling
  useEffect(() => {
    // Build position map from current node positions for dynamic edge routing
    const nodePositions = new Map(nodes.map((n) => [n.id, n.position]))
    const baseEdges = refsToEdges(tables, refs, nodePositions)
    setEdges(
      baseEdges.map((edge) => ({
        ...edge,
        selected: edge.id === selectedEdge,
        animated: edge.id === selectedEdge,
        style: edge.id === selectedEdge
          ? {
              stroke: "var(--primary)",
              strokeWidth: 4,
            }
          : {
              stroke: "var(--connection)",
              strokeWidth: 2,
              strokeDasharray: "4 2",
            },
      }))
    )
  }, [tables, refs, selectedEdge, setEdges, nodes])

  // Handle node click for selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onTableSelect(node.id)
      setSelectedEdge(null) // Deselect edge when clicking a node
    },
    [onTableSelect]
  )

  // Handle edge click for selection
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setSelectedEdge((current) => (current === edge.id ? null : edge.id))
    },
    []
  )

  // Handle pane click to deselect
  const onPaneClick = useCallback(() => {
    setSelectedEdge(null)
  }, [])

  // MiniMap node color based on selection
  const nodeColor = useCallback(
    (node: Node) => {
      return (node.data as TableNodeData)?.isSelected ? "var(--primary)" : "var(--secondary)"
    },
    []
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      nodesDraggable={nodesDraggable}
      nodesConnectable={false}
      elementsSelectable={true}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={2}
      defaultEdgeOptions={{
        type: LINE_TYPE,
        style: { stroke: "var(--connection)", strokeWidth: 2 },
      }}
      proOptions={{ hideAttribution: true }}
    >
      <Controls position="bottom-left"/>
      {showMinimap && (
        <MiniMap
          nodeColor={nodeColor}
          maskColor="rgba(0, 0, 0, 0.6)"
          pannable
          zoomable
          position="bottom-right"
        />
      )}
    </ReactFlow>
  )
}

// Main props interface
export interface SchemaCanvasProps {
  tables: Table[]
  refs?: Ref[]
  selectedTable: string | null
  onTableSelect: (tableName: string) => void
  initialX?: number
  initialY?: number
  nodesDraggable?: boolean
  showMinimap?: boolean
  className?: string
}

// Main component wrapped with ReactFlowProvider
export const SchemaCanvas = forwardRef<SchemaCanvasHandle, SchemaCanvasProps>(
  function SchemaCanvas(props, ref) {
    const { className = "", ...innerProps } = props

    return (
      <div className={`w-full h-full ${className}`}>
        <ReactFlowProvider>
          <SchemaCanvasInnerWithHandle ref={ref} {...innerProps} />
        </ReactFlowProvider>
      </div>
    )
  }
)

// Component that exposes methods via ref
const SchemaCanvasInnerWithHandle = forwardRef<SchemaCanvasHandle, SchemaCanvasInnerProps>(
  function SchemaCanvasInnerWithHandle(props, ref) {
    const { fitView, zoomIn, zoomOut, getZoom, setCenter, getNode } = useReactFlow()

    useImperativeHandle(ref, () => ({
      fitView: () => fitView({ padding: 0.2 }),
      zoomIn: () => zoomIn(),
      zoomOut: () => zoomOut(),
      getZoom: () => getZoom(),
      centerOnNode: (nodeId: string) => {
        const node = getNode(nodeId)
        if (node) {
          setCenter(node.position.x + 150, node.position.y + 100, { zoom: 1, duration: 500 })
        }
      },
    }))

    return <SchemaCanvasInner {...props} />
  }
)
