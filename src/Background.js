import Layer from './Layer'

export default class Background {
  constructor(game) {
    this.game = game
    this.width = 1920
    this.height = 1080
    this.gameon = true
    this.ml = new Image()
    this.ml.src = "/images/FG-pixel.png"
    this.sl = new Image()
    this.sl.src = "/images/BG-pixel.png"

    this.backgroundLayers = [
      new Layer(this.game, this.width, this.height, 0.01, this.sl),
      new Layer(this.game, this.width, this.height, 1, this.ml)
    ]
  }

  while (gameon = true) {
    setTimeout(1)
    this.timemilisec += 1
    console.log(this.timemilisec)
  }

  update(deltaTime) {
    this.backgroundLayers.forEach(layer => {
      layer.update(deltaTime)
      this.timemilisec.update(deltaTime)
    })
  }

  draw(ctx) {
    this.backgroundLayers.forEach(layer => {
      layer.draw(ctx)
    })
  }

}