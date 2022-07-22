FROM node:alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine as auth
WORKDIR
COPY --from=build /app/dist /app/
COPY package.json ./
RUN npm install
COPY . .
CMD ["npm","start"]
