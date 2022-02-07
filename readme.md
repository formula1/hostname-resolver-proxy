# Hostname Resolver Proxy Server

At the moment I'm rewriting the types and config so this isn't in a working state
But the general idea is you write a hostname config and this compiles it.
From there, this proxy server will allow multiple websites to hit this server and
the server will direct the traffic to the specifed location.


- takes
  - Config file path - required
  - greenlock config directory - default `${cwd}/.greenlock.d`
  - package directory - default https-proxy root
- Loads up a configuration file
- [formats it to a greenlock config](https://git.rootprojects.org/root/greenlock.js/src/branch/master/MIGRATION_GUIDE.md#_manager_-replaces-approvedomains)
- Checks if there already is a greenlock config
  - if there is - check if they are the same
    - if different
      - renames the config file to something including the timestamp
      - save the new config
    - if same - do nothing
  - if not - save the config
- starts up greenlock
  - greenlock should handle
    - all the certificates
    - the acme challenges
    - the redirect
- Listens to http and ws requests
  - extracts the top domain from the host header
    - if the top domain is not in our config file - close it
    - if the top domain is the host header
      - resolve(void, topTarget, defaulTarget)
    - if the host header is in direct subdomains
      - resolve(directSubdomains[host], topTarget, defaulTarget)
    - if the host header is in wild subdomains
      - resolve(wildSubdomains[host], topTarget, defaulTarget)
    - else close connection
- target resolution (subTarget, topTarget, defaultTarget)
  - if subTarget exists - use that
  - if topTarget exists - use that
  - use default target

### The Configuration file
- https://github.com/formula1/domain-config-formatter

**Simple**

```json
{
  "maintainerEmail": "required@email.com",
  "sites": ["host.name"]
}
```
