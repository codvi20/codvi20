# List of risks and countermeasures

## Impersonation
A user sends this message to the server asking for ids in the proximity:
   ```sh
   {my-id-hashed, my-coords-hashed}
   ```

Then, the server answers with a list of hashed-ids of the devices in the
proximity.

The user might store these values and hack the system notifying fake coords
to confuse the system:

    ```sh
    {one-of-the-received-ids-hashed, another-coords-hashed}
    ```

### Countermeasure
The server will answer with the hashed id again in the following way:
    ```sh
    hash( hashed-id + serverSequence )
    ```

When the infection is detected, the hashed id sent by the authority is 
rehashed by each server with its sequence.

This forces the authority to send the infected hashed id  to all
recognized servers in the netwowk where the message needs to be propagated.

Every user will receive several copies of the hashed id infected rehashed,
one per server.
