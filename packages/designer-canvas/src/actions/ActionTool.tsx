import type { ComponentType } from 'react'
import { MousePointer2, Hand } from 'lucide-react'
import {
  DesignerToolbarButton,
  DesignerToolbarGroup,
  useShellContext,
} from '@hilum/designer'

interface ToolDescriptor {
  id: string
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
  shortcut?: string
}

const DEFAULT_TOOLS: ToolDescriptor[] = [
  { id: 'select', label: 'Select', icon: MousePointer2, shortcut: 'V' },
  { id: 'hand', label: 'Pan', icon: Hand, shortcut: 'H' },
]

interface ActionToolProps {
  /** Override default tools. */
  tools?: ToolDescriptor[]
}

function ActionTool({ tools = DEFAULT_TOOLS }: ActionToolProps) {
  const { activeTool, setActiveTool } = useShellContext()

  return (
    <DesignerToolbarGroup>
      {tools.map((tool) => (
        <DesignerToolbarButton
          key={tool.id}
          label={tool.label}
          icon={tool.icon}
          shortcut={tool.shortcut}
          active={activeTool === tool.id}
          onClick={() => setActiveTool(tool.id)}
        />
      ))}
    </DesignerToolbarGroup>
  )
}

export { ActionTool }
export type { ActionToolProps, ToolDescriptor }
