import { Trash2 } from 'lucide-react'
import { DesignerToolbarButton, useShellContext } from '@hilum/designer'
import { useCanvasContext } from '../context/CanvasContext'

function ActionDelete() {
  const { dispatch } = useCanvasContext()
  const { selectedIds, setSelectedIds } = useShellContext()

  return (
    <DesignerToolbarButton
      label="Delete"
      icon={Trash2}
      shortcut="Del"
      disabled={selectedIds.length === 0}
      onClick={() => {
        dispatch({ type: 'DELETE_LAYERS', payload: selectedIds })
        setSelectedIds([])
      }}
    />
  )
}

export { ActionDelete }
