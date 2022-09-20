//------------------------------------------------------------------------------------------
import { PlayfieldTileModel } from '../playfield/PlayfieldTileModel';
import { TestGame } from './TestGame';

//------------------------------------------------------------------------------------------
export class PlayfieldBlockHayModel extends PlayfieldTileModel {

    //------------------------------------------------------------------------------------------
    public getDefaultHealth ():number {
        return 100;
    }

    //------------------------------------------------------------------------------------------
    public getType ():string {
        return TestGame.BLOCK_HAY;
    }

    //------------------------------------------------------------------------------------------
    public isSolid ():boolean {
        return true;
    }

    //------------------------------------------------------------------------------------------
    public isDestructable ():boolean {
        return true;
    }
}