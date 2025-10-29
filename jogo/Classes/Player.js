export class Player {
  constructor({ x, y }) {
    this.position = { x, y };
    this.width = 128; // ajuste conforme o tamanho do sprite
    this.height = 128;
    this.image = new Image();
    this.image.src = './img/player.png'; // caminho do sprite
    this.loaded = false;

    this.image.onload = () => {
      this.loaded = true;
    };
  }

  draw() {
    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    if (this.loaded) {
      // desenha o sprite do player
      c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    } else {
      // fallback visual caso o sprite ainda não tenha carregado
      c.fillStyle = 'red';
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }
}

