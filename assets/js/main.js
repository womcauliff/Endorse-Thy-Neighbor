var config = {
    apiKey: "AIzaSyAkrIa4l9BEGvOJZdtwuvBFljp7ZKw9cqo",
    authDomain: "endorse-thy-neighbor.firebaseapp.com",
    databaseURL: "https://endorse-thy-neighbor.firebaseio.com",
    storageBucket: "endorse-thy-neighbor.appspot.com",
};

// Initialize Firebase
firebase.initializeApp(config);
var database = firebase.database();

$(document).ready(function () {
    console.log("ready()");
});

var personName = "";
var linkedInURL = "";
$("#formsubmit").on("click", function (e) {
    e.preventDefault();

    personName = $("#person-name").val().trim();
    linkedInURL = $("#linkedin-url").val().trim();
    linkedInValid = linkedInURL.slice(0, 28);
    console.log(linkedInValid);

    if (personName === "" || linkedInURL === "") {
        console.log("empty form, return");
        return false;//prevent page refresh
    } else if (linkedInValid !== "https://www.linkedin.com/in/") {
        alert("Please enter a valid URL (https://www.linkedin.com/in/)")
    } else {


        database.ref().push({
            personName: personName,
            linkedInURL: linkedInURL,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("#person-name").val("");
        $("#linkedin-url").val("");
    }
    return false;//prevent page refresh
});

database.ref().on("child_added", function (childSnapshot) {

    if (childSnapshot.val() == null) {
        return;
    }

    var $entry = $("<div>").addClass("row studentrow");
    var $nameDiv = $("<div>").addClass("col-md-4");
    var $name = $("<input>").val(childSnapshot.val().personName).addClass('name').attr('disabled', true).attr('id', childSnapshot.key);
    $name.appendTo($nameDiv);
    var $url = $("<div>").addClass("col-md-6 url").html($('<a>' + childSnapshot.val().linkedInURL + '</a>').attr('href', childSnapshot.val().linkedInURL));
    var $edit = $("<div>").addClass("col-md-2").html($("<i>").addClass("fa btn fa-pencil").attr('aria-hidden', true).attr('data-id', childSnapshot.key));

    $nameDiv.appendTo($entry);
    $url.appendTo($entry);
    $edit.appendTo($entry);
    $entry.appendTo($("#students"));


}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

$(document).on('click', ".fa-pencil", edit);
$(document).on('click', ".fa-floppy-o", save);

function edit() {
    var userID = $(this).data('id');
    var $name = "#" + userID;
    $($name).removeAttr('disabled');
    $(this).removeClass("fa-pencil");
    $(this).addClass("fa-floppy-o");

    var test = $(this).closest('.studentrow').children('.url');
    var oldURL = $(this).closest('.studentrow').children('.url').children('a').attr('href');
    test.html($("<input>").val(oldURL));
    $(this).parent().append($("<i>").addClass("fa btn fa-trash-o").attr('aria-hidden', true).on('click', remove).attr('data-id', userID));

}

function save() {
    var userID = $(this).data('id');
    var $name = "#" + userID;
    var newName = $($name).val().trim();
    var newURL = $(this).closest('.studentrow').children('.url').children('input').val().trim();


    $(this).closest('.studentrow').children('.url').html($('<a>').text(newURL).attr('href', newURL));
    $($name).attr('disabled', true);
    $(this).removeClass("fa-floppy-o");
    $(this).addClass("fa-pencil");
    $(".fa-trash-o").remove();


    database.ref(userID + "/personName/").set(newName);
    database.ref(userID + "/linkedInURL/").set(newURL);

}

function remove() {
    var userID = $(this).data('id');
    $(this).closest(".studentrow").remove();
    database.ref(userID).remove().then(function () {
        console.log("Remove succeeded");
    });
}