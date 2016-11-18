# Server Side Implementation

I added you as a collaborator to https://twenty48.herokuapp.com/
I made it a separate app from the previous one I used in the last assignment,
to keep things organized on my end. 

The heroku app on the server side has the following endpoints:

## Endpoints 
**GET /** - Home, the root, the index in HTML. Accessing this on a web browser 
displays list of all the 2048 game scores for all players sorted in descending 
order by score. I did descending order simply by using the syntax given by
MongoDB documentation, where listing the parameter field and a value of -1 
does the trick: 

        scores.find().sort( {score: -1} ... etc 

Usernames and game timestamps are displayed in addition to the 
score. I formatted this page using Bootstrap. On load, the page makes a get
request to /allscores. I used JQuery to iterate through the response array
and populate the table. 

**POST /submit.json** - Submits final score and grid for a terminated 2048 game 
from any domain. The mandatory fields and exact field names for submission to 
this API are username, score, and grid. Successful submission of these three 
pieces of data adds one entry into the collection scores in Mongo. 
If a submission is missing any one of the data fields the record is not entered. 
Cross-origin resource sharing is enabled. 

**GET /scores.json** - Returns a JSON array of objects for a specified player with 
the scores sorted in descending order. If username is empty, returns empty JSON 
array []

## MongoDB 
In the Mongo Database I provisioned with Heroku, there is only one collection -
scores. 

Each document in the scores collection contains:

* username (a string) - Name of player for the game
* score (a number) - The player's score
* grid (JSON) - The final grid when game is terminated
* created_at (a timestamp) - Timestamp when new document was created, 
entered into database

The timestamp is added on the server side, just before I insert a new
document into the database. 

# Client Side Implementation

All I did here was find where the game ends, so I could send off the
score and grid info to a database before the grid is reset. I just modified 
game_manager.js.

When the game ends, I modified the code to prompt the user for their name. 
If they don't enter a name, I never send a post request. (I double check again 
on the server side as well).

Else, I send a post request to /submit.json with the username, score , and grid 
info.

# Cool stuff
        
I made it so you can play the modified game right on the heroku app, and your
scores will be submitted to the database! Just added the original client side
code and made it accessible via GET /2048.

You can play the game using this url: https://twenty48.herokuapp.com/2048

When you finish a game, it will prompt you to enter your username. If you enter
something, you can then go to the home page for the app and see your name
on the list of player scores.  

# Collaboration
I referenced the MongoDB documentation, JQuery docs, class examples, and 
stackoverflow.

# Time Spent
2 hours
