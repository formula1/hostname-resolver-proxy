// markdown-to-html.d.ts
// Type definitions for markdown-to-html

declare module "greenlock-express" {
  import {
    IncomingMessage, ServerResponse,
    Server as HttpServer
  } from "http";
  import {
    Server as HttpsServer,
    ServerOptions as HttpsServerOptions
  } from "https";
  import {
    Http2SecureServer,
    SecureServerOptions as Http2SecureServerOptions
  } from "http2";

  import Greenlock from "@root/greenlock";

  type ReqHandler = (req: IncomingMessage, res: ServerResponse)=>any;
  type ReqHandlerNext = (
    req: IncomingMessage, res: ServerResponse,
    next: (e?: any)=>any
  )=>any;

  /*
    Note: You can't use both https and http2s at the same time

  */

  interface Servers {
    httpServer(onReq?: ReqHandlerNext): HttpServer
    http2Server(
      secureOps: Http2SecureServerOptions, onReq?: ReqHandler
    ): Http2SecureServer
    httpsServer(
      secureOps: HttpsServerOptions, onReq?: ReqHandler
    ): HttpsServer
    serveApp(onReq: ReqHandler): Promise<void>
    id(): string | number
  }

  interface Master {
    ready(cb: (servers: Servers)=>any): Master;
    master(): Master;
    serve(onReq: ReqHandler): void;
  }


  type Options = {
    packageRoot: string,
    maintainerEmail: string,
    configDir: string
    cluster?: boolean
    greenlock?: Greenlock
    packageAgent?: string
    notify?: (ev: string, params: any)=>any
  };

  export function init(opts: Options | (()=>Options)): Master

}
