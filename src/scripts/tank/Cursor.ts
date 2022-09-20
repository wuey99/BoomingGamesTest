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
import { PlayfieldGridModel } from '../playfield/PlayfieldGridModel';
import { TestGame } from '../test/TestGame';

//------------------------------------------------------------------------------------------
export class Cursor extends XGameObject {
	public m_spriteUL:PIXI.AnimatedSprite;
    public m_metaDataUL:any;

	public m_spriteUR:PIXI.AnimatedSprite;
    public m_metaDataUR:any;

	public m_spriteLL:PIXI.AnimatedSprite;
    public m_metaDataLL:any;

	public m_spriteLR:PIXI.AnimatedSprite;
    public m_metaDataLR:any;

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

		this.setCX (-16, +16, -16, +16);

        this.createSprites ();
        this.createObjects ();

		this.script = this.addEmptyProcess ();

        this.Loop_Script ();

		this.addProcess (
			function * () {
				
			}
		);

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();
	}

//------------------------------------------------------------------------------------------
	public createSprites ():void {
        var __scale:number = 2.5;

        this.m_spriteUL = this.createAnimatedSpriteX ("Arrow");
        this.addSortableChild0 (this.m_spriteUL, this.getLayer (), this.getDepth (), false,
            this.m_metaDataUL = {
                x: 0,
                y: 0,
                rotation: 0,
                alpha: 1.0,
                scaleX: -__scale,
                scaleY: __scale,
                visible: true
            }
        );

        this.m_spriteUR = this.createAnimatedSpriteX ("Arrow");
        this.addSortableChild0 (this.m_spriteUR, this.getLayer (), this.getDepth (), false,
            this.m_metaDataUR = {
                x: 0,
                y: 0,
                rotation: 0,
                alpha: 1.0,
                scaleX: __scale,
                scaleY: __scale,
                visible: true
            }
        );

        this.m_spriteLL = this.createAnimatedSpriteX ("Arrow");
        this.addSortableChild0 (this.m_spriteLL, this.getLayer (), this.getDepth (), false,
            this.m_metaDataLL = {
                x: 0,
                y: 0,
                rotation: 0,
                alpha: 1.0,
                scaleX: -__scale,
                scaleY: -__scale,
                visible: true
            }
        );

        this.m_spriteLR = this.createAnimatedSpriteX ("Arrow");
        this.addSortableChild0 (this.m_spriteLR, this.getLayer (), this.getDepth (), false,
            this.m_metaDataLR = {
                x: 0,
                y: 0,
                rotation: 0,
                alpha: 1.0,
                scaleX: __scale,
                scaleY: -__scale,
                visible: true
            }
        );

		this.show ();
	}

//------------------------------------------------------------------------------------------
    public createObjects ():void {
    }

	//------------------------------------------------------------------------------------------
	public Loop_Script ():void {
		var self:Cursor = this;
    
		//------------------------------------------------------------------------------------------
		this.script.gotoProcess (
			function * () {

				//------------------------------------------------------------------------------------------
				// control
				//------------------------------------------------------------------------------------------
				self.script.addProcess (
					function * () {
                        var i:number;

						while (true) {
                            for (i = 24; i < 40; i++) {
                                yield [XProcess.WAIT, 0x0100];

                                self.m_metaDataUL.x = -i;
                                self.m_metaDataUL.y = -i;

                                self.m_metaDataUR.x = i;
                                self.m_metaDataUR.y = -i;

                                self.m_metaDataLL.x = -i;
                                self.m_metaDataLL.y = i;

                                self.m_metaDataLR.x = i;
                                self.m_metaDataLR.y = i;
                            }

                            for (i = 40; i >= 24; i--) {
                                yield [XProcess.WAIT, 0x0100];

                                self.m_metaDataUL.x = -i;
                                self.m_metaDataUL.y = -i;

                                self.m_metaDataUR.x = i;
                                self.m_metaDataUR.y = -i;

                                self.m_metaDataLL.x = -i;
                                self.m_metaDataLL.y = i;

                                self.m_metaDataLR.x = i;
                                self.m_metaDataLR.y = i;
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