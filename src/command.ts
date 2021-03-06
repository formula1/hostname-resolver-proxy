
import { Command } from "commander";
import { createHostnameResolverProxyServer } from "./index";

export class HostnameResolverCommand extends Command {
  constructor(){
    super();
    this.option(
      "-c, --config-path <configPath>",
      [
        "The location of your config file.",
        "Resolves relative to the current working direrctory"
      ].join(" "),
      "./sites.config"
    ).option(
      "-g, --greenlock-dir <greenlockDirectory>",
      [
        "Where the greenlock config.json file should be created.",
        "Resolves relative to the current working direrctory"
      ].join(" "),
      "./greenlock.d"
    ).option(
      "-p, --package-dir <packageDirectory",
      [
        "Where the package root should be.",
        "This is used internally by greenlock, so I'm not sure what it does.",
        "Resolves relative to the current working directory.",
        "Defaults to the directory of this package."
      ].join(" "),
      __dirname
    ).option(
      "-w, --watch",
      [
        "This currently does nothing but what can be done is...",
        "Watch the config file for updates. If an update happens...",
        "Reload the config,",
        "check if its not equal to the previous,",
        "make changes to the server or simply just restart the server",
        "Probably not a good idea to restartt the server though"
      ].join(" ")
    ).action((options: any)=>{
      createHostnameResolverProxyServer()
    });
  }
}
