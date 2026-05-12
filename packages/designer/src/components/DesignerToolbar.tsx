import type { ComponentType, ReactNode } from 'react'
import { cn, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@hilum/ui'

/* ============================================================== *
 *  Toolbar — outer container                                       *
 * ============================================================== */

interface DesignerToolbarProps {
  className?: string
  /** Position. Default: 'floating' (centered, floating above content). */
  variant?: 'floating' | 'inline'
  children: ReactNode
}

function DesignerToolbar({ className, variant = 'floating', children }: DesignerToolbarProps) {
  return (
    <TooltipProvider>
      <div
        role="toolbar"
        className={cn(
          'flex items-center gap-0.5 rounded-lg bg-white shadow-natural border border-taupe-100 p-1',
          variant === 'floating' &&
            'fixed bottom-4 left-1/2 -translate-x-1/2 z-30',
          className,
        )}
      >
        {children}
      </div>
    </TooltipProvider>
  )
}

/* ============================================================== *
 *  ToolbarGroup — visual group of buttons                          *
 * ============================================================== */

interface DesignerToolbarGroupProps {
  className?: string
  children: ReactNode
}

function DesignerToolbarGroup({ className, children }: DesignerToolbarGroupProps) {
  return <div className={cn('flex items-center gap-0.5', className)}>{children}</div>
}

/* ============================================================== *
 *  ToolbarSeparator                                                *
 * ============================================================== */

interface DesignerToolbarSeparatorProps {
  className?: string
}

function DesignerToolbarSeparator({ className }: DesignerToolbarSeparatorProps) {
  return <div className={cn('mx-1 h-5 w-px bg-taupe-100', className)} role="separator" />
}

/* ============================================================== *
 *  ToolbarButton — single tool / action                            *
 * ============================================================== */

interface DesignerToolbarButtonProps {
  label: string
  icon?: ComponentType<{ size?: number; className?: string }>
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  /** Optional keyboard shortcut shown in the tooltip (e.g. 'V', 'Cmd+Z'). */
  shortcut?: string
  className?: string
  children?: ReactNode
}

function DesignerToolbarButton({
  label,
  icon: Icon,
  onClick,
  active,
  disabled,
  shortcut,
  className,
  children,
}: DesignerToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          aria-pressed={active}
          className={cn(
            'flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-1.5 transition-colors caption',
            active
              ? 'bg-taupe-900 text-white'
              : 'text-taupe-600 hover:bg-taupe-100 hover:text-taupe-900',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
        >
          {Icon && <Icon size={16} />}
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <span>{label}</span>
        {shortcut && <span className="ml-2 caption-xs text-taupe-300">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
  )
}

export {
  DesignerToolbar,
  DesignerToolbarGroup,
  DesignerToolbarSeparator,
  DesignerToolbarButton,
}
export type {
  DesignerToolbarProps,
  DesignerToolbarGroupProps,
  DesignerToolbarSeparatorProps,
  DesignerToolbarButtonProps,
}
