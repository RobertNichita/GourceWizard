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

FROM base as branchproduction
WORKDIR /usr/src/frontend
COPY . .
COPY package.json ./
RUN npm install --silent
RUN npm install react-scripts -g --silent
RUN npm run build

FROM branchproduction AS branch-run-production
# RUN npm install --only=production
ENV NODE_ENV "production"
COPY --from=branchproduction /usr/src/frontend/build/ .
RUN npm install serve pm2 -g
EXPOSE 3000
CMD /bin/sh | pm2 serve . 3000

FROM branch-run-${environment}