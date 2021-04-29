class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('well', './assets/well.png');
        this.load.image('player', './assets/Asteriod(Round).png');
    }

    create() {

        // variables and settings
        this.JUMP_VELOCITY = 200;
        this.ACCELERATION = 200;
        this.DRAG = 200;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 200;

        this.jumped = false;
        this.apex = false;
        this.moveSpeed = fallspeed; //pixels per frame

        //place well background
        this.well = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'well').setOrigin(0, 0);

        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - 480, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        cursors = this.input.keyboard.createCursorKeys();

        this.alien = this.physics.add.sprite(240, game.config.height - 550, 'platformer_atlas', 'side').setScale(SCALE);
        this.alien.setCollideWorldBounds(true);
        this.alien.setMaxVelocity(100, 1000000);

        this.physics.add.collider(this.alien, this.ground);




        //define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {


         // check keyboard input
         if(cursors.left.isDown) {
            this.alien.body.setAccelerationX(-this.ACCELERATION);
            this.alien.setFlip(true, false);
            // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
            // play(key [, ignoreIfPlaying] [, startFrame])
        } else if(cursors.right.isDown) {
            this.alien.body.setAccelerationX(this.ACCELERATION);
            this.alien.resetFlip();
        } else {
            // set acceleration to 0 so DRAG will take over
            this.alien.body.setAccelerationX(0);
            this.alien.body.setDragX(this.DRAG);
        }

        /*if(this.alien.body.touching.down && Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.alien.body.velocity.y = this.JUMP_VELOCITY;
        } else {
            this.alien.body.setMaxSpeed(100);
        }
        
        console.log(this.alien.velocity)
        */
        

        if (!this.jumped && !this.apex) {
            this.well.tilePositionY += this.moveSpeed;
        } else if (this.jumped && !this.apex) {
            this.well.tilePositionY += this.moveSpeed;
            this.moveSpeed -= (fallspeed / 10);
            console.log (this.moveSpeed);
            if (this.moveSpeed < (fallspeed * -1.5)) {
                this.apex = true;
            }
        }

        if (this.apex) {
            this.well.tilePositionY += this.moveSpeed;
            if (this.moveSpeed < fallspeed) {
                this.moveSpeed += (fallspeed / 10);
            } else {
                this.jumped = false;
                this.apex = false;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.jumped = true;
        }
        //this.well.tilePositionY += this.alien.body.velocity.y / 10;
    }
}