FROM node:12 AS BUILD_IMAGE

WORKDIR /usr/src/app

# COPY package.json yarn.lock ./
COPY package.json package-lock.json ./

# install dependencies
# RUN yarn --frozen-lockfile
RUN npm install

COPY . .

# lint & test
# RUN yarn lint & yarn test

RUN Echo REACT_APP_GOOGLE_EMAIL = $REACT_APP_GOOGLE_EMAIL
# build application
# RUN yarn build 
RUN npm run build 


FROM --platform=linux/amd64 nginx
WORKDIR /usr/src/app/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=BUILD_IMAGE /usr/src/app/build/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]