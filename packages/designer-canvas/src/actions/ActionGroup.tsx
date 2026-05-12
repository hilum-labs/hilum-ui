import { Group, Ungroup } from 'lucide-react'
import {
  DesignerToolbarButton,
  DesignerToolbarGroup,
  useShellContext,
} from '@hilum/designer'
import { useCanvasContext } from '../context/CanvasContext'

function ActionGroup() {
  const { dispatch } = useCanvasContext()
  const { selectedIds } = useShellContext()

  return (
    <DesignerToolbarGroup>
      <DesignerToolbarButton
        label="Group"
        icon={Group}
        shortcut="⌘G"
        disabled={selectedIds.length < 2}
        onClick={() => {
          const groupId =
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
              ? crypto.randomUUID()
              : `group-${Date.now()}`
          dispatch({ type: 'GROUP_LAYERS', payload: { targetLayerIds: selectedIds, groupId } })
        }}
      />
      <DesignerToolbarButton
        label="Ungroup"
        icon={Ungroup}
        shortcut="⇧⌘G"
        disabled={selectedIds.length === 0}
        onClick={() => dispatch({ type: 'UNGROUP_LAYERS', payload: { targetLayerIds: selectedIds } })}
      />
    </DesignerToolbarGroup>
  )
}

export { ActionGroup }
