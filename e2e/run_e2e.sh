#!/usr/bin/env bash

docker build -t e2e ./e2e && \
docker run -e MYCHSA_E2E_TARGET="http://frontend:80" --network mychsa_default --sysctl net.ipv6.conf.all.disable_ipv6=1 --rm e2e npx mocha