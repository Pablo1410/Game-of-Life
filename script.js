const tablero = document.getElementById('tablero');
const btnRun = document.getElementById('botonprincipal');
const celdas = []; // Guardaremos las celdas aquí para que sea más rápido

// 1. Crear la cuadrícula y guardarla en un array
for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.classList.add('celda');
    tablero.appendChild(div);
    celdas.push(div); // Las guardamos en nuestra "caja de herramientas"
}


// 2. Función para pintar una celda al azar
/*function pintarAzar() {
    const indiceAleatorio = Math.floor(Math.random() * celdas.length);
    celdas[indiceAleatorio].classList.add('viva');
}*/

// 1. Primero asegúrate de tener la variable afuera para que sea global
let intervalo = null; 

// 2. El evento del botón
btnRun.addEventListener('click', () => {
    
    if (intervalo) {
        // SI EL JUEGO YA ESTÁ CORRIENDO:
        clearInterval(intervalo); // Detenemos el reloj
        intervalo = null;         // Vaciamos la variable
        btnRun.innerText = "Correr Simulación";
    } else {
        // SI EL JUEGO ESTÁ DETENIDO:
        // Aquí es donde "siguienteGeneracion" se ejecutará cada 200ms
        intervalo = setInterval(siguienteGeneracion, 200); 
        btnRun.innerText = "Detener";
    }
    
});

function limpiarTablero() {
    celdas.forEach(celda => celda.classList.remove('viva'));
    // Si la simulación está corriendo, la detenemos
    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
        btnRun.innerText = "Correr Simulación";
    }
}

function obtenerMapa() {
    let mapa = [];
    for (let f = 0; f < filas; f++) {
        let filaActual = [];
        for (let c = 0; c < columnas; c++) {
            // Calculamos el índice en el array plano de 100 elementos
            const index = f * columnas + c;
            const estaViva = celdas[index].classList.contains('viva') ? 1 : 0;
            filaActual.push(estaViva);
        }
        mapa.push(filaActual);
    }
    return mapa;
}

function siguienteGeneracion() {
    const mapaActual = obtenerMapa();
    const nuevoMapa = [];

    for (let f = 0; f < filas; f++) {
        nuevoMapa[f] = [];
        for (let c = 0; c < columnas; c++) {
            let vecinosVivos = 0;

            // Revisar los 8 vecinos alrededor de la celda actual
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue; // Saltarse la celda misma
                    
                    let filaVecino = f + i;
                    let colVecino = c + j;

                    // Verificar que el vecino esté dentro del tablero
                    if (filaVecino >= 0 && filaVecino < filas && colVecino >= 0 && colVecino < columnas) {
                        vecinosVivos += mapaActual[filaVecino][colVecino];
                    }
                }
            }

            // Aplicar las Reglas de Conway
            const estadoActual = mapaActual[f][c];
            if (estadoActual === 1 && (vecinosVivos === 2 || vecinosVivos === 3)) {
                nuevoMapa[f][c] = 1; // Sobrevive
            } else if (estadoActual === 0 && vecinosVivos === 3) {
                nuevoMapa[f][c] = 1; // Nace
            } else {
                nuevoMapa[f][c] = 0; // Muere o sigue muerta
            }
        }
    }
    
    actualizarPantalla(nuevoMapa);
}

function actualizarPantalla(mapa) {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            const index = f * columnas + c;
            if (mapa[f][c] === 1) {
                celdas[index].classList.add('viva');
            } else {
                celdas[index].classList.remove('viva');
            }
        }
    }
}