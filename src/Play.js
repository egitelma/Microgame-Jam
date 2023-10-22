class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        //load up robot spritesheet
        this.load.spritesheet("character", "./assets/buddy.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        //load up falling object spritesheets
        this.load.spritesheet("nut", "./assets/nutSpin.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("bolt1", "./assets/boltSpin1.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        //load audio
        this.load.audio("background_music", "./assets/ominous_ode_v2.wav");

        //load controller
        this.load.script("microgamejamcontroller", "./src/microgamejamcontroller.js");
        this.load.image("grid", "./assets/blah.png");
    }

    create() {
        //game settings
        game.settings = {
            gameTime: 15000
        }

        this.test = MicrogameJamController(1, 3, false); 
        this.test.SetMaxTimer(15);


        const Grid = this.add.grid(400, 400, 800, 800, 200, 200, 0x8453b5);

        this.cameras.main.setBackgroundColor("0x282247");

        //add music
        this.backgroundMusic = this.sound.add("background_music", {
            mute: false,
            volume: 0.5,
            rate: 1,
            loop: true
        });

        this.backgroundMusic.play();

        //set player sprite as a physics body
        this.player = this.physics.add.sprite(32, 32, "character", 1).setScale(3);
        this.player.body.setCollideWorldBounds(true).setSize(16, 16);
        this.PLAYER_VELOCITY = 350;

        //set nut sprite as a physics body
        this.nut = this.physics.add.sprite(400, 48, "nut", 1).setScale(3);
        this.nut.body.setAllowGravity(true).setSize(16, 16).setCollideWorldBounds(true);
        this.NUT_VELOCITY = 100;

        //inivisible platform?
        this.platform = this.physics.add.sprite(400, 400, "nut", 1).setScale(3);
        this.platform.body.setImmovable(true);

        //set variable for to bind up, down, left, right
        cursors = this.input.keyboard.createCursorKeys();

        //animations - four directions for idle 
        this.anims.create({
            key: "idle-down",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 0,
                end: 0
            })
        });

        this.anims.create({
            key: "idle-up",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 2,
                end: 2
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
                start: 6,
                end: 6
            })
        });

        this.anims.create({
            key: "walk-down",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 0,
                end: 1
            })
        });

        this.anims.create({
            key: "walk-up",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 2,
                end: 3
            })
        });

        this.anims.create({
            key: "walk-left",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 4,
                end: 5
            })
        });

        this.anims.create({
            key: "walk-right",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("character", {
                start: 6,
                end: 7
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

        this.anims.create({
            key: "nut-stop",
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("nut", {
                start: 0,
                end: 0
            })
        })
        
        playerDirection = "down";
        this.physics.add.collider(this.nut, this.platform);
        this.nutAnimation = "nut-spin";

        //when time's up, you win!
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.test.WinGame();});
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
        this.nut.playReverse(this.nutAnimation, true);
        this.physics.collide(this.nut, this.platform, ()=>{
            console.log("HELLO!!!");
            this.nut.play("nut-stop", true);
            this.nut.texture="./assets/blacksquare.png";
        });
    }
}