# mychsa

mychsa, from "My Community Health Service Area", provides a simple [web
interface](/frontend) and [API](/api) to identify which Community Health Service Area (CHSA)
is at a given latitude/longitude.

## Building and running

Assuming docker (the sole dependency) is installed locally, you can
build this app from the command line using the following:

    docker compose build

To run (and also to build, if that hasn't been done separately), use:

    docker compose up

The app will be available by default at http://localhost:8080, or http://localhost:PORT if the `PORT` environment variable is set. For example, with the following bash command, the app will be available at http://localhost:3000:

    PORT=3000 docker compose up

To tear down, and thus destroy all associated docker containers,
including the database, run `docker compose down`.

## Application architecture

This application is composed of the following high-level components. Each component
is contained in its own docker container, which can be built and run
independently, or as part of the `docker compose` toolchain outlined above (unless otherwise indicated).

 - [**api**](/api) - this API server, built on node/express, provides a thin wrapper
  (with additional, application specific validation features) around calls to the BC Open Maps public API. Given a latitude/longitude pair (geopoint), it identifies the intersecting CHSA.
 - [**db**](/db) - a mariadb database to maintain a running log of calls to the above API.
 - [**frontend**](/frontend) - a React app bundled with webpack and deployed to a static apache server. Includes a couple of form controls to interact with the API.
 - [**e2e**](/e2e) - end to end tests for the frontend using a headless browser. Excluded from docker compose toolchain. Integrated with Github Actions, with usage instructions in README.

In addition to the end to end tests, the **api** and **db** containers include 
unit tests. These tests are written with mocha and chai.

## Continuous integration

TODO Github actions are used to automatically run the end to end tests on Github's CI/CD platform.

## Planned improvements

 - log routing to elasticsearch with fluentd
