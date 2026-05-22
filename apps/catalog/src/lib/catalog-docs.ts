export type CatalogDocLink = {
  description?: string;
  href: string;
  label: string;
};

export type CatalogDocApiItem = {
  description: string;
  label: string;
};

export type CatalogPageDoc =
  | {
      accessibility: string[];
      api: CatalogDocApiItem[];
      exampleCode: string | null;
      kind: "component";
      path: string;
      summary: string;
      title: string;
      whenNotToUse: string[];
      whenToUse: string[];
    }
  | {
      grouping: string[];
      importantLinks: CatalogDocLink[];
      intro: string[];
      kind: "collection";
      path: string;
      summary: string;
      title: string;
    }
  | {
      grouping: string[];
      importantLinks: CatalogDocLink[];
      intro: string[];
      kind: "section";
      path: string;
      summary: string;
      title: string;
    };

export function slugifyDocAnchor(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
