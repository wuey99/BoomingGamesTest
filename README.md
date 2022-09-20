# BoomingGamesTest

I was given permission to use my own personal hobby game framework to complete this test, on condition that
i'm the sole author of the framework.

the framework does include some external libraries (outside of PixiJS), but to the best of my knowledge they're not used by the demo game.

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
    tool I wrote in Adobe Flex (years ago) that generates a lot of temporary files.
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
                model for the 50 x 50 grid 
            PlayfieldGridView.ts
                view for the 50 x 50 grid
            PlayfieldManager.ts
                manages tile types
            PlayfieldTileModel.ts
                model for the playfield model
            PlayfieldTileView.ts

        

        it uses a quasi MVC scheme. 




