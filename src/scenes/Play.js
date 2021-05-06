class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('well', './assets/well.png');
        this.load.image('player', './assets/Asteriod(Round).png');
        /*  Load sprite atlas. Kendrick's note: currently dont have dedicated load scene, not sure how u wanna handle
            scenes but we may want to create a separate load.js if we use dif scenes for tutorial(well)/game(cave)
        */
        this.load.atlas('sprite_atlas', './assets/sprite_atlas.png', './assets/sprites.json');
        this.load.audio('bgm_01', './assets/Falling.wav');
    }

    create() {

        // variables and settings
        this.JUMP_VELOCITY = 200;
        this.ACCELERATION = 200;
        this.DRAG = 200;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 200;
        
        this.death_flag = false;
        this.jumped = false;
        this.apex = false;
        this.moveSpeed = fallspeed; //pixels per frame

        this.fall_distance = 0;

        //place well background
        this.well = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'well').setOrigin(0, 0);

        //add music and play
        this.bgMusic = this.sound.add('bgm_01', {volume: 0.25});
        this.bgMusic.loop = true;
        this.bgMusic.play();

        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - 480, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        cursors = this.input.keyboard.createCursorKeys();
        
        /* create player and declare sprite */
        this.guy = this.physics.add.sprite(240, game.config.height - 512, 'sprite_atlas', 'fall01').setScale();
        this.guy.setCollideWorldBounds(true);
        this.guy.setMaxVelocity(100, 1000000);
        this.guy.setSize(30, 60, true);
        this.physics.add.collider(this.guy, this.ground);

        //Set up Animations - note: 'fall' is the "idle" animation
        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNames('sprite_atlas', {
                prefix: 'fall',
                start: 0,
                end: 2,
                suffix: '',
                zeroPad: 2
            }),
            frameRate: 4,
            repeat: -1
        });
        
        //jump anim, current issue: only one frame plays due to slow initial anim cycle
        this.anims.create({
            key: 'jump',
            defaultTextureKey: 'sprite_atlas',
            frames: [
                { frame: 'jump01' }, { frame: 'jump02' }
            ],
            frameRate: 12
        });

        //begin playing fall animation because it is constant except when jumping
        this.guy.anims.play('fall');

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

        this.spawn();

        this.branchGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

        //play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        this.fallRight = this.add.text(game.config.width - borderUISize - borderPadding - 120, borderUISize + borderPadding*2, this.fall_distance + "m", scoreConfig);
    }

    addBranch() {
        let invert =  Phaser.Math.Between(0, 1);
        let branch = new Branch(this, invert);
        branch.setSize(130, 5, true);
        this.physics.add.collider(this.guy, branch);
        this.branchGroup.add(branch);
    }

    spawn() {
        let delay = Phaser.Math.Between(600,1000)
        this.time.delayedCall(delay, () => { 
            this.addBranch(); 
            this.spawn();
        });
    }

    update() {


        this.fall_distance = Math.trunc(8 * this.clock.getElapsedSeconds() + this.moveSpeed);

        this.fallRight.text = this.fall_distance + "m";

         // check keyboard input
         if(cursors.left.isDown) {
            this.guy.body.setAccelerationX(-this.ACCELERATION);
            // see: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Animation.html#play__anchor
            // play(key [, ignoreIfPlaying] [, startFrame])
            this.guy.resetFlip();
        } else if(cursors.right.isDown) {
            this.guy.body.setAccelerationX(this.ACCELERATION);

            this.guy.setFlip(true, false);
        } else {
            // set acceleration to 0 so DRAG will take over
            this.guy.body.setAccelerationX(0);
            this.guy.body.setDragX(this.DRAG);
        }
            
        if (!this.jumped && !this.apex) {
            this.well.tilePositionY += this.moveSpeed;
            // this.branch01.setVelocityY(-this.moveSpeed * 60);       //branch velocity updated every frame
        } else if (this.jumped && !this.apex) {
                                       //jump anim
            this.well.tilePositionY += this.moveSpeed;
            this.moveSpeed -= (fallspeed / 10);
            // this.branch01.setVelocityY(-this.moveSpeed * 60);
            //console.log (this.moveSpeed);
            if (this.moveSpeed < (fallspeed * -1.5)) {
                this.apex = true;
            }
        }

        if (this.apex) {
            this.well.tilePositionY += this.moveSpeed;
            if (this.moveSpeed < fallspeed) {
                this.moveSpeed += (fallspeed / 10);
                // this.branch01.setVelocityY(-this.moveSpeed * 60);
            } else {
                this.jumped = false;
                this.apex = false;
            }
            this.guy.anims.play('fall');                    //resume idle fall anim
        }

        if (cursors.space.isDown) {
            this.guy.anims.play('jump'); 
            this.jumped = true;
        }
        if (!this.death_flag) {
            this.physics.overlap(this.guy, this.branchGroup, this.death, null, this);
        }

    }

    death() {
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
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'dead', scoreConfig).setOrigin(0.5);
        this.death_flag = true;

    }
}