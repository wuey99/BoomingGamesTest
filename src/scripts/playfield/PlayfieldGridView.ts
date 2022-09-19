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

//------------------------------------------------------------------------------------------
export class PlayfieldGridView extends XGameObject {
    public m_playfieldGridModel:PlayfieldGridModel;

    public m_tileModelToViewMap:Map<PlayfieldTileModel, PlayfieldTileView>;

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

        this.m_tileModelToViewMap = new Map<PlayfieldTileModel, PlayfieldTileView> ();

        this.m_playfieldGridModel.addTileAddedListener (this.onTileAdded.bind (this));
        this.m_playfieldGridModel.addTileRemovedListener (this.onTileRemoved.bind (this));

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();
	}

//------------------------------------------------------------------------------------------
    public getPlayfieldGridModel ():PlayfieldGridModel {
        return this.m_playfieldGridModel;
    }

//------------------------------------------------------------------------------------------
    public onTileAdded (__model:PlayfieldTileModel):void {
        if (!this.m_tileModelToViewMap.has (__model)) {

        }
    }

//------------------------------------------------------------------------------------------
    public onTileRemoved (__model:PlayfieldTileModel):void {
        if (this.m_tileModelToViewMap.has (__model)) {
            
        }
    }

//------------------------------------------------------------------------------------------
}