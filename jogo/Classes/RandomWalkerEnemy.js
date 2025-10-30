import { Enemy } from './Enemy.js';

// Inimigo 2: Movimento aleatório em duas direções
export class RandomWalkerEnemy extends Enemy {
  constructor(options) {
    super(options);
    this.velocidade.x = Math.random() < 0.5 ? this.moveSpeed : -this.moveSpeed;
    this.jumpChance = 0.01; // Chance de pular a cada frame
  }

  // Sobrescreve o método 'handleAI'
  handleAI() {
    this.movementTimer++;

    // Muda de direção X em intervalos aleatórios
    if (this.movementTimer > this.changeDirectionInterval) {
      this.velocidade.x = (Math.random() - 0.5) * this.moveSpeed * 2; // Direção X aleatória
      this.movementTimer = 0;
      this.changeDirectionInterval = (Math.random() * 3 + 2) * 60;
    }

    // Tem uma pequena chance de pular (se estiver no chão)
    if (this.velocidade.y === 0 && Math.random() < this.jumpChance) {
      this.velocidade.y = -10; // Força do pulo
    }
  }

 
  // Sobrescreve a função 'draw' para inverter a lógica do sprite
  draw(c, DEBUG_MODE) {
    if (this.isImageLoaded) {
      // Lógica de escala (copiada do Enemy.js)
      const drawWidth = this.width * this.scale
      const drawHeight = this.height * this.scale
      const offsetX = (drawWidth - this.width) / 2
      const offsetY = (drawHeight - this.height) / 2
      const finalDrawX = this.position.x - offsetX
      const finalDrawY = this.position.y - offsetY
      
      // Lógica de animação
      const frameWidth = this.currentSprite.width;
      const frameHeight = this.currentSprite.height;
      let frameX = frameWidth * this.currentFrame;
      
      let scaleX = 1
      let drawX = finalDrawX 
      
      // LÓGICA INVERTIDA: O sprite vira quando vai para a DIREITA
      // (Porque o sprite original olha para a esquerda)
      if (this.velocidade.x > 0) {
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
      
      // Desenha a hitbox
      if (DEBUG_MODE) {
          c.strokeStyle = 'red';
          c.lineWidth = 2;
          c.strokeRect(this.position.x, this.position.y, this.width, this.height);
      }
    }
  }
}