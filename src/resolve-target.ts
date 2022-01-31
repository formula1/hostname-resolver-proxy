import { ProxyConfig, UrlHost } from "domain-config-formatter";

export function resolveTarget(host: void | string, proxyConfig: ProxyConfig){
  if(!host) return false
  const split = host.split(".");
  if(split.length < 2) return false;
  const top = split.slice(-2).join(".");
  if(!(top in proxyConfig.sites)) return false;
  const site = proxyConfig.sites[top];
  if(top === host){
    return resolve(
      void 0, site.target, proxyConfig.defaultTarget
    );
  }

  const wild = ["*"].concat(split.slice(1)).join(".");
  const direct = site.altnames.direct;
  if(wild in direct){
    if(host in direct[wild]){
      return resolve(
        direct[wild][host], site.target, proxyConfig.defaultTarget
      )
    }
  }
  if(wild in site.altnames.wild){
    return resolve(
      site.altnames.wild[host], site.target, proxyConfig.defaultTarget
    )
  }
  return false
}

function resolve(
  subdomainTarget: void | boolean | UrlHost,
  topTarget: void | UrlHost,
  defaultTarget: UrlHost
): UrlHost{
  if(typeof subdomainTarget === "object"){
    return subdomainTarget
  }
  if(typeof topTarget === "object"){
    return topTarget;
  }
  return defaultTarget
}
