// game configureation
let config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Menu, Play]
};

let game = new Phaser.Game(config);

let cursors;
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let fallspeed = 4;
const tileSize = 20;
const SCALE = 0.5;







//reserve keyboard bindings
let keySPACE, keyR, keyLEFT, keyRIGHT;