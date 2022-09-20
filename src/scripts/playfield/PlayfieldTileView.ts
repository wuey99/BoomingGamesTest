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

import { PlayfieldGameObject } from './PlayfieldGameObject';
import { PlayfieldGridModel } from './PlayfieldGridModel';

//------------------------------------------------------------------------------------------
export class PlayfieldTileView extends PlayfieldGameObject {
    public m_sprite:PIXI.AnimatedSprite;

    public script:XProcess;

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

        this.createSprites ();
        
		this.script = this.addEmptyProcess ();

        this.Idle_Script ();

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();
	}

	//------------------------------------------------------------------------------------------
	public createSprites ():void {
        this.m_sprite = this.createAnimatedSpriteX (this.getName ());
        this.addSortableChild0 (this.m_sprite, this.getLayer (), this.getDepth (), false);

		this.show ();
	}

	//------------------------------------------------------------------------------------------
    public getName ():string {
        return "";
    }

	//------------------------------------------------------------------------------------------
	public Idle_Script ():void {
		var self:PlayfieldTileView = this;

        self.m_sprite.gotoAndStop (0);

		//------------------------------------------------------------------------------------------
		this.script.gotoProcess (
			function * () {

				//------------------------------------------------------------------------------------------
				// control
				//------------------------------------------------------------------------------------------
				self.script.addProcess (
					function * () {
						yield [XProcess.WAIT, 0x0100];
					}
				);	
				
				//------------------------------------------------------------------------------------------
				// animation
				//------------------------------------------------------------------------------------------	
				while (true) {
					yield [XProcess.WAIT, 0x0100];
				}

			//------------------------------------------------------------------------------------------			
			}
		);	
			
	//------------------------------------------------------------------------------------------
    }

	//------------------------------------------------------------------------------------------
	public Damage_Script ():void {
		var self:PlayfieldTileView = this;

		//------------------------------------------------------------------------------------------
		this.script.gotoProcess (
			function * () {

				//------------------------------------------------------------------------------------------
				// control
				//------------------------------------------------------------------------------------------
				self.script.addProcess (
					function * () {
						yield [XProcess.WAIT1000, 1 * 1000];

                        self.Idle_Script ();
					}
				);	
				
				//------------------------------------------------------------------------------------------
				// animation
				//------------------------------------------------------------------------------------------	
				while (true) {
                    var i:number;

                    for (i = 0; i < 8; i++) {
                        self.m_sprite.gotoAndStop (0)
                        yield [XProcess.WAIT, 0x0200];

                        self.m_sprite.gotoAndStop (1)
                        yield [XProcess.WAIT, 0x0200];
                    }
				}

			//------------------------------------------------------------------------------------------			
			}
		);	
			
	//------------------------------------------------------------------------------------------
    }

//------------------------------------------------------------------------------------------
}