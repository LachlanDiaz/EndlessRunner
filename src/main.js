/*
Technically Interesting:
For something technical we did, was that we implemented a full menu
navigation into the main menu and game over screens. We also created
our own physics of branch and player movement for the jump, which was
a bit difficult (and still a bit wonky). We also made a tutorial that
pauses the current scene and manages multiple scenes at once. Text 
bubbles were also implemenmted. 

Visual Style:
We are very pround of our visual style, particualrly due to the fact 
that we have two different levels depending on if the player is
playing the tutorial or not. The music is bumpin too.
*/



// game configureation
let config = {
    parent: 'myGame',
    type: Phaser.CANVAS,
    width: 480,
    height: 640,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Menu, Play, Pause, Pause2, Play2, Credits, GameOver]
};

let game = new Phaser.Game(config);

let cursors;
let score;
let fallspeed = 4;
const tileSize = 20;
const SCALE = 0.5;







//reserve keyboard bindings
let keySPACE, keyR, keyLEFT, keyRIGHT;