ARG environment

FROM node:17-alpine AS base

FROM base as branch-run-development
WORKDIR /usr/src/frontend
ENV NODE_ENV "development"
COPY . .
COPY package.json ./
RUN npm install
EXPOSE 3000
CMD ["npm","start"]