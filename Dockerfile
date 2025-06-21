# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of your app
COPY . .

# Expose your app port (change if needed)
EXPOSE 3000

# Start your app
CMD ["node", "server/server.js"]