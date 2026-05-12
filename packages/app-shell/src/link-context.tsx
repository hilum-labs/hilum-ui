import { createContext, useContext } from 'react'
import type { LinkComponent } from './types'

// Default: render a plain anchor. Apps that want client-side navigation
// pass their router's link component via <AppShell linkComponent={...}>.
const DefaultLink: LinkComponent = ({ href, children, ...rest }) => (
  <a href={href} {...rest}>
    {children}
  </a>
)

const LinkContext = createContext<LinkComponent>(DefaultLink)

export function useLink(): LinkComponent {
  return useContext(LinkContext)
}

export const LinkProvider = LinkContext.Provider
