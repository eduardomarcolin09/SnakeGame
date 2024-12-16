const tabuleiro = document.querySelector('.tabuleiro');
const elementoPontuacao = document.querySelector('.pontuacao');
const elementoMelhorPontuacao = document.querySelector('.melhor-pontuacao');
const controles = document.querySelectorAll('.controles i');

let jogoTerminado = false;
let comidaX, comidaY;
let cobraX = 5, cobraY = 5;
let velocidadeX = 0, velocidadeY = 0;
let corpoCobra = [];
let idIntervalo;
let pontuacao = 0;

let melhorPontuacao = localStorage.getItem('melhor-pontuacao') || 0;
elementoMelhorPontuacao.innerHTML = `Melhor Pontuação: ${melhorPontuacao}`;

const atualizarPosicaoComida = () => {
    comidaX = Math.floor(Math.random() * 30) + 1;
    comidaY = Math.floor(Math.random() * 30) + 1;
};

const encerrarJogo = () => {
    clearInterval(idIntervalo);
    alert('Fim de Jogo! Pressione OK para reiniciar...');
    location.reload();
};

const alterarDirecao = e => {
    const tecla = e.key.toLowerCase();

    if ((tecla === "arrowup" || tecla === "w") && velocidadeY != 1) {
        velocidadeX = 0;
        velocidadeY = -1;
    } else if ((tecla === "arrowdown" || tecla === "s") && velocidadeY != -1) {
        velocidadeX = 0;
        velocidadeY = 1;
    } else if ((tecla === "arrowleft" || tecla === "a") && velocidadeX != 1) {
        velocidadeX = -1;
        velocidadeY = 0;
    } else if ((tecla === "arrowright" || tecla === "d") && velocidadeX != -1) {
        velocidadeX = 1;
        velocidadeY = 0;
    }
};

// Adicionar evento para detectar cliques nos controles visuais
controles.forEach(botao =>
    botao.addEventListener('click', () => alterarDirecao({ key: botao.dataset.key }))
);

const iniciarJogo = () => {
    if (jogoTerminado) return encerrarJogo();
    let html = `<div class="comida" style="grid-area: ${comidaY} / ${comidaX}"></div>`;

    if (cobraX === comidaX && cobraY === comidaY) {
        atualizarPosicaoComida();
        corpoCobra.push([comidaY, comidaX]);
        pontuacao++;
        melhorPontuacao = pontuacao >= melhorPontuacao ? pontuacao : melhorPontuacao;
        localStorage.setItem('melhor-pontuação', melhorPontuacao);
        elementoPontuacao.innerHTML = `Pontuação: ${pontuacao}`;
        elementoMelhorPontuacao.innerHTML = `Melhor Pontuação: ${melhorPontuacao}`;
    }

    cobraX += velocidadeX;
    cobraY += velocidadeY;

    for (let i = corpoCobra.length - 1; i > 0; i--) {
        corpoCobra[i] = corpoCobra[i - 1];
    }

    corpoCobra[0] = [cobraX, cobraY];

    if (cobraX <= 0 || cobraX > 30 || cobraY <= 0 || cobraY > 30) {
        jogoTerminado = true;
    }

    for (let i = 0; i < corpoCobra.length; i++) {
        const classe = i === 0 ? 'cabeça' : 'corpo';
        html += `<div class="${classe}" style="grid-area: ${corpoCobra[i][1]} / ${corpoCobra[i][0]}"></div>`;
        if (i !== 0 && corpoCobra[0][1] === corpoCobra[i][1] && corpoCobra[0][0] === corpoCobra[i][0]) {
            jogoTerminado = true;
        }
    }

    tabuleiro.innerHTML = html;
};

atualizarPosicaoComida();
idIntervalo = setInterval(iniciarJogo, 100);
document.addEventListener('keyup', alterarDirecao);