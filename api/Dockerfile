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

FROM node:15-buster-slim as base
RUN mkdir /app
WORKDIR /app
COPY package*.json .

FROM base
RUN npm ci
COPY . .
RUN npm run test
RUN npm ci --production

# CMD is `node index.js` instead of `npm start` because of idosyncracies
# in how npm launches subprocesses. The dockerized node's `npm start`
# command creates a subshell which intercepts signals and prevents them
# from reaching our app.
CMD ["node", "index"]