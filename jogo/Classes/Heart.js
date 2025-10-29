export class Heart {
  constructor({
    x,
    y,
    width,
    height,
    imageSrc = './img/player.png',
    spriteCropbox = {
      x: 0,
      y: 0,
      width: 36,
      height: 28,
      frames: 6,
    },
  }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.isImageLoaded = false
    this.image = new Image()

    this.image.onload = () => {
      this.isImageLoaded = true
      console.log('Coração carregou')
    }

    this.image.onerror = () => {
      console.error(' Erro ao carregar a imagem do coração:', imageSrc)
    }

    this.image.src = imageSrc
    this.currentFrame = 0
    this.currentSprite = spriteCropbox
    this.depleted = false
  }

  draw(c) {
    // Para verificar se o coração está carregado
    console.log("Desenhando coração...", this.isImageLoaded)

    if (this.isImageLoaded) {
      let xScale = 1
      let x = this.x

      if (this.depleted) {
        this.currentFrame = 1
      }

      c.save()
      c.scale(xScale, 1)
      c.drawImage(
        this.image,
        this.currentSprite.x + this.currentSprite.width * this.currentFrame,
        this.currentSprite.y,
        this.currentSprite.width,
        this.currentSprite.height,
        x,
        this.y,
        this.width,
        this.height,
      )
      c.restore()
    }
  }
}
