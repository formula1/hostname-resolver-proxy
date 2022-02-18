import { UrlHost } from "domain-config-formatter";


export type ProxyConfig = {}

export type InitialConfig = {
  target404: UrlHost,
  sites: SitesMap,
}

export type SitesMap = {
  [key: string]: HostnamePart
}

export type HostnamePart = Partial<{
  sites: SitesMap,
  target: UrlHost,
  target404: UrlHost
}>
