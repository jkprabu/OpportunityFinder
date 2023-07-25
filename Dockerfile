# Use Node.js base image
# !!! Might cause issue due to name change of OG file app.js -> indexer.js

FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the TypeScript source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the desired port (e.g., 3000)
EXPOSE 3000

# Define the startup command
CMD ["node", "build/indexer.js"]