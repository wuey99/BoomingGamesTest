//------------------------------------------------------------------------------------------
import * as PIXI from 'pixi.js-legacy'
import { XApp } from '../../engine/app/XApp';
import { XSprite } from '../../engine/sprite/XSprite';
import { XSpriteLayer } from '../../engine/sprite/XSpriteLayer';
import { XSpriteLayer0 } from '../../engine/sprite/XSpriteLayer0';
import { XSpriteLayer9 } from '../../engine/sprite/XSpriteLayer9';
import { XSignal } from '../../engine/signals/XSignal';
import { XSignalManager } from '../../engine/signals/XSignalManager';
import { world } from '../app';
import { XTask } from '../../engine/task/XTask';
import { XTaskManager} from '../../engine/task/XTaskManager';
import { XTaskSubManager} from '../../engine/task/XTaskSubManager';
import { XWorld} from '../../engine/sprite/XWorld';
import { XGameObject} from '../../engine/gameobject/XGameObject';
import { XState } from '../../engine/state/XState';``
import { GUID } from '../../engine/utils/GUID';
import { XSimpleXMLNode } from '../../engine/xml/XSimpleXMLNode';
import { Fleet } from '../tank/Fleet';
import { PlayfieldGridView } from '../playfield/PlayfieldGridView';
import { PlayfieldGridModel } from '../playfield/PlayfieldGridModel';

//------------------------------------------------------------------------------------------
export class TestGame extends XState {

	public static GRID_COLS:number = 50;
	public static GRID_ROWS:number = 50;
	public static TILE_WIDTH:number = 35;
	public static TILE_HEIGHT:number = 35;

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

		// replace layer 0 with a PIXI.ParticleContainer layer
		this.world.replaceLayer (0, new XSpriteLayer0 ());

		var __playfieldGridModel:PlayfieldGridModel = new PlayfieldGridModel ();
		__playfieldGridModel.setup (
			TestGame.GRID_COLS, TestGame.GRID_ROWS,
			TestGame.TILE_WIDTH, TestGame.TILE_HEIGHT
		);

		var __playfieldGridView:PlayfieldGridView = this.addGameObjectAsDetachedChild (PlayfieldGridView, 0, 0.0, false) as PlayfieldGridView;
		__playfieldGridView.afterSetup ([__playfieldGridModel]);
		
		var __fleet:Fleet = __playfieldGridView.addGameObjectAsDetachedChild (Fleet, 0, 0.0, false) as Fleet;
		__fleet.afterSetup ([__playfieldGridView]);

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
        super.cleanup ();
	}
	
//------------------------------------------------------------------------------------------
}