window.onload = initialize;

var refFormulary;

function initialize() {
    var formVR = document.getElementById("form-vr");

    formVR.addEventListener("submit", sendFormularytoFirebase);

}



function sendFormularytoFirebase(event) {
    event.preventDefault();
    var formVR = event.target;
    data(formVR);

    var error = false;

    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var email = formVR.Email.value;
    console.log(email)
    if (emailRegex.test(email)) {
        console.log("entró")
        document.getElementById("error-email").style.display = "none";
    } else {
        error = true;
        document.getElementById("error-email").style.display = "block";
    }

    var age = formVR.age.value;
    if (!age || (age < 0 || age < 18 || age > 120)) {
        error = true;
        document.getElementById("error-age").style.display = "block";
    } else {
        document.getElementById("error-age").style.display = "none";
    }

    var user = formVR.usr.value;
    if (user == null || user == "") {
        error = true;
        document.getElementById("error-user").style.display = "block";
    } else {
        document.getElementById("error-user").style.display = "none";
    }

    var headset = formVR.Headset.value;
    if (headset == "No seleccionado") {
        error = true;
        document.getElementById("error-vr").style.display = "block";
    } else {
        document.getElementById("error-vr").style.display = "none";
    }

    var radios = formVR.Satisfaction.value;;

    if (radios == null || radios == "") {
        error = true;
        document.getElementById("error-radio").style.display = "block";
}   else {
        document.getElementById("error-radio").style.display = "none";
    }

    var comment = formVR.Comment.value;;

    if (comment == null || comment == "") {
        error = true;
        document.getElementById("error-comment").style.display = "block";
}   else {
        document.getElementById("error-comment").style.display = "none";
    }
    
}



function data(formVR) {
    refFormulary = firebase.database().ref().child("formulario");
    refFormulary.push({
        Usuario: formVR.Usuario.value,
        Age: formVR.age.value,
        Email: formVR.Email.value,
        Satisfaction: formVR.Satisfaction.value,
        Comentario: formVR.Comment.value,
        Headset: formVR.Headset.value

    });
}