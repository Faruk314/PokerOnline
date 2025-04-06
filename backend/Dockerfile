# build stage 
FROM node:20 

# Set the working directory to /app
WORKDIR /app

# Copy package.json and lock to the working directory
COPY ./package.json /app/package.json

COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml

COPY ./.env.docker /app/.env

RUN npm i -g corepack@latest
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


# Install dependencies
RUN pnpm i

COPY . .

EXPOSE 4000
EXPOSE 5001
