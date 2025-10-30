// Classe base para todos os inimigos
export class Enemy {
  constructor({
    x,
    y,
    width,
    height,
    imageSrc,
    spriteCropbox, // Configuração do spritesheet
    moveSpeed = 1,
    framesHold = 10,
    scale = 1.0 // <-- CORRIGIDO: Escala padrão é 1 (sem aumento)
  }) {
    // Posição e Hitbox
    this.position = { x, y }
    this.width = width   
    this.height = height 
    this.scale = scale // <-- Usa a escala (ou 1.0)
    
    // Física
    this.velocidade = { x: moveSpeed, y: 0 }
    this.gravidade = 0.5
    this.moveSpeed = moveSpeed
    this.damage = 1 
    
    // Configuração de Animação
    this.isImageLoaded = false
    this.image = new Image()
    this.currentSprite = spriteCropbox
    
    // Carrega a imagem do sprite
    this.image.onload = () => { 
      this.isImageLoaded = true 
      if (!this.currentSprite.width) {
        this.currentSprite.width = this.image.width / this.currentSprite.frames
      }
      if (!this.currentSprite.height) {
        this.currentSprite.height = this.image.height
      }
    }
    this.image.src = imageSrc
    
    this.currentFrame = 0
    this.framesElapsed = 0
    this.framesHold = framesHold 
    
    // Configuração de IA
    this.movementTimer = 0
    this.changeDirectionInterval = (Math.random() * 3 + 2) * 60 
  }

  // Método de IA (será implementado por cada classe filha)
  handleAI() {
    // ...
  }

  // Método de atualização (chamado a cada frame)
  update(c, blocosColisao, DEBUG_MODE) {
    this.draw(c, DEBUG_MODE)
    if (!this.isImageLoaded) return

    this.framesElapsed++
    if (this.framesElapsed % this.framesHold === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.currentSprite.frames
    }

    this.handleAI()

    // 1. Física Horizontal
    this.position.x += this.velocidade.x
    blocosColisao.forEach(bloco => {
      if (this.checkCollision(bloco)) {
        if (this.velocidade.x > 0) {
          this.position.x = bloco.x - this.width
          this.velocidade.x *= -1 
        } else if (this.velocidade.x < 0) {
          this.position.x = bloco.x + bloco.width
          this.velocidade.x *= -1 
        }
      }
    })
    
    if (this.position.x < 0) {
      this.position.x = 0;
      this.velocidade.x *= -1;
    } else if (this.position.x + this.width > c.canvas.width) {
      this.position.x = c.canvas.width - this.width;
      this.velocidade.x *= -1;
    }

    // 2. Física Vertical (Gravidade)
    this.position.y += this.velocidade.y
    this.velocidade.y += this.gravidade
    blocosColisao.forEach(bloco => {
      if (this.checkCollision(bloco)) {
        // Permite pular por baixo da plataforma
        if (this.velocidade.y > 0) {
          this.position.y = bloco.y - this.height
          this.velocidade.y = 0
        }
      }
    })

    if (this.position.y < 0) {
        this.position.y = 0;
        this.velocidade.y = 0;
    }
  }

  // Detecção de Colisão (AABB)
  checkCollision(bloco) {
    return (
      this.position.x < bloco.x + bloco.width &&
      this.position.x + this.width > bloco.x &&
      this.position.y < bloco.y + bloco.height &&
      this.position.y + this.height > bloco.y
    )
  }

  // Método de desenho
  draw(c, DEBUG_MODE) {
    if (this.isImageLoaded) {
      // Cálculo de escala (se houver)
      const drawWidth = this.width * this.scale
      const drawHeight = this.height * this.scale
      const offsetX = (drawWidth - this.width) / 2
      const offsetY = (drawHeight - this.height) / 2
      const finalDrawX = this.position.x - offsetX
      const finalDrawY = this.position.y - offsetY

      const frameWidth = this.currentSprite.width;
      const frameHeight = this.currentSprite.height;
      let frameX = frameWidth * this.currentFrame;
      
      let scaleX = 1
      let drawX = finalDrawX 
      
      // Inverte o sprite baseado na velocidade
      if (this.velocidade.x < 0) {
          scaleX = -1
          drawX = -(finalDrawX) - drawWidth
      }

      c.save()
      c.scale(scaleX, 1) 
      c.drawImage(
        this.image,
        frameX, // cropX
        0, // cropY
        frameWidth, // cropWidth
        frameHeight, // cropHeight
        drawX, 
        finalDrawY,
        drawWidth,
        drawHeight,
      )
      c.restore() 
      
      // Desenha a hitbox (após o restore)
      if (DEBUG_MODE) {
          c.strokeStyle = 'red';
          c.lineWidth = 2;
          c.strokeRect(this.position.x, this.position.y, this.width, this.height);
      }
    }
  }
}