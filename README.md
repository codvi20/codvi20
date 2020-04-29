# Abstract

The aim of this project is to implement a solution to the alert for
disease prevention when a case that has been in the proximty is detected.

Principal focus of the proposed solution are:
   * secrecy and confidentiality: no personal data is stored on any central server
   * confidence in the diagnostic of trusted sources
   * no single point of failure

# License

This is an open source project, free-libre.
You can copy, distribute, use to inspirate your own creation, implement
or do whatever you want with the information here contained, with 
ONLY TWO CONDITIONS: 
  1. you need to make an explicit reference to this project and the authors.
  2. you have to create a pull request in which you identify yourself with your email and name of your project in a clear way in the file "associated-projects.txt"

# Technical and non technical aspects

This prototype opens a list of questions, not all technical, but mathematical
and social. Check out them:
  1. Open [technical](open-technical-questions.md) questions technical
  1. Open [mathematical](open-mathematical-questions.md) questions
  1. Open [social](open-social-questions.md) question

# Other similar projects
We've found similar projects:
  1. [DP^3T](

# Brief description
The user has an instance of the app in their device.
Every N seconds, the app sends the device id and its
geoposition to a server; both hashed.
The server answers with the list of hashed device ids that were in the same 
geoposition during the last period of time.
The device stores this information.

When someone is diagnosed as positive covid19 by a trusted authority(e.g. a hospital),
it sends its device id hashed and signed with the trusted authority key to the
network.

All the devices in the network recieve the hashed id signed, verify the
signature is correct and check if the hashed id is in their list of
recent proximity. If it is, a message appears to the user warning a potential
risk of infection.


## Basic principles
No location information is stored in the device. This is only sent to the server.

Information of "who" were in proximity is stored, hashed to avoid impersonation,
in each device, since it's for the benefit of the owner to have an early
diagnostic and treatment.

The servers do not store the information for more than a short period of time. 

The devices store the information only for some days. 14 days makes sense as its the consensus incubation period, but it may change if the consensus changes.

There is no record of the activity of the users.

There is a list of potential risks and the countermeasures [here](risk-and-measures.md).


## Code structure - to readers
### The device side
In `device-core` you can find two folders: `src` where the Javascript with de ide logic is, and `test` where some tests try to execute the code in a simple way.

### The server side
We've created a simple demo for the server to be deployed in Google Cloud.

Under `gcloud` folder, the stuff for server side is present.

The most important file is `server.js`, a simple implementation of server side 
functionallity based in express.

### The Android specific wrapper
Under `android` folder we've placed the Android SDK project.
It's an hypbrid application that wrapps Javascript in an index.html specific
for Android.
See `app/src/main/assets/www/index.html` for the Main single page of the
application. It's loaded in a WebView in file
`app/src/main/java/com/codvi20/android/MainActivity.java`. And that's all our
knowledge on mobile apps, sorry.

Before building Android project, you need to deploy JavaScript files
under `device-core/src`. The `deploy-into-andorid.sh` does this.
