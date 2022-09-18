//------------------------------------------------------------------------------------------
import * as PIXI from 'pixi.js-legacy'
import { XApp } from '../../engine/app/XApp';
import { XSprite } from '../../engine/sprite/XSprite';
import { XSpriteLayer } from '../../engine/sprite/XSpriteLayer';
import { XSignal } from '../../engine/signals/XSignal';
import { XSignalManager } from '../../engine/signals/XSignalManager';
import { world } from '../app';
import { XTask } from '../../engine/task/XTask';
import { XTaskManager} from '../../engine/task/XTaskManager';
import { XTaskSubManager} from '../../engine/task/XTaskSubManager';
import { XWorld} from '../../engine/sprite/XWorld';
import { XType } from '../../engine/type/XType';
import { XGameObject} from '../../engine/gameobject/XGameObject';
import { XGameController } from '../../engine/state/XGameController';
import { TestGame } from './TestGame';
import { XSimpleXMLNode } from '../../engine/xml/XSimpleXMLNode';
import { TestGameInstance } from './TestGameInstance';
import { XTextureManager } from '../../engine/texture/XTextureManager';
import { XSubTextureManager } from '../../engine/texture/XSubTextureManager';
import { G } from '../../engine/app/G';

//------------------------------------------------------------------------------------------
export class TestGameController extends XGameController {

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

		this.getGameInstance ().registerState ("TestGame", TestGame);

		this.m_XApp.getXProjectManager ().pauseAllResourceManagers ();

		this.addTask ([
				XTask.WAIT, 0x0100,

				() => {
					this.m_XApp.getXProjectManager ().startResourceManagersByName (["default", "Common", "Preload", "Test"]);
				},

				XTask.LABEL, "loopAssets",
					XTask.WAIT, 0x0100,

					XTask.FLAGS, (__task:XTask) => {
						__task.ifTrue (
							this.m_XApp.getXProjectManager ().getLoadCompleteByGroups (["Common", "Preload", "Test"])
						);
					}, XTask.BNE, "loopAssets",

				() => { 
					this.m_XApp.getXProjectManager ().startAllResourceManagers ();

					this.cacheTextures ();

					this.getGameInstance ().gotoState ("TestGame");
				},

			XTask.RETN,
		]);

		return this;
	}
	
//------------------------------------------------------------------------------------------
	public cleanup ():void {
        super.cleanup ();
	}

//------------------------------------------------------------------------------------------
	public getGameInstanceClass ():any {
		return TestGameInstance;
	}

//------------------------------------------------------------------------------------------
	public cacheTextures ():void {
        var __subManager:XSubTextureManager = G.XApp.getTextureManager ().createSubManager ("__global__");
        __subManager.start ();
        __subManager.addFromSpritesheet ("OctopusBug");
		__subManager.addFromSpritesheet ("Block_Hay");
		__subManager.addFromSpritesheet ("Block_Wall");
		__subManager.addFromSpritesheet ("Tanks");
        __subManager.finish ();
	}

//------------------------------------------------------------------------------------------
}