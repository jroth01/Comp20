// API 
var myLat = 0;
var myLng = 0;
var api = "https://rocky-taiga-26352.herokuapp.com/redline.json"
var mbtaTrips;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
                        zoom: 13, // The larger the zoom number, the bigger the zoom
                        center: me,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                };
var map;
var marker;
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

    // forks here
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
                mbtaTrips = JSON.parse(mbtaTrips);
                parseTripList();
        }, function(err) {
                alert("Oh no! error getting stops!");
        });
}

function parseTripList()
{      
        // get triplist JSON
         mbtaTrips = mbtaTrips.TripList.Trips
        var lt, lg, trainName;
        for (var i = 0; i < mbtaTrips.length; i++) {
            lt = mbtaTrips[i].Position.Lat;
            lg = mbtaTrips[i].Position.Long;
            trainName = mbtaTrips[i].Position.Train;
            createMarker(lt,lg, trainName, "train.png");
        }
}

function init()
{
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        getMyLocation();
        plotStations();
        drawLines();
        queryTripList();
}

function plotStations() 
{
    var lt, lg, name;
    for (var i = 0; i < stations.length; i++) {
        name = stations[i].name;
        lt = stations[i].lat;
        lg = stations[i].lg;
         createMarker(lt,lg, name, "mbta.png");
    }
}

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

function createMarker(lat,lg,str, imgUrl) {
        // Create a marker
        var train = new google.maps.LatLng(lat, lg);
        marker = new google.maps.Marker({
                position: train,
                title: str,
                icon: imgUrl
        });
        marker.setMap(map);

}

function renderMap()
{
        me = new google.maps.LatLng(myLat, myLng);
        
        // Update map and go there...
        map.panTo(me);

        // Create a marker
        marker = new google.maps.Marker({
                position: me,
                title: "Here I Am!"
        });
        marker.setMap(map);
                
        // Open info window on click of marker
        google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(marker.title);
                infowindow.open(map, marker);
        });
}

// Using haversine formula
// code from  http://www.movable-type.co.uk/scripts/latlong.html
function getDistance()
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