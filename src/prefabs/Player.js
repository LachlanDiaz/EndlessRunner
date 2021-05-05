//Player prefab
class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add object to existing scene
        scene.add.existing(this);
        this.jumped = false;
        this.apex = false;
        this.moveSpeed = 2; //pixels per frame
    }

    update() {

        if (!this.jumped && !this.apex) {
            this.y += this.moveSpeed;
        } else if (this.jumped && !this.apex) {
            this.y += this.moveSpeed;
            this.moveSpeed -= .2;
            console.log (this.moveSpeed);
            if (this.moveSpeed < -3) {
                this.apex = true;
            }
        }

        if (this.apex) {
            this.y += this.moveSpeed;
            if (this.moveSpeed < 2) {
                this.moveSpeed += .2;
            } else {
                this.jumped = false;
                this.apex = false;
            }
        }

        //left/right movement
        if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed
        }

        //if(cursors.space.isDown) {
            //Phaser.Input.Keyboard.JustDown(cursors.up)
            this.jumped = true;
        //}
    }
}