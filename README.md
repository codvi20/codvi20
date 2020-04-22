# Abstract

The aim of this project is to implement a solution to the alert for
disease prevention when a case that has been in the proximty is detected.

Principal focus of the proposed solution are:
   * secrecy and confidentiality: no personal data is stored on any central server
   * confidence in the diagnostic of trusted sources
   * no single point of failure

# License

This is an open project.
You can copy, distribute, use to inspirate your own creation, implement
or do whatever you want with the information here contained, with 
ONLY TWO CONDITIONS: 
  1. you need to make an explicit reference to this project and the authors.
  2. you have to create a pull request in which you identify yourself with your email and name of your project in a clear way in the file "associated-projects.txt"

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

Servers do not store the information for more than a short period of time. 
There is no record of the activity of the users.

There is a list of potential risks and the countermeasures [here](risk-and-measures.md).
