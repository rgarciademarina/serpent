// Variables del juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreText = document.getElementById('score');
const controls = document.getElementById('controls');
const btnUp = document.getElementById('up');
const btnDown = document.getElementById('down');
const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');

let velocidad = 200;
let puntuacion = 0;
let serpiente = [];
let direccion = { x: 0, y: 0 };
let comida = { x: 0, y: 0 };
let segmentsToAdd = 0;
let startTime;

// Inicializar el juego
function iniciarJuego() {
    ajustarTamanoCanvas();
    const tamanoInicial = canvas.width / 20;
    serpiente = [
        { x: canvas.width / 2, y: canvas.height / 2 },
        { x: canvas.width / 2 - tamanoInicial, y: canvas.height / 2 },
        { x: canvas.width / 2 - tamanoInicial * 2, y: canvas.height / 2 },
        { x: canvas.width / 2 - tamanoInicial * 3, y: canvas.height / 2 },
        { x: canvas.width / 2 - tamanoInicial * 4, y: canvas.height / 2 }
    ];
    direccion = { x: tamanoInicial, y: 0 };
    segmentsToAdd = 0;
    puntuacion = 0;
    velocidad = 200;
    scoreText.textContent = `Puntuación: ${puntuacion}`;
    startTime = Date.now();

    colocarComida();
    document.addEventListener('keydown', cambiarDireccion);
    btnUp.addEventListener('click', () => establecerDireccion(0, -tamanoInicial));
    btnDown.addEventListener('click', () => establecerDireccion(0, tamanoInicial));
    btnLeft.addEventListener('click', () => establecerDireccion(-tamanoInicial, 0));
    btnRight.addEventListener('click', () => establecerDireccion(tamanoInicial, 0));

    if (esDispositivoMovil()) {
        controls.style.display = 'flex';
    }

    actualizarJuego();
}

// Detectar si es un dispositivo móvil
function esDispositivoMovil() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

// Cambiar dirección con el teclado
function cambiarDireccion(event) {
    const tecla = event.keyCode;
    if (tecla === 37 && direccion.x !== 10) { // Izquierda
        establecerDireccion(-10, 0);
    }
    else if (tecla === 38 && direccion.y !== 10) { // Arriba
        establecerDireccion(0, -10);
    }
    else if (tecla === 39 && direccion.x !== -10) { // Derecha
        establecerDireccion(10, 0);
    }
    else if (tecla === 40 && direccion.y !== -10) { // Abajo
        establecerDireccion(0, 10);
    }
}

// Establecer nueva dirección
function establecerDireccion(x, y) {
    direccion = { x, y };
}

// Colocar comida aleatoriamente
function colocarComida() {
    const tamanoSegmento = canvas.width / 40;
    comida.x = Math.floor(Math.random() * (canvas.width / tamanoSegmento)) * tamanoSegmento;
    comida.y = Math.floor(Math.random() * (canvas.height / tamanoSegmento)) * tamanoSegmento;

    const comerSerpiente = serpiente.some(segmento => segmento.x === comida.x && segmento.y === comida.y);
    if (comerSerpiente) {
        colocarComida();
    }
}

// Actualizar el juego
function actualizarJuego() {
    setTimeout(() => {
        limpiarCanvas();
        dibujarComida();
        moverSerpiente();
        dibujarSerpiente();
        comprobarColisiones();
        actualizarJuego();
    }, velocidad);
}

// Limpiar el canvas
function limpiarCanvas() {
    ctx.fillStyle = '#000'; // Fondo negro
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Dibujar la serpiente
function dibujarSerpiente() {
    const tamanoSegmento = canvas.width / 40;
    ctx.fillStyle = 'green'; // Serpiente verde
    serpiente.forEach(segmento => {
        ctx.fillRect(segmento.x, segmento.y, tamanoSegmento, tamanoSegmento);
    });
}

// Mover la serpiente
function moverSerpiente() {
    const tamanoSegmento = canvas.width / 40;
    const cabeza = { x: serpiente[0].x + direccion.x, y: serpiente[0].y + direccion.y };
    serpiente.unshift(cabeza);

    // Comprobar si ha comido
    if (cabeza.x === comida.x && cabeza.y === comida.y) {
        puntuacion += 10;
        scoreText.textContent = `Puntuación: ${puntuacion}`;
        colocarComida();
        aumentarVelocidad();

        // Calcular el tiempo transcurrido en segundos
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const multiplier = 1 + Math.floor(elapsedSeconds / 10);
        segmentsToAdd += multiplier;
    }

    if (segmentsToAdd > 0) {
        segmentsToAdd--;
    } else {
        serpiente.pop();
    }
}

// Dibujar la comida
function dibujarComida() {
    const tamanoComida = canvas.width / 40;
    ctx.fillStyle = 'red'; // Comida roja
    ctx.fillRect(comida.x, comida.y, tamanoComida, tamanoComida);
}

// Comprobar colisiones
function comprobarColisiones() {
    const cabeza = serpiente[0];

    // Chocar con paredes
    if (cabeza.x < 0 || cabeza.x >= canvas.width || cabeza.y < 0 || cabeza.y >= canvas.height) {
        reiniciarJuego();
    }

    // Chocar con sí misma
    for (let i = 1; i < serpiente.length; i++) {
        if (cabeza.x === serpiente[i].x && cabeza.y === serpiente[i].y) {
            reiniciarJuego();
        }
    }
}

// Aumentar velocidad
function aumentarVelocidad() {
    if (velocidad > 50) {
        velocidad -= 5;
    }
}

// Reiniciar juego
function reiniciarJuego() {
    alert(`Juego terminado. Tu puntuación fue: ${puntuacion}`);
    serpiente = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 },
        { x: 160, y: 200 }
    ];
    direccion = { x: 10, y: 0 };
    puntuacion = 0;
    velocidad = 200;
    segmentsToAdd = 0;
    scoreText.textContent = `Puntuación: ${puntuacion}`;
    startTime = Date.now();
    colocarComida();
}

// Iniciar el juego al cargar la página
window.onload = iniciarJuego;

function ajustarTamanoCanvas() {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const size = Math.min(containerWidth, containerHeight, 400);
    
    canvas.width = size;
    canvas.height = size;
}

// Añade esto al final de la función iniciarJuego
ajustarTamanoCanvas();
window.addEventListener('resize', ajustarTamanoCanvas);
