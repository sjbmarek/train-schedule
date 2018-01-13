

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
      // var convertedTime = moment(trainTime,"h:mm A");
      // var minutesAway = Math.floor(moment().diff(trainTime,"minutes",true));
      // var minutesAway = 17;
      // var today = new moment();
      // var emp_date = new moment(startDate);
      // var dateDiff = moment().subtract(startDate);
      // console.log(dateDiff);
      // var monthsWorked = Math.floor(moment().diff(startDate,"months",true));

      console.log("name: " + name);
      console.log("destination: " + destination);
      console.log("time: " + trainTime);
      // console.log(moment(convertedTime).format("h:mm A"));
      console.log("freqeuncy: " + frequency);
      // console.log("minutes away: " + minutesAway);

      database.ref().push({
        name: name,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency,
        // minutesAway: minutesAway,
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
      //   trainTime = moment(snapshot.val().trainTime,"HH:mm").add(frequency,"minutes");
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
      // Writes the saved value from firebase to the display
      $("#addRow").prepend(tr);
    
      //Handles firebase failure if it occurs

    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
