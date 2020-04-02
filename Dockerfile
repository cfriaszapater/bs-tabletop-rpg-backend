FROM node:12.16-stretch

# Avoid running as root user as a security measure
RUN mkdir /app && chown -R node:node /app
USER node

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "./bin/www" ]
