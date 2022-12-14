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
import { G } from '../../engine/app/G';
import { XTextSprite } from '../../engine/sprite/XTextSprite';
import { XTextSpriteButton } from '../../engine/ui/XTextSpriteButton';

import { PlayfieldGridView } from '../playfield/PlayfieldGridView';
import { PlayfieldGridModel } from '../playfield/PlayfieldGridModel';
import { PlayfieldManager } from '../playfield/PlayfieldManager';
import { PlayfieldTileView } from '../playfield/PlayfieldTileView';
import { Fleet } from '../tank/Fleet';
import { PlayfieldBlockWallModel } from './PlayfieldBlockWallModel';
import { PlayfieldBlockWallView } from './PlayfieldBlockWallView';
import { PlayfieldBlockHayModel } from './PlayfieldBlockHayModel';
import { PlayfieldBlockHayView } from './PlayfieldBlockHayView';

//------------------------------------------------------------------------------------------
export class TestGame extends XState {
	public static GRID_COLS:number = 50;
	public static GRID_ROWS:number = 50;

	public static TILE_WIDTH:number = 35;
	public static TILE_HEIGHT:number = 35;

	public static BLOCK_HAY:string = "block-hay";
	public static BLOCK_WALL:string = "block-wall";

	public static TOTAL_HAY_COUNT:number = 25;
	public static TOTAL_WALL_COUNT:number = 50;

	public m_playfieldGridView:PlayfieldGridView;
	public m_scaleRatio:number;

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

		this.registerTileTypes ();

		this.createBitmapFont (
            "Aller",
            {
                fontFamily: "Nunito",
                fontSize: 60,
                strokeThickness: 0,
                fill: "0xffffff",         
            },
            {chars: this.getBitmapFontChars ()}
		);

		var __startButton:XTextSpriteButton = this.addGameObjectAsChild (XTextSpriteButton, 7, 0.0, false) as XTextSpriteButton;
		__startButton.afterSetup ([
			"TestButtonToo",
			true, 10, 300, 100,
			"Start!",
			"Aller",
			50,
			0x0000ff,
			0xff0000,
			0x00ff00,
			0x0000ff,
			0x0000ff,
			false,
			"center", "center"
		]);

		__startButton.x = (G.SCREEN_WIDTH - 300) / 2;
		__startButton.y = (G.SCREEN_HEIGHT - 100) / 2;

		__startButton.addMouseUpListener (() => {
			__startButton.killLater ();

			this.createPlayfield ();

			this.scalePlayfieldToScreen ();

			this.showInstructions ();
		});

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
        super.cleanup ();
	}
	
//------------------------------------------------------------------------------------------
	public showInstructions ():void {
		var __textSprite:XTextSprite = this.createXTextSprite (
			600,
			64,
			"LEFT / RIGHT - TURNS TANK.\nUP - MOVES TANK.\nSPACE - SHOOTS.\nT - SWITCH TANKS.",
			"Aller",
			35,
			0xff0000,
			true,
			"center", "center"
		);
		this.addSortableChild (__textSprite, 7, 0.0, true);

		__textSprite.x = (this.m_playfieldGridView.x - __textSprite.width) / 2;
		__textSprite.y = (G.SCREEN_HEIGHT - __textSprite.height) / 2;
	}

//------------------------------------------------------------------------------------------
	public scalePlayfieldToScreen ():void {
		var __playfieldWidth:number, __playfieldHeight:number;

		__playfieldWidth = TestGame.GRID_COLS * TestGame.TILE_WIDTH;
		__playfieldHeight = TestGame.GRID_ROWS * TestGame.TILE_HEIGHT;

		var __scaleRatio:number = this.m_scaleRatio = Math.min (__playfieldWidth / G.SCREEN_WIDTH, __playfieldHeight / G.SCREEN_HEIGHT);

		this.m_playfieldGridView.scale.x = this.m_playfieldGridView.scale.y = __scaleRatio;

		this.m_playfieldGridView.x = (G.SCREEN_WIDTH - __playfieldWidth * __scaleRatio) / 2;
	}

//------------------------------------------------------------------------------------------
	public registerTileTypes ():void {
		PlayfieldManager.registerTileType (
			TestGame.BLOCK_HAY, 
			{
				model: PlayfieldBlockHayModel,
				view: PlayfieldBlockHayView
			}
		);

		PlayfieldManager.registerTileType (
			TestGame.BLOCK_WALL, 
			{
				model: PlayfieldBlockWallModel,
				view: PlayfieldBlockWallView
			}
		);
	}

//------------------------------------------------------------------------------------------
	public createPlayfield ():void {

		//------------------------------------------------------------------------------------------
		// create playfield model
		//------------------------------------------------------------------------------------------
		var __playfieldGridModel:PlayfieldGridModel = new PlayfieldGridModel ();
		__playfieldGridModel.setup (
			TestGame.GRID_COLS, TestGame.GRID_ROWS,
			TestGame.TILE_WIDTH, TestGame.TILE_HEIGHT
		);

		//------------------------------------------------------------------------------------------
		// create playfield view
		//------------------------------------------------------------------------------------------
		var __playfieldGridView:PlayfieldGridView = this.m_playfieldGridView = this.addGameObjectAsDetachedChild (
			PlayfieldGridView, 0, 0.0, false
		) as PlayfieldGridView;
		__playfieldGridView.afterSetup ([__playfieldGridModel]);
		
		//------------------------------------------------------------------------------------------
		var __col:number, __row:number;

		//------------------------------------------------------------------------------------------
		// create left / right wall boundary
		//------------------------------------------------------------------------------------------
		for (__row = 1; __row < TestGame.GRID_ROWS - 1; __row++) {
			__playfieldGridModel.setTileFromType (0, __row, TestGame.BLOCK_WALL);
			__playfieldGridModel.setTileFromType (TestGame.GRID_COLS - 1, __row, TestGame.BLOCK_WALL);
		}

		//------------------------------------------------------------------------------------------
		// create top / bottom wall boundary
		//------------------------------------------------------------------------------------------
		for (__col = 0; __col < TestGame.GRID_COLS; __col++) {
			__playfieldGridModel.setTileFromType (__col, 0, TestGame.BLOCK_WALL);
			__playfieldGridModel.setTileFromType (__col, TestGame.GRID_ROWS - 1, TestGame.BLOCK_WALL);
		}

		//------------------------------------------------------------------------------------------
		var i:number;

		var __success:boolean;

		//------------------------------------------------------------------------------------------
		// add hay blocks
		//------------------------------------------------------------------------------------------
		for (i = 0; i < TestGame.TOTAL_HAY_COUNT; i++) {
			__success = false;

			while (!__success) {
				__col = Math.floor (Math.random () * TestGame.GRID_COLS);
				__row = Math.floor (Math.random () * TestGame.GRID_ROWS);

				 if (__playfieldGridModel.getTile (__col, __row) == null) {
					__playfieldGridModel.setTileFromType (__col, __row, TestGame.BLOCK_HAY);

					__success = true;
				 }
			}
		}

		//------------------------------------------------------------------------------------------
		// add wall blocks
		//------------------------------------------------------------------------------------------
		for (i = 0; i < TestGame.TOTAL_WALL_COUNT; i++) {
			__success = false;

			while (!__success) {
				__col = Math.floor (Math.random () * TestGame.GRID_COLS);
				__row = Math.floor (Math.random () * TestGame.GRID_ROWS);

				 if (__playfieldGridModel.getTile (__col, __row) == null) {
					__playfieldGridModel.setTileFromType (__col, __row, TestGame.BLOCK_WALL);

					__success = true;
				 }
			}
		}

		//------------------------------------------------------------------------------------------
		// create our tank fleet
		//------------------------------------------------------------------------------------------
		var __fleet:Fleet = __playfieldGridView.addGameObjectAsDetachedChild (Fleet, 0, 0.0, false) as Fleet;
		__fleet.afterSetup ([__playfieldGridView]);
	}

//------------------------------------------------------------------------------------------
}