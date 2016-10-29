var myLat = 42.352271; // initialized to South Station in Boston
var myLng = -71.05524200000001;
var api = "https://radiant-chamber-20159.herokuapp.com/redline"
var mbtaTrips;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
                        zoom: 13, 
                        center: me,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                };
var map;
var myMarker;
var infowindow = new google.maps.InfoWindow();

/* Array of MBTA red line stations */
var stations = [
{
    name: "South Station",
    lat: 42.352271,
    lg: -71.05524200000001
},
{
    name: "Andrew",
    lat: 42.330154,
    lg: -71.057655
},
{
    name: "Porter Square",
    lat: 42.3884,
    lg: -71.11914899999999
},
{
    name: "Harvard Square",
    lat: 42.373362,
    lg: -71.118956
},
{
    name: "JFK/UMass",
    lat: 42.320685, 
    lg: -71.052391
},
{
    name: "Savin Hill",
    lat: 42.31129, 
    lg: -71.053331
},
{
    name: "Savin Hill",
    lat: 42.31129, 
    lg: -71.053331
},
{
    name: "Park Street",
    lat: 42.35639457, 
    lg: -71.0624242
},
{
    name: "Broadway",
    lat: 42.342622, 
    lg: -71.056967
},
{
    name: "North Quincy",
    lat: 42.275275, 
    lg: -71.029583
},
{
    name: "Shamut",
    lat: 42.29312583, 
    lg: -71.06573796000001
},
{
    name: "Davis",
    lat: 42.39674, 
    lg: -71.121815
},
{
    name: "Alewife",
    lat: 42.395428, 
    lg: -71.142483
},
{
    name: "Kendall/MIT",
    lat: 42.36249079, 
    lg: -71.08617653
},
{
    name: "Charles/MGH",
    lat: 42.361166, 
    lg: -71.070628
},
{
    name: "Downtown Crossing",
    lat: 42.355518, 
    lg: -71.060225
},
{
    name: "Quincy Center",
    lat:  42.251809, 
    lg: -71.005409
},
{
    name: "Quincy Adams",
    lat: 42.233391, 
    lg: -71.007153
},
{
    name: "Ashmont",
    lat: 42.284652, 
    lg: -71.06448899999999
},
{
    name: "Wollaston",
    lat: 42.2665139, 
    lg: -71.0203369
},
{
    name: "Fields Corner",
    lat: 42.300093, 
    lg: -71.061667
},
{
    name: "Central Square",
    lat: 42.365486, 
    lg: -71.103802
},
{
    name: "Braintree",
    lat: 42.2078543, 
    lg: -71.0011385
}
];

/* Returns a station */
function getStationByName(name) {
  return stations.filter(
      function(stations){ return stations.name == name}
  );
}

/* Draws polylines connecting each station on the MBTA red line  */
function drawLines() {
    connect("Alewife", "Davis");
    connect("Davis", "Porter Square");
    connect("Porter Square", "Harvard Square");
    connect("Harvard Square", "Central Square");
    connect("Central Square", "Kendall/MIT");
    connect("Kendall/MIT", "Charles/MGH");
    connect("Charles/MGH", "Park Street");
    connect("Park Street", "Downtown Crossing");
    connect("Downtown Crossing", "South Station");
    connect("South Station", "Broadway");
    connect("Broadway", "Andrew");
    connect("Andrew", "JFK/UMass");

    /* At this point, there is a right fork  on the map to Braintree */
    connect("JFK/UMass", "North Quincy");
    connect("North Quincy", "Wollaston");
    connect("Wollaston", "Quincy Center");
    connect("Quincy Center", "Quincy Adams");
    connect("Quincy Adams", "Braintree");

    /* At this point, there is a left fork  on the map to Ashmont */
    connect("JFK/UMass", "Savin Hill");
    connect("Savin Hill", "Fields Corner");
    connect("Fields Corner", "Shamut");
    connect("Shamut", "Ashmont");
}

/* Connects two stations */
function connect(st1, st2) {
    var station1 = getStationByName(st1)[0];
    var station2 = getStationByName(st2)[0];
    var line = [
          {lat: station1.lat, lng: station1.lg},
          {lat: station2.lat, lng: station2.lg},
    ];
    var redLine = new google.maps.Polyline({
          path: line,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 5
        });
    redLine.setMap(map);
}

/* Connects client to closest station */
function connectMeToStation(closest) {

    var line = [
          {lat: myLat, lng: myLng},
          {lat: closest.lat, lng: closest.lg},
    ];
    var redLine = new google.maps.Polyline({
          path: line,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 5
        });
    redLine.setMap(map);
}

/* Sends a request to fetch MBTA data from api */
function loadMBTA(method, url) {
            // Step 1: create an instance of XMLHttpRequest
            request = new XMLHttpRequest();
            // Step 2: Make request to remote resource
            request.open(method, url, true);
            // Step 3: Create handler function to do something with data in response
            request.onreadystatechange = handleReq;
            // Step 4: Send the request
            request.send();
}

/* Handles the request */
function handleReq() {
            // Step 5: When data is received, get it and do something with it
            if (request.readyState == 4 && request.status == 200) {
                // Step 5A: get the response text
                mbtaTrips = request.responseText;

                // Step 5B: parse the text into JSON
                mbtaTrips= JSON.parse(mbtaTrips);
                
                parseTripList();
                console.log(mbtaTrips);
                plotStations();
                drawLines();
            
            }
            else if (request.readyState == 4 && request.status == 404) {

                var msg = "MBTA Data not found :(\n\n";
                    msg += "Try reloading the browser again\n";
                alert(msg);

                //location.reload();
            }
}

/* Parse JSON and mark each train on the map */
function parseTripList()
{      
        // get triplist JSON
        mbtaTrips = mbtaTrips.TripList.Trips
        var lt, lg, trainName;
        for (var i = 0; i < mbtaTrips.length; i++) {
            if (mbtaTrips[i].Position) {
                lt = mbtaTrips[i].Position["Lat"];
                lg = mbtaTrips[i].Position.Long;
                trainName = mbtaTrips[i].Position.Train;
                estimates = getEstimates(mbtaTrips[i],mbtaTrips[i].Predictions);
                createTrainMarker(lt,lg, trainName, "train.png", estimates);
            }
        }
}

/* Returns a list of estimates for a particular trip */
function getEstimates(trip, predictions) {
    var upcoming = [];
    for (var j = 0; j < predictions.length; j++) 
    {
        if (predictions[j].Stop) {
            upcoming.push ({
                stop: predictions[j].Stop,
                trainID: trip.Position.Train,
                arrival: predictions[j].Seconds, 
                updated: trip.Position.Timestamp
            })
        }
    }
    return upcoming;
}

/* Returns upcoming trains for a particular station */
function upcomingTrains(stationName)
{
    var estimates;
    var destination;
    var upcoming =[];
    // For each train 
     for (var i = 0; i < mbtaTrips.length; i++) {
        // get predictions
     
        estimates =  mbtaTrips[i].Predictions;

        if (mbtaTrips[i].Position && estimates) {
            // find prediction specific to station 
            destination = mbtaTrips[i].Destination;
            trainEst = getEstimates(mbtaTrips[i], estimates);

            for (var j = 0; j < trainEst.length; j++) {
                if (trainEst[j].stop == stationName) {
                    trainEst[j]["destination"] = destination;
                    upcoming.push(trainEst[j]);
                } 
            }
        }
     }
         upcoming.sort(sort_by("arrival", false, parseInt));
     return upcoming;
}

/* Initializes the map */
function init()
{
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        getMyLocation();

        loadMBTA('GET', api);
}

/* Plots each station */
function plotStations() 
{
    var lt, lg, name, estimates;
    for (var i = 0; i < stations.length; i++) {
        name = stations[i].name;
        lt = stations[i].lat;
        lg = stations[i].lg;
        estimates = upcomingTrains(name);
        createStationMarker(lt,lg, name, "mbta.png", estimates);
    }
}

/* Gets my current position */
function getMyLocation() {
        if (navigator.geolocation) { 
            // the navigator.geolocation object is supported on your browser
                navigator.geolocation.getCurrentPosition(function(position) {
                        myLat = position.coords.latitude;
                        myLng = position.coords.longitude;
                        renderMap();
                });
        }
        else {
                alert("Geolocation is not supported by your web browser.  What a shame!");
        }
}

/* Creates marker for a particular station with scheduling info 
* This is a poorly written quick and dirty function with repeated code
* I'd like to come back later and fix this when I have time. 
*/
function createStationMarker(lat,lg,str, imgUrl, estimates) 
{
     var coordinates = new google.maps.LatLng(lat, lg);
        var newMarker = new google.maps.Marker({
                position: coordinates,
                title: str,
                icon: imgUrl
        });

        newMarker.setMap(map);
        headers = "<th>Train ID</th><th>Arrival</th>";
        rows = "";
        rows_alewife = "";
        rows_braintree = "";
        rows_ashmont = "";

        estimates_alewife = [];
        estimates_braintree = [];
        estimates_ashmont = []

        for (i = 0; i < estimates.length; i++) {

            // Converts times to minutes if time > 60 secs and adds a label 
            estimates[i].arrival = editTime(estimates[i].arrival);

            // get all the estimates 
            if (estimates[i]["destination"] == "Alewife") {
                estimates_alewife.push(estimates[i]);

            } else if (estimates[i]["destination"] == "Ashmont"){
                estimates_ashmont.push(estimates[i]);
            }
            else { // else going to braintree 
                estimates_braintree.push(estimates[i]);
            }     
        }

        // Populate html table rows for alewife estimates
        for (j = 0; j < estimates_alewife.length; j++) {
            rows_alewife += "<tr><td>" + estimates_alewife[j].trainID + "</td><td>" + estimates_alewife[j].arrival + "</td></tr>";
        }

        // Populate html table rows for alewife estimates
        for (j = 0; j < estimates_ashmont.length; j++) {
            rows_ashmont += "<tr><td>" + estimates_ashmont[j].trainID + "</td><td>" + estimates_ashmont[j].arrival + "</td></tr>";
        }

        // Populate html table rows for braintree estimates
        for (j = 0; j < estimates_braintree.length; j++) {
            rows_braintree += "<tr><td>" + estimates_braintree[j].trainID + "</td><td>" + estimates_braintree[j].arrival + "</td></tr>";
        }
        
        var contentString = "<h1>" + newMarker.title + "</h1>";
        
        // if there are alewife estimates, append table 
        if (estimates_alewife.length > 0) {
            contentString += "<p><h1>To Alewife:</h1><table style=\"height:auto; width:auto;\">" + headers + rows_alewife + "</table>" + "</p>"
        }

        //if ashmont estimates, append them 
        if (estimates_ashmont.length > 0) {
            contentString +="<p><h1>To Ashmont:</h1><table style=\"height:auto; width: auto;\">" +
             headers + rows_ashmont + "</table>"  + "</p>";
        } 

        //if braintree estimates, append them 
        if (estimates_braintree.length > 0) {
            contentString +="<p><h1>To Braintree:</h1><table style=\"height:auto; width: auto;\">" +
             headers + rows_braintree + "</table>"  + "</p>";
        } 

           // Open info window on click of marker
        google.maps.event.addListener(newMarker, 'click', function() {
                infowindow.setContent(contentString);
                infowindow.open(map, newMarker);
        });
}

/* Returns time in minutes if applicable */
function editTime(timeEstimate) {
    if (timeEstimate >= 60) {
        return timeEstimate= Math.round(timeEstimate / 60) + " minutes";
    }
    else {
        return timeEstimate += " seconds";
    }
}

/* Creates a train marker on the map */
function createTrainMarker(lat,lg,str, imgUrl, estimates) {
        // Create a marker
        var coordinates = new google.maps.LatLng(lat, lg);
        var newMarker = new google.maps.Marker({
                position: coordinates,
                title: str,
                icon: imgUrl
        });
        newMarker.setMap(map);

        closest = getClosestStation(lat,lg);

         var contentString = "<h1> Train " + newMarker.title + "</h1><p>" + "Nearest station is: " + closest.station + "</p>"

         // Open info window on click of marker
        google.maps.event.addListener(newMarker, 'click', function() {
                infowindow.setContent(contentString);
                infowindow.open(map, newMarker);
        });

}

/* Gets the nearest MBTA station to a particular lat and long */
function getClosestStation(Lat, Lon) {
    distances = getDistances(Lat, Lon);
    min = getMinDistance(distances);
    return min;
}

/* Gets the distances between a location and each of the MBTA stations */
function getDistances(Lat, Lon) {
    distances = [];
    for (i = 0; i < stations.length; i++) {
        d = getDistance(Lat, Lon, stations[i].lat, stations[i].lg);
        obj = {
            station: stations[i].name,
            lat: stations[i].lat,
            lg: stations[i].lg,
            distanceTo: d
        };
        distances.push(obj);
    }
    return distances;
}

/* Returns the minimum distance from a list */
function getMinDistance(distances) {
    min = distances[0];
    for (j = 1; j < distances.length; j++) {
        if (distances[j].distanceTo < min.distanceTo) {
            min = distances[j];
        }
    }
    return min;
}

/* Create a generic marker on the map */
function createMarker(lat,lg,str, imgUrl, estimates) {
        // Create a marker
        var coordinates = new google.maps.LatLng(lat, lg);
        var newMarker = new google.maps.Marker({
                position: coordinates,
                title: str,
                icon: imgUrl
        });
        newMarker.setMap(map);
          var contentString = "<h1>" + newMarker.title + "</h1><p>" + JSON.stringify(estimates) + "</p>";
         // Open info window on click of marker
        google.maps.event.addListener(newMarker, 'click', function() {
                infowindow.setContent(contentString);
                infowindow.open(map, newMarker);
        });

}

/* Renders the map */
function renderMap()
{
        me = new google.maps.LatLng(myLat, myLng);
        
        // Update map and go to my current location
        map.panTo(me);

        closest = getClosestStation(myLat, myLng);

        // Create a marker
        myMarker = new google.maps.Marker({
                position: me,
                title: "<p>Nearest station is: " + closest.station + "</p>"
        });
        myMarker.setMap(map);
        
         connectMeToStation(closest);
        // Open info window on click of marker
        google.maps.event.addListener(myMarker, 'click', function() {
                infowindow.setContent(myMarker.title);
                infowindow.open(map, myMarker);
        });
}

/* Awesome sort function I found online
 * SOURCE: http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects 
 */
var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}

/* Returns distance between two coordinates using haversine formula 
 * SOURCE:  http://www.movable-type.co.uk/scripts/latlong.html
 */
function getDistance(lat1, lon1, lat2, lon2)
{
    Number.prototype.toRad = function() {
   return this * Math.PI / 180;
    } 
    var R = 6371; // km 
    var x1 = lat2-lat1;
    var dLat = x1.toRad();  
    var x2 = lon2-lon1;
    var dLon = x2.toRad();  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 
    return d;
}

/* Returns formatted time (NOT USED)
 * SOURCE: https://glenngeenen.be/javascript-seconds-to-time-string/
*/
function formatTime (n) {
    var hours = Math.floor(n._value/60/60),
        minutes = Math.floor((n._value - (hours * 60 * 60))/60),
        seconds = Math.round(n._value - (hours * 60 * 60) - (minutes * 60));
    return hours + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
}