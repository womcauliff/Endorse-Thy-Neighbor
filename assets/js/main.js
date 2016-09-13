// Initialize Firebase
firebase.initializeApp(config);
var database = firebase.database();

$(document).ready(function () {
	console.log("ready()");
});

var personName = "";
var linkedInURL = "";
$("#formsubmit").on("click", function() {
	personName = $("#person-name").val().trim();
	linkedInURL = $("#linkedin-url").val().trim();

	if (personName === "" || linkedInURL === "") {
		console.log("empty form, return");
		return false;//prevent page refresh
	}

	console.log(personName);
	console.log(linkedInURL);

	
	database.ref().push({
		personName: personName,
		linkedInURL: linkedInURL,
		dateAdded: firebase.database.ServerValue.TIMESTAMP
	});
	
	return false;//prevent page refresh
});

database.ref().on("child_added", function(childSnapshot) {

	if(childSnapshot.val() == null) {
		return;
	}
	console.log(childSnapshot.val());

	
	var studentEntry = $("<div>").addClass("col-md-12");
	studentEntry.append($("<div>").addClass("col-md-6").text(childSnapshot.val().personName));
	studentEntry.append($("<div>").addClass("col-md-6").html($('<a>' + childSnapshot.val().linkedInURL + '</a>').attr('href', childSnapshot.val().linkedInURL)));

	$("#students").append($("<div class='row studentrow'>").append(studentEntry));

}, function(errorObject) {
	console.log("Errors handled: " + errorObject.code);
});
