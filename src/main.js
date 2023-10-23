"use strict"

let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            // debug: true
        }
    },
    width: 400,
    height: 400,
    scene: [ Play ]
}

let game = new Phaser.Game(config)

let cursors;
let playerDirection;
let spacebar;
let gridSpaces;