window.onload = initialize;

var database;
var refDatabase;
var tbodyVisits;
var CREATE = "Añadir visita"
var UPDATE = "Modificar visita"
var modo = CREATE;
var refEditDatabase;

function initialize() {
    database = document.getElementById("form-visits");

    database.addEventListener("submit", sendConvalidationstoFirebase, false);

    tbodyVisits = document.getElementById("tbody-visits");

    refDatabase = firebase.database().ref().child("Visitas");

    showDatabaseofFirebase();
}

function showDatabaseofFirebase() {
    refDatabase.on("value", function(snap){
    var data = snap.val();
    var showData = "";
    for(var key in data){
        showData += "<tr>" +
                        "<td>" + data[key].vrPlace + "</td>" +
                        "<td>" + data[key].vrIsland + "</td>" +
                        "<td>" + data[key].deviceCompany + "</td>" +
                        "<td>" + data[key].deviceModel + "</td>" +
                        "<td></td>" +
                        '<td>' +
                        '<button class="btn btn-default edit" data-vr="' + key + '">' +
                          '<span class="fas fa-edit"></span>' +
                        '</button>' +
                      '</td>' +
                        '<td>' +
                          '<button class="btn btn-danger delete" data-vr="' + key + '">' +
                            '<span class="fas fa-trash"></span>' +
                          '</button>' +
                        '</td>' +
                    "</tr>";
    }
    tbodyVisits.innerHTML = showData;
    if(showData != ""){
        var editElements = document.getElementsByClassName("edit");
        for(var i = 0; i < editElements.length; i++){
            editElements[i].addEventListener("click", editDatabasefromFirebase, false);
            }
            var deleteElements = document.getElementsByClassName("delete");
        for(var i = 0; i < deleteElements.length; i++){
            deleteElements[i].addEventListener("click", deleteDatabaseFromFirebase, false);
            }
        }
    });
}

function editDatabasefromFirebase(){
    var keyEditDatabase = this.getAttribute("data-vr");
    refEditDatabase = refDatabase.child(keyEditDatabase);
    refEditDatabase.once("value", function(snap){
        var data = snap.val();
        document.getElementById("island").value = data.vrIsland
        document.getElementById("place").value = data.vrPlace
        document.getElementById("device-model").value = data.deviceModel
        document.getElementById("device-company").value = data.deviceCompany

    });
    document.getElementById("send-data").value = UPDATE;
    modo = UPDATE;
}

function deleteDatabaseFromFirebase(){
    var keyDeleteDatabase = this.getAttribute("data-vr");
    var refDeleteDatabase = refDatabase.child(keyDeleteDatabase);
    refDeleteDatabase.remove();
}

function sendConvalidationstoFirebase(event) {
    event.preventDefault();
    switch(modo){
        case CREATE:
            var database = event.target;
            refDatabase.push({
                deviceCompany: database.deviceCompany.value,  
                deviceModel: database.deviceModel.value,
                vrIsland: database.vrIsland.value,
                vrPlace: database.vrPlace.value
            });
            break;
        case UPDATE:
            var database = event.target;
            refEditDatabase.update({
                deviceCompany: database.deviceCompany.value,  
                deviceModel: database.deviceModel.value,
                vrIsland: database.vrIsland.value,
                vrPlace: database.vrPlace.value
            });
            modo = CREATE;
            document.getElementById("send-data").value = CREATE;
            break;
    }
    database.reset();
}
