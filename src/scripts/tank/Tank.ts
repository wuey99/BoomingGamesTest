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

//------------------------------------------------------------------------------------------
export class Tank extends XGameObject {
	public m_sprite:PIXI.AnimatedSprite;

    public script:XTask;
    public gravity:XTask;

    public m_keyDownHandler:any;
    public m_keyUpHandler:any;
	public m_keysPressed:Map<string, number>;
	public m_keysClicked:Map<string, number>;

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

		this.createSprites ();

		this.script = this.addEmptyTask ();

        this.Idle_Script ();

		this.m_keysPressed = new Map<string, number> ();
		this.m_keysClicked = new Map<string, number> ();

		document.addEventListener ('keydown', this.m_keyDownHandler = this.keyDownHandler.bind (this));
		document.addEventListener ('keyup', this.m_keyUpHandler = this.keyUpHandler.bind (this));

		this.addTask ([
			XTask.WAIT, 0x0100,

			() => {
			},

			XTask.RETN,
		]);

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
	public handleCX ():void {
	}

	//------------------------------------------------------------------------------------------
	public createSprites ():void {
        this.m_sprite = this.createAnimatedSpriteX ("Tanks");
        this.addSortableChild (this.m_sprite, this.getLayer (), this.getDepth (), false);

		this.show ();
	}

	//------------------------------------------------------------------------------------------
	public Idle_Script ():void {

		this.script.gotoTask ([
				
			//------------------------------------------------------------------------------------------
			// control
			//------------------------------------------------------------------------------------------
			() => {
				this.script.addTask ([
					XTask.LABEL, "loop",
						XTask.WAIT, 0x0100,
						 () => {
							this.angle += 1.0;
						 },

						XTask.GOTO, "loop",
						
					XTask.RETN,
				]);	
			},
				
			//------------------------------------------------------------------------------------------
			// animation
			//------------------------------------------------------------------------------------------	
			XTask.LABEL, "loop",
                XTask.WAIT, 0x0100,
					
				() => {
					this.m_sprite.gotoAndStop (2);
				},

				XTask.GOTO, "loop",
				
			XTask.RETN,
				
			//------------------------------------------------------------------------------------------			
		]);
			
	//------------------------------------------------------------------------------------------
    }

//------------------------------------------------------------------------------------------
}