/**
 * Created by mcneelypj on 2/1/2017.
 */
"use strict";

var map = null;	        // a Google Map object
var update = 0;// update counter
var timer = null;
var myApp = angular.module('myApp', ['ui.bootstrap']);

/**
 * The initialization call to set up the map.
 */
window.onload = function(){
    var startPoint = new google.maps.LatLng(43.044240, -87.906446);// location of MSOE athletic field
    displayMap(startPoint); // map this starting location (see code below) using Google Maps
    addStartMarker(map, startPoint, "MSOE Athletic Field", "The place to be!");  // add a push-pin to the map
};

/**
 * The Angular controller for the creation of the data on the HTML page
 */
myApp.controller('busController', function($scope, $http, $interval){
    $scope.doAjaxRequest = function() {
        $http({
            method: "GET",
            url: "http://sapphire.msoe.edu:8080/BusTrackerProxy/BusInfo",
            params: {"key": key,"rt": $scope.route},
        }).then(function handleSuccess(response) {
            $scope.status = response.data.status;
            $scope.statusText = response.statusText;
            if (!response.data["bustime-response"]){
                $scope.reason = $scope.status;
                $scope.error = true;
                $scope.stopBus();
            } else if (response.data["bustime-response"].error){
                $scope.reason = response.data["bustime-response"].error[0].msg;
                $scope.error = true;
                $scope.stopBus();
            } else if (response.data["bustime-response"]["vehicle"]){
                $scope.count = ++update;
                $scope.success = true;
                $scope.busList = response.data["bustime-response"]["vehicle"];
                $scope.error = false;
                for (let e of $scope.busList){
                    let lat = e.lat;
                    let lon = e.lon;
                    addMarker(map, new google.maps.LatLng(lat, lon), e.vid, "Bus " + e.vid + " to " + e.des)
                }
                if (timer == null){
                    timer = $interval($scope.doAjaxRequest,10000);
                }
            }


        }, function handleError(response) {
            $scope.reason = response.status + " " + response.statusText;
            $scope.error = true;
            $scope.stopBus();
            });
    };

    $scope.stopBus = function(){
        console.log("Stoping the timer");
        $interval.cancel(timer);
        $scope.success = false;
        $scope.busList = null;
        update = 0;
        timer = null;
    }

    $scope.panToCityHall = function() {
         map.panTo(new google.maps.LatLng(43.044240, -87.906446));
    }


 });

/**
 * Adds a marker to the map at the location of the values passed in
 * @param map the map that will have the added flags
 * @param position The position in maps.google.LatLon(lat, lon)
 * @param title The title of the pin
 * @param content the description of the pin
 */
function addMarker(map, position, title, content) {
    "use strict";
    let markerOptions = {
        position: position, // position of the push-pin
        map: map,	// the map to put the pin into
        title: title, // title of the pin
        clickable: true, // if true, enable info window pop-up
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/bus.png",
        }
    };
    // create the push-pin marker
    let marker = new google.maps.Marker(markerOptions);

    // now create the pop-up window that is displayed when you click the marker
    let infoWindowOptions = {
        content: content, // description
        position: position // where to put it
    };
    let infoWindow = new google.maps.InfoWindow(infoWindowOptions);
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
 * Displays the map on the screen
 * @param position The starting location to where the map will be centered in maps.google.LatLong(lat,lon) notation
 */
function displayMap(position) {
    "use strict";
    var mapOptions = {
        zoom: 13, // range 0 to 21 (the mouse can be used to zoom in and out)
        center: position, // the position at the center of the map
        mapTypeId: google.maps.MapTypeId.ROADMAP // ROADMAP, SATELLITE, or HYBRID
    };
    var mapDiv = document.getElementById("map");
    if(map===null) { // create just once
        map = new google.maps.Map(mapDiv, mapOptions); // create a map if one doesn't exist
    } else {
        map.panTo(position) // only panning to the start position
    }
}

