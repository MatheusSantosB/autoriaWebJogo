export class Heart {
    constructor({ x, y, width, height, imageSrc }) {
        this.position = { x, y };
        this.width = width;
        this.height = height;
        this.imageSrc = imageSrc;
        this.depleted = false; // Se o coração foi perdido

        this.isImageLoaded = false;
        this.image = new Image();
        this.image.onload = () => { this.isImageLoaded = true; };
        this.image.src = imageSrc;
    }

    draw(c) {
        if (this.depleted) return; // Não desenha corações perdidos

        if (this.isImageLoaded) {
            // --- CORREÇÃO ---
            // Desenha a imagem inteira (this.image.width/height)
            // no tamanho definido (this.width/height)
            c.drawImage(
                this.image,
                0, // cropX
                0, // cropY
                this.image.width,  // cropWidth (usa a largura total da imagem)
                this.image.height, // cropHeight (usa a altura total da imagem)
                this.position.x,   // Posição X no canvas
                this.position.y,   // Posição Y no canvas
                this.width,        // Tamanho (32)
                this.height        // Tamanho (32)
            );
        } else {
            // Fallback
            c.fillStyle = 'red';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }
}