// markdown-to-html.d.ts
// Type definitions for markdown-to-html

declare module "@root/greenlock" {

  type JSON_Primitives = boolean | number | string;
  type JSON_Array = Array<JSON_Primitives | JSON_Array | JSON_Object>
  type JSON_Object = {
    [key: string]: JSON_Primitives | JSON_Array | JSON_Object
  }
  type JSON_Unknown = JSON_Primitives | JSON_Array | JSON_Object;

  // Note: the get args cannot have a number of options
  // https://github.com/therootcompany/greenlock.js/blob/f01286d5b1dfd73015be9316dd3e5c1cd614d25f/greenlock.js#L262
  type GetArgs = {
    serverName: string
  }

  // I may be missing args related to mega.find
  // https://github.com/therootcompany/greenlock.js/blob/f01286d5b1dfd73015be9316dd3e5c1cd614d25f/lib/manager-wrapper.js#L237
  // Also args related to gconf.find
  // https://github.com/therootcompany/greenlock.js/blob/f01286d5b1dfd73015be9316dd3e5c1cd614d25f/lib/manager-wrapper.js#L237
  export function create(gconf?: {
    maintainerEmail: string,
    notify?: (ev: string, params: any)=>any
    packageRoot?: string
    manager: {
      module: string
    }
    staging?: boolean
    directoryUrl?: string
    renew?: boolean
  }): Greenlock;

  type RenewArgs = {
    servername?: string
    wildname?: string
    servernames?: Array<string>
    altnames?: Array<string>
    subject?: string
    renewBefore?: number
  }

  // Returns the value of mega.find
  // https://github.com/therootcompany/greenlock.js/blob/f01286d5b1dfd73015be9316dd3e5c1cd614d25f/lib/manager-wrapper.js#L237
  // which is mini.find
  // which comes fro loadManager
  // which is loaded from a generic file
  // https://github.com/therootcompany/greenlock.js/blob/f01286d5b1dfd73015be9316dd3e5c1cd614d25f/lib/manager-wrapper.js#L237

  // I'm able to guess what it looks like but no certianty
  // https://github.com/therootcompany/greenlock.js/blob/f01286d5b1dfd73015be9316dd3e5c1cd614d25f/greenlock.js#L341
  type RenewValue = {
    // I don't know what the site is supposed to look like
    site: any
    // I don't know what the pems are supposed to look like
    pems?: any
    error?: any & {
      toJSON(): JSON_Unknown
      context: any | "cert_order"
      subject?: any
      servername?: string

    }
  }

  // Maybe more, since mega then does its own thing
  // https://github.com/therootcompany/greenlock.js/blob/f01286d5b1dfd73015be9316dd3e5c1cd614d25f/lib/manager-wrapper.js#L169
  type SiteArg = {
    renewOffset?: number | string
    renewStagger?: number | string
    subject: string,
    altnames: Array<string>
  }

  type AddSite = (arg: SiteArg)=>any
  type UpdateSite = (arg: SiteArg)=>any
  type RemoveSite = ({ subject: string })=>any

  type SitesUpdater = {
    add: AddSite
    update: UpdateSite
    remove: RemoveSite
  }

  type SitesGetter = {
    get(args: any):  Promise<any>
  }


  type SitesManager = {
    // https://github.com/therootcompany/greenlock.js/blob/f01286d5b1dfd73015be9316dd3e5c1cd614d25f/lib/manager-wrapper.js#L54
    defaults(conf?: any): Promise<any>
    set: UpdateSite
    // https://github.com/therootcompany/greenlock.js/blob/f01286d5b1dfd73015be9316dd3e5c1cd614d25f/lib/manager-wrapper.js#L196
    // https://github.com/therootcompany/greenlock.js/blob/f01286d5b1dfd73015be9316dd3e5c1cd614d25f/lib/manager-wrapper.js#L344
    init(args: any): any
  }

  export type Greenlock = SitesUpdater & {
    notify(ev: string, params: any): void
    renew(args?: RenewArgs): Promise<Array<RenewValue>>
    get(args: GetArgs): Promise<null|RenewValue>
    sites: SitesUpdater & SitesGetter
    manager: SitesUpdater & SitesGetter & SitesManager
    challenges: {
      get(chall: {
        servername?: string,
        altname?: string,
        identifier?: {
          value: string
        }
        // Is type necessary?
        type: string
        token?: string
      }): Promise<(
        null |
        { keyAuthorization: string} |
        { keyAuthorizationDigest: string }
      )>
    }
  }

}
