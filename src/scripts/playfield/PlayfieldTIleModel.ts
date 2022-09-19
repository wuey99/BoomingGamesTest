//------------------------------------------------------------------------------------------
import { XApp } from '../../engine/app/XApp';
import { G } from '../../engine/app/G';
import { XSignal } from '../../engine/signals/XSignal';
import { XSignalManager } from '../../engine/signals/XSignalManager';
import { PlayfieldGridModel } from './PlayfieldGridModel';

//------------------------------------------------------------------------------------------
export class PlayfieldTileModel {
    public m_health:number;
    public m_type:string;
    public m_solid:boolean;
    public m_col:number;
    public m_row:number;

    public m_playfieldGridModel:PlayfieldGridModel;

    //------------------------------------------------------------------------------------------
    public new () {
    }

    //------------------------------------------------------------------------------------------
    public setup (__col:number, __row:number, __health:number, __type:string, __solid:boolean):void {
        this.m_col = __col;
        this.m_row = __row;
        this.m_health = __health;
        this.m_type = __type;
        this.m_solid = __solid;
    }

    //------------------------------------------------------------------------------------------
    public cleanup ():void {
    }
}