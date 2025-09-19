# Use official Node.js runtime
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app files
COPY . .

# Expose port 3000 (same as your index.js uses)
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]
