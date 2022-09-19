//------------------------------------------------------------------------------------------
import { XApp } from '../../engine/app/XApp';
import { G } from '../../engine/app/G';
import { XSignal } from '../../engine/signals/XSignal';
import { XSignalManager } from '../../engine/signals/XSignalManager';

import { PlayfieldTileModel } from './PlayfieldTIleModel';

//------------------------------------------------------------------------------------------
export class PlayfieldGridModel {
    public m_cols:number;
    public m_rows:number;

    public m_tileWidth:number;
    public m_tileHeight:number;

    public m_tiles:Array<Array<PlayfieldTileModel>>;

    public m_tileAddedSignal:XSignal;
    public m_tileRemovedSignal:XSignal;

    //------------------------------------------------------------------------------------------
    public new () {
    }

    //------------------------------------------------------------------------------------------
    public setup (__cols:number, __rows:number, __tileWidth:number, __tileHeight:number):void {
        this.m_cols = __cols;
        this.m_rows = __rows;

        this.m_tileWidth = __tileWidth;
        this.m_tileHeight = __tileHeight;

        this.m_tiles = new Array<Array<PlayfieldTileModel>> ();

        var __row:number, __col:number;

        for (__row = 0; __row < this.m_rows; __row++) {
            this.m_tiles.push (new Array<PlayfieldTileModel> ());

            for (__col = 0; __col < this.m_cols; __col++) {
                this.m_tiles[__row].push (null);
            }
        }

        this.m_tileAddedSignal = G.XApp.getXSignalManager ().createXSignal ();
        this.m_tileRemovedSignal = G.XApp.getXSignalManager ().createXSignal ();
    }

    //------------------------------------------------------------------------------------------
    public cleanup ():void {
        G.XApp.getXSignalManager ().removeXSignal (this.m_tileAddedSignal);
        G.XApp.getXSignalManager ().removeXSignal (this.m_tileRemovedSignal);
    }

    //------------------------------------------------------------------------------------------
    public addTileAddedListener (__listener:any):number {
        return this.m_tileAddedSignal.addListener (__listener);
    }

    //------------------------------------------------------------------------------------------
    public removeTileAddedListener (__id:number):void {
        this.m_tileAddedSignal.removeListener (__id);
    }

    //------------------------------------------------------------------------------------------
    public addTileRemovedListener (__listener:any):number {
        return this.m_tileRemovedSignal.addListener (__listener);
    }

    //------------------------------------------------------------------------------------------
    public removeTileRemovedListener (__id:number):void {
        this.m_tileRemovedSignal.removeListener (__id);
    }

    //------------------------------------------------------------------------------------------
    public setTileFromType (__col:number, __row:number, __type:string):void {
    }

    //------------------------------------------------------------------------------------------
    public setTileFromModel (__col:number, __row:number, __model:PlayfieldTileModel):void {
        if (this.m_tiles[__row][__col] != null) {
            this.removeTile (__col, __row);
        }

        this.m_tiles[__row][__col] = __model;

        this.m_tileAddedSignal.fireSignal (__model);
    }

    //------------------------------------------------------------------------------------------
    public getTile (__col:number, __row:number):PlayfieldTileModel {
        return this.m_tiles[__row][__col];
    }

    //------------------------------------------------------------------------------------------
    public removeTile (__col:number, __row:number):void {
        var __model:PlayfieldTileModel = this.m_tiles[__row][__col];

        if (__model != null) {
            this.m_tiles[__row][__col] = null;

            this.m_tileRemovedSignal.fireSignal (__model);

            __model.cleanup ();
        }
    }
}