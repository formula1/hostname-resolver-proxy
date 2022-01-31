
import { resolve as pathResolve } from "path";
import { networkInterfaces } from "os";
import {
  readFile,
  rename as fsRename,
  writeFile,
  stat as fsStat
} from "fs/promises";
import {
  formatJsonToGreenlock,
  formatJsonToProxy,
} from "domain-config-formatter"
import { GreenlockConfig } from "domain-config-formatter/src/types/greenlock";
import { deepEqual } from "./util/json";
import moment from "moment";

export type TypeInitArg = {
  configPath: string,
  greenlockDir: string,
}

export async function initConfigs(
  { configPath, greenlockDir }: TypeInitArg
){
  const configJSON = JSON.parse(await readFile(configPath, "utf-8"));
  const greenlockConfig = formatJsonToGreenlock(configJSON);
  const proxyConfig = formatJsonToProxy(configJSON);
  await ensureGreenlockConfig(greenlockConfig, greenlockDir);
  const unknownHost = proxyConfig.unknownHost;
  if(unknownHost){
    Object.values(networkInterfaces()).forEach((internalIps)=>{
      if(!Array.isArray(internalIps)) return;
      unknownHost.blacklist.push(...internalIps.map((net)=>(net.address)));
    });
  }

  return {
    proxyConfig,
    greenlockConfig
  }

}

async function ensureGreenlockConfig(newConfig: GreenlockConfig, greenlockDir: string){
  const greenlockPath = require(pathResolve(greenlockDir, "./config.json"))
  var stat
  try {
    stat = await fsStat(greenlockPath);
  }catch(e){
    console.error("had trouble stating the greenlock config file")
    console.error("it may not exist, so it may not be no problem")
    console.error("Just in case, heres the error")
    console.error(e);
    console.error("we'll be writing a file at", greenlockPath);
    return writeFile(greenlockPath, JSON.stringify(newConfig, null, 2));
  }
  const oldJSON = JSON.parse(await readFile(greenlockPath, "utf-8"));
  if(deepEqual(oldJSON, newConfig)){
    console.log("old greenlock config found and its the same. doing nothing");
    return;
  }
  const renamedPath = pathResolve(
    greenlockDir,
    `./old.${
      moment(Math.floor(stat.mtimeMs)).format()
    }.config.json`
  )
  console.warn("found an old config file. moving it to:", renamedPath);
  await fsRename(greenlockPath, renamedPath);
}
