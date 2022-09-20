//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
export class PlayfieldManager {
    public static typeMap:Map<string, any> = new Map<string, any> ();

    //------------------------------------------------------------------------------------------
    public static registerTileType (__type:string, __classMap:any):void {
        PlayfieldManager.typeMap.set (__type, __classMap);
    }

    //------------------------------------------------------------------------------------------
    public static getTileClassMap (__type:string):any {
        return PlayfieldManager.typeMap.get (__type);
    }
}