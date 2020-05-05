# Open questions

## How an infection is communicated and propagated to the WHOLE network?
An authority sends a message of infection of a hashed-id.

How does it reach all users in network? Because every device asks for
last N hours infections in the network.

## Time to store information in server, frequency of notifications.
The question of how long we need to store in the server for a coincidence.

If we want to coinsider "in the same place" two devices that stay for
S seconds or more together, 
  - which should be the acceptable frequency of notification for the devices?
  - and the storage time of the positions in server

## And what if there is no GPS?
It will not detect the position and nothing can be notified.
Maybe it's good at this moment to scan for bluetooth near devices and store
them as it's done with the answer from servers.

## Please change SHA1 by something more secure
Of course, at least SHA256.
The number of different GPS positions with a resolution of 4 meters in a
country like Spain is about a rectangule of 6 degress by 7 degrees (and
each degree is about 111111 meters) is about 32,407,342,592
Think if it's big enough to ensure a good spreadding (and no collision expected
for a 2^256 space).
