class Play2 extends Phaser.Scene {
    constructor() {
        super("playScene2");
    }

    preload() {
        this.load.image('cave', './assets/bg_02.png');
        this.load.image('splat', './assets/splat.png');
        this.load.image('block', './assets/block.png');
        this.load.image('border', './assets/Border.png');
        this.load.image('text_border', './assets/TextBorder.png');
        /*  Load sprite atlas  */
        this.load.atlas('sprite_atlas', './assets/sprite_atlas.png', './assets/sprites.json');
        this.load.audio('bgm_02', './assets/Cave.wav');
        this.load.audio('flap', './assets/Flap.wav');
        this.load.audio('death_sound', './assets/Collisionbreak.wav');

    }

    create() {

        // variables and settings
        this.JUMP_VELOCITY = 200;
        this.ACCELERATION = 200;
        this.DRAG = 200;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 100

        this.death_flag = false;
        this.jumped = false;
        this.apex = false;
        this.moveSpeed = fallspeed; //pixels per frame

        this.fall_distance = 0;

        //place cave background
        this.cave = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cave').setOrigin(0, 0);

        this.add.image(game.config.width/2, 40, 'border').setScale(0.5);

        //add music and play
        this.bgMusic = this.sound.add('bgm_02', {volume: 0.25});
        this.bgMusic.loop = true;
        this.bgMusic.play();


        this.flap = this.sound.add('flap', {volume: 0.25});

        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - 480, 'block').setScale(1).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = 0; i < game.config.height; i += tileSize) {
            let groundTile = this.physics.add.sprite(10, i, 'block').setScale(1).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = 0; i < game.config.height; i += tileSize) {
            let groundTile = this.physics.add.sprite(game.config.width - 22, i, 'block').setScale(1).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        cursors = this.input.keyboard.createCursorKeys();
        
        /* create player and declare sprite */
        this.guy = this.physics.add.sprite(240, -40, 'sprite_atlas', 'fall01').setScale();
        //this.guy.setCollideWorldBounds(true);
        this.guy.setMaxVelocity(100, 1000000);
        this.guy.setSize(30, 60, true);
        this.physics.add.collider(this.guy, this.ground);

        //Set up Animations - note: 'fall' is the "idle" animation
        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNames('sprite_atlas', {
                prefix: 'fall',
                start: 1,
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

        // BAT ANIM CODE HERE
        this.anims.create({
            key: 'bat',
            defaultTextureKey: 'sprite_atlas',
            frames: [
                { frame: 'bat01' }, { frame: 'bat02' }, { frame: 'bat03' }, { frame: 'bat02' }
            ],
            frameRate: 15,
            repeat: -1
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
            fontFamily: 'font1',
            fontSize: '28px',
            //backgroundColor: '#b56612',
            color: '#843605',
            align: 'left',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }

        // GAME OVER flag
        this.gameOver = false;

        this.spawnBranch();

        this.spawnBat();

        this.branchGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });


        this.batGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });

        //play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ??? for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        this.fallRight = this.add.text(game.config.width/2 - 60, 20, this.fall_distance + "m", scoreConfig);

    }

    addBranch() {
        let invert = Phaser.Math.Between(0, 1);
        let branch = new glowBranch(this, invert);
        branch.setSize(130, 5, true);
        this.branchGroup.add(branch);
    }

    addBat() {
        let velocity = Phaser.Math.Between(2, 5);
        let bat = new Bat(this, velocity);
        bat.anims.play('bat');
        bat.setScale(0.5)
        bat.setOffset(40, 15);
        bat.body.setCircle(bat.width/5), 5;

        this.batGroup.add(bat);
    }

    spawnBranch() {
        let delay = Phaser.Math.Between(600,1000)
        this.time.delayedCall(delay, () => { 
            this.addBranch();
            this.spawnBranch();

        });
    }

    spawnBat() {
        let delay = Phaser.Math.Between(1000, 5000)
        this.time.delayedCall(delay, () => { 
            this.addBat(); 
            this.spawnBat();
        });
    }



    update() {

        if (!this.death_flag) {

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
                this.cave.tilePositionY += this.moveSpeed;
                // this.branch01.setVelocityY(-this.moveSpeed * 60);       //branch velocity updated every frame
            } else if (this.jumped && !this.apex) {
                                            //jump anim
                this.cave.tilePositionY += this.moveSpeed;
                this.moveSpeed -= (fallspeed / 10);
                // this.branch01.setVelocityY(-this.moveSpeed * 60);
                //console.log (this.moveSpeed);
                if (this.moveSpeed < (fallspeed * -1.5)) {
                    this.apex = true;
                }
            }

            if (this.apex) {
                this.cave.tilePositionY += this.moveSpeed;
                if (this.moveSpeed < fallspeed) {
                    this.moveSpeed += (fallspeed / 10);
                    // this.branch01.setVelocityY(-this.moveSpeed * 60);
                } else {
                    this.jumped = false;
                    this.apex = false;
                }
                this.guy.anims.play('fall');                    //resume idle fall anim
            }

            if (cursors.space.isDown && !this.jumped) {
                this.flap.play();
                this.guy.anims.play('jump'); 
                this.jumped = true;
            }

            if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.flap.play();
            }

            if (!this.death_flag) {
                this.physics.overlap(this.guy, this.branchGroup, this.death, null, this);
                this.physics.overlap(this.guy, this.batGroup, this.death, null, this);
            }

        }
        else {
            this.cave.tilePositionY += fallspeed;
        }
    }

    death() {
        let scoreConfig = {
            fontFamily: 'font1',
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

        this.sound.play('death_sound', { volume: 0.25 }); // play death sound
        // add tween to fade out audio
        this.tweens.add({
            targets: this.bgMusic,
            volume: 0,
            ease: 'Linear',
            duration: 2000,
        });


        // create particle explosion
        let deathParticleManager = this.add.particles('splat');
        let deathEmitter = deathParticleManager.createEmitter({


            x: this.guy.x,
            y: this.guy.y,
            alpha: { start: 1, end: 0 },
            scale: { start: 1.75, end: 0 },
            speed: { min: -150, max: 150 },
            lifespan: 1000,
            gravityY: -800,
            blendMode: 'COLOR_BURN'
        });

        deathEmitter.explode(300);

        this.death_flag = true;

        this.guy.destroy();

        score = this.fall_distance;

        this.time.delayedCall(2000, () => { this.scene.start('gameOverScene'); });
    }
}
