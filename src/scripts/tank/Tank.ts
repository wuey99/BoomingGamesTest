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

import { PlayfieldObject } from '../common/PlayfieldObject';
import { Shot } from './Shot';

//------------------------------------------------------------------------------------------
export class Tank extends PlayfieldObject {
	public m_sprite:PIXI.AnimatedSprite;

    public script:XProcess;
	public physics:XProcess;

    public m_keyDownHandler:any;
    public m_keyUpHandler:any;
	public m_keysPressed:Map<string, number>;
	public m_keysClicked:Map<string, number>;

	public static TURN_LEFT_KEY:string = "ArrowLeft";
	public static TURN_RIGHT_KEY:string = "ArrowRight";
	public static FORWARD_KEY:string = "ArrowUp"
	public static ACTION_KEY:string = "Space";

	public static GREEN:number = 0;
	public static BLUE:number = 1;
	public static RED:number = 2;

	public m_color:number;
	public m_bullets:number;
	public m_damage:number;

	public m_speed:number;

	public m_hasFocus:boolean;

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

		this.m_color = __params[this.m_paramIndex++];
		this.m_bullets = __params[this.m_paramIndex++];
		this.m_damage = __params[this.m_paramIndex++];

		this.setCX (-16, +16, -16, +16);

		this.createSprites ();

		this.script = this.addEmptyProcess ();
		this.physics = this.addEmptyProcess ();

		this.m_hasFocus = false;
		this.m_speed = 1.0;

		this.Physics_Script ();
        this.Loop_Script ();

		this.m_keysPressed = new Map<string, number> ();
		this.m_keysClicked = new Map<string, number> ();

		document.addEventListener ('keydown', this.m_keyDownHandler = this.keyDownHandler.bind (this));
		document.addEventListener ('keyup', this.m_keyUpHandler = this.keyUpHandler.bind (this));

		this.addProcess (
			function * () {
				
			}
		);

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();

		document.removeEventListener ('keydown', this.m_keyDownHandler);
		document.addEventListener ('keyup', this.m_keyUpHandler);
	}

//------------------------------------------------------------------------------------------
	public setFocus (__focus:boolean):void {
		this.m_hasFocus = __focus;
	}

//------------------------------------------------------------------------------------------
	public keyDownHandler (key:KeyboardEvent):void {
		console.log (": keyDown: ", key.code);

		if (this.m_hasFocus) {
			this.setKeyPressed (key.code);
		}
	}

//------------------------------------------------------------------------------------------
	public keyUpHandler (key:KeyboardEvent):void {
		console.log (": keyUp: ", key.code);

		this.setKeyReleased (key.code);
	}

//------------------------------------------------------------------------------------------
	public setKeyPressed (__key:string):void {
		if (!this.m_keysPressed.has (__key)) {
			this.m_keysClicked.set (__key, 0);
		}

		if (this.m_hasFocus) {
			this.m_keysPressed.set (__key, 0);	
		}
	}

//------------------------------------------------------------------------------------------
	public setKeyReleased (__key:string):void {
		this.m_keysPressed.delete (__key);

		if (this.m_keysClicked.has (__key)) {
			this.m_keysClicked.delete (__key);
		}
	}

	//------------------------------------------------------------------------------------------
	public handleCX ():void {
	}

	//------------------------------------------------------------------------------------------
	public createSprites ():void {
        this.m_sprite = this.createAnimatedSpriteX ("Tanks");
        this.addSortableChild0 (this.m_sprite, this.getLayer (), this.getDepth (), false);

		this.m_sprite.gotoAndStop (this.m_color);

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
		var self:Tank = this;

		//------------------------------------------------------------------------------------------
		this.script.gotoProcess (
			function * () {

				//------------------------------------------------------------------------------------------
				// control
				//------------------------------------------------------------------------------------------
				self.script.addProcess (
					function * () {
						while (true) {
							yield [XProcess.WAIT, 0x0100];

							if (self.m_keysPressed.has (Tank.TURN_LEFT_KEY)) {
								self.angle -= 2.0;
							} else if (self.m_keysPressed.has (Tank.TURN_RIGHT_KEY)) {
								self.angle += 2.0;
							}

							if (self.m_keysPressed.has (Tank.FORWARD_KEY)) {
								self.m_speed = Math.min (8.0, self.m_speed + 0.10);
							} else {
								self.m_speed = Math.max (0.0, self.m_speed - 0.20);
							}

							if (self.m_keysClicked.has (Tank.ACTION_KEY)) {
								self.m_keysClicked.delete (Tank.ACTION_KEY);

								self.fireShots ();
							}
						}
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
	public fireShots ():void {
		var self:Tank = this;

		this.script.addProcess (
			function * () {
				var i:number;

				for (i = 0; i < self.m_bullets; i++) {
					var __shot:Shot = self.m_playfield.addGameObjectAsDetachedChild (Shot, 0, 0.0, false) as Shot;
					__shot.afterSetup ([self.m_playfield, self.angle, 14.0, self.m_damage]);

					__shot.x = self.x;
					__shot.y = self.y;

					yield [XProcess.WAIT1000, 0.125 * 1000];
				}
			}
		);	
	}

//------------------------------------------------------------------------------------------
}