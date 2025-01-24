FROM node:22-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
#: Installs serve globally.serve is a lightweight static file server for serving production-ready React applications
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 3000

# serve: Runs the serve command.
# -s: Tells serve to serve a single-page application (SPA), ensuring proper handling of React routes.
# .: Serves the current directory (/app).
# -l 3000: Listens on port 3000.
CMD ["serve", "-s", ".", "-l", "3000"]