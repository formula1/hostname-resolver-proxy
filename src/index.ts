
import { initConfigs } from "./init-configs";
import { initGreenlock } from "./init-greenlock";
import { setupProxy } from "./setup-proxy";
import { resolve as pathResolve } from "path";
import { copy as copyJSON } from "./util/json";

export type Options = {
  configPath: string,
  greenlockDir: string,
  packageDir: string,
}

export async function createHttpsDomainProxy(optionsRaw: Options){
  const options = copyJSON(optionsRaw);
  options.packageDir = pathResolve(process.cwd(), options.packageDir);
  options.configPath = pathResolve(process.cwd(), options.configPath);
  options.greenlockDir = pathResolve(process.cwd(), options.greenlockDir);
  const configs = await initConfigs(options);
  const servers = await initGreenlock({
    maintainerEmail: configs.proxyConfig.maintainerEmail,
    greenlocklDir: options.greenlockDir,
    packagerDir: options.packageDir
  });
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
