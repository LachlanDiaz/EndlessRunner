class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_selected', './assets/Selected');
        this.load.image('credits', './assets/Credits.png');
      }

    create() {
        let menuConfig = {
            fontFamily: 'font1',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }



        this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'credits').setOrigin(0, 0);

        cursors = this.input.keyboard.createCursorKeys();

        //define keys 
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('sfx_selected', {volume: 0.5});
            this.scene.start('menuScene');
        }
    }
}