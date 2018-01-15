

   // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBkHlX4gqpYOqfBrQUZmY6XLl4LWfkLRJw",
    authDomain: "testsusan-56bcd.firebaseapp.com",
    databaseURL: "https://testsusan-56bcd.firebaseio.com",
    projectId: "testsusan-56bcd",
    storageBucket: "testsusan-56bcd.appspot.com",
    messagingSenderId: "577306188182"
  };


    firebase.initializeApp(config);

    var database = firebase.database();


    // Define function to update time
    var update = function () {
        currentTime = moment();
        $("#time").text("Current Time " + (moment(currentTime).format("h:mm:ss A")));
         console.log("db time: " + currentTime);

         // database.ref().push({
         // currentTime: currentTime
         // });
    };

    // Sends current time to display every second
    $(document).ready(function(){
        update();
        setInterval(update, 1000);  
    });


    var destinationCity = ["Seoul  서울", "Busan  부산", "Dongdaegu  동대구", "Incheon  인천", "Ulsan  울산", "Pyeongchang  평창"];


    $("#submit").on("click", function(event) {
      event.preventDefault();

      // Capture User Inputs and store them into variables
      var name = $("#name").val().trim();
      var destination = $("#destination").val().trim();
      var trainTime = $("#trainTime").val().trim();
      var frequency = $("#frequency").val().trim();
   
      console.log("name: " + name);
      console.log("destination: " + destinationCity[destination]);
      console.log("time: " + trainTime);
      console.log("freqeuncy: " + frequency);
      // Save values to firebase
      database.ref().push({
        name: name,
        destination: destinationCity[destination],
        trainTime: trainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      // Clear the input fields
      $("#name").val("");
      $("#destination").val("");
      $("#frequency").val("");
      $("#trainTime").val("");
    });


    database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
      console.log(snapshot.val());

      // var minutesAway = moment().diff(moment(snapshot.val().trainTime,"HH.mm"),"minutes");
      var minutesAway = moment(snapshot.val().trainTime,"HH.mm").diff(moment(),"minutes");
      console.log(minutesAway);
      console.log("------------");

      if (minutesAway < 0 ){
        minutesAway = minutesAway + 1440;
      };

      //if miuntesAway = 0, then update firebase with new trainTime = trainTime + frequency
      // How will the display update every minute?????  Add a decrimenting timer??
      
      // if (minutesAway === 0) {
      //   trainTime = moment(snapshot.val().trainTime,"HH:mm").add(snapshot.val().frequency,"minutes");
      //   database.ref().push({
      //   trainTime: trainTime,
      // });
      //   console.log("new trainTime: " + trainTime);

      // };

  
      var tr = $('<tr>'
          + '<td>' + snapshot.val().name + '</td>'
          + '<td>' + snapshot.val().destination + '</td>'
          + '<td>' + snapshot.val().frequency + '</td>'
          + '<td>' + moment(snapshot.val().trainTime,"HH:mm").format("h:mm A") + '</td>'
          + '<td>' + minutesAway + '</td></tr>'
          );
      // Writes the saved values from firebase to the display
      $("#addRow").prepend(tr);
    
      //Handles firebase failure if it occurs

    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });



    // Notes for time manipulation

    // // Time apart (remainder)
    // var tRemainder = diffTime % tFrequency;
    // console.log(tRemainder);

    // // Minute Until Train
    // var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // // Next Train
    // var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
