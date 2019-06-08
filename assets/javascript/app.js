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

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

//Global Variables
var trainName = $("#train-name-input");
var destination = $("#destination-input");
var firstTrainTime = $("#ftt-input");
var frequency = $("#frequency-input");
var submit = $("#add-train-btn");

//Functions
/**
 * 
 * @param {String} firstTime : first train military timing
 * @param {Integer or String} frequency : interval of each incoming train
 * @param {String} type decides between responding with arrivals or time remaining when calling the function.
 * 
 * Function
 */
function nextArrival(firstTime, frequency, type) {
    var diff = moment(moment() - moment(firstTime, "HH:mm")).minutes()
    console.log("diff: " + diff);
    
    var remainder = (diff % frequency)
    console.log("remainder: " + remainder);
    
    var minutesAway = (frequency - remainder);
    console.log("minutes: " + minutesAway);
    
    var nextTrain = moment().add(minutesAway, "minutes").format("HH:mm");
    console.log(nextTrain);
    
    if (!firstTime || !frequency || !type) return "--"
    else if (type === "minutes") return minutesAway;
    else if (type === "arrival") return nextTrain;
    
}

function insertTrain(snapshot) {
    var row = $("<tr>");
        row.append($("<th>").text(snapshot.val().trainName));
        row.append($("<th>").text(snapshot.val().destination));
        row.append($("<th>").text(snapshot.val().frequency));
        row.append($("<th>").text(nextArrival(snapshot.val().firstTrainTime, snapshot.val().frequency, "arrival")));
        row.append($("<th>").text(nextArrival(snapshot.val().firstTrainTime, snapshot.val().frequency, "minutes")));
    $("#train-table").append(row)
}

//New Train Event Listener pull info from firebase, update to website
database.ref().on("child_added", function(childSnapshot) {
    // Log everything that's coming out of snapshot
    console.log(
        `Name: ${childSnapshot.val().trainName} | `+
        `Destination: ${childSnapshot.val().destination} | `+
        `FirstTrainTime: ${childSnapshot.val().firstTrainTime} | `+
        `Frequency: ${childSnapshot.val().frequency} | `
    )

    insertTrain(childSnapshot)


}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// //Append NewTrain to site
// database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
//     insertTrain(snapshot)
// });


$(document).ready(function() {

    //Update db and site with new train object
    submit.on("click", function(event) {
        event.preventDefault();
        
        //Push new data into firebase
        var newTrain = {
            trainName: trainName.val().trim(),
            destination: destination.val().trim(),
            firstTrainTime: firstTrainTime.val().trim(),
            frequency: frequency.val().trim(),
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        }
        database.ref().push(newTrain);

        //Reset text boxes on site
        trainName.val("");
        destination.val("");
        firstTrainTime.val("");
        frequency.val("");
    })
})