# Open social questions

## Resolution in distance to consider two devices "in the same place"
Each minute in GPS is about 1.85 meters.

So if we decide two devices are in the same place if they are closer than
2 meters:
  - we need to discretize positions to 1/2 minute
  - send the information of location five times: one per real position,
    and the rest for each cardinal point adding and substracting 1/2 minute

## Time in proximity to consider "neighbors" 
And, combined with the distance, it's important to determine which is the
minimum time we want someone to be close to ("close to" according to the
answer to previous question).

Is it enough 10 nanoseconds? Or maybe 10 minutes?

The decissions are important since if we use "to aggressive" parameters
(let's say 100 meters and 1 millisecond is enought to be contagied)
we are going to notify the risk of infection to much more people 
(probably not infected at all) than if we use "too relaxed" parameters
(like 1 meter of distance for 2 hours).

In both cases the application will be useless to prevent anything and, in
tje first case, a lot of tests will be wasted.
