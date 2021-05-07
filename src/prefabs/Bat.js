class Bat extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        super(scene, Phaser.Math.Between(180, 300), game.config.height + 500);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
        this.body.allowGravity = false;
        this.setVelocityY(-velocity * 60);
        this.setVelocityX(2 * 60);
    }

    update() {
        if (this.x >= game.config.width - 40) {
            this.setVelocityX(-2 * 60);
            this.resetFlip();
        } else if (this.x <= 40) {
            this.setVelocityX(2 * 60);
            this.setFlip(true, false);
        }

        // destroy bat if it reaches the top of the screen
        if(this.y < 0) {
            this.destroy();
        }
    }
}