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

import { PlayfieldGameObject } from '../playfield/PlayfieldGameObject';

//------------------------------------------------------------------------------------------
export class Shot extends PlayfieldGameObject {
	public m_sprite:PIXI.AnimatedSprite;

    public script:XProcess;
	public physics:XProcess;

	public m_speed:number;
    public m_damage:number;

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

        this.angle = __params[this.m_paramIndex++];
        this.m_speed = __params[this.m_paramIndex++];
        this.m_damage = __params[this.m_paramIndex++];

		this.setCX (-16, +16, -16, +16);

		this.createSprites ();

		this.script = this.addEmptyProcess ();
		this.physics = this.addEmptyProcess ();

		this.Physics_Script ();
        this.Loop_Script ();

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();
	}

	//------------------------------------------------------------------------------------------
	public createSprites ():void {
        this.m_sprite = this.createAnimatedSpriteX ("Shot");
        this.addSortableChild0 (this.m_sprite, this.getLayer (), this.getDepth (), false);

		this.show ();
	}

	//------------------------------------------------------------------------------------------
	public Physics_Script ():void {
		var self:any = this;

		//------------------------------------------------------------------------------------------
		this.physics.gotoProcess (
			function * () {	
				while (true) {
					yield [XProcess.WAIT, 0x0100];

					self.updatePhysics ();
				}

			//------------------------------------------------------------------------------------------			
			}
		);	
	}

	//------------------------------------------------------------------------------------------
	public updatePhysics () {
		var __radians:number = ((this.angle - 90.0) % 360) * Math.PI / 180;

		var __dx:number = Math.cos (__radians) * this.m_speed;
		var __dy:number = Math.sin (__radians) * this.m_speed;

		this.x += __dx;
		this.y += __dy;
	}

	//------------------------------------------------------------------------------------------
	public Loop_Script ():void {
		var self:Shot = this;

		//------------------------------------------------------------------------------------------
		this.script.gotoProcess (
			function * () {

				//------------------------------------------------------------------------------------------
				// control
				//------------------------------------------------------------------------------------------
				self.script.addProcess (
					function * () {
						yield [XProcess.WAIT1000, 2 * 1000];

                        self.killLater ();
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
}