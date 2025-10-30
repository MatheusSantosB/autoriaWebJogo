export class Player {
  constructor({
    x,
    y,
    width,
    height,
    imageSrc,
    scale = 1.2 
  }) {
    this.position = { x, y }
    this.width = width
    this.height = height
    this.scale = scale 
    
    this.velocidade = { x: 0, y: 0 }
    this.gravidade = 0.5
    this.jumpSpeed = -15
    this.moveSpeed = 5
    this.isOnGround = false
    
    this.lastDirection = 'right'
    
    this.lives = 3
    this.isInvincible = false 
    this.isDead = false 

    this.isImageLoaded = false
    this.image = new Image()
    this.image.onload = () => { 
        this.isImageLoaded = true;
        this.spriteCropbox = { width: 64, height: 64, frames: 1 }; 
    }
    this.image.src = imageSrc
    // animação de ficar parado, andar, atirar, tomar dano e morrer. 
    this.animations = {
        idle: { row: 0, frames: 4, framesHold: 10, loop: true },
        walk: { row: 2, frames: 6, framesHold: 8, loop: true },     
        shoot: { row: 1, frames: 8, framesHold: 5, loop: false },
        takeDamage: { row: 3, frames: 3, framesHold: 8, loop: false }, 
        die: { row: 4, frames: 4, framesHold: 10, loop: false }        
    };
    
    this.currentFrame = 0
    this.framesElapsed = 0
    this.framesHold = this.animations.idle.framesHold
    this.currentAnimation = 'idle'; 
  }

  switchAnimation(animationName) {
    if (this.currentAnimation === animationName || this.isDead) return;

    const currentAnim = this.animations[this.currentAnimation];
    if (currentAnim && currentAnim.loop === false && 
        this.currentFrame < currentAnim.frames - 1) {
        if (animationName === 'idle' || animationName === 'walk') return;
    }

    this.currentAnimation = animationName;
    const anim = this.animations[animationName];
    this.spriteCropbox.frames = anim.frames;
    this.spriteCropbox.row = anim.row;
    this.framesHold = anim.framesHold;
    this.currentFrame = 0;
  }

  update(c, blocosColisao, keys, DEBUG_MODE) {
    this.draw(c, DEBUG_MODE) 
    if (!this.isImageLoaded) return

    // Animação
    this.framesElapsed++
    if (this.framesElapsed % this.framesHold === 0) {
        if (this.animations[this.currentAnimation].loop === false) {
            if (this.currentFrame < this.animations[this.currentAnimation].frames - 1) {
                this.currentFrame++;
            } else {
                if (this.currentAnimation === 'die') {
                    this.isDead = true; 
                } else {
                    this.switchAnimation(keys.a || keys.d ? 'walk' : 'idle');
                }
            }
        } else {
            this.currentFrame = (this.currentFrame + 1) % this.animations[this.currentAnimation].frames;
        }
    }

    if (this.isDead) {
        this.velocidade.x = 0;
        return; 
    }

    // Input
    let targetAnimation = 'idle';
    if (keys.a) {
      this.velocidade.x = -this.moveSpeed
      this.lastDirection = 'left'
      targetAnimation = 'walk';
    } else if (keys.d) {
      this.velocidade.x = this.moveSpeed
      this.lastDirection = 'right'
      targetAnimation = 'walk';
    } else {
      this.velocidade.x = 0
    }
    this.switchAnimation(targetAnimation); 

    // Física Horizontal
    this.position.x += this.velocidade.x
    blocosColisao.forEach(bloco => {
      if (this.checkCollision(bloco)) {
        if (this.velocidade.x > 0) this.position.x = bloco.x - this.width
        else if (this.velocidade.x < 0) this.position.x = bloco.x + this.width
      }
    })

    // Limites da tela
    this.position.x = Math.max(0, Math.min(this.position.x, c.canvas.width - this.width));

    // Física Vertical
    this.isOnGround = false;
    this.position.y += this.velocidade.y
    this.velocidade.y += this.gravidade
    
    blocosColisao.forEach(bloco => {
      const collisionMargin = 1; 
      if (this.checkCollision({
              ...bloco, 
              y: bloco.y - collisionMargin, 
              height: bloco.height + collisionMargin
          })) {
        if (this.velocidade.y > 0) {
          this.position.y = bloco.y - this.height - collisionMargin; 
          this.velocidade.y = 0;
          this.isOnGround = true;
        } 
      }
    })
    
    if (this.position.y < 0) {
        this.position.y = 0;
        this.velocidade.y = 0;
    }
  }

  takeDamage(amount = 1) { 
    if (this.isInvincible || this.isDead) return false 

    console.log(`Player tomou ${amount} de dano! Vidas restantes: ${this.lives - amount}`);
    
    this.lives -= amount;
    
    if (this.lives < 0) this.lives = 0;
    
    if (this.lives <= 0) {
        this.switchAnimation('die');
        this.isDead = true;
    } else {
        this.switchAnimation('takeDamage');
    }
    return true; 
  }

  checkCollision(bloco) {
    return (
      this.position.x < bloco.x + bloco.width &&
      this.position.x + this.width > bloco.x &&
      this.position.y < bloco.y + bloco.height &&
      this.position.y + this.height > bloco.y
    )
  }

  draw(c, DEBUG_MODE) {
    if (this.isImageLoaded) {
      // Efeito de piscar quando invencível
      if (this.isInvincible && Date.now() % 200 < 100) {
        return; // Não desenha em frames alternados (pisca rápido)
      }
      
      const drawWidth = this.width * this.scale
      const drawHeight = this.height * this.scale
      const offsetX = (drawWidth - this.width) / 2
      const offsetY = (drawHeight - this.height) / 2
      const finalDrawX = this.position.x - offsetX
      const finalDrawY = this.position.y - offsetY
      
      const anim = this.animations[this.currentAnimation];
      const frameWidth = this.spriteCropbox ? this.spriteCropbox.width : 64; 
      const frameHeight = this.spriteCropbox ? this.spriteCropbox.height : 64; 
      let frameX = frameWidth * this.currentFrame;
      let frameY = frameHeight * anim.row; 
      
      let scaleX = 1
      let drawX = finalDrawX 
      
      if (this.lastDirection === 'left') {
        scaleX = -1
        drawX = -(finalDrawX) - drawWidth 
      }

      c.save() 
      c.scale(scaleX, 1) 
      c.drawImage(
        this.image,
        frameX,
        frameY,       
        frameWidth,   
        frameHeight,  
        drawX,
        finalDrawY,   
        drawWidth,  
        drawHeight, 
      )
      c.restore() 
      
      // Hitbox debug
      if (DEBUG_MODE) {
          c.strokeStyle = this.isInvincible ? 'yellow' : 'green';
          c.lineWidth = 2;
          c.strokeRect(this.position.x, this.position.y, this.width, this.height);
      }
    }
  }
}