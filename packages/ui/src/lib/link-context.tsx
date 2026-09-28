import { createContext, useContext, type ComponentType, type ReactNode } from "react";

/**
 * Component used to render navigational anchors inside Hilum components.
 * Apps inject their router's link via `<LinkProvider value={Link}>` (or
 * `<AppShell linkComponent={Link}>` from `@hilum/app-shell`) so internal links
 * navigate client-side instead of reloading the page.
 *
 * `react-router` users pass a small adapter:
 *   `({ href, ...rest }) => <Link to={href} {...rest} />`
 */
export type LinkComponentProps = {
  href: string;
  className?: string;
  children?: ReactNode;
  onClick?: (event: unknown) => void;
  [key: string]: unknown;
};
export type LinkComponent = ComponentType<LinkComponentProps>;

const DefaultLink: LinkComponent = ({ href, children, ...rest }) => (
  <a href={href} {...rest}>
    {children}
  </a>
);

const LinkContext = createContext<LinkComponent>(DefaultLink);

export function useLink(): LinkComponent {
  return useContext(LinkContext);
}

export const LinkProvider = LinkContext.Provider;
