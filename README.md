# Emma Code Challenge

Getting Started
---------------
* Install Node.js version 6.9
* Run `npm install`
* Run `npm test`

* Could the function be improved if the same list of links is being passed in many times,
and what are the tradeoffs?
It's possible to implement some sort of caching mechanism that stores the last N links 
that the list of links being passed in could be checked against.  It's not clear that it makes sense
to cache the list itself unless we knew more about the links being passed in..  

Are the lists of links
mutually exclusive?  If so, we could has the list and then check against a list of cached lists.  Otherwise
there would be duplicate entries which might be a pain.

The drawbacks include: 
1. Links that were valid are no longer valid, or the opposite, where lists that were valid
are no longer valid.  
1. Managing the cache.  How long should lists of links be stored?  How big should it be?


* How might the function be written to process arbitrarily long lists of links?
The function takes an array of links, that at least at this point is arbitrarily long.  I guess
its a question of how long is reasonable?  I think this could handle quite a few before we'd have
to worry about breaking the url validation loop into an asynchronous call that would allow the system
to remain responsive.

* How might this function be exposed as an HTTP API to be used by a front-end
application?
If the list of urls is limited to a few, they could be part of an http GET call that passes them as 
URL parameters.  However that is kind of limited as the request URL could get unwieldy early.  A PUT
request might be okay too, though we're not really modifying anything.  The reason to use a PUT or a 
POST is to allow the list of urls to be passed in the body.  The issue is, if you are a REST purist,  
nothing is really being created (in the case of POST) or modified (in the case of PUT).
