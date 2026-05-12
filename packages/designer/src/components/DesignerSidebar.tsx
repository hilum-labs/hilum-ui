import type { ComponentType, ReactNode } from 'react'
import { cn, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@hilum/ui'

interface SidebarItem {
  id: string
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
  onClick?: () => void
  /** Caller-computed active flag. */
  active?: boolean
  disabled?: boolean
  badge?: ReactNode
}

interface DesignerSidebarProps {
  /** Top group of icon buttons. */
  items: SidebarItem[]
  /** Optional bottom group (settings, help, account). */
  bottomItems?: SidebarItem[]
  side?: 'left' | 'right'
  className?: string
  children?: ReactNode
}

/**
 * Vertical icon rail used as the primary tool / navigation column in an
 * editor. Driven by an `items` array — no engine coupling. Each item gets
 * a tooltip showing its label.
 */
function DesignerSidebar({
  items,
  bottomItems,
  side = 'left',
  className,
  children,
}: DesignerSidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col w-12 bg-white shrink-0',
        side === 'left' ? 'border-r' : 'border-l',
        'border-taupe-100',
        className,
      )}
    >
      <TooltipProvider>
        <div className="flex flex-col items-center gap-0.5 p-1.5">
          {items.map((item) => (
            <SidebarButton key={item.id} item={item} />
          ))}
        </div>

        {children}

        {bottomItems && bottomItems.length > 0 && (
          <div className="mt-auto flex flex-col items-center gap-0.5 p-1.5">
            {bottomItems.map((item) => (
              <SidebarButton key={item.id} item={item} />
            ))}
          </div>
        )}
      </TooltipProvider>
    </aside>
  )
}

function SidebarButton({ item }: { item: SidebarItem }) {
  const Icon = item.icon
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={item.onClick}
          disabled={item.disabled}
          aria-label={item.label}
          aria-pressed={item.active}
          className={cn(
            'relative flex size-9 items-center justify-center rounded-md transition-colors',
            item.active
              ? 'bg-taupe-900 text-white'
              : 'text-taupe-500 hover:bg-taupe-100 hover:text-taupe-900',
            item.disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          <Icon size={16} />
          {item.badge != null && (
            <span className="absolute -top-0.5 -right-0.5 caption-xs">{item.badge}</span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}

export { DesignerSidebar }
export type { DesignerSidebarProps, SidebarItem }
