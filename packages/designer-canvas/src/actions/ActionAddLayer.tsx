import { Plus } from "lucide-react";
import { DesignerToolbarButton, DesignerToolbarGroup, useShellContext } from "@hilum/designer";
import { useCanvasContext } from "../context/CanvasContext";
import type { Layer } from "../types";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `layer-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Renders one toolbar button per registered layer type. Apps that want a
 * single + dropdown can build their own using <DropdownMenu> and the same
 * dispatch call.
 */
function ActionAddLayer() {
  const { state, dispatch } = useCanvasContext();
  const { setSelectedIds } = useShellContext();

  if (state.layerTypes.length === 0) {
    return <DesignerToolbarButton label="Add layer" icon={Plus} disabled />;
  }

  return (
    <DesignerToolbarGroup>
      {state.layerTypes.map((descriptor) => {
        const Icon = descriptor.icon ?? Plus;
        return (
          <DesignerToolbarButton
            key={descriptor.type}
            label={`Add ${descriptor.label}`}
            icon={Icon}
            onClick={() => {
              const id = generateId();
              const size = descriptor.defaultSize ?? { width: 200, height: 100 };
              const layer: Layer<Record<string, unknown>> = {
                id,
                type: descriptor.type,
                name: descriptor.label,
                x: state.frameSize.width / 2 - size.width / 2,
                y: state.frameSize.height / 2 - size.height / 2,
                width: size.width,
                height: size.height,
                rotation: 0,
                opacity: 1,
                isLocked: false,
                isVisible: true,
                data: descriptor.defaultData as Record<string, unknown>,
              };
              dispatch({ type: "ADD_LAYER", payload: layer });
              setSelectedIds([id]);
            }}
          />
        );
      })}
    </DesignerToolbarGroup>
  );
}

export { ActionAddLayer };
