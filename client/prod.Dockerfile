# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG VITE_MAPS_API_KEY
ENV VITE_MAPS_API_KEY=${VITE_MAPS_API_KEY}
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4343

CMD ["nginx", "-g", "daemon off;"]