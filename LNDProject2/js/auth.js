window.onload = initialize;

var textEmail;
var email;
var file;
var refStorage;
var refImages;
var database;
var refDatabase;
var tbodyVisits;
var CREATE = "Añadir visita"
var UPDATE = "Modificar visita"
var modo = CREATE;
var refEditDatabase;
var imagesFromFirebase;

function initialize() {
    database = document.getElementById("form-visits");

    database.addEventListener("submit", sendConvalidationstoFirebase, false);

    tbodyVisits = document.getElementById("tbody-visits");

    imagesFromFirebase = document.getElementById("images-from-firebase");

    refDatabase = firebase.database().ref().child("Visitas");
    showDatabaseofFirebase();
    file = document.getElementById("file");
    file.addEventListener("change", uploadImageToFirebase, false);
    refStorage = firebase.storage().ref();
    refImages = firebase.database().ref().child("images");
    showImagesFromFirebase();
    
    const signIn = document.getElementById("sign-in");
    signIn.addEventListener("click", login);

    const signOut = document.getElementById("sign-out");
    signOut.addEventListener("click", logout);

    checkIfUserIsLoggedIn();
}

function showImagesFromFirebase() {
    refImages.on("value", function (snapshot) {
        var info = snapshot.val();
        var result = "";
        for (var key in info) {
            result += '<img margin="10" width="200" class="img-thumbnail delete-image" src="' + info[key].url + '"/>' +
            '<a class="btn btn-primary deleteimage-button" data-toggle="modal" href="#" data-image="' + key + '">' +
            'Borrar imagen</a>';
        }
        document.getElementById("images-from-firebase").innerHTML = result;
        if (result != "") {      
            var editImages = document.getElementsByClassName("");
            for (var i = 0; i < editImages.length; i++) {
                editImages[i].addEventListener("click", editImagefromFirebase, false);
            }
            var deleteImages = document.getElementsByClassName("deleteimage-button");
            for (var i = 0; i < deleteImages.length; i++) {
                deleteImages[i].addEventListener("click", deleteImageFromFirebase, false);
            }
        }
    });
}
// result += '<img width="200" class="img-thumbnail" src="'; + info[key].url + '"/>';
function uploadImageToFirebase() {
    var imageToUpload = file.files[0];
    var uploadTask = refStorage.child('images/' + imageToUpload.name).put(imageToUpload);
    document.getElementById("bar-for-progress").style.display = "block";
    uploadTask.on('state_changed',
        function (snapshot) {
            // Se va mostrando el progreso de la subida de la imagen.
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById("progress").style.width = progress + "%";
        }, function (error) {
            // Gestionar el error si se produce.
        }, function () {
            // Cuando se ha subido exitosamente la imagen
            var downloadURL = uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                createNodeInFirebaseBD(imageToUpload.name, downloadURL);
                document.getElementById("bar-for-progress").style.display = "none";
            });
        });

}

function createNodeInFirebaseBD(imageName, downloadURL) {
    refImages.push({
        nombre: imageName,
        url: downloadURL
    });
}


function showDatabaseofFirebase() {
    refDatabase.on("value", function (snap) {
        var data = snap.val();
        var showData = "";
        for (var key in data) {
            showData += "<tr>" +
                '<td class="letter">' + data[key].vrPlace + '</td>' +
                '<td class="letter">' + data[key].vrIsland + '</td>' +
                '<td align="center" class="letter">' + data[key].age + '</td>' +
                '<td class="letter">' + data[key].deviceModel + '</td>' +
                '<td></td>' +
                '<td>' +
                '<button id="edit-button" class="edit-button btn btn-default edit" data-vr="' + key + '">' +
                '<span class="fas fa-edit"></span>' +
                '</button>' +
                '</td>' +
                '<td>' +
                '<button id="delete-button" class="delete-button btn btn-danger delete" data-vr="' + key + '">' +
                '<span class="fas fa-trash"></span>' +
                '</button>' +
                '</td>' +
                "</tr>";
        }
        tbodyVisits.innerHTML = showData;
        if (showData != "") {
            var editElements = document.getElementsByClassName("edit");
            for (var i = 0; i < editElements.length; i++) {
                editElements[i].addEventListener("click", editDatabasefromFirebase, false);
            }
            var deleteElements = document.getElementsByClassName("delete");
            for (var i = 0; i < deleteElements.length; i++) {
                deleteElements[i].addEventListener("click", deleteDatabaseFromFirebase, false);
            }
        }
    });
}

function editDatabasefromFirebase() {
    var keyEditDatabase = this.getAttribute("data-vr");
    refEditDatabase = refDatabase.child(keyEditDatabase);
    refEditDatabase.once("value", function (snap) {
        var data = snap.val();
        document.getElementById("island").value = data.vrIsland
        document.getElementById("place").value = data.vrPlace
        document.getElementById("device-model").value = data.deviceModel
        document.getElementById("age").value = data.age

    });
    document.getElementById("send-data").value = UPDATE;
    modo = UPDATE;
}

function deleteDatabaseFromFirebase() {
    var keyDeleteDatabase = this.getAttribute("data-vr");
    var refDeleteDatabase = refDatabase.child(keyDeleteDatabase);
    refDeleteDatabase.remove();
}

function sendConvalidationstoFirebase(event) {
    event.preventDefault();
    var database = event.target;
    var error = false;

    var age = database.age.value;
    if (!age || (age < 0 || age < 7 || age > 120)) {
        error = true;
        document.getElementById("error-age").style.display = "block";
    } else {
        document.getElementById("error-age").style.display = "none";
    }

    var island = database.vrIsland.value;
    if (island == null || island == "") {
        error = true;
        document.getElementById("error-comment").style.display = "block";
}   else {
        document.getElementById("error-comment").style.display = "none";
    }

    var place = database.vrPlace.value;
    if (place == null || place == "") {
        error = true;
        document.getElementById("error-user").style.display = "block";
    } else {
        document.getElementById("error-user").style.display = "none";
    }

    var devices = database.deviceModel.value;;
    if (devices == null || devices == "") {
        error = true;
        document.getElementById("error-radio").style.display = "block";
}   else {
        document.getElementById("error-radio").style.display = "none";
    }
    
    switch (modo) {
        case CREATE:
            var database = event.target;
            refDatabase.push({
                age: database.age.value,
                deviceModel: database.deviceModel.value,
                vrIsland: database.vrIsland.value,
                vrPlace: database.vrPlace.value
            });
            break;
        case UPDATE:
            var database = event.target;
            refEditDatabase.update({
                age: database.age.value,
                deviceModel: database.deviceModel.value,
                vrIsland: database.vrIsland.value,
                vrPlace: database.vrPlace.value
            });
            modo = CREATE;
            document.getElementById("send-data").value = CREATE;
            break;
    }
    verification()
    database.reset();
}



function login(event) {
    event.preventDefault();
    const txtEmail = document.getElementById("email")
    const txtPassword = document.getElementById("password")
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
    if (email == "soldonfull@gmail.com") {
        administrator()
    } else {
        nonAdministrator()
    }

};

function administrator() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("Administrator user is signed in.")
            console.log(user.email)
            document.getElementById("sign-out").style.display = "block";
            editButton = document.getElementsByClassName("edit-button");
            document.getElementsByClassName("edit-button")
            if (editButton) {
              for (var x = 0; x < editButton.length; x++) {
                editButton[x].style.visibility = "visible";
              }
            }
            deleteButton = document.getElementsByClassName("delete-button");
            document.getElementsByClassName("delete-button")
            if (deleteButton) {
              for (var x = 0; x < deleteButton.length; x++) {
                deleteButton[x].style.visibility = "visible";
              }
            }
            deleteImage = document.getElementsByClassName("deleteimage-button");
            document.getElementsByClassName("deleteimage-button")
            if (deleteImage) {
              for (var x = 0; x < deleteImage.length; x++) {
                deleteImage[x].style.visibility = "visible";
              }
            }
            document.getElementById("database").style.display = "block";
            document.getElementById("images-from-firebase").style.display = "block";
            document.getElementById("send-data1").style.display = "block";
            document.getElementById("send-data2").style.display = "block";
            document.getElementById("login").style.display = "none";
            document.getElementById("file").style.display = "none";
            document.getElementById("bar-for-progress").style.display = "none";
        }
    })
};
function nonAdministrator() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("Non-administrator user is signed in.")
            document.getElementById("sign-in").style.display = "none";
            document.getElementById("sign-out").style.display = "block";
            editButton = document.getElementsByClassName("edit-button");
            document.getElementsByClassName("edit-button")
            if (editButton) {
              for (var x = 0; x < editButton.length; x++) {
                editButton[x].style.visibility = "hidden";
              }
            }
            deleteButton = document.getElementsByClassName("delete-button");
            document.getElementsByClassName("delete-button")
            if (deleteButton) {
              for (var x = 0; x < deleteButton.length; x++) {
                deleteButton[x].style.visibility = "hidden";
              }
            }
            deleteImage = document.getElementsByClassName("deleteimage-button");
            document.getElementsByClassName("deleteimage-button")
            if (deleteImage) {
              for (var x = 0; x < deleteImage.length; x++) {
                deleteImage[x].style.visibility = "hidden";
              }
            }
            document.getElementById("images-from-firebase").style.display = "block";
            document.getElementById("send-data1").style.display = "none";
            document.getElementById("send-data2").style.display = "none";
            divDatabase = document.getElementById("database").style.display = "block"
            divLogin = document.getElementById("login").style.display = "none"
        }
    })
}

function logout() {
    firebase.auth().signOut().then(() => {
        console.log("user logged out")
    }).catch((error) => {
        console.log(error.message)
    });
}

function deleteImageFromFirebase(){
    var imageDeleteDatabase = this.getAttribute("data-image");
    var refImageDeleteDatabase = refImages.child(imageDeleteDatabase);
    refImageDeleteDatabase.remove();
}

function checkIfUserIsLoggedIn() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            console.log("No user is signed in.")
            document.getElementById("sign-in").style.display = "block";
            document.getElementById("sign-out").style.display = "none";
            document.getElementById("send-data1").style.display = "none";
            document.getElementById("images-from-firebase").style.display = "none";
            document.getElementById("send-data2").style.display = "none";
            divDatabase = document.getElementById("database").style.display = "none";
            divLogin = document.getElementById("login").style.display = "block";
    } else {
            document.getElementById("sign-in").style.display = "block";
            document.getElementById("sign-out").style.display = "none";
            document.getElementById("send-data1").style.display = "none";
            document.getElementById("images-from-firebase").style.display = "none";
            document.getElementById("send-data2").style.display = "none";
            divDatabase = document.getElementById("database").style.display = "none";
            divLogin = document.getElementById("login").style.display = "block";
            
    }

})
}
