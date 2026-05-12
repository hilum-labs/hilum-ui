import {
  AlignCenter, AlignLeft, AlignRight,
  AlignVerticalSpaceAround, AlignHorizontalSpaceAround,
  AlignStartHorizontal, AlignEndHorizontal,
  AlignVerticalJustifyCenter,
} from 'lucide-react'
import {
  DesignerToolbarButton,
  DesignerToolbarGroup,
  DesignerToolbarSeparator,
  useShellContext,
} from '@hilum/designer'
import { useCanvasContext } from '../context/CanvasContext'

/**
 * Alignment + distribution toolbar group. Operates on currently-selected
 * layers via ShellContext.selectedIds (passed explicitly to the reducer).
 */
function ActionAlign() {
  const { dispatch } = useCanvasContext()
  const { selectedIds } = useShellContext()
  const disabled = selectedIds.length < 2

  const align = (a: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => () =>
    dispatch({ type: 'ALIGN_LAYERS', payload: { targetLayerIds: selectedIds, align: a } })

  const distribute = (axis: 'horizontal' | 'vertical') => () =>
    dispatch({ type: 'DISTRIBUTE_LAYERS', payload: { targetLayerIds: selectedIds, axis } })

  return (
    <>
      <DesignerToolbarGroup>
        <DesignerToolbarButton label="Align left" icon={AlignLeft} onClick={align('left')} disabled={disabled} />
        <DesignerToolbarButton label="Align center" icon={AlignCenter} onClick={align('center')} disabled={disabled} />
        <DesignerToolbarButton label="Align right" icon={AlignRight} onClick={align('right')} disabled={disabled} />
      </DesignerToolbarGroup>
      <DesignerToolbarSeparator />
      <DesignerToolbarGroup>
        <DesignerToolbarButton label="Align top" icon={AlignStartHorizontal} onClick={align('top')} disabled={disabled} />
        <DesignerToolbarButton label="Align middle" icon={AlignVerticalJustifyCenter} onClick={align('middle')} disabled={disabled} />
        <DesignerToolbarButton label="Align bottom" icon={AlignEndHorizontal} onClick={align('bottom')} disabled={disabled} />
      </DesignerToolbarGroup>
      <DesignerToolbarSeparator />
      <DesignerToolbarGroup>
        <DesignerToolbarButton
          label="Distribute horizontally"
          icon={AlignHorizontalSpaceAround}
          onClick={distribute('horizontal')}
          disabled={selectedIds.length < 3}
        />
        <DesignerToolbarButton
          label="Distribute vertically"
          icon={AlignVerticalSpaceAround}
          onClick={distribute('vertical')}
          disabled={selectedIds.length < 3}
        />
      </DesignerToolbarGroup>
    </>
  )
}

export { ActionAlign }
