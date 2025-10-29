import { Sprite } from './Classes/Sprite.js';
import { Player } from './Classes/Player.js';
import { Projectile } from './Classes/Projectile.js';
import { Heart } from './Classes/Heart.js';

// Canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 24 * 64; // largura do mapa
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
    // Desenhar bloco de colisão
    c.fillStyle = 'rgba(0,0,255,0.3)';
    c.fillRect(this.x, this.y, this.width, this.height);
  }
}
const blocosColisao = dadosColisao.map(d => new Colisao(d));

// Jogador
let player = new Player({ x: 50, y: 50 });
player.width = 75;
player.height = 100;
player.velocidade = { x: 0, y: 1 };

// Background
const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: './img/mapa1.png'
});

// Teclas
const keys = { a: false, d: false };

// Vida (corações)
const hearts = [
  new Heart({ x: 10, y: 10, width: 55, height: 55 }),
  new Heart({ x: 60, y: 10, width: 55, height: 55 }),
  new Heart({ x: 110, y: 10, width: 55, height: 55 }),
];
hearts.forEach(h => h.depleted = false);

let vidas = hearts.length;
let gameOver = false;

// Inimigos (futuro)
let eagles = [];
let oposums = [];
let sprites = [];

const projectiles = [];
let lastDirection = 'right';

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

// ------------------------- Funções de Vida e Game Over -------------------------
function perderVida() {
  for (let i = hearts.length - 1; i >= 0; i--) {
    if (!hearts[i].depleted) {
      hearts[i].depleted = true;
      vidas--;
      break;
    }
  }
  if (vidas <= 0) showGameOver();
}

function showGameOver() {
  gameOver = true;
}

function restartGame() {
  init();
}

// -----------------------------------------------------------------------------------> 
/* corações sumirem
// TEM QUE ESTAR DENTRO D FUNÇÃO DE COLISÃO // TEM QUE ESTAR DENTRO D FUNÇÃO DE COLISÃO
// TEM QUE ESTAR DENTRO D FUNÇÃO DE COLISÃO // TEM QUE ESTAR DENTRO D FUNÇÃO DE COLISÃO
// do personagem const fullHearts = hearts.filter((heart) => {
//   return !heart.depleted })
// if (fullHearts.length > 0) {
//   fullHearts[fullHearts.length - 1].depleted = true
// } else if (fullHearts.length === 0) {
//   init()
// }
// TEM QUE ESTAR DENTRO D FUNÇÃO DE COLISÃO // TEM QUE ESTAR DENTRO D FUNÇÃO DE COLISÃO
// TEM QUE ESTAR DENTRO D FUNÇÃO DE COLISÃO // TEM QUE ESTAR DENTRO D FUNÇÃO DE COLISÃO
// -----------------------------------------------------------------------------------> PARA CONSERTAR ESSA FUNÇÃO (DE REINICIAR) TEM QUE PEGAR TUDO O QUE FOI CRIADO DOS INIMIGOS E PERSONAGENS E AJUSTAR COM O QUE TEM AQUI E TEM QUE VERIFICAR COM A IA DE ACORDO COM O CÓDIGO QUE CRIAREM PORQUE TEM COISA AQUI QUE NÃO FOI CRIADA AINDA */

// -----------------------------------------------------------------------------------> 
// FUTURA FUNÇÃO DE REINÍCIO (QUANDO INIMIGOS FOREM ADICIONADOS)
// TEM QUE PEGAR OS DADOS DOS INIMIGOS (Eagle, Oposum) E RECRIAR JUNTO
// QUANDO FOREM CRIADAS AS CLASSES, AJUSTAR DENTRO DE init()
// POR ENQUANTO, USAR A VERSÃO CORRIGIDA ABAIXO QUE FUNCIONA COM O PLAYER E CORAÇÕES
// ----------------------------------------------------------------------------------->

function init() {
  // Reinicia o player
  player = new Player({ x: 50, y: 50 });
  player.width = 75;
  player.height = 100;
  player.velocidade = { x: 0, y: 1 };

  // Reinicia os corações
  hearts.length = 0;
  hearts.push(
    new Heart({ x: 10, y: 10, width: 55, height: 55 }),
    new Heart({ x: 60, y: 10, width: 55, height: 55 }),
    new Heart({ x: 110, y: 10, width: 55, height: 55 })
  );
  hearts.forEach(h => h.depleted = false);

  // Futuros inimigos (exemplo de estrutura pronta)
  eagles = [
    // new Eagle({ x: 816, y: 172, width: 40, height: 41 }),
  ];

  oposums = [
    // new Oposum({ x: 650, y: 100, width: 36, height: 28 }),
    // new Oposum({ x: 906, y: 515, width: 36, height: 28 }),
  ];

  sprites = [];

  vidas = hearts.length;
  gameOver = false;
}

// Função de animação
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // Tela de game over
  if (gameOver) {
    c.fillStyle = "rgba(0, 0, 0, 0.8)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "white";
    c.font = "bold 80px Arial";
    c.textAlign = "center";
    c.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 50);
    c.fillStyle = "red";
    c.fillRect(canvas.width / 2 - 150, canvas.height / 2 + 10, 300, 80);
    c.fillStyle = "white";
    c.font = "bold 40px Arial";
    c.fillText("Reiniciar", canvas.width / 2, canvas.height / 2 + 65);
    return;
  }

  // Fundo
  if (background.image.complete) c.drawImage(background.image, 0, 0);

  blocosColisao.forEach(bloco => bloco.draw());

  // Projéteis
  projectiles.forEach((projectile, index) => {
    projectile.update();
    if (projectile.position.x + projectile.width < 0 || projectile.position.x > canvas.width) {
      setTimeout(() => { projectiles.splice(index, 1); }, 0);
    }
  });

  atualizarPlayer();
  player.draw();

  // Desenhar corações
  for (let i = hearts.length - 1; i >= 0; i--) {
    const heart = hearts[i];
    if (heart.depleted) {
      c.save();
      c.globalAlpha = 0.3;
      heart.draw(c);
      c.restore();
    } else heart.draw(c);
  }
}
animate();

// Controles
window.addEventListener('keydown', (e) => {
  if (e.key === 'a') keys.a = true;
  if (e.key === 'd') keys.d = true;
  if (e.key === 'w' && player.velocidade.y === 0) player.velocidade.y = -15;

  if (e.key === ' ') {
    const projectileVelocity = (lastDirection === 'right') ? 10 : -10;
    projectiles.push(
      new Projectile({
        position: { x: player.position.x + player.width / 2 - 10, y: player.position.y + player.height / 2 - 2.5 },
        velocity: { x: projectileVelocity, y: 0 }
      })
    );
  }

  // Testes
  if (e.key === 'h') perderVida(); // tira 1 coração
  if (e.key === 'g') showGameOver(); // força Game Over
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'a') keys.a = false;
  if (e.key === 'd') keys.d = false;
});

setInterval(() => {
  player.velocidade.x = 0;
  if (keys.a) { player.velocidade.x = -5; lastDirection = 'left'; }
  if (keys.d) { player.velocidade.x = 5; lastDirection = 'right'; }
}, 16);

// Clique para reiniciar
canvas.addEventListener('click', (e) => {
  if (!gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  if (mx >= canvas.width / 2 - 150 && mx <= canvas.width / 2 + 150 && my >= canvas.height / 2 + 10 && my <= canvas.height / 2 + 90) {
    restartGame();
  }
});
