FROM node:20-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 4343

# Start Next.js in development mode based on the preferred package manager
CMD ["npm", "run", "dev", "--", "--host"]
