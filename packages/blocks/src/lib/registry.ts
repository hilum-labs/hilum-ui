const REGISTRY_URL = 'https://ui.hilum.dev/registry.json'

export interface Block {
  name: string
  category: string
  title: string
  description: string
  source: string
  dependencies: string[]
}

export interface Registry {
  version: string
  updatedAt: string
  blocks: Block[]
}

export async function fetchRegistry(): Promise<Registry> {
  let res: Response
  try {
    res = await fetch(REGISTRY_URL)
  } catch {
    throw new Error(`Could not reach registry at ${REGISTRY_URL}. Are you online?`)
  }
  if (!res.ok) {
    throw new Error(`Registry returned HTTP ${res.status}`)
  }
  return res.json() as Promise<Registry>
}
