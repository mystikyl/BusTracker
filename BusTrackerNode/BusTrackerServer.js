/**
 * Created by mcneelypj on 2/8/2017.
 */
"use strict";

var express = require('express');
var http = require('http');

var favicon = require('serve-favicon');
var ajax = require('request');

var app = express();

app.use(favicon(__dirname + '/webcontent/images/favicon.ico'));
app.use(express.static(__dirname + '/webcontent'));

/**
 * Starts the server on a specific port
 * @type {http.Server}
 */
var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Express server running from host " + host + " on port " + port);
});


/**
 * Gets called when the browser gets a request at BusInfo URL also makes sure to check the error checking
 */
app.get('/BusInfo', function( request, response ) {
    console.log("BusInfo called");
     // import the request library (downloaded from NPM) for making ajax requests
    // import and use the 'url' package for parsing request urls (in order to get params)
    var route = request.query.rt; // default route. Get the real one from the 'rt=XXX' request param. See demo code for hints.
    var key = request.query.key; // default key. Get the real one (yours) from the 'key=XXXXX' request param


    // the default response (same as asking for route 1000)
    var busData;
    if( route === '1000') { // simulate MCTS server error...
        busData = {status:"Server Error; IOException during request to ridemcts.com: Simulated server error during request to ridemcts.com"}; // the default JSON response
        response.json(busData); // note that this sends the above default response
        return;
    } else if( route === '1001' ) {
        response.writeHead(404);
        response.end();
        console.log("Route 1001 called");
        return;
    } else if( route === '1002' ) { // generate 1001, 1002, 1003 responses that simulate other error conditions
        busData = {status: "Key or route parameter empty"};
        response.json(busData);
        return;
    }else if( route === '1003' ) { // generate 1001, 1002, 1003 responses that simulate other error conditions
        key = "ABCE";
    }
    if (route !== null && key !== null) {
        var url = "http://realtime.ridemcts.com/bustime/api/v2/getvehicles?key=" + key + "&rt=" + route + "&format=json";
    }
    if ( busData === undefined) {
        // if no errors are simulated, make the real ajax call to MCTS
        ajax(url, function (error, res, body) {
            console.log("AJAX called");
            if (!error && res.statusCode === 200) { // no errors and a good response
                // parse the body (a JSON string) to a JavaScript object
                busData = JSON.parse(body);
            }
            // Note: if a failure occurs, the default response above is sent here
            response.json(busData);
        });
    }
});
