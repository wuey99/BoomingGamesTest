//------------------------------------------------------------------------------------------
import * as PIXI from 'pixi.js-legacy'
import { XApp } from '../../engine/app/XApp';
import { XSprite } from '../../engine/sprite/XSprite';
import { XSpriteLayer } from '../../engine/sprite/XSpriteLayer';
import { XSignal } from '../../engine/signals/XSignal';
import { XSignalManager } from '../../engine/signals/XSignalManager';
import { world } from '../app';
import { XTask } from '../../engine/task/XTask';
import { XNumber } from '../../engine/task/XNumber';
import { XTaskManager} from '../../engine/task/XTaskManager';
import { XTaskSubManager} from '../../engine/task/XTaskSubManager';
import { XWorld} from '../../engine/sprite/XWorld';
import { XType } from '../../engine/type/XType';
import { XGameObject} from '../../engine/gameobject/XGameObject';
import { XGameObjectCX} from '../../engine/gameobject/XGameObjectCX';
import { G } from '../../engine/app/G';
import { XProcess } from '../../engine/process/XProcess';

import { PlayfieldGridModel } from './PlayfieldGridModel';
import { PlayfieldTileModel } from './PlayfieldTileModel';
import { PlayfieldTileView } from './PlayfieldTileView';
import { PlayfieldManager } from './PlayfieldManager';

//------------------------------------------------------------------------------------------
export class PlayfieldGridView extends XGameObject {
    public m_playfieldGridModel:PlayfieldGridModel;

    public m_modelToViewMap:Map<PlayfieldTileModel, PlayfieldTileView>;

//------------------------------------------------------------------------------------------	
	constructor () {
		super ();
	}
	
//------------------------------------------------------------------------------------------
	public setup (__world:XWorld, __layer:number, __depth:number):XGameObject {
        super.setup (__world, __layer, __depth);

		return this;
	}
	
//------------------------------------------------------------------------------------------
	public afterSetup (__params:Array<any> = null):XGameObject {
        super.afterSetup (__params);

        this.m_playfieldGridModel = __params[this.m_paramIndex++];

        this.m_modelToViewMap = new Map<PlayfieldTileModel, PlayfieldTileView> ();

        this.m_playfieldGridModel.addTileAddedListener (this.onTileAdded.bind (this));
        this.m_playfieldGridModel.addTileRemovedListener (this.onTileRemoved.bind (this));

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();
	}

//------------------------------------------------------------------------------------------
    public getModel ():PlayfieldGridModel {
        return this.m_playfieldGridModel;
    }

//------------------------------------------------------------------------------------------
    public getPlayfieldGridModel ():PlayfieldGridModel {
        return this.m_playfieldGridModel;
    }

//------------------------------------------------------------------------------------------
    public onTileAdded (__model:PlayfieldTileModel):void {
        if (!this.m_modelToViewMap.has (__model)) {
            var __classMap:any = PlayfieldManager.getTileClassMap (__model.getType ());

            var __playfieldTile:PlayfieldTileView = this.addGameObjectAsDetachedChild (
                __classMap.view, 0, 0.0, false
            ) as PlayfieldTileView;
            __playfieldTile.afterSetup ([]);

            __playfieldTile.x = __model.col * __model.tileWidth;
            __playfieldTile.y = __model.row * __model.tileHeight;

            this.m_modelToViewMap.set (__model, __playfieldTile);
        }
    }

//------------------------------------------------------------------------------------------
    public onTileRemoved (__model:PlayfieldTileModel):void {
        if (this.m_modelToViewMap.has (__model)) {
            
        }
    }

//------------------------------------------------------------------------------------------
}