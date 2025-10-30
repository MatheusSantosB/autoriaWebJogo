import { Enemy } from './Enemy.js';

// Inimigo 1: Movimento horizontal simples (Patrulha / Esqueleto)
export class ScoutEnemy extends Enemy {
  constructor(options) {
    // 'super' chama o construtor da classe base 'Enemy'
    super(options);
    // Define a velocidade inicial (pode ser aleatória)
    this.velocidade.x = Math.random() < 0.5 ? this.moveSpeed : -this.moveSpeed;
  }

  // Sobrescreve o método 'handleAI'
  handleAI() {
    this.movementTimer++;
    
    // Se bater o tempo, inverte a direção
    if (this.movementTimer > this.changeDirectionInterval) {
      this.velocidade.x *= -1; // Inverte a direção
      
      // Reseta o timer com um novo valor aleatório
      this.movementTimer = 0;
      this.changeDirectionInterval = (Math.random() * 3 + 2) * 60; // 2-5 segundos
    }
  }
}