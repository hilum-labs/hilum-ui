import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from 'lucide-react'
import {
  DesignerToolbarButton,
  DesignerToolbarGroup,
  useShellContext,
} from '@hilum/designer'
import { useCanvasContext } from '../context/CanvasContext'

/** Bring to front / back / forward / backward. */
function ActionArrange() {
  const { dispatch } = useCanvasContext()
  const { selectedIds } = useShellContext()
  const disabled = selectedIds.length === 0

  const arrange = (mode: 'front' | 'back' | 'forward' | 'backward') => () =>
    dispatch({ type: 'ARRANGE_LAYERS', payload: { targetLayerIds: selectedIds, mode } })

  return (
    <DesignerToolbarGroup>
      <DesignerToolbarButton label="Bring to front" icon={ChevronsUp} onClick={arrange('front')} disabled={disabled} />
      <DesignerToolbarButton label="Bring forward" icon={ArrowUp} onClick={arrange('forward')} disabled={disabled} />
      <DesignerToolbarButton label="Send backward" icon={ArrowDown} onClick={arrange('backward')} disabled={disabled} />
      <DesignerToolbarButton label="Send to back" icon={ChevronsDown} onClick={arrange('back')} disabled={disabled} />
    </DesignerToolbarGroup>
  )
}

export { ActionArrange }
