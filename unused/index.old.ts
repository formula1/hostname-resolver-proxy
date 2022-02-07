
import { initConfigs } from "./base/init-configs";
import { setupProxy } from "./base/setup-proxy";
import { resolve as pathResolve } from "path";
import { copy as copyJSON } from "./util/json";
import { Server } from "http";
import { HostnamePart } from "./types/ProxyConfig";

export type Options = {
  configPath: string,
  greenlockDir: string,
  packageDir: string,
}

export async function createHttpDomainProxy(optionsRaw: Options){
  const options = copyJSON(optionsRaw);
  options.configPath = pathResolve(process.cwd(), options.configPath);
  const configs = await initConfigs(options);
  const proxyServer = setupProxy({
    servers: servers,
    proxyConfig: configs.proxyConfig
  })
  return {
    paths: options,
    greenlockServers: servers,
    proxyServer: proxyServer,
    configs: configs,
  }
}
