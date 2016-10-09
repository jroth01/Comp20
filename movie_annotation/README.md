Justin Roth
Comp20 Lab - Movie Annotation

# Implementation
For this assignment, I attached an event listener to the element with the video tag, and configured it to listen for time updates. 

I then wrote a callback function to update the innerHTML of the element with the "movie_quotes" id to be a caption, depending on the current time position in the movie.

I also added some simple CSS rules to center the movie, make it a bit smaller,
and change the font. 

If I have time, I'd love to play around with making a pause button / fast forward / rewind. 

# Collaboration
While i didn't collaborate with anyone in person, I did reference the "Double Rainbow" example on the TuftsDev github. 

https://github.com/tuftsdev/WebProgramming/tree/gh-pages/examples/doublerainbow

I modeled my callback function off the one in the example, using a chain of
if /elseif statements to set the caption at the current position. 

# Time Spent
About 1 hour
