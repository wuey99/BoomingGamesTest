//------------------------------------------------------------------------------------------
import { XApp } from '../../engine/app/XApp';
import { G } from '../../engine/app/G';
import { XSignal } from '../../engine/signals/XSignal';
import { XSignalManager } from '../../engine/signals/XSignalManager';
import { PlayfieldGridModel } from './PlayfieldGridModel';

//------------------------------------------------------------------------------------------
export class PlayfieldTileModel {
    public m_playfieldGridModel:PlayfieldGridModel;

    public m_health:number;
    public m_col:number;
    public m_row:number;
    public m_tileWidth:number;
    public m_tileHeight:number;

    //------------------------------------------------------------------------------------------
    constructor () {
    }

    //------------------------------------------------------------------------------------------
    public setup (__model:PlayfieldGridModel, __col:number, __row:number):void {
        this.m_playfieldGridModel = __model;

        this.m_col = __col;
        this.m_row = __row;

        this.m_tileWidth = __model.getTileWidth ();
        this.m_tileHeight = __model.getTileHeight ();

        this.m_health = this.getDefaultHealth ();
    }

    //------------------------------------------------------------------------------------------
    public cleanup ():void {
    }

    //------------------------------------------------------------------------------------------
    public get health ():number {
        return this.m_health;
    }

    //------------------------------------------------------------------------------------------
    public set health (__value:number) {
        this.m_health = __value;
    }

    //------------------------------------------------------------------------------------------
    public get col ():number {
        return this.m_col;
    }

    //------------------------------------------------------------------------------------------
    public get row ():number {
        return this.m_row;
    }

    //------------------------------------------------------------------------------------------
    public get tileWidth ():number {
        return this.m_tileWidth;
    }

    //------------------------------------------------------------------------------------------
    public get tileHeight ():number {
        return this.m_tileHeight;
    }

    //------------------------------------------------------------------------------------------
    public getDefaultHealth ():number {
        return -1;
    }

    //------------------------------------------------------------------------------------------
    public getType ():string {
        return "";
    }

    //------------------------------------------------------------------------------------------
    public isSolid ():boolean {
        return true;
    }
}