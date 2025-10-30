export class Projectile {
    constructor({ position, velocity, imageSrc = './img/arrow.png' }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50; // Ajuste para o tamanho da sua flecha
        this.height = 10; // Ajuste para o tamanho da sua flecha

        this.isImageLoaded = false;
        this.image = new Image();
        this.image.onload = () => { this.isImageLoaded = true; };
        this.image.src = imageSrc;
    }

   
    // 'c' (context) é passado como parâmetro
    draw(c) {
        if (this.isImageLoaded) {
            let scaleX = 1;
            let drawX = this.position.x;
            if (this.velocity.x < 0) {
                scaleX = -1;
                drawX = -this.position.x - this.width;
            }
            c.save(); // Agora 'c' está definido
            c.scale(scaleX, 1);
            c.drawImage(this.image, drawX, this.position.y, this.width, this.height);
            c.restore(); // Agora 'c' está definido
        } else {
            c.fillStyle = 'yellow';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

   
    // 'c' (context) é passado como parâmetro
    update(c) {
        this.draw(c); // Passa 'c' para a função draw
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}