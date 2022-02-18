
import { setupProxy } from "./base/setup-proxy";
import { Server } from "http";
import { HostnamePart } from "./types/ProxyConfig";


export async function createHostnameResolverProxyServer(){
  const config: HostnamePart = getConfig();
  const server = new Server();
  const proxyServer = setupProxy({
    server: server,
    proxyConfig: config
  })
  const port = process.env.HTTP_PORT || 80;
  server.listen(port, ()=>{
    console.log("listening on :", port)
  });
}

function getConfig(){
  switch(process.env.NODE_ENV){
    case "prod": return getProdConfig();
    case "dev": return getDevConfig();
    default: {
      throw new Error("invalid $NODE_ENV " + process.env.NODE_ENV);
    }
  }

}



function getProdConfig(){
  return {
    sites: {
      app: {
        sites: {
          cleanupfun: {
            target: { hostname: "production-entry", port: 80 },
            sites: {
              staging: {
                target: { hostname: "staging-entry", port: 80 },
              }
            }
          }
        }
      }
    }
  }
}

function getDevConfig(){
  return {
    sites: {
      test: {
        sites: {
          localhost: {
            target: { hostname: "production-entry", port: 80 },
            sites: {
              staging: {
                target: { hostname: "staging-entry", port: 80 },
              }
            }
          }
        }
      }
    }
  }
}
