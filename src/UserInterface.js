export default class UserInterface {
    constructor(game) {
      this.game = game
      this.fontSize = 25
      this.fontFamily = 'Arial'
      this.color = 'white'
    }
  
    draw(context) {
      context.save()
      context.fillStyle = this.color
      context.shadowOffsetX = 2
      context.shadowOffsetY = 2
      context.shadowColor = 'black'
  
      context.textAlign = 'left'
      context.font = `${this.fontSize}px ${this.fontFamily}`
      context.fillText(
        `Time: ${(this.game.gameTime * 0.001).toFixed(1)}`,
        20,
        100
      )
  
      context.textAlign = 'center'
        context.font = `50px ${this.fontFamily}`
        context.fillText(
          'WOHOO!',
          this.game.width / 2,
          this.game.height / 2 - 20
        )

      if (this.game.gameOver) {
        context.textAlign = 'center'
        context.font = `50px ${this.fontFamily}`
        context.fillText(
          'WOHOO!',
          this.game.width / 2,
          this.game.height / 2 - 20
        )
      }
  
      // debug
      if (this.game.debug) {
        context.font = `15px Arial`
        context.textAlign = 'right'
        context.fillText(`x: ${this.game.player.x}`, this.game.width - 20, 25)
        context.fillText(`y: ${this.game.player.y}`, this.game.width - 20, 50)
        context.fillText(
          `speedX: ${this.game.player.speedX}`,
          this.game.width - 20,
          75
        )
        context.fillText(
          `speedY: ${this.game.player.speedY}`,
          this.game.width - 20,
          100
        )
        context.fillText(
          `enemies: ${this.game.enemies.length}`,
          this.game.width - 20,
          200
        )
        context.fillText(
          `projectiles: ${this.game.player.projectiles.length}`,
          this.game.width - 20,
          225
        )
        context.fillText(
          `cameraX: ${this.game.camera.x.toFixed(2)}`,
          this.game.width - 20,
          250
        )
        context.fillText(
          `cameraY: ${this.game.camera.y.toFixed(2)}`,
          this.game.width - 20,
          275
        )
        context.fillText(`keys: ${this.game.keys}`, this.game.width - 20, 150)
      }
  
      context.restore()
    }
  }