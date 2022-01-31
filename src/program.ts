
import { Command } from "commander";
import { createHttpsDomainProxy, Options } from "./index";
import { hasParent } from "./util/module";

export class HttpsDomainProxyCommand extends Command {
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
    ).action((options: Options)=>{
      createHttpsDomainProxy(options)
    });
  }
}
if(
  typeof module !== "undefined"
  &&
  typeof process !== "undefined"
  &&
  typeof require !== "undefined"
){
  if(!hasParent(module)){
    const program = new HttpsDomainProxyCommand();
    program.parse(process.argv);
  } else {
    console.warn(
      "this module has parents, maybe it's getting added as a subcommand"
    );
  }
} else {
  console.log(
    "not sure what you plan to do with this but it intrigues me."
  )
}
