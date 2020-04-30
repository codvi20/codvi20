# A simple demo

## First device
With id=111
Position as shown in picture
![Image of 1st device](doc/20200429_184909.jpg)

## Second device
With id=333 and location shown in the picture (close to the other one).
![Image of 2ndt device](doc/20200429_184917.jpg)

## Hospital reports an infection
Of the device 111
![Infection report](doc/20200429_185053.jpg)

## Second device reports risk to user
As it was close to the other device.
![Infection report](doc/20200429_185118.jpg)

## Notes
So simple.

No info is stored in servers. There is only info of matching ids inside
the devices.


## How to deal with the buttons and the prototype
Yo see a lot of buttons: because it's a PROTOTYPE and all the functionallity
is open to be controlled by user. No timers at this moment.

Two ways to access the app:
  1. Via APP (downloading the apk, installing, for experts since it's not 
signed and we've compiled for Android 10.
  2. Via Web. It's the same app since the app is an "Hybrid": it includes
inside the HTML5 code.

In both cases you will see a list of buttons and text areas:
  1. The *id* of the device: set if different for different devices when you
test them
  1. The *Minimum infection matches* to set the minimum number of times
a dived should be near to an infected device to consider it in risk.
  1. *Max days to remember* is the number of days the memory of near devices
is stored in this device

With this values set, you neww to press *Set values* to save.
In the real application it will be down at startup automatically.

Press *send geolocation* to send the server you hashed position and your id.
(You'll receive the list of near devices as an answer of this request.)
This function would be invoked periodically without user intervention.

Press *checkForInfection* to ask the network the list of infected ids.
The device will check the id against its own list of historical near devices
and shows a *true* or *false* if a risk of infection is detected or not.
This function would be invoked once a doy v.g. to check for a risk.

To notify an infection, there is a web page (in the demo is under the
URL `/static/notify-infection.html`): insert the id and press the button to send
to server the notification.
