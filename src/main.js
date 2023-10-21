"use strict"

let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    width: 800,
    height: 800,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

let cursors;
let playerDirection;
let spacebar;