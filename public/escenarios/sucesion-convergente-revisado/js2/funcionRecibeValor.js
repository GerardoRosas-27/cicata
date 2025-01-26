

function funcionLeerValor() {
  var inputNumber = document.getElementById("inputNumber").value;

  // Hacer algo con el número ingresado
  console.log("El número ingresado es: " + inputNumber);

  // Llamar a una función y pasarle el número como argumento
  funcionValidar(inputNumber);
}

function funcionValidar(numero) {
  // Hacer algo con el número recibido
  let limite = parseFloat(numero);

  if (limite === 2) {

    swal({
      title: "Muy bien!",
      text: "El límite " + limite + " es correcto.",
      icon: "success"
    });
    console.log("El límite es: " + limite);
    
  } else {
    swal({
      title: "Ups! Revisa tus cálculos!",
      text: "El valor del límite " + limite + " no es correcto.",
      icon: "error"
    });


  }
  
}
