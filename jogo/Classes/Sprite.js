// Classe para os sprites de fundo (cenário)
export class Sprite {
  constructor({ position, imageSrc }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  // Método de desenho (agora recebe 'c')
  draw(c) {
    // Desenha a imagem no canvas (apenas se já estiver carregada)
    if (this.image.complete) {
      c.drawImage(this.image, this.position.x, this.position.y);
    }
  }
}