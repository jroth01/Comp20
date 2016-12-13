# Comp20: Web Programming Portfolio
This repository contains my work for the programming course at Tufts
taught by Ming Chow.

# Favorite Assignments
The MBTA geolocation map! It was rewarding to use a practical api that
provided (almost) real time transit information, and integrate that
with the Google maps api. It was also great that we had to re-build the
mbta endpoints you initially provided us, and understand how the
client side and server side communicate. 

One takeaway was that there are always tradeoffs in design -even if it's a simple one-off assignment. 
For example, some people chose to get all the mbta transit information on page load, which
keeps down the number of requests and provides instant display of
information when you click on the station marker. However, that choice meant that the data wasn't the most recent. Some people alternatively elected to send a request when you click on a station marker, get the response, and show the most recent data. The cost of that is
more code, more requests, and possibly slight delay depending on how you choose
to implement it.  

The assignment spec was deliberately ambiguous on this design choice -- it didn't matter which design you chose so long as it functioned properly. This ambiguity caused everyone to 
consider the tradeoffs of various designs that are functionally correct. 

Another takeaway from the geolocation assignment was that if you make things modular, it shouldn't be hard to configure your old front end to work with a new back end and vice versa 
(like when we replaced your heroku app that served the mbta data). 

# Personal Growth
Coming into this course, I had a very strong interest in web programming.
I had used a number of libraries and bloated frameworks for building simple web apps, 
(AngularJS etc) but I didn't deeply understand what was happening behind the scenes.
The cost of relying on other people's abtractions is that they often hide the subtle, interesting parts of solving a puzzle. 

Now I have a better foundational understanding of networking/ web programming, as well as 
the challenges and opportunities it presents to developers. Specifically, 
I feel like I have a much better handle on asyncronous callbacks & first class
functions. This course has definitely inspired an interest in 
programming languages... 

# Most Important Takeaways

* You learn just as much from your peers as you do from professors
* Using version control with git & communicating your ideas with meaningful comments
 helps everyone maintain and troubleshoot a project
* Javascript is really expressive, also incredibly forgiving - for that reason, it's sometimes painful to debug
* Being okay with failing as you're still learning, and recognizing that understanding mistakes make you a much better programmer and team player 
* Self-teaching by reading documentation & reviewing examples is very, very empowering 

# Moving Forward
I'm interested in learning more about how to design, implement, and *maintain*
scalable web applications. Specifically, more about proper model-view-controller
design, and integrating the front end with the server such that there's two
way data binding.

I'm looking forward to Web Engineering next semester!