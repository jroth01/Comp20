// API 
var myLat = 42.352271;
var myLng = -71.05524200000001;
var api = "https://rocky-taiga-26352.herokuapp.com/redline.json"
var mbtaTrips;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
                        zoom: 13, // The larger the zoom number, the bigger the zoom
                        center: me,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                };
var map;
var myMarker;
var infowindow = new google.maps.InfoWindow();


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

function getStationByName(name) {
  return stations.filter(
      function(stations){ return stations.name == name}
  );
}

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

    //right fork 
    connect("JFK/UMass", "North Quincy");
    connect("North Quincy", "Wollaston");
    connect("Wollaston", "Quincy Center");
    connect("Quincy Center", "Quincy Adams");
    connect("Quincy Adams", "Braintree");

    // left fork
    connect("JFK/UMass", "Savin Hill");
    connect("Savin Hill", "Fields Corner");
    connect("Fields Corner", "Shamut");
    connect("Shamut", "Ashmont");
}

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

// Return a promise from an http request 
//http://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
function httpRequest(method, url) {
        //returns a promise
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = resolve;
        xhr.onerror = reject;
        xhr.send();
    });
}

// Get each stop, store in array
// map over the stops, put down markers
function queryTripList()
{
        httpRequest('GET', api).then(function (res){
                mbtaTrips = res.target.response;
                status = res.currentTarget.status;

                if (status == 200) {
                    mbtaTrips = JSON.parse(mbtaTrips);
                    console.log(mbtaTrips);
                    parseTripList();
                    plotStations();
                    drawLines();
                } else {
                    alert("Data not found!");
                }
        }, function(err) {
                alert("Oh no! error getting stops!");
        });
}

// Parse JSON and mark each train on the map 
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
                createMarker(lt,lg, trainName, "train.png", estimates);
            }
        }
}

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

function upcomingTrains(stationName)
{
    var estimates;
    var upcoming =[];
    // For each train 
     for (var i = 0; i < mbtaTrips.length; i++) {
        // get predictions
        estimates =  mbtaTrips[i].Predictions;

        if (mbtaTrips[i].Position && estimates) {
            // find prediction specific to station 
            trainEst = getEstimates(mbtaTrips[i], estimates);
            
            for (var j = 0; j < trainEst; j++) {
                console.log("triggered");
                if (trainEst[j].stop == stationName) {
                    upcoming.push(trainEst[j]);
                }

            }
        }
     }

     return upcoming;
}
// Initialize the map
function init()
{
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        getMyLocation();

        queryTripList();
}

// Plot each station 
function plotStations() 
{
    var lt, lg, name, estimates;
    for (var i = 0; i < stations.length; i++) {
        name = stations[i].name;
        lt = stations[i].lat;
        lg = stations[i].lg;
        estimates = upcomingTrains(name);
        console.log(estimates);
        createMarker(lt,lg, name, "mbta.png", estimates);
    }
}

// Get my current position
function getMyLocation() {
        if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
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

// Create a marker on the map
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

// Render the map
function renderMap()
{
        me = new google.maps.LatLng(myLat, myLng);
        
        // Update map and go to my current location
        map.panTo(me);

        // Create a marker
        myMarker = new google.maps.Marker({
                position: me,
                title: "Here I Am!"
        });
        myMarker.setMap(map);
                
        // Open info window on click of marker
        google.maps.event.addListener(myMarker, 'click', function() {
                infowindow.setContent(myMarker.title);
                infowindow.open(map, myMarker);
        });
}

// Using haversine formula
// code from  http://www.movable-type.co.uk/scripts/latlong.html
function getDistance(lat1, lon1, lat2, lon2)
{
    var R = 6371e3; // metres
    var φ1 = lat1.toRadians();
    var φ2 = lat2.toRadians();
    var Δφ = (lat2-lat1).toRadians();
    var Δλ = (lon2-lon1).toRadians();

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
}