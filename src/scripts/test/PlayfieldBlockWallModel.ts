//------------------------------------------------------------------------------------------
import { PlayfieldTileModel } from '../playfield/PlayfieldTileModel';
import { TestGame } from './TestGame';

//------------------------------------------------------------------------------------------
export class PlayfieldBlockWallModel extends PlayfieldTileModel {

    //------------------------------------------------------------------------------------------
    public getDefaultHealth ():number {
        return -1;
    }

    //------------------------------------------------------------------------------------------
    public getType ():string {
        return TestGame.BLOCK_WALL;
    }

    //------------------------------------------------------------------------------------------
    public isSolid ():boolean {
        return true;
    }
}