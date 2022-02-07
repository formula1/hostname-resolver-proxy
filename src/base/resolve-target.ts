import { ProxyConfig, UrlHost } from "domain-config-formatter";
import { HostnamePart } from "../types/ProxyConfig"
type TD_U_R = {
  type: typeof DIRECT_URL_AND_REST,
  target: UrlHost
}

const DIRECT_URL_AND_REST = Symbol("Direct the url and all further subdomains");
const WILD_CARD_SUB = "*";
const WILD_CARD_FULL = "!";
const HOST_SPLIT = ".";
export function resolveTarget(
  topMap: HostnamePart, hostname?: string
){
  console.log("map:", topMap);
  if(!hostname){
    throw "hostname can't be void";
  }

  // Just in case there is a port
  // : is not a valid hostname character
  // https://domainname.shop/faq?id=7&currency=USD&lang=en
  // If someone is going crazy with :, they're probably a bad actor
  hostname = hostname.split(":")[0];
  const parts = hostname.split(HOST_SPLIT).reverse();
  console.log("parts:", parts);
  try {
    const foundMap = parts.reduce((currentMap, part)=>{
      console.log("currentMap:", currentMap);
      console.log("part:", part);
      const currentSites = currentMap.sites;
      if(!currentSites){
        throw "Host not found"
      }
      if(part in currentSites){
        return makeResolveMap(currentSites[part], currentMap)
      }
      if(WILD_CARD_SUB in currentSites){
        return makeResolveMap(currentSites[WILD_CARD_SUB], currentMap)
      }
      if(WILD_CARD_FULL in currentSites){
        throw {
          type: DIRECT_URL_AND_REST,
          target: makeResolveMap(currentSites[WILD_CARD_FULL], currentMap)
        }
      }
      throw "Host not found"
    }, topMap);
    if(foundMap.target) return foundMap.target;
    if(foundMap.defaultTarget) return foundMap.defaultTarget;
    throw "Host found but no target available";
  }catch(oE){
    if(typeof oE !== "object") throw oE;
    if(oE === null) throw oE;
    const mE = oE as Partial<TD_U_R>;
    if(mE.type !== DIRECT_URL_AND_REST) throw mE;
    return mE.target;
  }

  function makeResolveMap(foundMap: HostnamePart, oldMap: HostnamePart){
    return {
      sites: foundMap.sites,
      target: foundMap.target ? foundMap.target : oldMap.target,
      defaultTarget: foundMap.defaultTarget ? foundMap.defaultTarget : oldMap.target
    }
  }
}



export function resolveTargetOld(host: void | string, proxyConfig: ProxyConfig){
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
