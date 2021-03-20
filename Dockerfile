FROM node:15-buster-slim
RUN mkdir /workspace
WORKDIR /workspace
COPY package*.json .
RUN npm i
COPY . .
CMD ["npm", "run", "start"]