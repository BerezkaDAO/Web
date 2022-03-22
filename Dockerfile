FROM --platform=linux/amd64 nginx
WORKDIR /usr/src/app/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./build  /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]