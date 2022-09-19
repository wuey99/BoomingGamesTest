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
            this.m_tiles.push (null);

            for (__col = 0; __col < this.m_cols; __col++) {
                this.m_tiles[__row].push (null);
            }
        }
    }

    //------------------------------------------------------------------------------------------
    public cleanup ():void {
    }

    //------------------------------------------------------------------------------------------
    public setTileByType (__col:number, __row:number, __type:string):void {
    }

    //------------------------------------------------------------------------------------------
    public setTileByModel (__col:number, __row:number, __model:PlayfieldTileModel):void {
    }

    //------------------------------------------------------------------------------------------
    public getTile (__col:number, __row:number):PlayfieldTileModel {
        return null;
    }

    //------------------------------------------------------------------------------------------
    public removeTile (__col:number, __row:number):void {
    }
}