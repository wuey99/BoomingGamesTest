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
import { XProcess } from '../../engine/process/XProcess';

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

		var self:TestGameController = this;

		// register all the game's states
		this.getGameInstance ().registerState ("TestGame", TestGame);

		// pause async loading of assets
		this.m_XApp.getXProjectManager ().pauseAllResourceManagers ();

		// restart async loading for the following asset groups
		this.m_XApp.getXProjectManager ().startResourceManagersByName (["default", "Common", "Preload", "Test"]);

		this.addProcess (
			function * () {
				// wait until the following asset groups are completely loaded before continuing
				while (!self.m_XApp.getXProjectManager ().getLoadCompleteByGroups (["Common", "Preload", "Test"])) {
					yield [XProcess.WAIT, 0x0100];
				}

				// restart async loading for the remainder of the game's assets
				self.m_XApp.getXProjectManager ().startAllResourceManagers ();

				// create a unified sprite sheet
				self.createUnifiedSpritesheet ();

				// goto the TestGame state
				self.getGameInstance ().gotoState ("TestGame");
			}
		);

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
// create a single, unified sprite sheet
//
// this is required for PIXI.ParticleContainer's
//------------------------------------------------------------------------------------------
	public createUnifiedSpritesheet ():void {
        var __subManager:XSubTextureManager = G.XApp.getTextureManager ().createSubManager ("__global__");
        __subManager.start ();
        __subManager.addFromSpritesheet ("OctopusBug");
		__subManager.addFromSpritesheet ("Block_Hay");
		__subManager.addFromSpritesheet ("Block_Wall");
		__subManager.addFromSpritesheet ("Tanks");
		__subManager.addFromSpritesheet ("Shot");
		__subManager.addFromSpritesheet ("Arrow");
        __subManager.finish ();
	}

//------------------------------------------------------------------------------------------
}