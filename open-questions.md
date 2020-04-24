# Open questions

## How an infection is communicated and propagated to the WHOLE network?
An authority sends a message of infection of a hashed-id.

How does it reach all users in network?

## Resolution in distance to consider two devices "in the same place"
Each minute in GPS is about 1.85 meters.

So if we decide two devices are in the same place if they are closer than
2 meters:
  - we need to discretize positions to 1/2 minute
  - send the information of location five times: one per real position,
    and the rest for each cardinal point adding and substracting 1/2 minute

## Time to store information in server, frequency of notifications.
The question of how long we need to store in the server for a coincidence.

If we want to coinsider "in the same place" two devices that stay for
S seconds or more together, 
  - which should be the acceptable frequency of notification for the devices?
  - and the storage time of the positions in server


