# Suggestion from Dr. Kenneth Paterson

Very intesting objections to this prototype.
And maybe the destiny of this project: to have open questions.

## Bandwith consumption
As the device is constantly connecting to server, it will consume lot of
bandwith.

### Proporsal
Reducing the frequency of connection to server (to do it every 2 minutes or
every 5 minutes if it's considered thst is the minimum time in proximity
to incur in a risk of contagious) and creating an specific protocol 
smaller than JSON, the device might send and receive in each connection about 
1Kb, so 1Mb per day.


## Battery consumption
It seems G4 connections are more expensive in terms of battery than Low
energy Usage BT connections (the other approach to detect proximity).


## GPS hashed is not secure at all
The main issue detected by Dr. Paterson is that hashing GPS positions 
before sending to server does not add any extra confidentiallity degree:
we always can calculate the hash value for all gps coordinates and then
they are totally non-confidential.

It's totally true. In fact is even worst!
Because we don't need to calculate it for all places, only for those we want
to track specially.

### A solution? No

Let's suppose there exists:

1. A function `a(x)` that, for a given device `A` chypers the position `x`
1. A function `f(A,B)(a(x),b(y))` that gives 1 if `x==y` and 0 otherwise

Under this circumstances, if I know `f(A,B)`, and `b`, I can for each 
`z=a(x)` given discover the real value of `x`, just mapping all posible
values for `y` and evaluating the function `f(A,B)(z,b(y))`.
The sooner this function is `1` for a `y`, the original position for A is `y`.

So no guarantee on confidentiallity for device position is feasible
if there is a third point that checks if two position matches.


Instead of sending the GPS hashed, might be better to send it to the power
of the hashed device Id.
Then the server will match the position received by device A 
with received from device B if:

messageFromA ^ idB == messageFromB ^ idA

as

messageFromA = hashedGPS ^ idA

But it's not a solution: if we store all the messages sent by idA, we can
calculate we're she was.
No matter if we add something that changes during time; it's just a question
of time and memory to calculate the values.
Everything modulus a agreed number. 
