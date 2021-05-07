class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.image('main_menu', './assets/main_menu.png');
        this.load.image('pointer', './assets/pointer.png');
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



        this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'main_menu').setOrigin(0, 0);

        cursors = this.input.keyboard.createCursorKeys();

        this.menu_option = 1;

        this.add_pointer();

        //show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'FALLER 0.1', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press (space) to play', menuConfig).setOrigin(0.5);

        //define keys 
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            // easy mode
            game.settings = {
            spaceshipSpeed: 3,
            gameTimer: Infinity    
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }


        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.pointer.destroy();
            this.menu_option--;
            if (this.menu_option > 3) {
                this.menu_option = 1;
            } else if (this.menu_option < 1) {
                this.menu_option = 3;
            }
            this.sound.play('sfx_select');
            this.add_pointer();
        } else if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.pointer.destroy();
            this.menu_option++;
            if (this.menu_option > 3) {
                this.menu_option = 1;
            } else if (this.menu_option < 1) {
                this.menu_option = 3;
            }
            this.sound.play('sfx_select');
            this.add_pointer();
        }
    }
    add_pointer() {
        if (this.menu_option == 1) {
            this.pointer = this.add.image(80, 290, 'pointer');

        } else if (this.menu_option == 2) {
            this.pointer = this.add.image(80, 378, 'pointer');
        } else if (this.menu_option == 3) {
           this.pointer = this.add.image(100, 500, 'pointer');
        }
    }
}