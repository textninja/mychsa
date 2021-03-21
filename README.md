# mychsa

mychsa provides a simple web interface and API for identifying which
Community Health Service Area (CHSA), if any, a latitude/longitude point
intersects.

## Usage

Assuming docker (the sole dependency) is installed locally, you can
build this app from the command line using the following:

    docker compose build

To run, use:

    docker compose up

To tear down, which will stop and delete all associated docker containers,
and clear the database, run `docker compose down`.


The app will then be exposed on localhost, port 8080.