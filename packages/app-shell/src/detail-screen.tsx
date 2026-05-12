import type { ReactNode } from 'react'
import { cn } from '@hilum/ui'

interface DetailScreenProps {
  /** Main content (left/primary column). */
  children: ReactNode
  /** Metadata sidebar content (right column). */
  meta?: ReactNode
  /** Width of the meta column. Default: 320px. */
  metaWidth?: number | string
  /** Stack vertically below this breakpoint. Default: lg (1024px). */
  breakpoint?: 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Two-column detail layout — main content on the left, metadata sidebar on
 * the right. Stacks vertically below the breakpoint for mobile.
 */
function DetailScreen({
  children,
  meta,
  metaWidth = 320,
  breakpoint = 'lg',
  className,
}: DetailScreenProps) {
  const breakpointClass =
    breakpoint === 'md' ? 'md:flex-row' : breakpoint === 'xl' ? 'xl:flex-row' : 'lg:flex-row'

  return (
    <div className={cn('flex flex-col gap-6 p-6', breakpointClass, className)}>
      <div className="flex-1 min-w-0">{children}</div>
      {meta && (
        <aside
          className="shrink-0"
          style={{ width: typeof metaWidth === 'number' ? `${metaWidth}px` : metaWidth }}
        >
          {meta}
        </aside>
      )}
    </div>
  )
}

export { DetailScreen }
export type { DetailScreenProps }
