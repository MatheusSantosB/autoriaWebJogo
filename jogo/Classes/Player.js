export class Player {
  constructor({ x, y }) {
    this.position = { x, y };
    this.width = 50;
    this.height = 50;
  }

  draw() {
    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
