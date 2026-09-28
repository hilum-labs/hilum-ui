"use client";

import * as React from "react";
import { Collapsible } from "radix-ui";

function CollapsibleRoot(props: React.ComponentProps<typeof Collapsible.Root>) {
  return <Collapsible.Root data-slot="collapsible" {...props} />;
}
CollapsibleRoot.displayName = "Collapsible";

function CollapsibleTrigger(props: React.ComponentProps<typeof Collapsible.Trigger>) {
  return <Collapsible.Trigger data-slot="collapsible-trigger" {...props} />;
}
CollapsibleTrigger.displayName = "CollapsibleTrigger";

function CollapsibleContent(props: React.ComponentProps<typeof Collapsible.Content>) {
  return <Collapsible.Content data-slot="collapsible-content" {...props} />;
}
CollapsibleContent.displayName = "CollapsibleContent";

export { CollapsibleRoot as Collapsible, CollapsibleTrigger, CollapsibleContent };
