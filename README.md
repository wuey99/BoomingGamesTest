# BoomingGamesTest

I was given permission to use my own personal hobby game framework to complete this test on condition that
i'm the sole author of the framework.

the framework does include some external libraries (outside of PixiJS), but to the best of my knowledge they're not used by the game.

    "@types/howler": "2.2.1",
    "@types/matter-js": "^0.14.5",
    "fast-xml-parser": "^3.17.4",
    "he": "^1.2.0",
    "howler": "^2.2.0",
    "matter-js": "^0.14.2",
    "pako": "^2.0.4",
    "pixi-textinput-v5": "^4.0.0-beta.10",
    "pixi.js-legacy": "^5.3.3",
    "poly-decomp": "^0.3.0",
    "polygon-clipping": "^0.15.1",
    "sfs2x-api": "1.7.10"

just to be clear, i'm NOT using matter-js.  all collision code in the game were custom-coded.

link to engine on gitbub can be found at: https://github.com/wuey99/x-engine

i haven't created an npm package for this engine. for this programming test, the engine is embedded in the repository

I will provide more detail of the engine later in the document.

high-level directory structure:

engine code:
    \BoomingGamesTest\src\engine

programming test:
    \BoomingGamesTest\src\scripts

graphics:
    \BoomingGamesTest\src\assets\Cows\Project\Common

    note: there's a ton of unused and temporay files in there.  I have a custom asset management
    tool I wrote in Adobe Flex (from many years ago) that generates a lot of temporary files.
    But the following list show the actual graphics used in the demo game.

    012CFE37-4DE4-1202-4E62-B49388A43C5B-Shot.json
    4FD54215-2221-0DDE-83E9-54E879CCF38C-Block_Wall.json
    817F8B6F-E8D8-02EB-5ADC-32B7A330E70C-Arrow.json
    B239C3A6-A56C-584B-16FA-E3B3634DB48B-Block_Hay.json
    D9041538-137A-03E2-0D42-5C35F4EA3808-Tanks.json

    012CFE37-4DE4-1202-4E62-B49388A43C5B-Shot.png
    4FD54215-2221-0DDE-83E9-54E879CCF38C-Block_Wall.png
    817F8B6F-E8D8-02EB-5ADC-32B7A330E70C-Arrow.png
    B239C3A6-A56C-584B-16FA-E3B3634DB48B-Block_Hay.png
    D9041538-137A-03E2-0D42-5C35F4EA3808-Tanks.png

game classes:
    Playfield
        \src\scripts\playfield
            PlayfieldGameObject.ts
                used primarily for game objects and sprites (the tank and shots)
            PlayfieldGridModel.ts
                model for the game grid
            PlayfieldGridView.ts
                view for the game grid
            PlayfieldManager.ts
                manages tile types
            PlayfieldTileModel.ts
                model for the game tile (block)
            PlayfieldTileView.ts
                view for the game tile (block)
        
        it uses a MVC-like scheme.  it's not super-efficient.  all tiles / blocks are rendered as sprites.
        
        The classes should be self-contained and doesn't rely on any references to the game
        itself.

        the game should sub-class PlayfieldTileModel and PlayfieldTileView. these classes
        can't be instantiated directly.

        PlayfieldGridModel and PlayfieldTileModel communicate indirectly to the associated
        view classes PlayfieldGridView and PlayfieldTileView via the use of signals.
        
        there are currently 3 signals supported.  the views listen for these signals from the model
        and acts accordingly:

            tiledAddedSignal
                the view creates a new block

            tileRemovedSignal
                the view removes the block

            tileDamagedSignal
                handles damage response (i.e. flash the block, etc)

        PlayfieldTileModel has 4 methods that need to be overriden by the game's classes

            public getDefaultHealth ():number {
                return 100;
            }

            public getType ():string {
                return TestGame.BLOCK_HAY;
            }

            public isSolid ():boolean {
                return true;
            }

            public isDestructable ():boolean {
                return true;
            }

            note: isSolid currently isn't being used. i thought I needed a solid flag, but it turned out
            that both HAY and WALLS are both solid in the specification.

     Tank   
        \src\scripts\tank
            Fleet.ts
                creates the 3 tanks and manages tank switching and ensures which tank has the current focus
            Shot.ts
                bullets shot from the tank.  
            Tank.ts
                one of 3 tanks manipulated by the player.  use arrows to turn and move forward.  space bar
                to shoot a bullet.
            Cursor.ts
                I added an active tank cursor because it bugged me that it wasn't immediate what the active
                tank was.
                
            both Shot and Tank knows about the PlayfieldGridView, PlayfieldGridModel and PlayfieldTileModel.

            Motion of tanks is free-form, instead of being locked to a grid.  collision checking is done
            by checking the sprite's internal rectangle against the block's rectangle on the grid.
            


    Test
        \src\test

        PlayfieldBlockHayModel.ts
        PlayfieldBlockHayView.ts
        PlayfieldBlockWallModel.ts
        PlayfieldBlockWallView.ts
            these are the game's implementation of PlayfieldTileModel and PlayfieldTileView

        TestGame.ts
            the actual game state (or scene).  the game framework supports state (or scene) changing
            but for this game there is only one scene.

            the playfield is created here (per requirements of the programming test) and the tank
            fleet is created here as well

        TestGameController.ts
            this handles async monitoring of the loading of the game's assets.  
            it's optionally possible to go to a progress screen at this point
            or load a minimum set of graphics and lazy load the rest of the assets
            while the game is playing.
            
            when the assets are completely loaded a unified sprite sheet is created.

        TestGameInstance.ts
            the actual game instance (data shared by all the states (scenes) in the game)

    Main method:
        \src
            app.ts

            inits the game framework, sets up the main game loop.  configures and starts
            the loading of the game assets.


The hobby game framework (more details)

the game framework was originally programmed in actionscript / flash.  it was later ported
to haxe / openfl (around 2015-ish).  I finally ported it from (haxe / openfl) to typescript / pixijs 
in 2020 or so.

mainly using it for my own games and occasional freelance work

classes

    \geom
        XPoint.ts
        XRect.ts

        wrappers for PIXI.Point and PIXI.Rectangle.  I eventually want run this code server-side on smartfox
        server 2X without any framework (PixiJS) dependencies. but currently the code still relies heavily
        on PIXI.Point

    \bullet
        XBulletCollisonList.ts
        XBulletCollisionManager.ts

        classes designed to handle rectangular collision checking between two GameObjects

    \collision
        XObjectCollisionList.ts
        XObjectCollisionManager.ts

        classes designed to handle GameObject to GameObject collisions.  primarily current use-case is
        for moving platforms

    \gameobject
        XGameObject.ts
        XGameObjectCX.ts

        primary class to handle game objects.  huge monolithic monstrosity.  hoping to refactor this
        eventually to use a component-based design.

        it has factory methods for handling all manner of things: creating child game objects, managed sprite creation. managed creation of sub-threads, signals, etc, etc.  the idea is that when a GameObject
        is disposed, everything created using the factory methods are managed and auto-cleaned up.

    \level
        XLevel.ts
        XMickey.ts

        high-level classes to handle large scrolling levels

    \model
        XModelBase.ts

        intended to be a base-class for all models (i.e. handle signals/slots, etc)

    \pool
        XClassPoolManager.ts
        XObjectPoolManager.ts
        XSubObjectPoolManager.ts

        object-pooling classes.  this was critical for AS3 because of the performance issues related to class 
        instantiation.  Not sure how important is is for modern javascript.  but i ported it over (first to haxe and then to typescript)

    \process
        XProcess.ts
        XProcessManager.ts
        XProcessManager.ts

        classes designed to support "multi-threaded" code using javascript es6 generators

        I used them in the prgrammer test.  it's still buggy!  hopefully the game will be stable

        an example is the tank shooting bullets code

            this.script.addProcess (
                function * () {
                    var i:number;

                    self.m_firing = true;

                    for (i = 0; i < self.m_bullets; i++) {
                        var __shot:Shot = self.m_playfieldGridView.addGameObjectAsDetachedChild (Shot, 0, 0.0, false) as Shot;
                        __shot.afterSetup ([self.m_playfieldGridView, self.angle, 14.0, self.m_damage]);

                        __shot.x = self.x;
                        __shot.y = self.y;

                        yield [XProcess.WAIT1000, 0.125 * 1000];
                    }

                    self.m_firing = false;
                }
            );	

            so it shoots "m_bullets" spaced every 1/8th of a second.  this is a standard pattern I used previously
            and I prefer it over state-based logic.

        \resource
            classes designed to handle asset management, resource loading, etc

        \sfs
            experimental.  Smartfox Server 2X bindings.  my plan is to eventually do multiplayer game.
            hopefully I can transpile typescript code into javascript es5 and run it on the back-end using
            java's javascript nashorn interpreter

        \signals
            a simple signals and slots implementation.  i'm currently using it in the programmer test
            to signal grid changes to the view

        \sound
            wrapper classes for HowlerJS.  added support for priority, interruption and chaining sounds

        \state
            misnamed.  it's really scene management classes.  I have one game state in the programmer's test,
            "TestGame"  but if I wanted to add a game over or results state, it's easy to add in

        \task
            a quasi "multi-threaded" system that I implemented in AS3, that uses op-codes and function callbacks.
            my hope is that \process will eventually replace it.  the programmer test uses mostly \process now
            (at the risk of introducing bugs)

        \texture
            texture management code.  i don't use pre-made spritesheets.  prefer to create them dynamically.
            (even though the creation process is argubablly slower)  this allows me to dynamically create sprite sheets from svg's.  Makes use of "MaxRectPacker", something originally implemented by Jukka Jylänki
            and ported to various languages.  
        
        \sprites
            various sprites and container classes.  

        \ui
            still a work-in-progress.  various ui classes (buttons, hbox, vbox layouts, etc) that can be 
            declaratively defined as xml

        \utils
            various utility classes

        \xmap
            classes that support large scrolling levels.  I didn't use it for the programmer tests
            because the tile sixe is fixed at 64 x 64.

        \xml
            xml wrapper classes.

Here are the classes (I think) i'm using for the programmer's test

    \gameobject (GameObjects)
    \signals (Signals and Slots, primarily used for MVC state change signalling)
    \texture (for dynamic sprite sheet generation)
    \state (for state/scene management)
    \process (for animation and game logic handling)