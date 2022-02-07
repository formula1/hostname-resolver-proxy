
/*
Maybe Todo
- Create Success and Failure Classes
- Instead of returning, throw
- Then in the safe function
  - Check if the value is an instance of success or failure
   - if success - return true
   - if failure - return false
   - else - throw the error (who knows what happened)

*/


export function isValidHostHeader(
  hostMap: TypeHostMap,
  subdomains: TypeSubdomains,
  host?: string,
){
  // no host? fail
  // also detects if empty string
  if(!host) return false;

  const splitHost = host.split(".");

  // We are turning a.hello.world.domain.com into domain.com
  const mainHost = splitHost.slice(-2).join(".");

  // If the main host doesn't exist, it's subdomains will not exist either, fail
  if(!(mainHost in hostMap)) return false;

  // If the main host is the host, we're done
  if(mainHost === host){
    return true;
  }

  // if there are no subdomains for this host, there's nothing to checkl fail
  if(!(mainHost in subdomains)){
    return false;
  }

  // If it matches a subdomain, we're done
  const wildsAndNot = subdomains[mainHost];
  if(includes(wildsAndNot.notWild, host)){
    return true;
  }

  // We are turning username.users.mydomain.com into *.users.mydomain.com
  // Then we are testing if theres a wildcard for *.users.mydomain.com
  const wildCardTest = ["*"].concat(splitHost.slice(1)).join(".");
  if(includes(wildsAndNot.wildCards, wildCardTest)){
    return true;
  }

  // else failed
  return false;
}
