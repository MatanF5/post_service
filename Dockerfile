# 1. Use official Node.js LTS image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install --production

# 5. Copy the rest of the application code
COPY . .
COPY .env .
# 6. Build the NestJS app
RUN npm run build

# 7. Expose the port (change if your app uses a different port)
EXPOSE 8080

# 8. Set environment variables (optional, can also be set in docker-compose)
# ENV NODE_ENV=production

# 9. Start the app
CMD ["npm", "run", "start:prod"]