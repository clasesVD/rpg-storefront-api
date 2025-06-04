FROM node:20-alpine
WORKDIR /app
COPY ./dist ./
COPY package*.json ./
RUN npm install --omit=dev --omit=optional --omit=peer
EXPOSE 3000
CMD sh -c "npm start"
