class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        //load up placeholder spritesheet
        this.load.spritesheet("character", "./assets/Placeholder.png", {
            frameWidth: 48,
            frameHeight: 48
        });

        //load up nut spritesheet
        this.load.spritesheet("nut", "./assets/nutSpin.png", {
            frameWidth: 32,
            frameHeight: 32
        });

    }

    create() {
        this.cameras.main.setBackgroundColor("0x282247");

        //set player sprite as a physics body
        this.player = this.physics.add.sprite(48, 48, "character", 1).setScale(2);
        this.player.body.setCollideWorldBounds(true).setSize(32, 32).setOffset(8, 16);
        this.PLAYER_VELOCITY = 350;

        //set nut sprite as a physics body
        this.nut = this.physics.add.sprite(400, 48, "nut", 1).setScale(2);
        this.nut.body.setAllowGravity(true).setSize(32, 32).setCollideWorldBounds(true);
        this.NUT_VELOCITY = 100;

        //inivisible platform?
        this.platform = this.physics.add.sprite(400, 400, "nut", 1).setScale(2);
        this.nut.body.

        //set variable for to bind up, down, left, right
        cursors = this.input.keyboard.createCursorKeys();

        //animations - four directions for idle 
        this.anims.create({
            key: "idle-down",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 1,
                end: 1
            })
        });

        this.anims.create({
            key: "idle-up",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 10,
                end: 10
            })
        });

        this.anims.create({
            key: "idle-left",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 4,
                end: 4
            })
        });

        this.anims.create({
            key: "idle-right",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 7,
                end: 7
            })
        });

        this.anims.create({
            key: "walk-down",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 0,
                end: 2
            })
        });

        this.anims.create({
            key: "walk-up",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 9,
                end: 11
            })
        });

        this.anims.create({
            key: "walk-left",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 3,
                end: 5
            })
        });

        this.anims.create({
            key: "walk-right",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 6,
                end: 8
            })
        });

        //falling objects animations
        this.anims.create({
            key: "nut-spin",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("nut", {
                start: 0,
                end: 5
            })
        });
        
        playerDirection = "down";
    }

    update() {
        let playerVector = new Phaser.Math.Vector2(0, 0);

        if(cursors.left.isDown) {
            playerVector.x = -1;
            playerDirection = "left";
        }
        else if(cursors.right.isDown) {
            playerVector.x = 1;
            playerDirection = "right";
        }
        if(cursors.up.isDown) {
            playerVector.y = -1;
            playerDirection = "up";
        }
        else if(cursors.down.isDown) {
            playerVector.y = 1;
            playerDirection = "down";
        }

        playerVector.normalize();
        this.player.setVelocity(this.PLAYER_VELOCITY * playerVector.x, this.PLAYER_VELOCITY * playerVector.y);

        let playerMovement;
        playerVector.length() ? playerMovement = "walk" : playerMovement = "idle" //idle or walk animation?
        this.player.play(playerMovement + "-" + playerDirection, true); //plays animation

        this.nut.setVelocity(0, this.NUT_VELOCITY);
        this.nut.play("nut-spin", true);
    }
}