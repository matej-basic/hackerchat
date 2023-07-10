FROM node:alpine
ENV npm_config_cache /home/node/app/.npm
WORKDIR /app
COPY package.json .
RUN npm install
COPY dist .
CMD ["npm", "run", "start"]
