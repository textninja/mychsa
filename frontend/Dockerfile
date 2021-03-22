# Copyright 2021 Joe Taylor <joe@textninja.net>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM node:15-buster-slim as buildstage
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG API_URL
RUN API_URL="$API_URL" npm run build

# Command to build and inspect:
#
#    docker build -t tmp . && docker run --rm -it tmp /bin/bash

FROM httpd:2.4 as production

COPY public /usr/local/apache2/htdocs
COPY --from=buildstage /app/dist/* /usr/local/apache2/htdocs/