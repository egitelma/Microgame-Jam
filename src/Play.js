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

        //load warning images
        this.load.spritesheet("warning", "./assets/warning.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        //load audio
        this.load.audio("background_music", "./assets/ominous_ode_v2.wav");

        //load controller
        this.load.script("microgamejamcontroller", "./src/microgamejamcontroller.js");
        this.load.image("tiles", "./assets/tiles.png");
    }

    create() {
        //game settings
        game.settings = {
            gameTimer: 14999
        }

        this.test = MicrogameJamController(1, 3, false); 
        this.test.SetMaxTimer(15);

        this.grid = [
            [ 0, 1, 2, 3],
            [ 4, 5, 6, 7],
            [ 8, 9,10,11],
            [12,13,14,15],
        ];
        let map = this.make.tilemap({data: this.grid, tileWidth: 16, tileHeight: 16});
        let tiles = map.addTilesetImage("tiles");
        let layer = map.createLayer(0, tiles, 0, 0);
        layer.setScale(6.25);
        layer.setAlpha(0.45);

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
        this.player = this.physics.add.sprite(100, 100, "character", 1).setScale(3);
        this.player.body.setCollideWorldBounds(true).setSize(16, 16);
        this.PLAYER_VELOCITY = 350;

        //add a group to place randomly generated nuts & bolts in
        this.fallingObjects = [];
        this.objectList = ["nut", "bolt1", "bolt2"];
        this.falling = [50, 150, 250, 350]; //values for places that the bolts can fall, and where they stop falling
        this.objectsStopFalling = []; //each object stops falling at the appropriate x value
        this.warningFlash = [];

        //generate nuts & bolts
        // for (let i=0; i<12; i++){
        //     let numX = this.falling[Math.floor(Math.random()*this.falling.length)]; //x value
        //     let numY = -100 * i;
        //     this.objectsStopFalling.push(this.falling[Math.floor(Math.random()*this.falling.length)]); //also set a y value for where it stops falling
        //     let nameObject = this.objectList[Math.floor(Math.random()*this.objectList.length)]; //nut, bolt1, bolt2?
            
        //     this.fallingObjects.push(this.physics.add.sprite(numX, numY, nameObject).setScale(3)); //adds to list of falling objects
        //     this.fallingObjects[this.fallingObjects.length-1].body.setAllowGravity(true).setSize(16, 16); //i know this looks disgusting. sorry. sets size, gravity, and world bound collision
        // }
        // this.numObjectsDown = 0; //increment whenever a new object falls
        
        this.FALL_VELOCITY = 100;

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

        this.anims.create({
            key: "warning-flash",
            frameRate: 2,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("warning", {
                start: 0,
                end: 1
            })
        })
        
        playerDirection = "down";
        // this.physics.add.collider(this.nut, this.platform);

        this.menuConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#FFFFFF",
            color: "#000000",
            align: "right",
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }

        //when time's up, you win!
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.test.WinGame();
            this.add.text(game.config.width/2, game.config.height/2, "YOU WIN! :)", this.menuConfig).setOrigin(0.5);
            game.destroy();
        });

        this.timeLeft = 15;
        this.text = this.add.text(15, game.config.height-32, this.timeLeft, this.menuConfig);
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
            },
            loop: true
        });

        this.timerFall = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.dropItem = true;
            },
            loop: true
        });
    }

    update() {
        if(this.dropItem) {
            this.dropItem = false;
            let numX = this.falling[Math.floor(Math.random()*this.falling.length)]; //x value
            let numY = -200;
            let yToFall = this.falling[Math.floor(Math.random()*this.falling.length)];
            this.objectsStopFalling.push(yToFall); //also set a y value for where it stops falling
            let nameObject = this.objectList[Math.floor(Math.random()*this.objectList.length)]; //nut, bolt1, bolt2?
            
            this.fallingObjects.push(this.physics.add.sprite(numX, numY, nameObject).setScale(3)); //adds to list of falling objects
            this.fallingObjects[this.fallingObjects.length-1].body.setAllowGravity(true).setSize(16, 16); //i know this looks disgusting. sorry. sets size, gravity, and world bound collision

            //add warning at spot where it's gonna fall
            this.warningFlash.push(this.add.sprite(numX, yToFall, "warning").setScale(6));
        }
        this.text.destroy();
        this.text = this.add.text(15, game.config.height-32, this.timeLeft, this.menuConfig);

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

        //player movement walking
        playerVector.normalize();
        this.player.setVelocity(this.PLAYER_VELOCITY * playerVector.x, this.PLAYER_VELOCITY * playerVector.y);
        let playerMovement;
        playerVector.length() ? playerMovement = "walk" : playerMovement = "idle" //idle or walk animation?
        this.player.play(playerMovement + "-" + playerDirection, true); //plays animation

        //play animation for all falling objects and warning flashes
        for (let i=0; i<this.fallingObjects.length; i++){
            let falling_animation = this.fallingObjects[i].texture.key + "-spin";
            this.fallingObjects[i].setVelocity(0, this.FALL_VELOCITY);
            this.fallingObjects[i].playReverse(falling_animation, true);
            this.warningFlash[i].play("warning-flash", true);
        }

        //is the object at the place where it needs to stop falling?
        let row, col;
        for (let i=0; i<this.fallingObjects.length; i++){
            if(this.fallingObjects[i].y >= this.objectsStopFalling[i]-5 && this.fallingObjects[i].y <= this.objectsStopFalling[i]+5){
                //destroy (make invisible) object when it hits the ground (and warning)
                this.fallingObjects[i].setAlpha(0);
                this.warningFlash[i].setAlpha(0);

                //check if player in range
                if((this.fallingObjects[i].y >= this.player.y-30 && this.fallingObjects[i].y <= this.player.y+30) && (this.fallingObjects[i].x >= this.player.x-30 && this.fallingObjects[i].x <= this.player.x+30)){
                    this.test.LoseGame();
                    this.add.text(game.config.width/2, game.config.height/2, "GAME OVER. YOU LOSE :(", this.menuConfig).setOrigin(0.5);
                    game.destroy();
                }
            }
        }
    }
}