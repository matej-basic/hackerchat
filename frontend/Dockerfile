FROM node:alpine as build 
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html/hackerchat/
COPY ./nginx.conf /etc/nginx/conf.d/hackerchat.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]