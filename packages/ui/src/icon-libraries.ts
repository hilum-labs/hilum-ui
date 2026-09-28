// @hilum/ui/icon-libraries — optional alternative icon sets for IconProvider.
//
// The main `@hilum/ui` entry only depends on lucide-react. Import this subpath
// (which requires the matching optional peer packages to be installed) and
// hand the sets to IconProvider:
//
//   import { IconProvider } from "@hilum/ui";
//   import { iconLibraries } from "@hilum/ui/icon-libraries";
//
//   <IconProvider libraries={iconLibraries} defaultLibrary="phosphor">…</IconProvider>
//
// Individual sets are exported too, so a bundler only pulls in the packages
// you actually register:
//
//   import { phosphorIcons } from "@hilum/ui/icon-libraries";
//   <IconProvider libraries={{ phosphor: phosphorIcons }} defaultLibrary="phosphor">

import type { IconLibraryRegistry } from "./lib/icon-map";
import {
  hugeiconsIcons,
  phosphorIcons,
  tablerIcons,
  untitleduiIcons,
} from "./lib/icon-libraries-data";

export { hugeiconsIcons, phosphorIcons, tablerIcons, untitleduiIcons };
export { lucideIcons, iconLibraryOrder, iconLibraryLabels } from "./lib/icon-map";
export type {
  IconComponent,
  IconComponentProps,
  IconLibrary,
  IconLibraryRegistry,
  IconName,
  IconSet,
} from "./lib/icon-map";

/** Every alternative icon set, ready for `<IconProvider libraries={iconLibraries}>`. */
export const iconLibraries: IconLibraryRegistry = {
  tabler: tablerIcons,
  phosphor: phosphorIcons,
  hugeicons: hugeiconsIcons,
  untitledui: untitleduiIcons,
};
