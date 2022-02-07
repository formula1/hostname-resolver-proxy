
import { networkInterfaces } from "os";
import {
  readFile,
} from "fs/promises";
import {
  formatJsonToProxy,
} from "domain-config-formatter"

export type TypeInitArg = {
  configPath: string,
}

export async function initConfigs(
  { configPath }: TypeInitArg
){
  const configJSON = JSON.parse(await readFile(configPath, "utf-8"));
  const proxyConfig = formatJsonToProxy(configJSON);
  const unknownHost = proxyConfig.unknownHost;
  if(unknownHost){
    Object.values(networkInterfaces()).forEach((internalIps)=>{
      if(!Array.isArray(internalIps)) return;
      unknownHost.blacklist.push(...internalIps.map((net)=>(net.address)));
    });
  }

  return {
    allowedConfig: configJSON,
    proxyConfig,
  }

}
