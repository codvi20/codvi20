# Abstract

The aim of this project is to implement a solution to the alert for
disease prevention when a case that has been in the proximty is detected.

Principal focus of the proposed solution are:
   * secrecity and confidentiallity: no centralized personal data is stored
   * confidence in the diagnostic of trusted sources
   * no central point to be broken

# License

This is an open project.
You can copy, distribute, use to inspirate your own creation, implement
or do whatever you may want with the information here contained, with 
ONLY TWO CONDITIONS: 
  1. you need to need to make an explicit reference to this project and the authors.
  2. you have to create a pull request in which you identify yourself and th email and name your project in a clear way in the file "associated-projects.txt"

# Brief description
Each has an instance of the app in their device.
Every N seconds, the app sends to a server the id of the device and the
geoposition; both hashed.
The server answers with the list of hashed device ids that were in the same 
geoposition during the last period of time.
The device stores inside its memory this information.

When someone has a positive infection diagnostic by a trusted authority,
it sends its device id hashed and signed with trusted authority key to the
network.

All the devices in the network recieve the hashed id signed, verify the
signature is correct and check if the hashed id is in their list of
recent proximity. If it's, a message appears to the user advicing a potential
risk of infection.


## Basic principles
No information on "where" is stored in the device.

Information of "who" were in proximity is stored, hashed to avoid impersonation,
in each device, since it's for the benefit of the owner to have an early
diagnostic and treatment.

Servers do not store the information for more than a short period of time.
There is no record of the activity of the users.

There is a list of potential risks and the countermeasures [here](risk-and-measures.md).
