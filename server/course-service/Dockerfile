FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directories
RUN mkdir -p uploads uploads/thumbnails uploads/videos

# Expose port
EXPOSE 3004

# Start the service
CMD ["npm", "start"]

