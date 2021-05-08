class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_selecting', './assets/Selecting.wav');
        this.load.audio('sfx_selected', './assets/Selected.wav');
        this.load.audio('jingle', './assets/Game_over.wav');
        this.load.image('game_over', './assets/Game_Over_screen.png');
        this.load.image('pointer', './assets/pointer.png');
      }

    create() {
        let menuConfig = {
            fontFamily: 'font1',
            fontSize: '24px',
            color: '#b30e0e',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }



        this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'game_over').setOrigin(0, 0);

        cursors = this.input.keyboard.createCursorKeys();

        this.menu_option = 1;

        this.add_pointer();

        this.tutorial = false;

        //define keys 
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.message = this.add.text(320, 443, score + "m", menuConfig);

        this.sound.play('jingle', { volume: 0.5 });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
              this.selection();
        }


        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.pointer.destroy();
            this.menu_option--;
            if (this.menu_option > 3) {
                this.menu_option = 1;
            } else if (this.menu_option < 1) {
                this.menu_option = 3;
            }
            this.sound.play('sfx_selecting', { volume: 0.25 });
            this.add_pointer();
        } else if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            this.pointer.destroy();
            this.menu_option++;
            if (this.menu_option > 3) {
                this.menu_option = 1;
            } else if (this.menu_option < 1) {
                this.menu_option = 3;
            }
            this.sound.play('sfx_selecting', { volume: 0.25 });
            this.add_pointer();
        }
    }
    add_pointer() {
        if (this.menu_option == 1) {
            this.pointer = this.add.image(160, 285, 'pointer');
        } else if (this.menu_option == 2) {
            this.pointer = this.add.image(150, 343, 'pointer');
        } else if (this.menu_option == 3) {
           this.pointer = this.add.image(175, 400, 'pointer');
        }
    }

    selection() {
        if (this.menu_option == 1) {
            game.settings = {
                gameTimer: Infinity    
            }
            this.sound.play('sfx_selected', { volume: 0.25 });
            this.scene.start('playScene2');
        } else if (this.menu_option == 2) {
            this.sound.play('sfx_selected', { volume: 0.25 });
            this.scene.start('menuScene');
        } else if (this.menu_option == 3) {
            this.sound.play('sfx_selected', { volume: 0.25 });
            this.scene.start('creditsScene');
        }
    }
}