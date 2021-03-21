# mychsa

mychsa, from "My Community Health Service Area", provides a simple [web
interface](tree/main/e2e) and API to identify which Community Health Service Area (CHSA)
is at a given latitude/longitude.

## Building and running

Assuming docker (the sole dependency) is installed locally, you can
build this app from the command line using the following:

    docker compose build

To run (and also to build, if that hasn't been done separately), use:

    docker compose up

The app will be available at http://localhost:8080.    

To tear down, and thus destroy all associated docker containers,
including the database, run `docker compose down`.

## Application architecture

This application is composed of the following high-level components. Each component
is contained in its own docker container, which can be built and run
independently, or (unless otherwise indicated) as part of the `docker compose` toolchain outlined above.

 - **api** - this API server, built on node/express, provides a thin wrapper
  (with additional, case specific validation features) around calls to the public BC Geographic Warehouse API. Given a latitude/longitude pair (geopoint), it identifies the intersecting CHSA.
 - **db** - a mariadb database to maintain a running log of calls to the above API.
 - **frontend** - a React app bundled with webpack and deployed to a static apache server. Includes a couple of form controls to interact with the API.
 - **e2e** - end to end tests for the frontend using a headless browser. Excluded from docker compose toolchain. Integrated with Github Actions, with usage instructions in README.

In addition to the end to end tests, the **api** and **db** containers include 
unit tests. These tests are written with mocha/chai.

## Continuous integration

TODO Github actions are used to automatically run the end to end tests on Github's CI/CD platform.
