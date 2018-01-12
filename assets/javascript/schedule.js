

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
      var role = $("#role").val().trim();
      var startDate = $("#startDate").val().trim();
      var monthlyRate = $("#monthlyRate").val().trim();

      // var today = new moment();
      // var emp_date = new moment(startDate);
      // var dateDiff = moment().subtract(startDate);
      // console.log(dateDiff);
      var monthsWorked = Math.floor(moment().diff(startDate,"months",true));
      console.log(monthsWorked);

      var totalBilled = monthsWorked * monthlyRate;

      console.log("name: " + name);
      console.log("role: " + role);
      console.log("start: " + startDate);
      console.log("rate: " + monthlyRate);
      console.log("months: " + monthsWorked);
      console.log("total: " + totalBilled);

      database.ref().push({
        name: name,
        role: role,
        startDate: startDate,
        monthlyRate: monthlyRate,
        monthsWorked: monthsWorked,
        totalBilled: totalBilled,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      $("#name").val("");
      $("#role").val("");
      $("#startDate").val("");
      $("#monthlyRate").val("");
    });

     database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
      console.log(snapshot.val());

      var tr = $('<tr>'
          + '<td>' + snapshot.val().name + '</td>'
          + '<td>' + snapshot.val().role + '</td>'
          + '<td>' + snapshot.val().startDate + '</td>'
          + '<td>' + snapshot.val().monthsWorked + '</td>'
          + '<td>' + snapshot.val().monthlyRate + '</td>'
          + '<td>' + snapshot.val().totalBilled + '</td></tr>'
          );
      // Writes the saved value from firebase to our display
      $("#addRow").prepend(tr);
    
      //Handles firebase failure if it occurs

    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
