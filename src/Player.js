import GameObject from "./GameObject";
import Platform from "./Platform";
import Game from "./Game.js"

export default class Player extends GameObject {
    constructor(x, y, width, height, color, speed, game) {
        super(x, y, width, height, color)
        this.game = game

        this.image = new Image()
        this.image.src = "./images/Player-pixel-2.png"

        this.frameWidth = 64
        this.frameHeight = 64
        this.frameX = 0
        this.frameY = 0
        this.flip = false
        this.maxFrames = 1
        this.timer = 0
        this.fps = 10

        this.respawnX = 0
        this.respawnY = 0

        this.speedX = 0
        this.maxSpeedX = speed
        this.speedY = 0
        this.maxSpeedY = speed
        this.height = height
        this.width = width

        this.jump = 20

        this.dashSpeed = 30
        this.dashCount = 0
        this.dashDelay = true
        this.dashDirection = 0

        this.wallGrabbable = false
        this.wallGrab = false
        this.climbSpeed = 2
        this.wallside
    }

    update(deltaTime) {
        this.oldX = this.x
        this.oldY = this.y

        if (this.game.input.keys.has("ArrowLeft")) {
            this.speedX -= this.maxSpeedX
            this.flip = true
        }

        if (this.game.input.keys.has("ArrowRight")) {
            this.speedX += this.maxSpeedX
            this.flip = false
        }

        if (this.game.input.keys.has("ArrowRight") || this.game.input.keys.has("ArrowLeft")) {
            this.frameY = 1
            this.maxFrames = 3
            this.fps = Math.abs(this.speedX) * 5
        }

        //dash

        if (this.grounded) {
            if (this.dashCount == 0 && this.dashDelay) {
                this.dashCount++
            }
            this.speedY = 0
            if (this.game.input.keys.has("ArrowUp") || this.game.input.keys.has(" ")) {
                this.speedY -= this.jump
                this.grounded = false
            }
            if (this.game.input.keys.has("ArrowRight") && this.game.input.keys.has("ArrowLeft") || !this.game.input.keys.has("ArrowRight") && !this.game.input.keys.has("ArrowLeft") || this.speedX > 0 && this.game.input.keys.has("ArrowLeft") || this.speedX < 0 && this.game.input.keys.has("ArrowRight")) {
                this.speedX *= 0.6
                this.frameY = 0
                this.maxFrames = 1
                this.fps = 15
                if (this.speedX < 0.1 && this.speedX > -0.1) {
                    this.speedX = 0
                }
            }
        } else {
            this.speedY += 1
        }

        if (this.game.input.keys.has("Shift") && this.dashCount > 0 && this.dashDelay) {
            console.log("Dash")
            if (this.flip) {
                this.dashDirection = 0
            } else {
                this.dashDirection = 180
            }
            if (this.game.input.keys.has("ArrowUp")) {
                this.dashDirection = (90)
            }
            if (this.game.input.keys.has("ArrowDown")) {
                this.dashDirection = (270)
            }
            if (this.game.input.keys.has("ArrowLeft")) {
                if (this.dashDirection == 90) {
                    this.dashDirection = this.dashDirection / 2
                } else if (this.dashDirection == 270) {
                    this.dashDirection = (this.dashDirection + 360) / 2
                } else {
                    this.dashDirection = 0
                }
            }
            if (this.game.input.keys.has("ArrowRight")) {
                if (this.dashDirection != 0) {
                    this.dashDirection = (this.dashDirection + 180) / 2
                } else {
                    this.dashDirection = 180
                }
            }

            this.speedX = -Math.cos(this.degToRad(this.dashDirection)) * this.dashSpeed
            this.speedY = -Math.sin(this.degToRad(this.dashDirection)) * this.dashSpeed

            this.dashCount--
            this.dashDelay = false

            setTimeout(() => {
                this.dashDelay = true
            }, 200);
        }

        if(this.wallGrabbable && !this.grounded && this.game.input.keys.has("Control")){
            this.game.dontfuckupmyshit = 0
            console.log("grab")
            this.wallGrab = true
            this.speedY = 0
            this.speedX = 0
            if(this.game.input.keys.has("ArrowUp")){
                this.speedY = -this.climbSpeed
            }
            if(this.game.input.keys.has("ArrowDown")){
                this.speedY = this.climbSpeed
            }
        } else{
            this.wallGrab = false
        }

        if(this.wallGrab && this.game.input.keys.has(" ")){
            this.speedY = this.jump * -Math.sin(this.degToRad(45))
            if (this.wallside == 1){
                this.speedX = this.jump * -Math.cos(this.degToRad(45))
            }
            if (this.wallside == 0){
                this.speedX = this.jump * Math.cos(this.degToRad(45))
            }
        }

        this.x += this.speedX
        this.y += this.speedY

        if (this.speedY < 0) {
            this.maxFrames = 1
        }

        this.interval = 1000 / this.fps

        if (this.timer > this.interval) {
            this.frameX++
            this.timer = 0
        } else {
            this.timer += deltaTime
        }

        if (this.frameX >= this.maxFrames) {
            this.frameX = 0
        }
       
        if (this.y > this.game.height) {
            this.respawn()
        }

        if(this.game.levelNumber == this.game.levelCount && this.x >= 1800){
            this.game.gameOver = true
        }
    }

    draw(ctx) {
        if (this.flip) {
            ctx.save()
            ctx.scale(-1, 1)
        }

        ctx.globalAlpha = 0.1

        ctx.drawImage(
            this.image,
            this.frameWidth * this.frameX,
            this.frameHeight * this.frameY,
            this.frameWidth,
            this.frameHeight,
            this.flip ? this.oldX * -1 - this.width : this.oldX,
            this.oldY,
            this.width,
            this.height)

        ctx.globalAlpha = 1

        ctx.drawImage(
            this.image,
            this.frameWidth * this.frameX,
            this.frameHeight * this.frameY,
            this.frameWidth,
            this.frameHeight,
            this.flip ? this.x * -1 - this.width : this.x,
            this.y,
            this.width,
            this.height)

        if (this.flip) {
            ctx.restore()
        }
    }

    checkCollision(r1, r2) {
        if (r1.x >= r2.x + r2.width) {
            return false;
        } else if (r1.x + r1.width <= r2.x) {
            return false;
        } else if (r1.y >= r2.y + r2.height) {
            return false;
        } else if (r1.y + r1.height <= r2.y) {
            return false;
        } else {
            return true
        }
    }

    degToRad(deg) {
        const rad = deg * (Math.PI) / 180
        return rad
    }
    
    respawn(){
        this.x = this.respawnX;
        this.y = this.respawnY;
        this.speedX = 0;
        this.speedY = 0;
    }
}