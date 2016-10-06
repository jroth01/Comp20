// API 
var myLat = 0;
var myLng = 0;
var api = "https://rocky-taiga-26352.herokuapp.com/redline.json"
var stops;
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
                        zoom: 13, // The larger the zoom number, the bigger the zoom
                        center: me,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                };
var map;
var marker;
var infowindow = new google.maps.InfoWindow();

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
function queryStops()
{
        httpRequest('GET', api).then(function (res){
                stops = res;
        }, function(err) {
                alert("Oh no! error getting stops!");
        });
}

function init()
{
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        getMyLocation();
        queryStops();
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

// takes in a cm function 
function markStops(cm,foo)
{
       for (i = 0; i < stops.length; i++) {

       }
}

function createMarker(position, title) {
        // Create a marker
        marker = new google.maps.Marker({
                position: me,
                title: "Here I Am!"
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