
JXG.Options.board.minimizeReflow = 'none'
let limiteSucesion = 0;
var board = JXG.JSXGraph.initBoard('edvi', {
	boundingbox: [-1, 10, 1, -1], //xmin,ymax,xmax,ymin			
	keepaspectratio: false,
	axis: false,
	grid: false,
	showCopyright: false,
	zoomX: 1.2,  //En PC y iPad 1.5 es suficiente
	zoomY: 9,  //En PC y iPad 1.5 es suficiente
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

//-----------------------------Dibuja ejes----------------------//

var ejeX = board.create('axis', [[0, 0], [1, 0]], {

	ticks: {
		drawZero: false,
		ticksDistance: 0.5,
		minorTicks: 5,
		majorHeight: 10,
		label: { offset: [-5, -15] }
	}

});

ejeX.removeAllTicks();

board.create('ticks', [ejeX, 1], { // The number here is the distance between Major ticks
	grid: false,
	strokeColor: '#ccc',
	majorHeight: 12, // Need this because the JXG.Options one doesn't apply
	drawLabels: true, // Needed, and only works for equidistant ticks
	label: { offset: [-4, -15] },
	minorTicks: 0, // The NUMBER of small ticks between each Major tick
	drawZero: false
}
);

var ejeY = board.create('axis', [[0, 0], [0, 2]], {

	ticks: {
		minorTicks: 5,
		ticksDistance: 0.1,
		majorHeight: 20,
		label: { offset: [-30, -1] },
		drawZero: false
	}

});

var epsilon = 0
var limite = 1;
var estaDesarrollo = false;
var estaCalcula = false;
var colorElegido = "purple";
let iteracion = 0;


function animaLimite() {
	console.log("entro anima limite");     // Anima la línea del límite L=1
	board.create("line", [[-0.05, limite], [0.05, limite]], {
		straightFirst: false,
		straightLast: false,
		strokeWidth: 5,
		strokeColor: "green"
	});
}

animaLimite()

//--------------------------Anima la sucesión---------------------//

let isAnimating = true; // Bandera para controlar la animación

function animaSucesion() {
	console.log("anima sucesion");

	(async () => {
		let i = 1;

		while (isAnimating) {
			await new Promise(resolve => setTimeout(() => {
				let puntos = parseFloat(i / (i + 1));
				let puntosY = puntos.toFixed(3);
				console.log("puntos: ", puntos, " limiteSucesion: ", limiteSucesion);
				if (i <= limiteSucesion && puntos <= (1 - epsilon)) {
					board.create('point', [0, puntos], { name: puntosY, color: colorElegido, strokeWidth: 1, withLabel: true, label: {
						offset: [10, -2], // Ajusta estos valores para cambiar la posición de la etiqueta
						highlight: true
					} });
				} else {
					isAnimating = false;  // Detener la animación cuando no se cumple la condición
					return i;

				}
				console.log("valor de i: ", i);
				iteracion = i;  //iteracion es variable global
				console.log("número de iteración: ", iteracion);

				resolve();
				i++;
			}, 300)); // velocidad de la animación
		}
	})();

}

//-------------------------Anima los segmentitos respecto al valor de épsilon-------------------//

let existeLineLimite = false;
function changeEpsilon() {

	epsilon = parseFloat(document.getElementById('inputEpsilon').value);

	if (existeLineLimite) {
		board.removeObject("limiteLine2_rojo");
	}

	board.create("line", [[-0.05, (1 - epsilon)], [0.05, (1 - epsilon)]], {
		straightFirst: false,
		straightLast: false,
		strokeWidth: 4,
		strokeColor: "red",
		name: "limiteLine2_rojo"
	});

	board.create("line", [[0, limite], [0, limite - epsilon]], {
		straightFirst: false,
		straightLast: false,
		strokeWidth: 4,             //Grosor del segmento que representa la épsilon que se restó del límite (cuánto se bajo?)
		strokeColor: "lightblue",
		name: "segmento_azul"         // Color de la segmento anterior
	});

	board.create("line", [[0, limite - epsilon], [0, 0]], {
		straightFirst: false,
		straightLast: false,
		strokeWidth: 4,             //Grosor del segmento que representa la épsilon que se restó del límite (cuánto se bajo?)
		strokeColor: "yellow",
		name: "segmento_amarillo"              // Color de la segmento anterior
	});

	existeLineLimite = true;

}

//Se ejecuta la sucesión

function ejecutarSucesion() {

	animaSucesion();

	MathJax.typeset();
}

/**
 * This function retrieves the value of N from the input field, updates the limit of the succession,
 * and clears the current graph.
 */
function ejecutarN() {
	// Get the input element by its ID
	var valorN = document.getElementById("inputVerificaN");

	// Parse the input value as an integer and assign it to limiteSucesion
	limiteSucesion = parseInt(valorN.value);

	// Log the current value for debugging purposes
	console.log(limiteSucesion);

	// Clear the current graph
	limpiarGrafica();
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}


function reload() {
	const button = document.getElementById('boton'); // replace 'myButton' with the actual ID of your button
	button.style.display = 'none'; // hide the button when it is clicked

	board.suspendUpdate();


	const minY = limite - epsilon; // minimum x-coordinate value
	const maxY = limite; // maximum x-coordinate value

	const points = []; // empty array to store the points


	for (let i = 0; i < 3; i++) {
		const randomY = Math.random() * (maxY - minY) + minY;
		let nameY = randomY.toFixed(3);

		const point1 = board.create('point', [0, randomY], 
			{ 
			name: nameY, visible: true, color: "darkblue", size: 1.5, withLabel: true,
			label: {
				offset: [10, -2], // Ajusta estos valores para cambiar la posición de la etiqueta
				highlight: true
			}
		});

		points.push(point1); // add the point to the array
		console.log("El valor de Y es: " + point1.Y());
		console.log("El valor de X es: " + point1.X());
		console.log("El valor de i es: " + i);


		point1.setAttribute({
			labelOffset: [0, -2]  // Ajusta la posición de la etiqueta para moverla hacia abajo
		});
		board.update();
	}


	board.unsuspendUpdate();

	//Punto dentro de la sucesión (el bueno)
	//Este es el código nuevo
	let N = getRandomInt(limiteSucesion, limiteSucesion + 10);
	console.log("El valor de N es: " + N);
	console.log("El límite superior es: " + (limiteSucesion + 10));

	let bueno = N / (N + 1);
	let buenoY = bueno.toFixed(3);


	console.log("El valor del bueno es: " + buenoY);

	const el_bueno = board.create("point", [0, N / (N + 1)], {

		strokeWidth: .5,
		side: .5,
		color: "pink",
		name: buenoY,
		withLabel: true,
		label: {
			offset: [10, -2], // Ajusta estos valores para cambiar la posición de la etiqueta
			highlight: true
		}
	});

	points.push(el_bueno);

	points.map(item => {
      

		item.on('down', function () {
			console.log("El punto ha sido clicado: " + item.Y());


			if(item.Y() == el_bueno.Y()){
				swal({
					title: "Felicitaciones",
					text: "El punto (0," + item.Y() + ") es correcto.",
					icon: "success"
				});
			}else{
				swal({
					title: "Error",
					text: "El punto (0," + item.Y() + ") no es correcto.",
					icon: "error"
				});
				
			}
		});
     
	
	});


}

