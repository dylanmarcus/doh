FROM node:18-bullseye-slim

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Clean npm cache and remove existing node_modules
RUN npm cache clean --force
RUN rm -rf node_modules frontend/node_modules backend/node_modules

# Install dependencies
RUN npm install --legacy-peer-deps
RUN cd frontend && npm install --legacy-peer-deps
RUN cd backend && npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN cd frontend && npm run build

EXPOSE 5000

CMD ["npm", "start"]