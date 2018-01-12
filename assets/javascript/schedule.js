

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

      $("#submit").on("click", function(event) {
      event.preventDefault();

      // Capture User Inputs and store them into variables
      var name = $("#name").val().trim();
      var destination = $("#destination").val().trim();
      var trainTime = $("#trainTime").val().trim();
      var frequency = $("#frequency").val().trim();
      var minutesAway = 45;

      // var today = new moment();
      // var emp_date = new moment(startDate);
      // var dateDiff = moment().subtract(startDate);
      // console.log(dateDiff);
      // var monthsWorked = Math.floor(moment().diff(startDate,"months",true));
      // console.log(monthsWorked);

      // var totalBilled = monthsWorked * monthlyRate;

      console.log("name: " + name);
      console.log("destination: " + destination);
      console.log("time: " + trainTime);
      console.log("freqeuncy: " + frequency);
      // console.log("months: " + monthsWorked);
      // console.log("total: " + totalBilled);

      database.ref().push({
        name: name,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency,
        minutesAway: minutesAway,
        // monthsWorked: monthsWorked,
        // totalBilled: totalBilled,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      $("#name").val("");
      $("#destination").val("");
      $("#frequency").val("");
      $("#trainTime").val("");
    });

     database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
      console.log(snapshot.val());

      var tr = $('<tr>'
          + '<td>' + snapshot.val().name + '</td>'
          + '<td>' + snapshot.val().destination + '</td>'
          + '<td>' + snapshot.val().frequency + '</td>'
          + '<td>' + snapshot.val().trainTime + '</td>'
          + '<td>' + snapshot.val().minutesAway + '</td></tr>'
          // + '<td>' + snapshot.val().totalBilled + '</td></tr>'
          );
      // Writes the saved value from firebase to our display
      $("#addRow").prepend(tr);
    
      //Handles firebase failure if it occurs

    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
