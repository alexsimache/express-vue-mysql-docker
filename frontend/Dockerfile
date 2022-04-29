FROM node:14

# Create app directory
WORKDIR /app

# copy package.json and package.lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 8080

# Start application
CMD npm start
