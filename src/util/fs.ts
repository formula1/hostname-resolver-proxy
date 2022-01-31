import {
  stat as fsStat,
} from "fs/promises";


export async function fsExists(path: string){
  try{
    await fsStat(path);
    return true;
  }catch(e){
    return false;
  }
}
