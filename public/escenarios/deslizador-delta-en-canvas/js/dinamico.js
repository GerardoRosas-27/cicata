

document.addEventListener('DOMContentLoaded', function () {
    // Función a ejecutar cuando se haya cargado el HTML
    crearFormularioMultiple(1);
    

});
function obtenerIdRespuesta(respuesta){
    console.log("respuesta: ", respuesta)

}
let preguntas = [" ¿Cuál es el valor de $ \\varepsilon $ ? ", " ¿Cuál es el valor de $ \\delta $ ?", "¿Puedes elegir un valor más grande para $ \\delta $ ?", "¿Puedes elegir un valor más pequeño para $ \\delta $" ];



let formulario = [
    [" $ \\left| \\frac{(-1))^{n}}{n} \\right| > \\varepsilon $", "\\(n\\) > $ \\varepsilon $"," $ \\left| \\frac{(-1))^{n}}{n} \\right| < \\varepsilon $", "\\(n\\) < $ \\varepsilon $"],
    [" $ \\left| \\frac{(-1))^{n}}{n} \\right| > \\varepsilon $", "\\(n\\) > $ \\frac{1}{\\varepsilon} $"," $ \\left| \\frac{(-1))^{n}}{n} \\right| < \\varepsilon $", "\\(n\\) < $ \\varepsilon $"],
    ["Verdadero", "$x^{3}$", "No se puede saber", "$x^{2}$"],
    ["$ T(x,y)=(0,-x)$", "$ T(x,y)=(-y,0)$", "$ T(x,y)=(x,0)$", "$ T(x,y)=(x+y,-x)$"]
   ];



let opcionesCorrectas = ["opcion2", "opcion4", "opcion4", "opcion2"];

function preguntaSiguente(element) {

    let preguntaData = 1 + parseInt(element.getAttribute('data-pregunta'));

    console.log("pregunta: ", preguntaData);
    obtenerValores();
    crearFormularioMultiple(preguntaData);
    element.setAttribute('data-pregunta', preguntaData);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "formMultipleDinamico"]);
}


function crearFormularioMultiple(numPregunta) {
    console.log("numPregunta: ", parseInt(numPregunta));
    let form = document.getElementById("formMultipleDinamico");

    let html = "<ul>";
    index0 = 1;

    formulario.forEach(element => {
        console.log("sin entrar: ", parseInt(numPregunta), index0);
        if (parseInt(numPregunta) === index0) {
            console.log("parseInt(numPregunta): ", parseInt(numPregunta), index0);
            console.log("index0: ", index0)


    
            html = html + '<h3> Pregunta'+index0+ ' : ' + preguntas[parseInt(numPregunta) - 1] + '</h3>';
            label = "";
            index = 1;
            indexId = 1
            element.forEach(element1 => {

                label = label + '<li><input type="radio" id="pregunta ' + index0 +'-' + indexId + '"  name="pregunta ' + index0 + '" value="opcion' + index + '" /><label for="pregunta ' + index0 +'-' + indexId + '" >  ' + element1 + '</label><div class="check"><div class="inside"></div></div></li>'
                index++;
                indexId++;
            });
            html = html + label + '</ul>';
        }
        index0++;
    });
    console.log("Html: ", html);
    form.innerHTML = html;

}




let valoresSeleccionados = [];
function obtenerValores() {
    var formulario = document.getElementById("formMultipleDinamico");
    var elementos = formulario.querySelectorAll("input[type='radio']");

    elementos.forEach(function (elemento) {
        if (elemento.checked) {
            valoresSeleccionados.push(elemento.value);
        }
    });


}

function validarForm() {
    console.log("valoresSeleccionados: ", valoresSeleccionados)

    let contador = 0;
    let valoresCorrectos = [];
    valoresSeleccionados.forEach(elemento => {
        if (opcionesCorrectas[contador] === elemento) {
            valoresCorrectos.push(elemento);
        }
        contador++;
    });

    console.log(valoresCorrectos);
    if (valoresCorrectos.length === 4) {
        swal({
            title: "Correcto!",
            text: "Tus respuestas al cuestionario son correctas",
            icon: "success",
        });
    } else {
        swal({
            title: "Incorrecto!",
            text: "Tu respuesta es incorrecta",
            icon: "error",
        });
    }
}
