import { useRef, useEffect, useCallback } from 'react';

interface FloatingTablesProps {
  tableColor?: string;
  lineColor?: string;
  opacity?: number;
  speed?: number;
  tableCount?: number;
  tableNames?: string[];
}

interface Table {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rows: number;
  name: string;
}

interface Relation {
  from: number;
  to: number;
}

const DEFAULT_TABLE_NAMES = [
  'users', 'posts', 'comments', 'orders', 'products', 'categories',
  'reviews', 'bookings', 'payments', 'sessions', 'roles', 'permissions',
  'tags', 'likes', 'follows', 'messages', 'notifications', 'settings'
];

const FloatingTables = ({
  tableColor = '#22c55e',
  lineColor = '#22c55e',
  opacity = 0.2,
  speed = 0.3,
  tableCount = 10,
  tableNames
}: FloatingTablesProps) => {
  const names = tableNames && tableNames.length > 0 ? tableNames : DEFAULT_TABLE_NAMES;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const tablesRef = useRef<Table[]>([]);
  const relationsRef = useRef<Relation[]>([]);
  const initializedRef = useRef(false);

  const initTables = useCallback((width: number, height: number) => {
    const tables: Table[] = [];
    const usedNames = new Set<string>();
    const count = tableNames ? Math.min(tableCount, names.length) : tableCount;

    for (let i = 0; i < count; i++) {
      let name: string;
      if (tableNames && i < names.length) {
        name = names[i];
      } else {
        do {
          name = names[Math.floor(Math.random() * names.length)];
        } while (usedNames.has(name) && usedNames.size < names.length);
      }
      usedNames.add(name);

      const rows = Math.floor(Math.random() * 4) + 2;
      const tableWidth = 120 + Math.random() * 40;
      const tableHeight = 30 + rows * 22;

      // Use gaussian-like distribution to concentrate tables near center
      const gaussianRandom = () => {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      };

      // Concentrate around center with some spread
      const spreadX = width * 0.35;
      const spreadY = height * 0.35;

      tables.push({
        x: width / 2 + gaussianRandom() * spreadX - tableWidth / 2,
        y: height / 2 + gaussianRandom() * spreadY - tableHeight / 2,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        width: tableWidth,
        height: tableHeight,
        rows,
        name
      });
    }

    // Generate relations
    const relations: Relation[] = [];
    for (let i = 0; i < tables.length; i++) {
      const numRelations = Math.floor(Math.random() * 2) + 1;
      for (let r = 0; r < numRelations; r++) {
        const target = Math.floor(Math.random() * tables.length);
        if (target !== i && !relations.some(rel =>
          (rel.from === i && rel.to === target) || (rel.from === target && rel.to === i)
        )) {
          relations.push({ from: i, to: target });
        }
      }
    }

    tablesRef.current = tables;
    relationsRef.current = relations;
    initializedRef.current = true;
  }, [tableCount, speed, names, tableNames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      if (!initializedRef.current) {
        initTables(rect.width, rect.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawTable = (table: Table) => {
      const { x, y, width, height, rows, name } = table;

      ctx.strokeStyle = tableColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity;

      // Header
      const headerHeight = 24;
      ctx.fillStyle = tableColor;
      ctx.globalAlpha = opacity * 0.3;
      ctx.fillRect(x, y, width, headerHeight);

      ctx.globalAlpha = opacity;
      ctx.strokeRect(x, y, width, headerHeight);

      // Body
      ctx.strokeRect(x, y + headerHeight, width, height - headerHeight);

      // Row dividers
      const bodyHeight = height - headerHeight;
      const rowHeight = bodyHeight / rows;
      ctx.globalAlpha = opacity * 0.3;
      for (let i = 1; i < rows; i++) {
        const rowY = y + headerHeight + i * rowHeight;
        ctx.beginPath();
        ctx.moveTo(x + 5, rowY);
        ctx.lineTo(x + width - 5, rowY);
        ctx.stroke();
      }

      // Field indicators (key icons)
      ctx.globalAlpha = opacity * 0.6;
      for (let i = 0; i < rows; i++) {
        const rowY = y + headerHeight + i * rowHeight + rowHeight / 2;

        // Key icon (small circle)
        ctx.beginPath();
        ctx.arc(x + 15, rowY, 3, 0, Math.PI * 2);
        ctx.stroke();

        // Field line
        ctx.beginPath();
        ctx.moveTo(x + 25, rowY);
        ctx.lineTo(x + 50 + Math.random() * 30, rowY);
        ctx.stroke();
      }

      // Table name
      ctx.globalAlpha = opacity * 0.8;
      ctx.font = '11px monospace';
      ctx.fillStyle = tableColor;
      ctx.fillText(name, x + 8, y + 16);

      ctx.globalAlpha = 1;
    };

    const drawRelation = (from: Table, to: Table) => {
      const fromX = from.x + from.width;
      const fromY = from.y + from.height / 2;
      const toX = to.x;
      const toY = to.y + to.height / 2;

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = opacity * 0.5;
      ctx.setLineDash([4, 4]);

      // Bezier curve
      const dx = toX - fromX;
      const dy = toY - fromY;
      const cx1 = fromX + dx * 0.4;
      const cy1 = fromY;
      const cx2 = toX - dx * 0.4;
      const cy2 = toY;

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.bezierCurveTo(cx1, cy1, cx2, cy2, toX, toY);
      ctx.stroke();

      // Connection dots
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(fromX, fromY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(toX, toY, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
    };

    let time = 0;
    const animate = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      time += 0.016;

      // Update positions
      tablesRef.current.forEach((table) => {
        table.x += table.vx;
        table.y += table.vy;

        // Wrap around
        if (table.x > width + 100) table.x = -table.width - 50;
        if (table.x < -table.width - 100) table.x = width + 50;
        if (table.y > height + 100) table.y = -table.height - 50;
        if (table.y < -table.height - 100) table.y = height + 50;
      });

      // Draw relations first (behind tables)
      relationsRef.current.forEach(rel => {
        const from = tablesRef.current[rel.from];
        const to = tablesRef.current[rel.to];
        if (from && to) {
          drawRelation(from, to);
        }
      });

      // Draw tables
      tablesRef.current.forEach(table => {
        drawTable(table);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [tableColor, lineColor, opacity, speed, initTables]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
};

export { FloatingTables };
