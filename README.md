[![CI](https://github.com/textninja/mychsa/actions/workflows/main.yml/badge.svg)](https://github.com/textninja/mychsa/actions/workflows/main.yml)

# mychsa

mychsa, from "My Community Health Service Area", provides a simple [web
interface](/frontend) and [API](/api) to identify which Community Health Service Area (CHSA)
is at a given latitude/longitude.

## Building and running

Assuming docker and docker-compose (the sole dependencies) are installed locally, you can
build this app from the command line using the following:

    docker-compose build
    
The above command automatically runs all available unit tests (but **not** the end to end tests), and the build will fail if any defects are found.

To run, use:

    docker-compose up

The app will be available at http://localhost:8080, unless the `MYCHSA_PORT` environment variable is set, in which case it will be available at http://localhost:MYCHSA_PORT. For example, with the following bash command, the app will be available at http://localhost:3000:

    MYCHSA_PORT=3000 docker-compose up

To tear down, and thus destroy all associated docker containers, run `docker-compose down`. Note that the database volume will be preserved. If you would like to destroy the database completely (delete the volume on teardown), use `docker-compose down -v` instead.

## Tracking API Calls

Every time the API is called, it records a timestamp in a mariadb database. After running
`docker compose up`, you can query this database for total API calls using the following command:

    docker-compose exec db mysql -uapi -pchangeifyouwant api -e "select count(id) as 'API Calls' from accesslogs"

This assumes that the password is unchanged from the application default of "changeifyouwant".
If you are using a different password, please substitute accordingly; in general, inlining passwords in the shell is not recommended, so if you have configured a secure password then the recommended approach is to use the following command instead:

    docker-compose exec db mysql -uapi -p api -e "select count(id) as 'API Calls' from accesslogs"

## Application architecture

This application is composed of the following high-level components. Each component
is contained in its own docker container, which can either be built and run
independently with ad hoc docker commands, or (unless otherwise indicated,) spun up and connected using the `docker-compose` toolchain outlined above.

 - [**api**](/api) - this API server, built on node/express, provides a thin wrapper
  (with additional, application specific validation features) around calls to the BC Open Maps public API. Given a latitude/longitude pair (geopoint), it identifies the intersecting CHSA.
 - [**db**](/db) - a mariadb database to maintain a running log of calls to the above API.
 - [**apiaccesstracker**](/apiaccesstracker) - to keep the api as loosely coupled from the backing store as possible, a RESTful endpoint was created which connects to the database above and logs API access times and counts.
 - [**frontend**](/frontend) - a React app bundled with webpack then deployed to a static apache server. Includes a couple of form controls to interact with the API.
 - [**e2e**](/e2e) - end to end tests for the frontend using a headless browser. Excluded from docker compose toolchain. Integration with Github Actions to follow.

In addition to the end to end tests, the api and frontend containers include 
unit tests. These tests are written with mocha and chai.

## Environment variables

The build and run commands specified above are influenced by the following environment variables:

  - `MYCHSA_MYSQL_PASSWORD` - Default value is `apiaccess`
  - `MYCHSA_PORT` - Configures the port the web server is accessible from. Default value is `8080`

## Continuous integration

Github actions are used to automatically run the unit and end to end tests on Github's CI/CD platform. In order to conserve build minutes, the CI action is configured to be run manually rather than on push.

## Planned improvements

 - log routing to elasticsearch with fluentd
