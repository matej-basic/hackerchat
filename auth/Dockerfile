FROM node:alpine as build
WORKDIR /app
ENV npm_config_cache /home/node/app/.npm
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine as auth
WORKDIR /app
ENV npm_config_cache /home/node/app/.npm
COPY --from=build /app/dist /app/
COPY package.json ./
RUN npm install
COPY . .
CMD ["npm","start"]
