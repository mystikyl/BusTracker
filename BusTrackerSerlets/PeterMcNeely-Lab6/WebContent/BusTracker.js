"use strict";
/**
 * Peter McNeely
 */
var map = null;	        // a Google Map object
var timer = null;       // an interval timer
var update = 0;         // update counter


$().ready(function() {      // when document loads, do some initialization
	"use strict";
    var startPoint = new google.maps.LatLng(43.044240, -87.906446);// location of MSOE athletic field
    displayMap(startPoint); // map this starting location (see code below) using Google Maps
    addStartMarker(map, startPoint, "MSOE Athletic Field", "The place to be!");  // add a push-pin to the map

    // initialize button event handlers (note this shows an alternative to $("#id).click(handleClick)
    $("#start").on( "click", paintNewMap);
    $("#stop").on( "click", stopTimer);
    $("#pan").on( "click", panToCityHall);

    // adds the enter functionality to the text box.
    $("#route").keydown( function(e){
        if (e.which === 13){
            paintNewMap();
        }});
});

/**
 * Display a Google Map centered on the specified position. If the map already exists, update the center point of the map per the specified position
 * param position - a google.maps.LatLng object containing the coordinates to center the map around
 */

function displayMap(position) {
    "use strict";
    var mapOptions = {
        zoom: 13, // range 0 to 21 (the mouse can be used to zoom in and out)
        center: position, // the position at the center of the map
        mapTypeId: google.maps.MapTypeId.ROADMAP // ROADMAP, SATELLITE, or HYBRID
    };
    var mapDiv = $("#map").get(0); // get the DOM <div> element underlying the jQuery result
    if(map===null) { // create just once
        map = new google.maps.Map(mapDiv, mapOptions); // create a map if one doesn't exist
    } else {
        map.panTo(position) // only panning to the start position
    }
}

/**
 * This function adds a "push-pin" marker to the existing map
 * @param map - the map to add the marker to
 * @param position - the google.maps.LatLng position of the marker on the map
 * @param title - the title of the marker
 * @param content - the text that appears when a user clicks on the marker
 */

function addMarker(map, position, title, content) {
    "use strict";
    var markerOptions = {
    position: position, // position of the push-pin
        map: map,	// the map to put the pin into
        title: title, // title of the pin
        clickable: true, // if true, enable info window pop-up
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/bus.png",
        }
        };
    // create the push-pin marker
    var marker = new google.maps.Marker(markerOptions);

    // now create the pop-up window that is displayed when you click the marker
    var infoWindowOptions = {
        content: content, // description
        position: position // where to put it
    };
    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    google.maps.event.addListener(marker, "click", function() {
        infoWindow.open(map);
    });
}

/**
 * Adds the starting marker to the map; the typical push pin locator.
 * @param map - the map to add the marker to
 * @param position - the google.maps.LatLng position of the marker on the map
 * @param title - the title of the marker
 * @param content - the text that appears when a user clicks on the marker
 */
function addStartMarker(map, position, title, content){
    "use strict";
    var markerOptions = {
        position: position, // position of the push-pin
        map: map,	// the map to put the pin into
        title: title, // title of the pin
        clickable: true, // if true, enable info window pop-up
    };
    // create the push-pin marker
    var marker = new google.maps.Marker(markerOptions);

    // now create the pop-up window that is displayed when you click the marker
    var infoWindowOptions = {
        content: content, // description
        position: position // where to put it
    };
    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    google.maps.event.addListener(marker, "click", function() {
        infoWindow.open(map);
    });
}

/**
 * This function executes a JSON request to the CPULoadServlet
 */
function doAjaxRequest() {
    "use strict";
    let route = checkRoute();
    $("#update").html("Number of times route "+ $("#route").val() +" was updated: "+update++);
    var params = "key=" + key +"&rt=" + route;
    $.ajax({
        type: "get",
        url : "http://sapphire.msoe.edu:8080/BusTrackerProxy/BusInfo", // the url of the servlet returning the Ajax response
        data : params, // key and route, for example "key=ABCDEF123456789&rt=31"
        dataType: "json",
        success: handleSuccess,
        error: handleError
    });
    if (timer === null) {
        timer = setInterval(doAjaxRequest, 5000)
    }
    // When started, it should cause doAjaxRequest to be called every 5 seconds
}

// This function stops the timer and nulls the reference
function stopTimer() {
    "use strict";
    clearInterval(timer);
    update = 0;
    $("#update").html("Number of times route " + $("#route").val() + " was updated: " + update)
    timer = null;
    stopUpdate();
}

/**
 * This function is called if the Ajax request succeeds. The response from the server is a JavaScript object!
 *
 * @param response
 * @param textStatus
 * @param jqXHR
 */

function handleSuccess( response, textStatus, jqXHR ) {
    "use strict";
    let table = $("#table1").html("");
    var innerhtml = "<tr><th>Bus</th><th>Route</th><th>latitude</th><th>longitude</th><th>speed(MPH)</th><th>dist(mi)</th></tr>";
    if (!response["bustime-response"]) {
        alert(response.status);
        stopTimer();
    } else if (response["bustime-response"].vehicle) {
        for (let e of response["bustime-response"]["vehicle"]) {
            let latitude = e.lat;
            let longitude = e.lon;
            let id = e.vid;
            innerhtml += "<tr><td>" + id + "</td><td>" + e.rt + "</td><td>" + Number(latitude).toFixed(5) + "</td><td>"
                + Number(longitude).toFixed(5) + "</td><td>" + e.spd + "</td><td>" + calculateDistance(e.pdist) + "</td></tr>";
            var position = new google.maps.LatLng(latitude, longitude); // creates a Google position object
            addMarker(map, position, id, "Bus " + id + " to " +e.des);
        }
        table.html("<tbody>" + innerhtml + "</tbody>");
    } else if (response["bustime-response"].error) {
        let error = response["bustime-response"].error[0].msg;
        if ( error === "No data found for parameter") {
            alert("The bus route " + $("#route").val() + " is not valid.");
        } else {
            alert("There was an error: " + response["bustime-response"].error[0].msg );
        }
        stopTimer();
    }
}

/**
 * This function is called if the Ajax request fails (e.g. network error, bad url, server timeout, etc)
 **/
function handleError(jqXHR, textStatus, errorThrown) {
    "use strict";
    console.log("Error processing Ajax request!");
    if (textStatus === "error"){
        alert("Problem with the contacting the page: " + errorThrown);
        stopTimer();
    }
}

/**
 * Calculates the distance from feet to miles
 * @param e the String representing the distance in ft.
 * @returns {*} the speed calculated into miles
 */
function calculateDistance(e){
    let speed;
    if (Number.isFinite(e)){
        speed = Number.parseInt(e);
        speed /= 5280.0; // changes speed from Feet to miles
    }
    return speed.toFixed(3);
}
/**
 * Refreshes the map when the stop button is pressed. Repaints the
 */
function stopUpdate(){
    let startPoint = new google.maps.LatLng(43.044240, -87.906446);
    let mapOptions = {
        zoom: 13,
        center: startPoint,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    let mapDiv = $("#map").get(0);
    map = new google.maps.Map(mapDiv, mapOptions);
    displayMap(startPoint);
    addStartMarker(map, startPoint, "MSOE Athletic Field", "The place to be!");

    var innerhtml = "<tr><th>Bus</th><th>Route</th><th>latitude</th><th>longitude</th><th>speed(MPH)</th><th>dist(mi)</th></tr>";
    $("#table1").html(innerhtml);
}
/**
 * Starts fresh with a enw map when ever the start button is pressed
 */
function paintNewMap(){
    let startPoint = new google.maps.LatLng(43.044240, -87.906446);
    let mapOptions = {
        zoom: 13,
        center: startPoint,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    let mapDiv = $("#map").get(0);
    map = new google.maps.Map(mapDiv, mapOptions);
    displayMap(startPoint);
    addStartMarker(map, startPoint, "MSOE Athletic Field", "The place to be!");

    doAjaxRequest();
}

/**
 * Ensures that if you are looking for the colored lines you would then be able to look up the correct bus line
 * @returns {string|jQuery|*} the correct Bus code associated with the line.
 */
function checkRoute(){
    let route = $("#route").val().toUpperCase();
    if (route === "GREEN" || route === "GRN"){
        route = "GRE"
    } else if (route ==="GOLD"){
        route = "GOL"
    } else if (route ==="BLUE" || route === "BL"){
        route = "BLU"
    } else if (route ==="PURPLE" || route === "PURP"){
        route = "PUR"
    }
    return route;
}

/**
 * Pans the map back to the City Hall location, in case they lose track of where they are.
 */
function panToCityHall(){

    // let startPoint = new google.maps.LatLng(43.044240, -87.906446);
    map.panTo(new google.maps.LatLng(43.044240, -87.906446));
}


