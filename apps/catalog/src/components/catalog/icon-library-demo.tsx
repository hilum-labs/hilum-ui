import { useState } from "react";
import {
  Button,
  IconProvider,
  Input,
  Kbd,
  ShapeProvider,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
  iconLibraryLabels,
  shapeOrder,
  useIconLibrary,
  useIconLibraryCycleShortcut,
  useIcons,
  useShapeContext,
  useShapeCycleShortcut,
  type IconLibrary,
  type IconName,
  type ShapeVariant,
} from "@hilum/ui";
// Non-Lucide sets live behind a separate entry so apps that only use Lucide
// don't pull in the optional icon packages.
import { iconLibraries } from "@hilum/ui/icon-libraries";
import { PreviewBlock } from "@/components/catalog/preview-block";

const SAMPLE_ICONS: IconName[] = [
  "home",
  "search",
  "bell",
  "mail",
  "settings",
  "users",
  "star",
  "heart",
  "rocket",
  "lightbulb",
  "palette",
  "globe",
];

const SHAPE_LABELS: Record<ShapeVariant, string> = { rounded: "Rounded", pill: "Pill" };

export const ICON_LIBRARY_DEMO_CODE = `import {
  IconProvider,
  ShapeProvider,
  ToggleGroup,
  ToggleGroupItem,
  iconLibraryLabels,
  useIconLibrary,
  useIconLibraryCycleShortcut,
  useShapeCycleShortcut,
} from "@hilum/ui"
// Tabler, Phosphor, Hugeicons and Untitled UI are optional peer dependencies:
// install the ones you register.
import { iconLibraries } from "@hilum/ui/icon-libraries"

function IconLibraryPicker() {
  const { iconLibrary, setIconLibrary, availableLibraries } = useIconLibrary()
  // Opt-in: @hilum/ui never installs global key handlers on its own.
  useIconLibraryCycleShortcut({ key: "i" })
  useShapeCycleShortcut({ key: "r" })

  return (
    <ToggleGroup
      type="single"
      value={iconLibrary}
      onValueChange={(next) => next && setIconLibrary(next as IconLibrary)}
    >
      {availableLibraries.map((lib) => (
        <ToggleGroupItem key={lib} value={lib}>
          {iconLibraryLabels[lib]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export function App() {
  return (
    <IconProvider libraries={iconLibraries}>
      <ShapeProvider>
        <IconLibraryPicker />
        {/* useIcon("search") / useIcons() now follow the selected library */}
      </ShapeProvider>
    </IconProvider>
  )
}`;

function IconLibraryControls() {
  const { iconLibrary, setIconLibrary, availableLibraries } = useIconLibrary();
  const { shape, setShape } = useShapeContext();
  const icons = useIcons();
  const [shortcutsEnabled, setShortcutsEnabled] = useState(false);

  // Opt-in keyboard shortcuts: off by default so the docs page never hijacks
  // plain "i"/"r" keystrokes unless the reader turns them on.
  useIconLibraryCycleShortcut({ key: "i", enabled: shortcutsEnabled });
  useShapeCycleShortcut({ key: "r", enabled: shortcutsEnabled });

  const SearchIcon = icons.search;
  const PlusIcon = icons.plus;
  const ArrowIcon = icons["arrow-right"];

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p id="icon-library-label" className="caption font-medium text-muted-foreground">
          Icon library
        </p>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          aria-labelledby="icon-library-label"
          value={iconLibrary}
          onValueChange={(next) => {
            if (next) setIconLibrary(next as IconLibrary);
          }}
          className="flex-wrap justify-start"
        >
          {availableLibraries.map((lib) => (
            <ToggleGroupItem key={lib} value={lib}>
              {iconLibraryLabels[lib]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-2">
        <p id="shape-label" className="caption font-medium text-muted-foreground">
          Shape
        </p>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          aria-labelledby="shape-label"
          value={shape}
          onValueChange={(next) => {
            if (next) setShape(next as ShapeVariant);
          }}
          className="justify-start"
        >
          {shapeOrder.map((variant) => (
            <ToggleGroupItem key={variant} value={variant}>
              {SHAPE_LABELS[variant]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6" aria-label="Icon samples">
        {SAMPLE_ICONS.map((name) => {
          const Icon = icons[name];
          return (
            <li
              key={name}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-border px-2 py-3"
            >
              <Icon size={20} className="text-foreground" />
              <span className="caption-xs text-muted-foreground">{name}</span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-56">
          <SearchIcon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input aria-label="Search" placeholder="Search…" className="pl-9" />
        </div>
        <Button leadingIcon={PlusIcon}>New project</Button>
        <Button variant="outline" trailingIcon={ArrowIcon}>
          Continue
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-4">
        <Switch
          label="Keyboard shortcuts"
          checked={shortcutsEnabled}
          onCheckedChange={setShortcutsEnabled}
          className="-ml-3"
        />
        <p className="caption text-muted-foreground">
          <Kbd>I</Kbd> cycles the icon library, <Kbd>R</Kbd> toggles the shape
        </p>
      </div>
    </div>
  );
}

export function IconLibraryDemo() {
  return (
    <PreviewBlock
      title="Icon library and shape switching"
      description="IconProvider with @hilum/ui/icon-libraries registered, plus ShapeProvider"
      code={ICON_LIBRARY_DEMO_CODE}
      previewClassName="items-start justify-start"
    >
      <IconProvider libraries={iconLibraries}>
        <ShapeProvider>
          <IconLibraryControls />
        </ShapeProvider>
      </IconProvider>
    </PreviewBlock>
  );
}
