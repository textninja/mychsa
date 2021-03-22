# End to end testing for mychsa front-end

Because of shell differences across platforms, network limitations of docker 
on Mac, and challenges that arise from running docker in docker, the method you use to run end to end test suite will be platform and situation specific. One approach is documented below.

To run these tests against the front-end using docker-compose on a *nix-like system, then **from the parent directory** (where the docker-compose.yml file lives),
run the following command:

    docker-compose up -d && source e2e/run_e2e.sh
    
If the docker-compose containers are already up, the `docker-compose up -d` can of course be omitted:

    source e2e/run_e2e.sh
