 
$(document).ready(function(){

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAUxDANeh1fGhzDzUTMizQsJJ8WdRi191o",
    authDomain: "train-scheduler-38586.firebaseapp.com",
    databaseURL: "https://train-scheduler-38586.firebaseio.com",
    projectId: "train-scheduler-38586",
    storageBucket: "train-scheduler-38586.appspot.com",
    messagingSenderId: "255043979089"
  };
firebase.initializeApp(config);
  var traindata = firebase.database().ref();
//   Show user current time
  $("#currentTime").append(moment().format("hh:mm A"));
  
// Button to add train
$("#submit-train").on("click", function(){
    event.preventDefault();
    // grabs user input
    var trainName = $("#train-name").val().trim();
    var trainDestin = $("#destination").val().trim();
    // convert to UNIX
    var trainTime = moment($('#first-time').val().trim(),"HH:mm").subtract(10, "years").format("X");
    var trainFreq=$("#frequency").val().trim();
    console.log(trainName, trainDestin, trainTime, trainFreq);

    // create object to hold data
    var newTrain={
        name: trainName,
        destination: trainDestin,
        firstTrain: trainTime,
        frequency: trainFreq,
    }
    // upload train data to firebase database
    traindata.push(newTrain);
    // clear input textboxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-time").val("");
    $("#frequency").val("");
});

// create event to add trains to firebase
traindata.on("child_added", function(childSnapshot){
    var data = childSnapshot.val();
    var trainNames = data.name;
    var trainDestination = data.destination;
    var trainFrequency =data.frequency;
    var firstTrainTime = data.firstTrain;
    console.log(firstTrainTime);

    // calculate minutes remianign till next train
    // subtract first train time form current time in Unix, get modulus of difference and frequency

    var remainder = moment().diff(moment.unix(firstTrainTime), "minutes")%trainFrequency;
    var timeMinutes = trainFrequency - remainder;
    // add timeMinutes to current time to get arrival time
    var arrivalTime = moment().add(timeMinutes, "m").format("hh:mm A");
    console.log(arrivalTime);
    // append train's info to table
    $("#train-table > tbody").append("<tr><td>" + trainNames + "</td><td>" + trainDestination + "</td><td class='min'>" + trainFrequency + "</td><td class='min'>" + arrivalTime + "</td><td class='min'>" + timeMinutes + "</td></tr>");

});
});
