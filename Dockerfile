# 1. Use official Node image
FROM node:18

# 2. Create app folder inside container
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy all project files
COPY . .

# 5. Expose API port
EXPOSE 5000

# 6. Start the server
CMD ["npm", "start"]
