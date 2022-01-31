import { IncomingMessage, ServerResponse } from "http";
import { createProxyServer } from "http-proxy";
import { TypeInitRet } from "./init";
import { resolveTarget } from "./resolve-target";

export function setupProxy({
  servers,
  proxyConfig,
}: TypeInitRet){
  // we need the raw https server
  var server = servers.httpsServer({});
  var proxy = createProxyServer({ xfwd: true });

  // catches error events during proxying
  proxy.on("error", function(err) {
      console.error(err);
      console.log(arguments);
  });

  // We'll proxy websockets too
  server.on("upgrade", function(req, socket, head) {
    const target = resolveTarget(req.headers.host, proxyConfig);
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

  // servers a node app that proxies requests to a localhost
  servers.serveApp(function(req: IncomingMessage, res: ServerResponse) {
    const target = resolveTarget(req.headers.host, proxyConfig);
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
  });
}
