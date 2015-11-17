
var MovieBooking = function(){};

MovieBooking.prototype.addSeats = function() { // render screen and seats of cinema hall
	var movieSeats = $('.movieSeats');
	for(var i=0;i<120;i++) {
		var content = '<div class="col-md-1 col-sm-1 col-xs-1" id="seatUIBlock">' + 
		'<li class="'+movieSeat[i].row+'">' + 
		'<p>' + movieSeat[i].id + '</p>' + 
		'<ul>' +
		'<label class="checkbox">' +
		'<input value="" type="checkbox" id="'+movieSeat[i].id+'"  style="display:none">' +
		'<div class="seatUI"></div>' +
		'</label>' +
		'</ul>' + 
		'</li>' + 
		'</div>';
		movieSeats.append(content);
		if(movieSeat[i].state=="Selected"){
			$('#' + movieSeat[i].id).parent().addClass("selected");
			$('#' + movieSeat[i].id).attr("disabled", "true");
		}
	}
}

MovieBooking.prototype.appendUserDetails = function() { // render user booking details
	var userDetails = $('#userDetails');
	for(var i=0;i<user.length;i++) {
		if(user[i].noOfSeats>0) {
			var content = '<tr>' +
			'<td>' + user[i].name + '</td>' +
			'<td>' + user[i].noOfSeats + '</td>' +	
			'<td>' + user[i].seatsBooked + '</td>' +
			'</tr>';
			userDetails.append(content);
		}
	}	
}


var movie = new MovieBooking();
function init() {
	$("input[type=checkbox]").on("change", function() {
		var chk = $(this);
		var isChecked = chk.prop('checked');
		if (isChecked) {
			chk.parent().addClass("checked");
		}
		else {
			chk.parent().removeClass("checked");
		}
	});

	$(".movieSeats").click(function() { //disable all the checkboxes till user give input
		$("input:checkbox").each(function() {
			$(this).attr("disabled", "true");
		});
	});
}

if (localStorage['user']) { // make localstorage initially
	var user = JSON.parse(localStorage['user']);
} else {
	var user = [];
}

if (localStorage['movieSeat']) {
	var movieSeat = JSON.parse(localStorage['movieSeat']);
} else {
	var movieSeat = [];
	for(var j=65;j<75;j++) {
		for(var i=1;i<13;i++){
			var movieSeatObj = {
				"row":String.fromCharCode(j),
				"id": i + String.fromCharCode(j),
				"state":'Empty'
			}
			movieSeat.push(movieSeatObj);
			localStorage["movieSeat"] = JSON.stringify(movieSeat);
		}
	}
}

var totalSeats = 120;

if(localStorage['reserveSeats']) {
	var reserveSeats = localStorage.getItem('reserveSeats');
}
else {
	var reserveSeats = 0;
}

function confirmSeat() { // when user clicks on confirm seat button
	var userName = $('#userName').val();
	var noOfSeats = $('#noOfSeats').val();
	var seats = [];
	if(noOfSeats == GetSelectedCheckboxCount()) { //check number of seats are equal to seats asked by user
		$("input:checkbox").each(function(e) {
			if ($(this).is(":checked")) {
				seats.push(($(this).attr('id')));
				reserveSeats++;
			}
		});
		localStorage.setItem('reserveSeats',reserveSeats);
		for(var i=0;i<movieSeat.length;i++) { // changing state of seat from checked to selected
			if($('#' + movieSeat[i].id).is(":checked")) {
				movieSeat[i].state = "Selected";
				$('#' + movieSeat[i].id).parent().addClass("selected");
			}
		}
		localStorage["movieSeat"] = JSON.stringify(movieSeat);
		var userObj = {
			"name": userName,
			"noOfSeats": noOfSeats,
			"seatsBooked":seats,
		}
		user.push(userObj);
		localStorage["user"] = JSON.stringify(user);
		$('#userName').val("");
		$('#noOfSeats').val("");
		location.reload();
	}
	else {
		alert("Please Select " + noOfSeats + " Seats");
	}
}

function seatSelection() {
	var userName = $('#userName').val();
	var noOfSeats = $('#noOfSeats').val();
	if(noOfSeats > (totalSeats - reserveSeats)) { //check number of seats asked by user are available
		alert("Sorry " + noOfSeats + " seats are not available")
	}
	else {
		$(".movieSeats").click(function() {
			if (GetSelectedCheckboxCount() == noOfSeats) {
				$("input:checkbox").each(function() {
					if ($(this).is(":checked")) {
						$(this).removeAttr("disabled");
					}
					else {
						$(this).attr("disabled", "true");
					}
				});
			}
			else {
				$("input:checkbox").each(function() {
					$(this).removeAttr("disabled");
				});    
			}
		});
	}
}


function GetSelectedCheckboxCount() { //get number of checked checkbox
	var selectedCheckboxCount = 0;
	$("input:checkbox").each(function() {
		if ($(this).is(":checked")) {
			selectedCheckboxCount++;
		}
	});
	return selectedCheckboxCount;
}

movie.appendUserDetails();
movie.addSeats();
init();