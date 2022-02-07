import { Server } from "http";
import { createProxyServer } from "http-proxy";
import { HostnamePart } from "../types/ProxyConfig";
import { resolveTarget } from "./resolve-target";

type SetupProxyArg = {
  server: Server,
  proxyConfig: HostnamePart
}

export function setupProxy({
  server,
  proxyConfig,
}: SetupProxyArg){
  // we need the raw https server
  const proxy = createProxyServer({ xfwd: true });

  // catches error events during proxying
  proxy.on("error", function(err) {
      console.error(err);
      console.log(arguments);
  });

  // We'll proxy websockets too
  server.on("upgrade", function(req, socket, head) {
    const target = resolveTarget(proxyConfig, req.headers.host);
    if(!target){
      return socket.end(()=>{
        socket.destroy();
      })
    }
    proxy.ws(req, socket, head, {
        ws: true,
        target: `ws://${target.hostname}:${target.port}`
    });
  });

  server.on("request", function(req, res){
    const target = resolveTarget(proxyConfig, req.headers.host);
    if(!target){
      res.statusCode = 403;
      return res.end();
    }
    proxy.web(req, res, {
        target: `http://${target.hostname}:${target.port}`
    }, (e)=>{
      console.error(e);
      res.statusCode = 500;
      res.end();
    });
  })

  return proxy;
}
