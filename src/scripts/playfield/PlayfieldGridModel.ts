//------------------------------------------------------------------------------------------
import { XApp } from '../../engine/app/XApp';
import { G } from '../../engine/app/G';
import { XSignal } from '../../engine/signals/XSignal';
import { XSignalManager } from '../../engine/signals/XSignalManager';
import { XType } from '../../engine/type/XType';

import { PlayfieldTileModel } from './PlayfieldTileModel';
import { PlayfieldManager } from './PlayfieldManager';

//------------------------------------------------------------------------------------------
export class PlayfieldGridModel {
    public m_cols:number;
    public m_rows:number;

    public m_tileWidth:number;
    public m_tileHeight:number;

    public m_tiles:Array<Array<PlayfieldTileModel>>;

    public m_tileAddedSignal:XSignal;
    public m_tileRemovedSignal:XSignal;
    public m_tileDamagedSignal:XSignal;

    //------------------------------------------------------------------------------------------
    constructor () {
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
        this.m_tileDamagedSignal = G.XApp.getXSignalManager ().createXSignal ();
    }

    //------------------------------------------------------------------------------------------
    public cleanup ():void {
        G.XApp.getXSignalManager ().removeXSignal (this.m_tileAddedSignal);
        G.XApp.getXSignalManager ().removeXSignal (this.m_tileRemovedSignal);
        G.XApp.getXSignalManager ().removeXSignal (this.m_tileDamagedSignal);
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
    public addTileDamagedListener (__listener:any):number {
        return this.m_tileDamagedSignal.addListener (__listener);
    }

    //------------------------------------------------------------------------------------------
    public removeTileDamagedListener (__id:number):void {
        this.m_tileDamagedSignal.removeListener (__id);
    }

    //------------------------------------------------------------------------------------------
    public getCols ():number {
        return this.m_cols;
    }

    //------------------------------------------------------------------------------------------
    public getRows ():number {
        return this.m_rows;
    }
    
    //------------------------------------------------------------------------------------------
    public getTileWidth ():number {
        return this.m_tileWidth;
    }

    //------------------------------------------------------------------------------------------
    public getTileHeight ():number {
        return this.m_tileHeight;
    }

    //------------------------------------------------------------------------------------------
    public setTileFromType (__col:number, __row:number, __type:string):void {
        var __classMap:any = PlayfieldManager.getTileClassMap (__type);

        this.setTileFromClass (__col, __row, __classMap.model);
    }

    //------------------------------------------------------------------------------------------
    public setTileFromClass (__col:number, __row:number, __class:any):void {
        if (this.m_tiles[__row][__col] != null) {
            this.removeTile (__col, __row);
        }

        var __model:PlayfieldTileModel = XType.createInstance (__class) as PlayfieldTileModel;
        __model.setup (this, __col, __row);

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

    //------------------------------------------------------------------------------------------
    public damageTile (__col:number, __row:number, __damage:number):void {
        var __model:PlayfieldTileModel = this.m_tiles[__row][__col];

        if (__model != null) {
            this.m_tileDamagedSignal.fireSignal (__model);

            if (__model.isDestructable ()) {
                __model.health = Math.max (0, __model.health - __damage);

                if (__model.health == 0) {
                    this.removeTile (__col, __row);
                }
            }
        }
    }
}