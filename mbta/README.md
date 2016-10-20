Justin Roth
COMP20 Assignment 2 - MBTA

# Implementation

Correctly implemented:
- All the MBTA Red Line subway stations are marked on the map
- Each station on the map is a marker with a T icon
- Rendered a red polyline connecting each station, showing the complete Red Line on the map
- Determined and marked user location on the map
- Noted the closest MBTA Red Line subway station from where user is
- Polyline connecting user marker to the closest MBTA Red Line subway station
- Upon clicking on a MBTA Red Line subway station marker, display an infowindow of the schedule of upcoming trains for that station

Needs work:
- Handling 404 error. I made the decision to not load the station markers if
the client gets a 404, given that the site is only useful if it can show
real-time train information. Instead, I give an alert and tell the user to
do a hard refresh of the page. I recognize this is "cheap". 

It would be more aethetically appealing to load each of the station makers, and on click, have each display some kind of "data not found" message. This is
something i would like to come back to and fix. 

- The function "createStationMarker()" is a laughably horrible abomination. I've been under a severe time crunch with my coursework this week, and that one
slipped through the cracks in the middle of the night. I plan to refactor this using some sort of map function. 

Cool stuff:
- Plotted trains with a different icon
- Clicking on a train will tell the user which station that train is closest to
- Each train marker notes that train's ID number 
- Made train schedules broken into two tables for each station: one for trains
headed to Alewife and another table for trains headed to braintree.
- Train schedules list the train id, arrival time, and the time the trip info 
was last updated
- Schedules sorted in ascending order by shortest arrival time

# Collaboration
I used stackoverflow for general info about HTTP requests, as well as
lecture notes, and the examples under the tufts dev web programming repo. 

I used the recommended code for computing distance between two locations
using the Haversine formula: http://www.movable-type.co.uk/scripts/latlong.html

I used a cool sorting function for sorting javascript objects based on attribute: http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects


# Time Spent
3.5 hours 