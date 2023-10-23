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
        this.load.spritesheet("bolt2", "./assets/boltSpin2.png", {
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
            gameTimer: 14999
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

        //add a group to place randomly generated nuts & bolts in
        this.fallingObjects = [];
        this.objectList = ["nut", "bolt1", "bolt2"];
        this.falling = [100, 300, 500, 700]; //values for places that the bolts can fall, and where they stop falling
        this.objectsStopFalling = []; //each object stops falling at the appropriate x value

        //generate nuts & bolts
        for (let i=0; i<6; i++){
            let numX = this.falling[Math.floor(Math.random()*this.falling.length)]; //x value
            this.objectsStopFalling.push(this.falling[Math.floor(Math.random()*this.falling.length)]); //also set a y value for where it stops falling
            let nameObject = this.objectList[Math.floor(Math.random()*this.objectList.length)];
            // let numY = this.fallingY[Math.floor(Math.random()*this.fallingY.length)];
            this.fallingObjects.push(this.physics.add.sprite(numX, 0, nameObject).setScale(6)); //adds to list of falling objects
            this.fallingObjects[this.fallingObjects.length-1].body.setAllowGravity(true).setSize(16, 16); //i know this looks disgusting. sorry. sets size, gravity, and world bound collision
            console.log(this.fallingObjects[i]);
        }
        // this.numObjectsDown = 0; //increment whenever a new object falls
        
        this.FALL_VELOCITY = 100;

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
        });

        this.anims.create({
            key: "bolt-spin1",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("bolt1", {
                start: 0,
                end: 7
            })
        });

        this.anims.create({
            key: "bolt1-spin",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("bolt1", {
                start: 0,
                end: 7
            })
        });

        this.anims.create({
            key: "bolt2-spin",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("bolt2", {
                start: 0,
                end: 7
            })
        });
        
        playerDirection = "down";
        // this.physics.add.collider(this.nut, this.platform);

        //when time's up, you win!
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.test.WinGame();
        });
        
        //but also, spawn falling objects every 2 seconds
        this.timer = new Phaser.Time.TimerEvent({
            delay: 2,
            repeat: 6,
            loop: false,
            callback: function(){
                console.log("2 seconds have passed.");
            }
        })
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

        for (let i=0; i<this.fallingObjects.length; i++){
            let falling_animation = this.fallingObjects[i].texture.key + "-spin";
            this.fallingObjects[i].setVelocity(0, this.FALL_VELOCITY);
            this.fallingObjects[i].playReverse(falling_animation, true);
        }

        //is the object at the place where it needs to stop falling?
        for (let i=0; i<this.fallingObjects.length; i++){
            if(this.fallingObjects[i].y >= this.objectsStopFalling[i]-10 && this.fallingObjects[i].y <= this.objectsStopFalling[i]+10){
                console.log("OBJECT DESTROYED");
                // this.fallingObjects[i].destroy();
                this.fallingObjects[i].setAlpha(0);
                // this.fallingObjects.splice(i, i);
                // this.objectsStopFalling.splice(i, i);
                if((this.fallingObjects[i].y >= this.player.y-100 && this.fallingObjects[i].y <= this.player.y+100) && (this.fallingObjects[i].x >= this.player.x-100 && this.fallingObjects[i].x <= this.player.x+100)){
                    this.test.LoseGame();
                    let menuConfig = {
                        fontFamily: "Courier",
                        fontSize: "28px",
                        color: "#000000",
                        align: "right",
                        padding: {
                            top: 5,
                            bottom: 5
                        },
                        fixedWidth: 0
                    }
                    this.add.text(game.config.width/2, game.config.height/2, "GAME OVER :(", menuConfig).setOrigin(0.5);
                    game.destroy();
                }
            }
        }
    }
}