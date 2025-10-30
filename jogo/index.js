// Importa as classes
import { Sprite } from './Classes/Sprite.js';
import { Player } from './Classes/Player.js';
import { Projectile } from './Classes/Projectile.js';
import { Heart } from './Classes/Heart.js';
import { ScoutEnemy } from './Classes/ScoutEnemy.js';
import { RandomWalkerEnemy } from './Classes/RandomWalkerEnemy.js';
import { JumperEnemy } from './Classes/JumperEnemy.js';

// Configuração do Canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 24 * 64;  // 1536px
canvas.height = 16 * 64; // 1024px

// --- MODO DEBUG: MANTENHA 'true' ATÉ O DANO FUNCIONAR ---
const DEBUG_MODE = false;

// Dados de colisão das plataformas
const dadosColisao = [
  { height: 22, id: 1, width: 278, x: 8, y: 760 }, { height: 30, id: 2, width: 148, x: 492, y: 744 },
  { height: 28, id: 3, width: 138, x: 652, y: 604 }, { height: 38, id: 5, width: 502, x: 1028, y: 764 },
  { height: 46, id: 7, width: 460, x: 1056, y: 272 }, { height: 42, id: 8, width: 150, x: 840, y: 352 },
  { height: 30, id: 9, width: 136, x: 418, y: 466 }, { height: 32, id: 10, width: 138, x: 500, y: 240 },
  { height: 30, id: 12, width: 264, x: 100, y: 274 }, { height: 14, id: 14, width: 142, x: 828, y: 822 },
  { height: 96, id: 17, width: 1568, x: 2, y: 932 }
];

// Classe para desenhar blocos de colisão (debug)
class Colisao {
  constructor({ x, y, width, height }) { this.x = x; this.y = y; this.width = width; this.height = height; }
  draw() { c.fillStyle = 'rgba(0,0,255,0.3)'; c.fillRect(this.x, this.y, this.width, this.height); }
}

// Variáveis globais
let gameState = { running: true, message: '' };
let blocosColisao;
let player;
let background;
let hearts;
let projectiles;
let enemies;
let keys;
let canShoot = true; 
let lastDamageTime = 0;
const DAMAGE_COOLDOWN = 1000; // 1 segundo entre danos

// Função para atualizar a UI dos corações
function updateHeartsUI() {
  hearts.forEach((heart, index) => {
    heart.depleted = index >= player.lives;
  });
}

// Função de inicialização
function init() {
  blocosColisao = dadosColisao.map(d => new Colisao(d));
  
  player = new Player({
    x: 80, y: 80,
    width: 100, height: 100,
    imageSrc: './img/player2.png', 
    scale: 1.3
  });

  background = new Sprite({ position: { x: 0, y: 0 }, imageSrc: './img/mapa1.png' });
  keys = { a: false, d: false, w: false, space: false }; 
  projectiles = [];
  
  hearts = [
    new Heart({ x: 10, y: 10, width: 32, height: 32, imageSrc: './img/heart.png' }), 
    new Heart({ x: 50, y: 10, width: 32, height: 32, imageSrc: './img/heart.png' }),
    new Heart({ x: 90, y: 10, width: 32, height: 32, imageSrc: './img/heart.png' }),
  ];
  player.lives = 3;

  enemies = [
    new ScoutEnemy({
      x: 700, y: 700,
      width: 200, height: 200,
      imageSrc: './img/Skeleton_01_Yellow_Walk.png',
      spriteCropbox: { frames: 10 }, 
      moveSpeed: 1, framesHold: 6 
    }),
    new RandomWalkerEnemy({
      x: 900, y: 200,
      width: 140, height: 170,
      imageSrc: './img/Mushroom-Run.png',
      spriteCropbox: { frames: 8 }, 
      moveSpeed: 1.5, framesHold: 8
    }),
    new JumperEnemy({
      x: 1100, y: 200,
      width: 180, height: 180,
      imageSrc: './img/Enemy3No-Move-Fly.png', 
      spriteCropbox: { frames: 8 }, 
      moveSpeed: 3, framesHold: 10
    })
  ];
  
  gameState.running = true;
  gameState.message = '';
  canShoot = true;
  lastDamageTime = 0;
  
  updateHeartsUI();
}

// Função para verificar colisão entre dois retângulos
function checkCollision(rect1, rect2) {
  return (
    rect1.position.x < rect2.position.x + rect2.width &&
    rect1.position.x + rect1.width > rect2.position.x &&
    rect1.position.y < rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height > rect2.position.y
  );
}

// Loop principal do jogo
function animate() {
  requestAnimationFrame(animate); 
  c.clearRect(0, 0, canvas.width, canvas.height); 

  background.draw(c);

  // Desenha blocos de colisão (se debug ativado)
  if (DEBUG_MODE) {
    blocosColisao.forEach(bloco => bloco.draw());
  }

  // Se o jogo terminou
  if (!gameState.running) {
    c.fillStyle = 'rgba(0, 0, 0, 0.7)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'white';
    c.font = '50px Arial';
    c.textAlign = 'center';
    c.fillText(gameState.message, canvas.width / 2, canvas.height / 2);
    c.font = '20px Arial';
    c.fillText('Pressione Enter para reiniciar', canvas.width / 2, canvas.height / 2 + 40);
    return;
  }

  // Atualiza o jogador
  player.update(c, blocosColisao, keys, DEBUG_MODE);

  // Se o player está morto
  if (player.isDead) {
    if (player.currentFrame === player.animations.die.frames - 1) {
      setTimeout(() => { 
        gameState.running = false; 
        gameState.message = 'Game Over!';
      }, 1000); 
    }
    projectiles = [];
    return;
  }

  // --- NOVA ABORDAGEM DE COLISÃO ---
  const currentTime = Date.now();
  
  // Atualiza inimigos
  enemies.forEach(enemy => {
    enemy.update(c, blocosColisao, DEBUG_MODE);
    
    // Verifica colisão com player
    if (!player.isDead && 
        !player.isInvincible && 
        currentTime - lastDamageTime > DAMAGE_COOLDOWN &&
        checkCollision(player, enemy)) {
      
      console.log("COLISÃO DETECTADA! Aplicando dano...");
      
      // Aplica dano
      player.takeDamage(enemy.damage);
      lastDamageTime = currentTime;
      
      // Atualiza UI
      updateHeartsUI();
      
      // Feedback visual
      player.isInvincible = true;
      setTimeout(() => {
        player.isInvincible = false;
      }, 1500);
    }
  });

  // Atualiza projéteis
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    projectile.update(c); 

    // Remove projéteis fora da tela
    if (projectile.position.x > c.canvas.width || 
        projectile.position.x + projectile.width < 0) {
      projectiles.splice(i, 1);
      continue;
    }

    // Verifica colisão projétil vs inimigo
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      
      if (checkCollision(projectile, enemy)) {
        console.log("PROJÉTIL ACERTOU INIMIGO!");
        projectiles.splice(i, 1);
        enemies.splice(j, 1);
        break;
      }
    }
  }

  // --- Interface (UI) ---
  hearts.forEach(heart => heart.draw(c));
  
  c.fillStyle = 'white';
  c.font = '20px Arial';
  c.textAlign = 'right';
  c.fillText(`Inimigos restantes: ${enemies.length}`, canvas.width - 20, 30);
  
  // Debug info
  if (DEBUG_MODE) {
    c.fillStyle = 'yellow';
    c.font = '12px Arial';
    c.textAlign = 'left';
    c.fillText(`Vidas: ${player.lives}`, 10, canvas.height - 30);
    c.fillText(`Invencível: ${player.isInvincible}`, 10, canvas.height - 15);
  }

  // Checagem de Fim de Jogo
  if (player.lives <= 0 && !player.isDead) {
    player.switchAnimation('die');
  }
  if (enemies.length === 0 && player.lives > 0) {
    gameState.running = false;
    gameState.message = 'Vitória!';
  }
}

// --- Eventos de Teclado ---
window.addEventListener('keydown', (e) => {
  if (!gameState.running) {
    if (e.key === 'Enter') init();
    return;
  }
  if (player.isDead) return; 

  if (e.key === 'a') keys.a = true;
  if (e.key === 'd') keys.d = true;
  
  if (e.key === 'w' && player.isOnGround) { 
    player.velocidade.y = player.jumpSpeed;
    player.isOnGround = false; 
  }

  if (e.key === ' ' && canShoot) { 
    canShoot = false; 
    player.switchAnimation('shoot');
    
    const projectileVelocity = (player.lastDirection === 'right') ? 10 : -10;
    
    projectiles.push(
      new Projectile({
        position: {
          x: player.position.x + (player.lastDirection === 'right' ? player.width - 10 : 10) - 15,
          y: player.position.y + player.height / 2 - 5 
        },
        velocity: { x: projectileVelocity, y: 0 }
      })
    );
    
    setTimeout(() => { canShoot = true; }, 500); 
  }
});

window.addEventListener('keyup', (e) => {
  if (!gameState.running || player.isDead) return; 
  if (e.key === 'a') keys.a = false;
  if (e.key === 'd') keys.d = false; 
  if (e.key === 'w') keys.w = false;
});

// Inicia o jogo
init();
animate();