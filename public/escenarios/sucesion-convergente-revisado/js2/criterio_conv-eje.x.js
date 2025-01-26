/*******************************************************
 *             EJEMPLO CON EJE X (en lugar de Y)       *
 *       (Se mantiene toda la lógica, pero invirtiendo *
 *       para que todo se pinte en el eje X)           *
 *******************************************************/

// Ajuste para minimizar reflows
JXG.Options.board.minimizeReflow = 'none';

// Variable global para el límite de la sucesión
let limiteSucesion = 0;

// Inicializa el tablero JSXGraph
var board = JXG.JSXGraph.initBoard('edvi', {
    // Ajusta la caja de visualización: [xmin, ymax, xmax, ymin]
    // Cambiamos a un rango más amplio en X para que se vea la sucesión y los puntos.
    boundingbox: [-1, 2, 10, -2],
    keepaspectratio: false,
    axis: false,
    grid: false,
    showCopyright: false,
    zoomX: 1.2,
    zoomY: 9,
    showNavigation: true,
    needsRegularUpdate: false,
    fixed: true,
    numberPointsLow: 100,
    numberPointsHigh: 100,
    pan: {
        needShift: false,
        needTwoFingers: false,
        enabled: false
    }
});

// ----------------------------------------------------
//            DIBUJO DE EJES
// ----------------------------------------------------

// Eje X (horizontal)
var ejeX = board.create('axis', [[0, 0], [1, 0]], {
    ticks: {
        drawZero: false,
        ticksDistance: 0.5,
        minorTicks: 5,
        majorHeight: 10,
        label: { offset: [-5, -15] }
    }
});

// Retiramos las marcas por defecto del eje X
ejeX.removeAllTicks();

// Creamos nuevas marcas (ticks) equidistantes en eje X
board.create('ticks', [ejeX, 1], {
    grid: false,
    strokeColor: '#ccc',
    majorHeight: 12, 
    drawLabels: true, 
    label: { offset: [-4, -15] },
    minorTicks: 0, 
    drawZero: false
});

// Eje Y (vertical)
var ejeY = board.create('axis', [[0, 0], [0, 2]], {
    ticks: {
        minorTicks: 5,
        ticksDistance: 0.1,
        majorHeight: 20,
        label: { offset: [-30, -1] },
        drawZero: false
    }
});

// ----------------------------------------------------
//              VARIABLES GLOBALES
// ----------------------------------------------------
var epsilon = 0;     // Valor de epsilon
var limite = 1;      // El límite deseado (L = 1)
var estaDesarrollo = false;
var estaCalcula = false;
var colorElegido = "purple";
let iteracion = 0;   // Para controlar las iteraciones de la sucesión

// ----------------------------------------------------
//     FUNCIÓN PARA ANIMAR LÍNEA DEL LÍMITE (x=1)
// ----------------------------------------------------
function animaLimite() {
    console.log("Entro a animaLimite"); 
    // Dibuja la línea vertical x = 1 (antes era horizontal en y=1).
    board.create("line", [[limite, -0.05], [limite, 0.05]], {
        straightFirst: false,
        straightLast: false,
        strokeWidth: 5,
        strokeColor: "green"
    });
}

animaLimite();

// ----------------------------------------------------
//      FUNCIÓN PARA ANIMAR LA SUCESIÓN (en eje X)
// ----------------------------------------------------
let isAnimating = true; // Bandera para controlar la animación

function animaSucesion() {
    console.log("animaSucesion");

    (async () => {
        let i = 1;
        while (isAnimating) {
            await new Promise(resolve => setTimeout(() => {

                // Cálculo del término de la sucesión i/(i+1), antes usábamos la coordenada y,
                // ahora lo ponemos en la coordenada x.
                let puntoX = parseFloat(i / (i + 1));
                let puntoXred = puntoX.toFixed(3);

                console.log("puntoX: ", puntoX, " limiteSucesion: ", limiteSucesion);

                // Pintamos el punto en el eje X si i <= limiteSucesion y si x <= (1 - epsilon)
                // (antes era y <= 1 - epsilon, ahora x <= 1 - epsilon).
                if (i <= limiteSucesion && puntoX <= (1 - epsilon)) {
                    board.create('point', 
                                 [puntoX, 0], // <-- Lo situamos en (x,0)
                                 { 
                                    name: puntoXred, 
                                    color: colorElegido, 
                                    strokeWidth: 1, 
                                    withLabel: true, 
                                    label: {
                                        offset: [0, 10], // Ajusta la posición de la etiqueta
                                        highlight: true
                                    } 
                                 }
                    );
                } else {
                    // Si no se cumple la condición, detenemos la animación
                    isAnimating = false;  
                    return i;
                }

                console.log("Valor de i: ", i);
                iteracion = i;  
                console.log("Número de iteración: ", iteracion);

                resolve();
                i++;
            }, 300)); // velocidad de la animación
        }
    })();
}

// ----------------------------------------------------
//     FUNCIÓN PARA CAMBIAR EPSILON Y MOSTRAR SEGMENTOS
// ----------------------------------------------------
let existeLineLimite = false;
function changeEpsilon() {
    epsilon = parseFloat(document.getElementById('inputEpsilon').value);

    if (existeLineLimite) {
        // Quitamos la línea previa para no duplicar
        board.removeObject("limiteLine2_rojo");
        // Quitamos también posibles segmentos si fuera necesario
        board.removeObject("segmento_azul");
        board.removeObject("segmento_amarillo");
    }

    // Línea roja en x = 1 - epsilon (antes era y=1-epsilon)
    board.create("line", [[1 - epsilon, -0.05], [1 - epsilon, 0.05]], {
        straightFirst: false,
        straightLast: false,
        strokeWidth: 4,
        strokeColor: "red",
        name: "limiteLine2_rojo"
    });

    // Segmento que representa cuánto nos bajamos desde x=1 hasta x=1-epsilon (azul)
    board.create("line", [[limite, 0], [limite - epsilon, 0]], {
        straightFirst: false,
        straightLast: false,
        strokeWidth: 4,
        strokeColor: "lightblue",
        name: "segmento_azul"
    });

    // Segmento que va desde x=1 - epsilon hasta x=0 (amarillo)
    board.create("line", [[limite - epsilon, 0], [0, 0]], {
        straightFirst: false,
        straightLast: false,
        strokeWidth: 4,
        strokeColor: "yellow",
        name: "segmento_amarillo"
    });

    existeLineLimite = true;
}

// ----------------------------------------------------
//  FUNCIÓN PARA EJECUTAR LA SUCESIÓN
// ----------------------------------------------------
function ejecutarSucesion() {
    animaSucesion();
    MathJax.typeset();
}

// ----------------------------------------------------
//   FUNCIÓN PARA OBTENER N, ACTUALIZAR LIMITE Y LIMPIAR
// ----------------------------------------------------
function ejecutarN() {
    // Tomamos el valor de N
    var valorN = document.getElementById("inputVerificaN");
    limiteSucesion = parseInt(valorN.value);

    // Vemos en consola para debug
    console.log(limiteSucesion);

    // Limpiamos la gráfica anterior
    limpiarGrafica();
}

// ----------------------------------------------------
//    FUNCIÓN AUXILIAR PARA NÚMEROS ALEATORIOS
// ----------------------------------------------------
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

// ----------------------------------------------------
//     FUNCIÓN PRINCIPAL PARA REGENERAR Y MARCAR PUNTOS
// ----------------------------------------------------
function reload() {
    const button = document.getElementById('boton');
    button.style.display = 'none'; // Oculta el botón

    board.suspendUpdate();

    // Rango en X (antes lo hacíamos en Y)
    const minX = limite - epsilon; 
    const maxX = limite; 

    const points = []; // Array para almacenar los puntos aleatorios

    // Creamos 3 puntos "incorrectos" (aleatorios) en el eje X
    for (let i = 0; i < 3; i++) {
        const randomX = Math.random() * (maxX - minX) + minX;
        let nameX = randomX.toFixed(3);

        const point1 = board.create('point', 
                                    [randomX, 0], 
                                    { 
                                        name: nameX, 
                                        visible: true, 
                                        color: "darkblue", 
                                        size: 1.5, 
                                        withLabel: true,
                                        label: {
                                            offset: [0, 10],
                                            highlight: true
                                        }
                                    }
        );

        points.push(point1); 
        console.log("El valor de X es: " + point1.X());
        console.log("El valor de Y es: " + point1.Y());
        console.log("El valor de i es: " + i);

        point1.setAttribute({
            labelOffset: [0, 10]  
        });
        board.update();
    }

    board.unsuspendUpdate();

    // Ahora creamos el punto "bueno" dentro de la sucesión
    // Tomamos un valor de N aleatorio un poco mayor a limiteSucesion
    let N = getRandomInt(limiteSucesion, limiteSucesion + 10);
    console.log("El valor de N es: " + N);
    console.log("El límite superior para N es: " + (limiteSucesion + 10));

    let bueno = N / (N + 1);
    let buenoX = bueno.toFixed(3);

    console.log("El valor del bueno es (X): " + buenoX);

    // Dibujamos ese punto en X (antes era en Y)
    const el_bueno = board.create("point", 
                                  [bueno, 0], 
                                  {
                                    strokeWidth: .5,
                                    side: .5,
                                    color: "pink",
                                    name: buenoX,
                                    withLabel: true,
                                    label: {
                                        offset: [0, 10],
                                        highlight: true
                                    }
                                  }
    );

    points.push(el_bueno);

    // Manejo de clic en cada punto para verificar si es el "bueno"
    points.map(item => {
        item.on('down', function () {
            console.log("El punto ha sido clicado: X=" + item.X());

            // Comparamos la X del punto con la X del punto "bueno"
            if (item.X() == el_bueno.X()) {
                swal({
                    title: "¡Felicitaciones!",
                    text: "El punto (" + item.X() + ", 0) es correcto.",
                    icon: "success"
                });
            } else {
                swal({
                    title: "Error",
                    text: "El punto (" + item.X() + ", 0) no es correcto.",
                    icon: "error"
                });
            }
        });
    });
}
