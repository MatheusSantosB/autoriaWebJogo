export class Sprite {
  constructor({ position, imageSrc }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {
    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');
    if (this.image.complete) {
      c.drawImage(this.image, this.position.x, this.position.y);
    }
  }
}
