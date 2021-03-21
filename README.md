# mychsa

mychsa provides a simple web interface and API for identifying the
Community Health Service Area (CHSA) a latitude/longitude point
intersects.

## Building and running

Assuming docker (the sole dependency) is installed locally, you can
(optionally) build this app from the command line using the following:

    docker compose build

To run (and build, if that hasn't been done already), use:

    docker compose up

The app will be available at http://localhost:8080.    

To tear down, which will destroy all associated docker containers,
including the database, run `docker compose down`.

