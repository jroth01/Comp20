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
- Handling 404 errors / performing the initial HTTP request to the mbta api

Cool stuff:
- Plotted trains with a different icon
- Clicking on a train will tell the user which station that train is closest to
- Each train marker notes that train's ID number 
- Made train schedules broken into two tables for each station: one for trains
headed to Alewife and another table for trains headed to braintree.
- Train schedules list the train id, arrival time, and the time the trip info 
was last updated
- Schedules sorted in ascending order by arrival time

# Collaboration
I used stackoverflow for general info about HTTP requests / promises with javascript. 

I used the recommended code for computing distance between two locations
using the Haversine formula: http://www.movable-type.co.uk/scripts/latlong.html

I used a cool sorting function for sorting javascript objects based on attribute: http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects

# Time Spent
3.5 hours 