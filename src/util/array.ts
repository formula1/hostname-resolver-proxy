

export function includes<T, V>(ari: Array<T>, v: V, cb?: (a:T,b:V)=>boolean): boolean{
  if(!cb) cb = (a, b)=>(a as T&V === b as T&V);
  for(var i = 0, l = ari.length; i < l; i++){
    if(cb(ari[i], v)) return true;
  }
  return false;
}
