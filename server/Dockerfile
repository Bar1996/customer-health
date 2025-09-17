# server/Dockerfile

# שלב 1: Build של ה-client
FROM node:20-alpine AS client-build
WORKDIR /app

COPY client/package*.json ./client/
RUN cd client && npm install
COPY client ./client
RUN cd client && npm run build

# שלב 2: Build של ה-server
FROM node:20-alpine
WORKDIR /app

# התקנת תלויות ל-server
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# העתקת קוד ה-server
COPY server ./server

# העתקת ה-build של ה-client לתוך ה-server
COPY --from=client-build /app/client/dist ./server/client/dist

WORKDIR /app/server
ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
