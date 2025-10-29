import { Sprite } from './Classes/Sprite.js';
import { Player } from './Classes/Player.js';

// Canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 24 * 64;  // largura do mapa
canvas.height = 16 * 64; // altura do mapa

// Gravidade
const gravidade = 0.5;

// Dados de colisão exatos do Tiled
const dadosColisao = [
  { height: 22, id: 1, width: 278, x: 8, y: 760 },
  { height: 30, id: 2, width: 148, x: 492, y: 744 },
  { height: 28, id: 3, width: 138, x: 652, y: 604 },
  { height: 38, id: 5, width: 502, x: 1028, y: 764 },
  { height: 46, id: 7, width: 460, x: 1056, y: 272 },
  { height: 42, id: 8, width: 150, x: 840, y: 352 },
  { height: 30, id: 9, width: 136, x: 418, y: 466 },
  { height: 32, id: 10, width: 138, x: 500, y: 240 },
  { height: 30, id: 12, width: 264, x: 100, y: 274 },
  { height: 14, id: 14, width: 142, x: 828, y: 822 },
  { height: 96, id: 17, width: 1568, x: 2, y: 932 }
];

// Criar blocos de colisão
class Colisao {
  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    c.fillStyle = 'rgba(0,0,255,0.3)';
    c.fillRect(this.x, this.y, this.width, this.height);
  }
}

const blocosColisao = dadosColisao.map(d => new Colisao(d));

// Jogador
const player = new Player({ x: 50, y: 50 });
player.width = 75;
player.height = 100;
player.velocidade = { x: 0, y: 1 };

// Background
const background = new Sprite({ position: { x: 0, y: 0 }, imageSrc: './img/mapa1.png' });

// Teclas
const keys = { a: false, d: false };

// Função de atualização do player com colisão
function atualizarPlayer() {
  // Horizontal
  player.position.x += player.velocidade.x;

  blocosColisao.forEach(bloco => {
    if (
      player.position.x < bloco.x + bloco.width &&
      player.position.x + player.width > bloco.x &&
      player.position.y < bloco.y + bloco.height &&
      player.position.y + player.height > bloco.y
    ) {
      // Colisão horizontal
      if (player.velocidade.x > 0) player.position.x = bloco.x - player.width;
      else if (player.velocidade.x < 0) player.position.x = bloco.x + bloco.width;
    }
  });

  // Vertical
  player.position.y += player.velocidade.y;
  player.velocidade.y += gravidade;

  blocosColisao.forEach(bloco => {
    if (
      player.position.x < bloco.x + bloco.width &&
      player.position.x + player.width > bloco.x &&
      player.position.y < bloco.y + bloco.height &&
      player.position.y + player.height > bloco.y
    ) {
      // Colisão vertical
      if (player.velocidade.y > 0) {
        player.position.y = bloco.y - player.height;
        player.velocidade.y = 0;
      } else if (player.velocidade.y < 0) {
        player.position.y = bloco.y + bloco.height;
        player.velocidade.y = 0;
      }
    }
  });
}

// Função de animação
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha o background
  if (background.image.complete) {
    c.drawImage(background.image, 0, 0);
  }

  // Desenha as colisões
  blocosColisao.forEach(bloco => bloco.draw());

  // Atualiza e desenha o player
  atualizarPlayer();
  player.draw();
}

animate();

// Eventos de teclado
window.addEventListener('keydown', (e) => {
  if (e.key === 'a') keys.a = true;
  if (e.key === 'd') keys.d = true;
  if (e.key === 'w' && player.velocidade.y === 0) player.velocidade.y = -15;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'a') keys.a = false;
  if (e.key === 'd') keys.d = false;
});

// Atualiza velocidade horizontal com base nas teclas
setInterval(() => {
  player.velocidade.x = 0;
  if (keys.a) player.velocidade.x = -5;
  if (keys.d) player.velocidade.x = 5;
}, 16);