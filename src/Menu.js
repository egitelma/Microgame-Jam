class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload() {
        //this would be where we load audio
    }

    create() {
        //set background color
        this.cameras.main.setBackgroundColor("0x282247");

        //menu config - for font styling!
        let menuConfig = {
            fontFamily: "Courier New",
            fontSize: "20px",
            color: "#FFFFFF",
            align: "right",
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }

        //show menu text
        this.add.text(game.config.width/3, game.config.height/2, "GAME NAME HERE", menuConfig);
        this.add.text(game.config.width/3, game.config.height/2+20, "Press SPACE to Start!", menuConfig);

        //define keybind for spacebar
        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {
        //check if spacebar has been pressed
        if (Phaser.Input.Keyboard.JustDown(spacebar)){
            //set timer to end after 15 seconds
            game.settings = {
                gameTime: 15000
            }
            this.scene.start("Play");
        }
    }
}