import { UrlHost } from "domain-config-formatter";


export type ProxyConfig = {}

export type SitesMap = {
  [key: string]: HostnamePart
}

export type HostnamePart = Partial<{
  sites: SitesMap,
  target: UrlHost,
  defaultTarget: UrlHost
}>
