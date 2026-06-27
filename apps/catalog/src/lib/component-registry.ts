import {
  componentRegistry as componentRegistryData,
  getComponentCountBySection as getComponentCountBySectionData,
  getComponentEntriesBySection as getComponentEntriesBySectionData,
  groupComponentEntries as groupComponentEntriesData,
} from "@/data/component-registry.js";

export type ComponentSection = "atoms" | "molecules";

export type ComponentCategory = "primitive" | "form" | "overlay" | "layout" | "feedback" | "data";

export type ComponentRegistryEntry = {
  slug: string;
  name: string;
  section: ComponentSection;
  group: string;
  category: ComponentCategory;
  package: "@hilum/ui";
  sourcePath: string;
  catalogPath: string;
  description: string;
  composedFrom?: string;
};

export type ComponentRegistryGroup = {
  label: string;
  components: ComponentRegistryEntry[];
};

export const componentRegistry = componentRegistryData as ComponentRegistryEntry[];

export function getComponentEntriesBySection(section: ComponentSection) {
  return getComponentEntriesBySectionData(section) as ComponentRegistryEntry[];
}

export function getComponentCountBySection(section: ComponentSection) {
  return getComponentCountBySectionData(section) as number;
}

export function groupComponentEntries(entries: ComponentRegistryEntry[]) {
  return groupComponentEntriesData(entries) as ComponentRegistryGroup[];
}
