

import { init as greenlockInit, Servers as GreenlockServers } from "greenlock-express";
import {
  ProxyConfig
} from "domain-config-formatter"
import { GreenlockConfig } from "domain-config-formatter/src/types/greenlock";

export type TypeInitGreenlockArg = {
  maintainerEmail: string,
  greenlockDir: string,
  packageDir: string,
}

export async function initGreenlock(
  { maintainerEmail, greenlockDir, packageDir }: TypeInitGreenlockArg
): Promise<GreenlockServers>{
  return await new Promise((res)=>{
    greenlockInit({
      packageRoot: packageDir,
      configDir: greenlockDir,
      maintainerEmail: maintainerEmail,
      cluster: false
    }).ready((glx)=>{
      res(glx)
    })
  })
}
