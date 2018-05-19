

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

      var firstTime = snapshot.val().trainTime;

      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart (remainder)
      var tRemainder = diffTime % (snapshot.val().frequency);
      console.log(tRemainder);

      // Minute Until Train
      var tMinutesTillTrain = (snapshot.val().frequency) - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

      if (tMinutesTillTrain < 10) {

        var trow = $('<tr class="sooner">'
          + '<td>' + snapshot.val().name + '</td>'
          + '<td>' + snapshot.val().destination + '</td>'
          + '<td>' + snapshot.val().frequency + '</td>'
          + '<td>' + nextTrain.format("h:mm A") + '</td>'
          + '<td>' + tMinutesTillTrain + '</td>'
          + '<td><i class="fa fa-trash" aria-hidden="true"></i></td></tr>'
          );
        $("#addRow").prepend(trow);


      } else {



      var trow = $('<tr class="later">'
        + '<td>' + snapshot.val().name + '</td>'
        + '<td>' + snapshot.val().destination + '</td>'
        + '<td>' + snapshot.val().frequency + '</td>'
        + '<td>' + nextTrain.format("h:mm A") + '</td>'
        + '<td>' + tMinutesTillTrain + '</td>'
        + '<td><i class="fa fa-trash" aria-hidden="true"></i></td></tr>'
        );
      $("#addRow").prepend(trow);
    };
        // Writes the saved values from firebase to the display

        // This mess is me trying to add a class to color the table row
        //green if the train was withing 10 minutes of arrival.
        // I was unsuccessful

        // if (tMinutesTillTrain < 10) {
          // $("trow").removeClass();
          // $("trow").addClass("sooner");
          // ("#addRow").prepend(trow);$
        // } else {
          // $("tr").removeClass();
          // $("tr").addClass("later");
          // $("#addRow").prepend(trow);
        // };

        //Handles firebase failure if it occurs

    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
