FROM node:22-bullseye-slim

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN npm run postinstall

# Remove node_modules directories if they exist to avoid conflicts
RUN rm -rf ./frontend/node_modules
RUN rm -rf ./backend/node_modules

COPY . .

# Install dependencies without optional packages
RUN cd frontend && npm install --no-optional

# Manually install an older version of rollup
RUN cd frontend && npm install rollup@2.79.1 --no-optional

# Manually install vite and its dependencies
RUN cd frontend && npm install vite@4.5.0 @vitejs/plugin-react --no-optional

# Build the frontend
RUN cd frontend && npx vite build

EXPOSE 5000

CMD ["npm", "start"]