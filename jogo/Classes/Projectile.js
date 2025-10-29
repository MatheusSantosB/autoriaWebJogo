export class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    
    // Vamos fazer a flecha ser um pequeno retângulo por enquanto
    this.width = 20; 
    this.height = 5;
  }

  draw() {
    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');
    c.fillStyle = 'red'; // Cor do projétil
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    // Move o projétil
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    
    // Desenha o projétil na nova posição
    this.draw(); 
  }
}