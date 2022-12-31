FROM node:18-alpine

WORKDIR /usr/src/worker

# Install dependencies
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Run
CMD ["npm", "start"]