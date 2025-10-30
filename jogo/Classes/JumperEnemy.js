import { Enemy } from './Enemy.js';

// Inimigo 3: Pulador (causa 2 de dano)
// Herda da classe base 'Enemy'
export class JumperEnemy extends Enemy {
  constructor(options) {
    super(options);
    this.velocidade.x = 0; // Este inimigo só se move horizontalmente ao pular
    this.damage = 2; // Dano dobrado
  }

  // Sobrescreve o método 'handleAI'
  handleAI() {
    this.movementTimer++;

    // Só faz algo se estiver no chão
    if (this.velocidade.y === 0 && this.movementTimer > this.changeDirectionInterval) {
      // Pula
      this.velocidade.y = -12; // Força do pulo
      // E se move para uma direção aleatória
      this.velocidade.x = (Math.random() - 0.5) * this.moveSpeed * 2;
      
      // Reseta o timer com um intervalo mais curto
      this.movementTimer = 0;
      this.changeDirectionInterval = (Math.random() * 2 + 1) * 60; // 1-3 segundos
    }
    
    // Para de se mover horizontalmente quando aterrissar
    if (this.velocidade.y === 0) {
      this.velocidade.x = 0;
    }
  }
}