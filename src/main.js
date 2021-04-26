// game configureation
let config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 640,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let starSpeed = 4;

//reserve keyboard bindings
let keySPACE, keyR, keyLEFT, keyRIGHT;