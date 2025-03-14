import GameObject from "./GameObject.js"
import input from "./Input.js"
import Player from "./Player.js"
import Platform from "./Platform.js"
import UserInterface from "./UserInterface.js"
import Background from "./Background.js"

export default class Game {
    constructor(width, height) {
        this.ui = new UserInterface(this)
        this.background = new Background(this)
        this.width = width
        this.height = height
        this.input = new input(this)
        this.player = new Player(0, 0, 64, 64, "#ff0000", 0.3, this)
        this.levelNumber = 0
        this.gameTime = 0
        this.dontfuckupmyshit = 0
        this.platformsArray = [
            [
                new Platform(this, this.width - 200, 280, 200, 1000),
                new Platform(this, 200, 200, 300, 100),
                new Platform(this, 300, 150, 50, 50, true),
                new Platform(this, 0, this.height - 100, 300, 100),
                new Platform(this, 200, 200, 100, 300),
            ],
            [
                new Platform(this, 0, 280, 200, 100),
                new Platform(this, this.width - 200, 280, 200, 1000),
            ]
        ]
        this.spawnpoints = [ //x, y
            [
                0,
                this.height - 101 - this.player.height
            ],
            [
                0,
                281 - this.player.height
            ]
        ]
        this.platforms = this.platformsArray[0]
        this.player.respawnX = this.spawnpoints[0][0]
        this.player.respawnY = this.spawnpoints[0][1]
        this.levelCount = this.platformsArray.length - 1
    }

    update(deltaTime) {
        if (this.gameOver) return
        if (this.pause) return
        if (!this.gameOver) {
            this.gameTime += deltaTime
        }

        if (this.player.x > this.width) {
            if (this.levelNumber < this.platformsArray.length - 1) {
                this.player.wallGrabbable = false
                this.levelNumber++
                this.player.x = 0
                this.platforms = this.platformsArray[this.levelNumber]
                this.player.respawnX = this.spawnpoints[this.levelNumber][0]
                this.player.respawnY = this.spawnpoints[this.levelNumber][1]
            } else {
                this.player.x = this.width - this.player.width
                this.player.speedX = 0
            }
        }
        if (this.player.x < 0) {
            if (this.levelNumber > 0) {
                this.levelNumber--
                this.player.x = this.width
                this.platforms = this.platformsArray[this.levelNumber]
                this.player.respawnX = this.spawnpoints[this.levelNumber][0]
                this.player.respawnY = this.spawnpoints[this.levelNumber][1]
            } else {
                this.player.x = 0
                this.player.speedX = 0
            }
        }
        let a = 0;
        this.platforms.forEach((platform) => {
            if (this.checkPlatformCollision(this.player, platform)) {
                this.player.speedY = 0
                this.player.y = platform.y - this.player.height
                if (platform.harm) {
                    this.player.respawn()
                }
                a++
            }
            if (a > 0) {
                this.player.grounded = true
            }
        })
        this.player.update(deltaTime)
    }

    draw(ctx) {
        this.background.draw(ctx)
        this.player.draw(ctx)
        this.platforms.forEach((platform) => platform.draw(ctx))
        this.ui.draw(ctx)
    }

    checkPlatformCollision(object, platform) {
        if (object.oldY + object.height > platform.y && object.oldY < platform.y + platform.height) {
            if (object.x + object.width >= platform.x && object.x <= platform.x + platform.width && object.y + object.height >= platform.y && object.y <= platform.y + platform.height) {
                object.speedX = 0
                if (!object.wallGrab) {
                    if (object.oldX < object.x) {
                        this.player.wallside = 1
                        object.x = platform.x - object.width
                    }
                    if (object.oldX > object.x) {
                        this.player.wallside = 0
                        object.x = platform.x + platform.width
                    }
                    if (platform.harm) {
                        this.player.respawn()
                    }
                }
                this.player.wallGrabbable = true
                this.dontfuckupmyshit = 1
            } else {
                if(this.dontfuckupmyshit == 0){
                    this.player.wallGrabbable = false
                }
            }
        } else {
            if (
                object.y + object.height >= platform.y &&
                object.y < platform.y &&
                object.x + object.width >= platform.x &&
                object.x <= platform.x + platform.width
            ) {
                if (object.y + object.height > platform.y && object.x > platform.x + platform.width && object.x + object.width < platform.x) {
                    object.speedY = 0
                    object.y = platform.y - object.height
                }
                object.grounded = true;
                if (object.oldY < object.y) {
                    this.landingParticles((object.x + object.width) / 2, platform.y)
                }
                return true
            } else {
                object.grounded = false;
                if (object.x > platform.x + platform.width || object.x + object.width < platform.x && object.y + object.height == platform.y) {
                    return false

                }
                if (object.grounded && object.y + object.height < platform.y) {
                    return false
                }
            }
            if (object.y < platform.height + platform.y && object.y + object.height > platform.y && object.x < platform.x + platform.width && object.x + object.width > platform.x) {
                object.speedY = 0
                object.y = platform.y + platform.height
            }
        }
    }
    landingParticles(x, y) {
        console.log("coola partiklar")
    }
}
