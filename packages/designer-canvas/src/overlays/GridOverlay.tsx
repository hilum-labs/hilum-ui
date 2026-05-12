import { useCanvasContext } from '../context/CanvasContext'

/**
 * Visual grid overlay — renders a SVG pattern based on `state.gridContainer`.
 * Non-interactive; sits behind the layers but inside the artboard.
 */
function GridOverlay() {
  const { state } = useCanvasContext()
  const { frameSize, gridContainer } = state
  if (!gridContainer) return null

  const { cols, rows, gap, padding } = gridContainer
  const cellW = (frameSize.width - padding * 2 - gap * (cols - 1)) / cols
  const cellH = (frameSize.height - padding * 2 - gap * (rows - 1)) / rows

  const lines: { x: number; y: number; w: number; h: number }[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      lines.push({
        x: padding + c * (cellW + gap),
        y: padding + r * (cellH + gap),
        w: cellW,
        h: cellH,
      })
    }
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={frameSize.width}
      height={frameSize.height}
      aria-hidden
    >
      {lines.map((cell, i) => (
        <rect
          key={i}
          x={cell.x}
          y={cell.y}
          width={cell.w}
          height={cell.h}
          fill="none"
          stroke="var(--brand-primary)"
          strokeOpacity={0.18}
          strokeDasharray="3 3"
          strokeWidth={1}
        />
      ))}
    </svg>
  )
}

export { GridOverlay }
