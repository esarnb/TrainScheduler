//FireBase Initialization
var firebaseConfig = {
    apiKey: "AIzaSyDkeFLoKhW5wVDFYMTf7DoICGL14Vnljj8",
    authDomain: "trainscheduler-sr.firebaseapp.com",
    databaseURL: "https://trainscheduler-sr.firebaseio.com",
    projectId: "trainscheduler-sr",
    storageBucket: "trainscheduler-sr.appspot.com",
    messagingSenderId: "721920220550",
    appId: "1:721920220550:web:408403b22546d5a2"
};

//Global Variables
var trainName = $("#train-name-input");
var destination = $("#destination-input");
var firstTrainTime = $("#ftt-input");
var frequency = $("#frequency-input");
var submit = $("#add-train-btn");

//Functions
function nextArrival() {

}

function minutesAway() {

}

//New Train Event Listener
database.ref().on("child_added", function(childSnapshot) {
    // Log everything that's coming out of snapshot
    console.log(
        `Name: ${childSnapshot.val().trainName} |`+
        `Destination: ${childSnapshot.val().destination} |`+
        `FirstTrainTime: ${childSnapshot.val().firstTrainTime} |`+
        `Frequency: ${childSnapshot.val().frequency} |`
    )
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

//Append NewTrain to site
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    var row = $("<tr>");
        row.append($("<th>").text(snapshot.val().trainName));
        row.append($("<th>").text(snapshot.val().destination));
        row.append($("<th>").text(snapshot.val().frequency));
        row.append($("<th>").text("Next Arrival"));
        row.append($("<th>").text("Minutes Away"));
    $("#train-table").append(row)
});