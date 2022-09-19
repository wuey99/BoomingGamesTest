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

import { Tank } from './Tank';
import { PlayfieldGameObject } from '../playfield/PlayfieldGameObject';

//------------------------------------------------------------------------------------------
export class Fleet extends PlayfieldGameObject {
	public m_sprite:PIXI.AnimatedSprite;

    public script:XProcess;

    public m_tanks:Map<number, Tank>;

    public m_currentTankID:number;

    public m_keyDownHandler:any;
    public m_keyUpHandler:any;
	public m_keysPressed:Map<string, number>;
	public m_keysClicked:Map<string, number>;

	public static CHANGE_TANKS_KEY:string = "KeyT";

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

		this.setCX (-16, +16, -16, +16);

        this.createObjects ();

		this.script = this.addEmptyProcess ();

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
	public keyDownHandler (key:KeyboardEvent):void {
		console.log (": keyDown: ", key.code);

		this.setKeyPressed (key.code);
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

		this.m_keysPressed.set (__key, 0);	
	}

//------------------------------------------------------------------------------------------
	public setKeyReleased (__key:string):void {
		this.m_keysPressed.delete (__key);

		if (this.m_keysClicked.has (__key)) {
			this.m_keysClicked.delete (__key);
		}
	}

//------------------------------------------------------------------------------------------
    public createObjects ():void {
        this.m_tanks = new Map<number, Tank> ();

		var __tank:Tank;
        
        var __x:number = 512;
        var __y:number = 512;

        //------------------------------------------------------------------------------------------
        // green tank
        //------------------------------------------------------------------------------------------
        __tank = this.m_playfield.addGameObjectAsDetachedChild (Tank, 0, 0.0, false) as Tank;
		__tank.afterSetup ([this.m_playfield, Tank.GREEN, 1, 25]);

		__tank.x = __x;
		__tank.y = __y;

        this.m_tanks.set (Tank.GREEN, __tank);

        __x += 256;

        //------------------------------------------------------------------------------------------
        // blue tank
        //------------------------------------------------------------------------------------------
        __tank = this.m_playfield.addGameObjectAsDetachedChild (Tank, 0, 0.0, false) as Tank;
		__tank.afterSetup ([this.m_playfield, Tank.BLUE, 3, 20]);

		__tank.x = __x;
		__tank.y = __y;

        this.m_tanks.set (Tank.BLUE,__tank);

        __x += 256;

        //------------------------------------------------------------------------------------------
        // red tank
        //------------------------------------------------------------------------------------------
        __tank = this.m_playfield.addGameObjectAsDetachedChild (Tank, 0, 0.0, false) as Tank;
		__tank.afterSetup ([this.m_playfield, Tank.RED, 2, 10]);

		__tank.x = __x;
		__tank.y = __y;

        this.m_tanks.set (Tank.RED, __tank);
    }

	//------------------------------------------------------------------------------------------
    public updateActiveFocus ():void {
        var __tank:Tank;
        var __tankID:number;

        for (__tankID of this.m_tanks.keys ()) {
            __tank = this.m_tanks.get (__tankID);
            __tank.setFocus (this.m_currentTankID == __tankID);
        }
    }

	//------------------------------------------------------------------------------------------
	public Loop_Script ():void {
		var self:Fleet = this;
        
        self.m_currentTankID = Tank.GREEN;

        this.updateActiveFocus ();

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

                            if (self.m_keysClicked.has (Fleet.CHANGE_TANKS_KEY)) {
                                self.m_keysClicked.delete (Fleet.CHANGE_TANKS_KEY);

                                self.m_currentTankID = (self.m_currentTankID + 1) % 3;

                                self.updateActiveFocus ();
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
}