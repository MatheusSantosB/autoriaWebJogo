Projeto: Jogo de Plataforma 2D em JavaScript
📖 Sobre o Projeto
Este é um protótipo de um jogo de plataforma 2D desenvolvido inteiramente com HTML5 Canvas e JavaScript puro (ES6+).

O jogador controla um arqueiro que deve navegar por um cenário, pular em plataformas e derrotar diferentes tipos de inimigos para vencer. O projeto é estruturado com Classes JavaScript, separando a lógica do jogador, inimigos, projéteis e elementos de cenário.

🚀 Funcionalidades
Movimentação de Personagem: O jogador pode andar (esquerda/direita) e pular.

Sistema de Combate: O jogador pode atirar flechas para derrotar os inimigos.

Inimigos com IA: O jogo inclui três tipos de inimigos com comportamentos distintos:

Esqueleto (Patrulha): Move-se de um lado para o outro.

Cogumelo (Aleatório): Anda em direções aleatórias e pode pular.

Inimigo Voador (Pulador): Fica parado e dá pulos em direções aleatórias.

Sistema de Vidas: O jogador possui 3 vidas, representadas por corações na UI. Ao colidir com um inimigo, o jogador perde uma vida.

Física e Colisões: Implementação de gravidade e detecção de colisão AABB (Axis-Aligned Bounding Box) com as plataformas e entre entidades.

Animação de Sprites: O jogador e os inimigos possuem animações de idle (parado), andar, atirar, tomar dano e morrer, lidas a partir de spritesheets.

Condições de Vitória/Derrota: O jogo termina com "Vitória!" se todos os inimigos forem derrotados, ou "Game Over!" se o jogador perder todas as vidas.

🎮 Controles
A: Andar para a esquerda

D: Andar para a direita

W: Pular

Barra de Espaço: Atirar flecha

Enter: Reiniciar o jogo (após Game Over ou Vitória)

💻 Como Executar
Como este projeto utiliza Módulos JavaScript (import/export), ele precisa ser executado a partir de um servidor local. Abrir o arquivo index.html diretamente no navegador (protocolo file://) não funcionará.

Clone ou baixe este repositório.

Navegue até a pasta jogo/.

Inicie um servidor local. A forma mais fácil é usar a extensão "Live Server" no Visual Studio Code.

Se não usar o VS Code, você pode usar o Python (se tiver instalado):

No terminal, dentro da pasta jogo/, execute: python -m http.server

Abra seu navegador e acesse http://localhost:8000 (ou o endereço fornecido pelo seu servidor).

🛠️ Tecnologias Utilizadas
HTML5

CSS3

JavaScript (ES6+)
