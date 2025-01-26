
var board = JXG.JSXGraph.initBoard("box", {
    boundingbox: [-2, 1.5, 5, -2.5],
    axis: true,
});


const p1 = board.create("point", [1, 0], { color: "none" });
const p2 = board.create("point", [4, 0], { color: "none" });

let line = board.create("segment", [p1, p2], {
    strokeColor: "blue",
    strokeWidth: 6,
    fixed: true  
});


const p3 = board.create("point", [0, -0.5], { color: "none" });
const p4 = board.create("point", [0, -1.5], { color: "none" });

let line2 = board.create("segment", [p3, p4], {
    strokeColor: "blue",
    strokeWidth: 6,
    fixed: true  
});

let puntosCorrectos = false;

var getMouseCoords = function (e, i) {
    var cPos = board.getCoordsTopLeftCorner(e, i),
        absPos = JXG.getPosition(e, i),
        dx = absPos[0] - cPos[0],
        dy = absPos[1] - cPos[1];

    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
}
down = function (e) {
    if (!puntosCorrectos) {
        var canCreate = true,
            i,
            coords,
            el;

        if (e[JXG.touchProperty]) {
            i = 0;
        }
        coords = getMouseCoords(e, i);

        for (el in board.objects) {
            if (
                JXG.isPoint(board.objects[el]) &&
                board.objects[el].hasPoint(
                    coords.scrCoords[1],
                    coords.scrCoords[2]
                )
            ) {
                canCreate = false;
                break;
            }
            let puntos = board.objects[el].hasPoint(
                coords.scrCoords[1],
                coords.scrCoords[2]
            );
        }

        if (canCreate) {
            if (
                p1.X() <= coords.usrCoords[1] &&
                coords.usrCoords[1] <= p2.X() &&
                coords.usrCoords[2] < 0.02 &&
                coords.usrCoords[2] > -0.02 &&
                puntosCorrectos == false
            ) {
                puntosCorrectos = true;

                swal({
                    title: "Muy bien!",
                    text: "El intervalo es correcta",
                    icon: "success",
                });

                let newPunto = board.create("point", [
                    coords.usrCoords[1],
                    coords.usrCoords[2],
                     
                ], { color: "purple", fixed: true} );

                crearSegmentosDivididos(newPunto);

            } else {
                swal({
                    title: "Incorrecto!",
                    text: "Haz click en el intervalo correcto",
                    icon: "error",
                });
            }
        }
    }
};

board.on("down", down);


function crearSegmentosDivididos(point) {
    let line1 = board.create("segment", [p1, point], {
        strokeColor: "red",
        strokeWidth: 6,
        fixed: true  
    });
    let line2 = board.create("segment", [point, p2], {
        strokeColor: "green",
        strokeWidth: 6,
        fixed: true  
    });
}


