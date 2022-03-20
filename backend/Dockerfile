#arg branching idea found from https://medium.com/@tonistiigi/advanced-multi-stage-build-patterns-6f741b852fae
# ARG environment

FROM node:17-alpine AS base

FROM base as branch-run-development
WORKDIR /usr/src/backend
ENV NODE_ENV "development"
COPY . .
COPY package.json ./
RUN npm install
EXPOSE 4000
CMD ["npm","run","dev"]

# FROM base as branchproduction
# WORKDIR /usr/src/backend
# COPY . .
# COPY package.json ./
# RUN npm install
# RUN npm run build

# FROM branchproduction AS branch-run-production
# ENV NODE_ENV "production"
# WORKDIR /usr/src/backend
# COPY package.json ./
# RUN npm install --only=production
# COPY --from=branchproduction /usr/src/backend/build .
# RUN npm install pm2 -g
# EXPOSE 5000
# CMD ["pm2-runtime","src/api.js"]

# FROM branch-run-${environment}

