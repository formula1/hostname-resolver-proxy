
import { JSON_Unknown } from "../types/JSON"
import { includes } from "./array";
export function copy<T>(json: T & JSON_Unknown): T {
  return JSON.parse(JSON.stringify(json));
}

export function deepEqual(a: JSON_Unknown,b: JSON_Unknown): boolean{
  if(typeof a !== "object") return a === b;
  if(typeof b !== "object") return false;
  if(a === null) return a === b;
  if(Array.isArray(a) && Array.isArray(b)){
    if(a.length !== b.length) return false;
    return !a.some((item)=>{
      return !includes(b as Array<JSON_Unknown>, item, deepEqual);
    })
  }
  if(Array.isArray(a) || Array.isArray(b)){
    return false;
  }
  const akeys = Object.keys(a);
  const bkeys = Object.keys(b);
  if(akeys.length !== bkeys.length) return false;
  return !akeys.some((key)=>{
    if(!(key in b)) return true;
    return !deepEqual(a[key], b[key]);
  })
}
