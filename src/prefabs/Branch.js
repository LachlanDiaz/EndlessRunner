class Branch extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, invert, frame) {
        super(scene, (invert === 0) ? 400 : 80,  game.config.height + 500, 'sprite_atlas', 'branch01').setScale(), frame;

        this.jumped = false;
        this.apex = false;
        this.moveSpeed = fallspeed; //pixels per frame
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
        this.body.allowGravity = false;
        this.setVelocityY(-this.moveSpeed * 60);
        this.setMaxVelocity(0, 1000000);
         if (invert === 1) {
            this.setFlip(true, false);
         }
    }




    update() {

        if (!this.jumped && !this.apex) {
            this.setVelocityY(-this.moveSpeed * 60);       //branch velocity updated every frame
        } else if (this.jumped && !this.apex) {
            this.moveSpeed -= (fallspeed / 10);
            this.setVelocityY(-this.moveSpeed * 60);
            if (this.moveSpeed < (fallspeed * -1.5)) {
                this.apex = true;
            }
        }

        if (this.apex) {
            if (this.moveSpeed < fallspeed) {
                this.moveSpeed += (fallspeed / 10);
                this.setVelocityY(-this.moveSpeed * 60);
            } else {
                this.jumped = false;
                this.apex = false;
            }
        }

        if (cursors.space.isDown & !this.jumped) {
            this.jumped = true;
            Phaser.Input.Keyboard.JustDown(cursors.up)
        }

        // destroy branch if it reaches the top of the screen
        if(this.y < -10) {
            this.destroy();
        }
    }
}